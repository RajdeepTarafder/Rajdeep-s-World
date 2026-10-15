import React, { useEffect, useRef, useState } from 'react';
import { audio } from '../engine/audio';

interface SeismicMiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP: (xp: number) => void;
  onTriggerExpression?: (exprId: string) => void;
}

interface Target {
  x: number;
  y: number;
  w: number;
  h: number;
  hit: boolean;
  speed: number;
  name: string;
}

export const SeismicMiniGameModal: React.FC<SeismicMiniGameModalProps> = ({
  isOpen,
  onClose,
  onRewardXP,
  onTriggerExpression
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameResult, setGameResult] = useState<'playing' | 'won' | 'lost'>('playing');
  const [freezeState, setFreezeState] = useState<'idle' | 'freezing' | 'rescued'>('idle');

  const gameStateRef = useRef({
    active: false,
    score: 0,
    timer: 15,
    targets: [] as Target[],
    animId: 0
  });

  useEffect(() => {
    if (!isOpen) {
      if (gameStateRef.current.animId) {
        cancelAnimationFrame(gameStateRef.current.animId);
      }
      return;
    }

    setScore(0);
    setTimeLeft(15);
    setGameResult('playing');

    gameStateRef.current = {
      active: true,
      score: 0,
      timer: 15,
      targets: [
        { x: 150, y: 50, w: 24, h: 24, hit: false, speed: 1.5, name: 'BExB Fault' },
        { x: 300, y: 120, w: 24, h: 24, hit: false, speed: 2.0, name: 'EPMB Bright Spot' },
        { x: 450, y: 80, w: 24, h: 24, hit: false, speed: 1.8, name: 'RGT Horizon' }
      ],
      animId: 0
    };

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastT = performance.now();

    const loop = (now: number) => {
      if (!gameStateRef.current.active) return;
      const dt = (now - lastT) / 1000;
      lastT = now;

      gameStateRef.current.timer -= dt;
      const curTimer = Math.max(0, Math.ceil(gameStateRef.current.timer));
      setTimeLeft(curTimer);

      if (gameStateRef.current.timer <= 0) {
        gameStateRef.current.active = false;
        setGameResult('lost');
        return;
      }

      // Draw seismic wiggle traces
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = '#1E293B';
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Waveform traces
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;
      const tNow = now * 0.003;
      for (let x = 10; x < canvas.width; x += 15) {
        ctx.beginPath();
        for (let y = 0; y < canvas.height; y += 4) {
          const off = Math.sin(y * 0.05 + tNow + x) * 6;
          if (y === 0) ctx.moveTo(x + off, y);
          else ctx.lineTo(x + off, y);
        }
        ctx.stroke();
      }

      // Targets
      gameStateRef.current.targets.forEach(t => {
        if (!t.hit) {
          t.x -= t.speed;
          if (t.x < -30) t.x = canvas.width + 20;

          ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(t.x, t.y, t.w, t.h);
          ctx.fillRect(t.x, t.y, t.w, t.h);

          ctx.fillStyle = '#FACC15';
          ctx.font = '8px "Press Start 2P"';
          ctx.fillText("🎯", t.x + 4, t.y + 16);
        }
      });

      gameStateRef.current.animId = requestAnimationFrame(loop);
    };

    gameStateRef.current.animId = requestAnimationFrame(loop);

    return () => {
      gameStateRef.current.active = false;
      cancelAnimationFrame(gameStateRef.current.animId);
    };
  }, [isOpen]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameStateRef.current.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    gameStateRef.current.targets.forEach(t => {
      if (!t.hit && mx >= t.x && mx <= t.x + t.w && my >= t.y && my <= t.y + t.h) {
        t.hit = true;
        gameStateRef.current.score++;
        const newScore = gameStateRef.current.score;
        setScore(newScore);
        audio.playTone(1000, 'square', 0.1, 0.2);

        if (newScore >= 3) {
          gameStateRef.current.active = false;
          setGameResult('won');
          onRewardXP(250);
          audio.playFanfare();
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="rpg-modal-overlay">
      <div className="nes-container is-dark with-title modal-window">
        <p className="title">SEISMIC FAULT SNIPER (SCHLUMBERGER PETREL)</p>
        <p className="minigame-instructions">
          Target the 3 moving seismic fault anomalies &amp; RGT bright spots on the wiggle trace canvas before time runs out!
        </p>

        <div className="minigame-hud-row">
          <span>Faults Matured: <strong>{score}/3</strong></span>
          <span>Time Remaining: <strong>{timeLeft}s</strong></span>
        </div>

        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={500}
            height={180}
            onClick={handleCanvasClick}
            className="minigame-canvas"
            style={{ cursor: 'crosshair', maxWidth: '100%', height: 'auto', background: '#030712' }}
          />
        </div>

        {gameResult === 'won' && (
          <div className="minigame-result-msg result-success">
            🎯 PROSPECTS MATURED! BExB &amp; EPMB Drillable Targets Unlocked! (+250 XP)
          </div>
        )}

        {gameResult === 'lost' && (
          <div className="minigame-result-msg result-fail">
            Seismic noise obscured the faults! Retry at the Petrel workstation.
          </div>
        )}

        {/* Easter Egg: 4:59 PM Petrel 3D Cube Freeze Gag */}
        {freezeState === 'freezing' && (
          <div className="petrel-crash-box" style={{ background: '#7F1D1D', border: '3px solid #EF4444', padding: '12px', margin: '12px 0', animation: 'pulse 0.8s infinite' }}>
            <p style={{ color: '#FEE2E2', fontWeight: 'bold', fontSize: '11px', marginBottom: '6px' }}>
              ⚠️ WARNING: 64GB RAM MAXED OUT AT 4:59 PM! Petrel Not Responding...
            </p>
            <p style={{ color: '#FCA5A5', fontSize: '9px', marginBottom: '8px' }}>
              Windows Error 0x8849: Giant 3D fault envelope compilation overload! Hit <strong>Ctrl + S</strong> immediately!
            </p>
            <button
              onClick={() => {
                setFreezeState('rescued');
                audio.playFanfare();
                onRewardXP(50);
                if (onTriggerExpression) onTriggerExpression('wicked_smirk');
              }}
              className="nes-btn is-warning"
              style={{ fontSize: '9px', padding: '6px 14px' }}
            >
              💾 RESCUE PROJECT [Ctrl + S]
            </button>
          </div>
        )}

        {freezeState === 'rescued' && (
          <div className="minigame-result-msg result-success" style={{ background: '#065F46', border: '2px solid #34D399', margin: '10px 0' }}>
            ✨ Phew! Rajdeep's Ctrl+S reflex &amp; auto-backup saved the BExB/EPMB prospect model! (+50 XP)
            <div style={{ fontSize: '9px', marginTop: '4px', color: '#A7F3D0' }}>
              🎭 Wicked Discovery Smirk equipped! Subsurface locked!
            </div>
          </div>
        )}

        <div className="modal-footer-bar" style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          {freezeState === 'idle' && (
            <button
              onClick={() => {
                setFreezeState('freezing');
                audio.playAlarmSiren();
                setTimeout(() => {
                  setFreezeState(prev => prev === 'freezing' ? 'freezing' : prev);
                }, 2000);
              }}
              className="nes-btn is-warning"
              style={{ fontSize: '8px', padding: '4px 10px' }}
            >
              ⚡ Render Massive 3D Fault Cube
            </button>
          )}
          <button onClick={onClose} className="nes-btn is-error" style={{ fontSize: '9px', padding: '4px 10px' }}>
            Exit Petrel Workstation
          </button>
        </div>
      </div>
    </div>
  );
};
