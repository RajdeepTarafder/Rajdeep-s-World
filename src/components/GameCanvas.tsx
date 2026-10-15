import React, { useEffect, useRef, useCallback } from 'react';
import { GameMap } from '../engine/worldMap';
import { PlayerAvatar } from '../engine/player';
import { audio } from '../engine/audio';
import { sprites, TILE_SIZE } from '../engine/sprites';
import { Hotspot, LightingMode } from '../types/game';

interface GameCanvasProps {
  map: GameMap;
  player: PlayerAvatar;
  activeHotspot: Hotspot | null;
  onActiveHotspotChange: (h: Hotspot | null) => void;
  onTriggerHotspot: (h: Hotspot) => void;
  onFastTravel: (zone: 'academic' | 'lab' | 'rig') => void;
  onOpenBackpack: () => void;
  onOpenLiveUpdater: () => void;
  isModalOpen: boolean;
  onCloseModals: () => void;
  lightingMode: LightingMode;
  onSoccerGoal: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface PulsingTarget {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  timer: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  map,
  player,
  onActiveHotspotChange,
  onTriggerHotspot,
  onFastTravel,
  onOpenBackpack,
  onOpenLiveUpdater,
  isModalOpen,
  onCloseModals,
  lightingMode,
  onSoccerGoal
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const inputRef = useRef({
    left: false,
    right: false,
    up: false,
    down: false
  });

  const cameraRef = useRef({
    x: 0,
    y: 0,
    width: 640,
    height: 360
  });

  const soccerBallRef = useRef({
    x: 12.5 * TILE_SIZE,
    y: 6.5 * TILE_SIZE,
    vx: 0,
    vy: 0,
    isKicked: false
  });

  const particlesRef = useRef<Particle[]>([]);
  const ambientTimerRef = useRef(0);
  const pulsingTargetRef = useRef<PulsingTarget | null>(null);
  const zoomFactorRef = useRef(1.25);

  const triggerAction = useCallback(() => {
    if (isModalOpen) {
      onCloseModals();
      return;
    }
    const currentHotspot = map.getNearbyHotspot(player.x, player.y);
    if (currentHotspot) {
      if (currentHotspot.specialType === 'slide_tackle') {
        player.slideTackle();
      } else {
        onTriggerHotspot(currentHotspot);
      }
    }
  }, [isModalOpen, map, player, onCloseModals, onTriggerHotspot]);

  // Connect soccer ball kick from slide tackle
  useEffect(() => {
    player.onSoccerKick = (fromX: number, fromY: number) => {
      const ball = soccerBallRef.current;
      const goalX = 14.5 * TILE_SIZE;
      const goalY = 3.5 * TILE_SIZE;
      const dx = goalX - ball.x;
      const dy = goalY - ball.y;
      const dist = Math.hypot(dx, dy);
      const speed = 190;

      ball.vx = (dx / (dist || 1)) * speed;
      ball.vy = (dy / (dist || 1)) * speed;
      ball.isKicked = true;

      audio.playGoalCheer();
      onSoccerGoal();
      player.showBubble("⚽ GOOOOAL! Centre-Back strike into top bins! (+50 XP)", 2.8);
    };
  }, [player, onSoccerGoal]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) {
        if (e.key === 'Escape') onCloseModals();
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          inputRef.current.left = true;
          break;
        case 'arrowright':
        case 'd':
          inputRef.current.right = true;
          break;
        case 'arrowup':
        case 'w':
          inputRef.current.up = true;
          break;
        case 'arrowdown':
        case 's':
          inputRef.current.down = true;
          break;
        case 'h':
          player.strikeHammer();
          break;
        case 'm':
          player.inspectLens();
          break;
        case 'f':
          player.slideTackle();
          break;
        case '1':
          onFastTravel('academic');
          break;
        case '2':
          onFastTravel('lab');
          break;
        case '3':
          onFastTravel('rig');
          break;
        case 'i':
          onOpenBackpack();
          break;
        case 'u':
          onOpenLiveUpdater();
          break;
        case ' ':
        case 'e':
        case 'enter':
          e.preventDefault();
          triggerAction();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          inputRef.current.left = false;
          break;
        case 'arrowright':
        case 'd':
          inputRef.current.right = false;
          break;
        case 'arrowup':
        case 'w':
          inputRef.current.up = false;
          break;
        case 'arrowdown':
        case 's':
          inputRef.current.down = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isModalOpen, onCloseModals, player, triggerAction, onFastTravel, onOpenBackpack, onOpenLiveUpdater]);

  // Tap-to-walk / point and click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isModalOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const z = zoomFactorRef.current;
    const cam = cameraRef.current;

    const worldX = cam.x + (clickX * scaleX) / z;
    const worldY = cam.y + (clickY * scaleY) / z;

    player.setTargetDestination(worldX, worldY);

    pulsingTargetRef.current = {
      x: worldX,
      y: worldY,
      radius: 4,
      maxRadius: 14,
      timer: 0.8
    };

    audio.playTone(500, 'sine', 0.05, 0.08);
  };

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let animId = 0;
    let lastTime = performance.now();

    const resize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        zoomFactorRef.current = canvas.width > 900 ? 1.25 : 1.0;
        ctx.imageSmoothingEnabled = false;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;

      // Update Player if no modal is open
      if (!isModalOpen) {
        player.update(dt, inputRef.current, map);

        // Check Hotspot
        const nearHotspot = map.getNearbyHotspot(player.x, player.y);
        onActiveHotspotChange(nearHotspot);
      }

      // Soccer Ball Physics
      const ball = soccerBallRef.current;
      if (ball.isKicked) {
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        ball.vx *= 0.94;
        ball.vy *= 0.94;

        if (Math.hypot(ball.vx, ball.vy) < 6) {
          ball.vx = 0;
          ball.vy = 0;
          ball.isKicked = false;
          setTimeout(() => {
            ball.x = 12.5 * TILE_SIZE;
            ball.y = 6.5 * TILE_SIZE;
          }, 3000);
        }
      }

      // Ambient Particles (Campfire & Flare Stack)
      ambientTimerRef.current += dt;
      if (ambientTimerRef.current > 0.1) {
        ambientTimerRef.current = 0;
        particlesRef.current.push({
          x: 15.5 * TILE_SIZE + (Math.random() - 0.5) * 8,
          y: 14.8 * TILE_SIZE,
          vy: -20 - Math.random() * 20,
          vx: (Math.random() - 0.5) * 10,
          life: 0.8,
          color: '#F97316'
        });
        particlesRef.current.push({
          x: 48.5 * TILE_SIZE + (Math.random() - 0.5) * 6,
          y: 1.4 * TILE_SIZE,
          vy: -35 - Math.random() * 25,
          vx: (Math.random() - 0.5) * 12,
          life: 0.6,
          color: '#FACC15'
        });
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) particlesRef.current.splice(i, 1);
      }

      // Camera Follow
      const cam = cameraRef.current;
      const z = zoomFactorRef.current;
      const camTargetW = canvas.width / z;
      const camTargetH = canvas.height / z;
      cam.width = camTargetW;
      cam.height = camTargetH;

      const tx = player.x - camTargetW / 2;
      const ty = player.y - camTargetH / 2;
      cam.x += (tx - cam.x) * 0.12;
      cam.y += (ty - cam.y) * 0.12;

      cam.x = Math.max(0, Math.min(cam.x, map.width - camTargetW));
      cam.y = Math.max(0, Math.min(cam.y, map.height - camTargetH));

      // RENDER
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(z, z);

      // Map & Props
      map.render(ctx, cam);

      // Soccer Ball
      const ballSpr = sprites.get('soccer_ball');
      if (ballSpr) {
        const bx = Math.round(ball.x - cam.x - 8);
        const by = Math.round(ball.y - cam.y - 8);
        ctx.drawImage(ballSpr, bx, by);
      }

      // Ambient Particles
      particlesRef.current.forEach(p => {
        const px = Math.round(p.x - cam.x);
        const py = Math.round(p.y - cam.y);
        ctx.fillStyle = p.color;
        ctx.fillRect(px, py, 2, 2);
      });

      // Player Avatar
      player.render(ctx, cam);

      // Tap-to-Walk Ring
      if (pulsingTargetRef.current) {
        const pt = pulsingTargetRef.current;
        pt.timer -= dt;
        const progress = 1 - pt.timer / 0.8;
        const r = pt.radius + (pt.maxRadius - pt.radius) * progress;
        const alpha = Math.max(0, 1 - progress);

        ctx.save();
        ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pt.x - cam.x, pt.y - cam.y, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(250, 204, 21, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(pt.x - cam.x, pt.y - cam.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (pt.timer <= 0) pulsingTargetRef.current = null;
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [map, player, isModalOpen, onActiveHotspotChange]);

  const handleTouchDpad = (dir: 'up' | 'down' | 'left' | 'right', isStart: boolean) => {
    inputRef.current[dir] = isStart;
  };

  const viewportClass = `game-viewport ${lightingMode === 'sunset' ? 'lighting-sunset' : lightingMode === 'night' ? 'lighting-night' : ''}`;

  return (
    <main className={viewportClass}>
      <canvas
        id="rpg-canvas"
        ref={canvasRef}
        onClick={handleCanvasClick}
      />

      {/* Bottom Keyboard & Antics Helper */}
      <div className="desktop-action-bar">
        <span className="key-tag">[W,A,S,D]</span> Move &bull;
        <span className="key-tag">[H]</span> Hammer &bull;
        <span className="key-tag">[M]</span> 10x Lens &bull;
        <span className="key-tag">[F]</span> Slide Tackle &bull;
        <span className="key-tag">[SPACE]</span> Examine &bull;
        <span className="key-tag">[1,2,3]</span> Fast Travel &bull;
        <span className="key-tag">[U]</span> Live Milestones &bull;
        <span className="key-tag">Point &amp; Click / Tap to Walk</span>
      </div>

      {/* On-Screen Touch Controls for Mobile / Tablet */}
      <div className="touch-controls-hud">
        <div className="touch-dpad">
          <button
            type="button"
            className="touch-btn dpad-up"
            onTouchStart={() => handleTouchDpad('up', true)}
            onTouchEnd={() => handleTouchDpad('up', false)}
            onMouseDown={() => handleTouchDpad('up', true)}
            onMouseUp={() => handleTouchDpad('up', false)}
          >
            &uarr;
          </button>
          <button
            type="button"
            className="touch-btn dpad-left"
            onTouchStart={() => handleTouchDpad('left', true)}
            onTouchEnd={() => handleTouchDpad('left', false)}
            onMouseDown={() => handleTouchDpad('left', true)}
            onMouseUp={() => handleTouchDpad('left', false)}
          >
            &larr;
          </button>
          <button
            type="button"
            className="touch-btn dpad-right"
            onTouchStart={() => handleTouchDpad('right', true)}
            onTouchEnd={() => handleTouchDpad('right', false)}
            onMouseDown={() => handleTouchDpad('right', true)}
            onMouseUp={() => handleTouchDpad('right', false)}
          >
            &rarr;
          </button>
          <button
            type="button"
            className="touch-btn dpad-down"
            onTouchStart={() => handleTouchDpad('down', true)}
            onTouchEnd={() => handleTouchDpad('down', false)}
            onMouseDown={() => handleTouchDpad('down', true)}
            onMouseUp={() => handleTouchDpad('down', false)}
          >
            &darr;
          </button>
        </div>
        <div className="touch-actions">
          <button
            type="button"
            className="touch-action-btn hammer-btn"
            onClick={() => player.strikeHammer()}
            title="Swing Hammer [H]"
          >
            🔨 HAMMER
          </button>
          <button
            type="button"
            className="touch-action-btn lens-btn"
            onClick={() => player.inspectLens()}
            title="Inspect Lens [M]"
          >
            🔍 LENS
          </button>
          <button
            type="button"
            className="touch-action-btn tackle-btn"
            onClick={() => player.slideTackle()}
            title="Slide Tackle [F]"
          >
            ⚽ TACKLE
          </button>
          <button
            type="button"
            className="touch-action-btn interact-btn"
            onClick={triggerAction}
            title="Action [SPACE]"
          >
            ⚡ ACTION
          </button>
        </div>
      </div>
    </main>
  );
};
