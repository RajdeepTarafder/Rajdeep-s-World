import React, { useEffect, useRef, useState } from 'react';
import { audio } from '../engine/audio';

interface ShiftDodgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP: (xp: number) => void;
}

interface FallingObject {
  x: number;
  y: number;
  type: 'coffee' | 'pipe';
  speed: number;
}

export const ShiftDodgeModal: React.FC<ShiftDodgeModalProps> = ({
  isOpen,
  onClose,
  onRewardXP
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [gameResult, setGameResult] = useState<'playing' | 'won' | 'lost'>('playing');

  const stateRef = useRef({
    active: false,
    timer: 15,
    coffeeCount: 0,
    playerX: 200,
    objects: [] as FallingObject[],
    animId: 0
  });

  useEffect(() => {
    if (!isOpen) {
      if (stateRef.current.animId) cancelAnimationFrame(stateRef.current.animId);
      return;
    }

    setTimeLeft(15);
    setCoffeeCount(0);
    setGameResult('playing');

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    stateRef.current = {
      active: true,
      timer: 15,
      coffeeCount: 0,
      playerX: canvas.width / 2,
      objects: [],
      animId: 0
    };

    const keyListener = (e: KeyboardEvent) => {
      if (!stateRef.current.active) return;
      if (e.key === 'a' || e.key === 'ArrowLeft') {
        stateRef.current.playerX = Math.max(16, stateRef.current.playerX - 24);
      }
      if (e.key === 'd' || e.key === 'ArrowRight') {
        stateRef.current.playerX = Math.min(canvas.width - 16, stateRef.current.playerX + 24);
      }
    };
    window.addEventListener('keydown', keyListener);

    let lastT = performance.now();
    let spawnTimer = 0;

    const loop = (now: number) => {
      if (!stateRef.current.active) return;
      const dt = (now - lastT) / 1000;
      lastT = now;

      stateRef.current.timer -= dt;
      const curTimer = Math.max(0, Math.ceil(stateRef.current.timer));
      setTimeLeft(curTimer);

      if (stateRef.current.timer <= 0) {
        stateRef.current.active = false;
        setGameResult('won');
        onRewardXP(250);
        audio.playFanfare();
        return;
      }

      spawnTimer += dt;
      if (spawnTimer > 0.4) {
        spawnTimer = 0;
        const isCoffee = Math.random() < 0.4;
        stateRef.current.objects.push({
          x: Math.random() * (canvas.width - 30) + 15,
          y: -10,
          type: isCoffee ? 'coffee' : 'pipe',
          speed: 120 + Math.random() * 80
        });
      }

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Player avatar
      ctx.fillStyle = '#EA580C';
      ctx.fillRect(stateRef.current.playerX - 10, canvas.height - 24, 20, 20);
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(stateRef.current.playerX - 10, canvas.height - 28, 20, 5);

      for (let i = stateRef.current.objects.length - 1; i >= 0; i--) {
        const obj = stateRef.current.objects[i];
        obj.y += obj.speed * dt;

        if (obj.type === 'coffee') {
          ctx.fillStyle = '#EF4444';
          ctx.fillRect(obj.x - 6, obj.y - 6, 12, 12);
          ctx.fillStyle = '#FFF';
          ctx.font = '10px monospace';
          ctx.fillText("☕", obj.x - 5, obj.y + 4);
        } else {
          ctx.fillStyle = '#94A3B8';
          ctx.fillRect(obj.x - 3, obj.y - 12, 6, 24);
        }

        // Collision check
        if (
          Math.abs(obj.x - stateRef.current.playerX) < 16 &&
          obj.y >= canvas.height - 30 &&
          obj.y <= canvas.height
        ) {
          if (obj.type === 'coffee') {
            stateRef.current.coffeeCount++;
            setCoffeeCount(stateRef.current.coffeeCount);
            audio.playTone(800, 'triangle', 0.08, 0.2);
            stateRef.current.objects.splice(i, 1);
          } else {
            audio.playHit();
            stateRef.current.active = false;
            setGameResult('lost');
            return;
          }
        } else if (obj.y > canvas.height + 20) {
          stateRef.current.objects.splice(i, 1);
        }
      }

      stateRef.current.animId = requestAnimationFrame(loop);
    };

    stateRef.current.animId = requestAnimationFrame(loop);

    return () => {
      stateRef.current.active = false;
      cancelAnimationFrame(stateRef.current.animId);
      window.removeEventListener('keydown', keyListener);
    };
  }, [isOpen, onRewardXP]);

  if (!isOpen) return null;

  return (
    <div className="rpg-modal-overlay">
      <div className="nes-container is-dark with-title modal-window">
        <p className="title">24-HOUR SHIFT DODGE (DOGHOUSE SURVIVAL)</p>
        <p className="minigame-instructions">
          Control Rajdeep with [A / D] or [&larr; / &rarr;]. Collect 3 AM doghouse espresso mugs while dodging falling drill tubulars!
        </p>

        <div className="minigame-hud-row">
          <span>Shift Time Left: <strong>{timeLeft}s</strong></span>
          <span>Coffee Ingested: <strong>☕ {coffeeCount}</strong></span>
        </div>

        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="minigame-canvas"
            style={{ maxWidth: '100%', height: 'auto', background: '#0F172A', border: '2px solid #334155' }}
          />
        </div>

        {gameResult === 'won' && (
          <div className="minigame-result-msg result-success">
            ☕ 24-HR SHIFT SURVIVED! Collected {coffeeCount} mugs! Zero LTI Intact! (+250 XP)
          </div>
        )}

        {gameResult === 'lost' && (
          <div className="minigame-result-msg result-fail">
            Struck by falling drill tubular! Rest at the doghouse and retry.
          </div>
        )}

        <div className="modal-footer-bar">
          <button onClick={onClose} className="nes-btn is-error">
            Exit Doghouse
          </button>
        </div>
      </div>
    </div>
  );
};
