import React, { useEffect, useRef } from 'react';
import { PlayerStats, PlayerProfile, OutfitType, LightingMode } from '../types/game';
import { sprites } from '../engine/sprites';

interface HUDProps {
  player: PlayerProfile;
  stats: PlayerStats;
  outfit: OutfitType;
  currentExpression: string;
  isGodMode?: boolean;
  isPortraitCanvas: boolean;
  onTogglePortrait: () => void;
  onActivateGodMode?: () => void;
  onTeleport: (zone: 'academic' | 'lab' | 'rig') => void;
  onToggleElevator: () => void;
  onOpenBackpack: () => void;
  onOpenLiveUpdater: () => void;
  lightingMode: LightingMode;
  onToggleLighting: () => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  onOpenBossResume: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  player,
  stats,
  outfit,
  currentExpression,
  isGodMode = false,
  isPortraitCanvas,
  onTogglePortrait,
  onActivateGodMode,
  onTeleport,
  onToggleElevator,
  onOpenBackpack,
  onOpenLiveUpdater,
  lightingMode,
  onToggleLighting,
  isAudioOn,
  onToggleAudio,
  onOpenBossResume
}) => {
  const portraitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const clickCountRef = useRef<number>(0);
  const clickTimerRef = useRef<any>(null);

  const handlePortraitClick = () => {
    // Check 5 clicks within 3 seconds for God Mode easter egg
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2800);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      if (onActivateGodMode) {
        onActivateGodMode();
      }
    }

    onTogglePortrait();
  };

  useEffect(() => {
    if (isPortraitCanvas && portraitCanvasRef.current) {
      const ctx = portraitCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 40, 40);
        const outfitKey = outfit === 'scholar' ? 'academic' : outfit;
        const spr = sprites.get(`portrait_${currentExpression}_${outfitKey}`) ||
                    sprites.get(`portrait_${currentExpression}`) ||
                    sprites.get(`portrait_${outfitKey}`);
        if (spr) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(spr, 0, 0, 40, 40);
        }
      }
    }
  }, [isPortraitCanvas, outfit, currentExpression]);

  const xpPercent = Math.min(100, Math.round((stats.currentXP / stats.maxXP) * 100));
  const isPPEOn = outfit === 'rig';

  const lightingIcon = lightingMode === 'day' ? '☀️' : lightingMode === 'sunset' ? '🌅' : '🌙';
  const lightingLabel = lightingMode === 'day' ? 'Day' : lightingMode === 'sunset' ? 'Sunset' : '24h Night';

  return (
    <header className="game-hud">
      <div className="hud-left">
        {/* Player Mini Avatar & XP / Stamina Bars */}
        <div className="hud-profile-card">
          <div
            className="hud-portrait-wrapper"
            onClick={handlePortraitClick}
            title="Click to toggle Real Field Photo / 16-Bit Pixel Sprite (Click 5x for God Mode!)"
          >
            {!isPortraitCanvas ? (
              <img
                src={player.photo || 'avatar-photo.jpg'}
                alt={player.name}
                className="hud-portrait-img"
              />
            ) : (
              <canvas
                ref={portraitCanvasRef}
                width={40}
                height={40}
                className="hud-portrait-canvas"
              />
            )}
          </div>
          <div className="hud-stats">
            <div className="hud-name-row">
              <span className="hud-player-name">{player.name.toUpperCase()}</span>
              <span className="nes-badge is-warning">
                <span className="is-warning">LVL {stats.level}</span>
              </span>
              <span className={`ppe-badge ${isPPEOn ? 'ppe-on' : 'ppe-off'}`}>
                {isPPEOn ? 'PPE: ON (HARD HAT)' : 'PPE: OFF'}
              </span>
              {isGodMode && (
                <span className="nes-badge is-error god-mode-badge" style={{ fontSize: '7px', animation: 'pulse 1.2s infinite' }}>
                  <span className="is-error">👑 GOD MODE (2.5x)</span>
                </span>
              )}
            </div>
            {/* Dynamic XP & Stamina Bars */}
            <div className="hud-bars">
              <div className="bar-container" title="Experience Points">
                <span className="bar-label">XP:</span>
                <div className="nes-progress is-primary custom-progress">
                  <div
                    className="progress-fill xp-fill"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <span className="bar-val">
                  {stats.currentXP}/{stats.maxXP}
                </span>
              </div>
              <div className="bar-container" title="Field Stamina & Coffee Level">
                <span className="bar-label">STM:</span>
                <div className="nes-progress is-success custom-progress">
                  <div
                    className="progress-fill stm-fill"
                    style={{ width: `${stats.stamina}%` }}
                  />
                </div>
                <span className="bar-val">{stats.stamina}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fast-Travel Teleport Buttons & Actions */}
        <div className="fast-travel-bar">
          <button
            onClick={() => onTeleport('academic')}
            className="nes-btn is-primary hud-btn"
            title="Fast Travel to Academic & Gym Wing [1]"
          >
            <span>1:🏛️ Archive</span>
          </button>
          <button
            onClick={() => onTeleport('lab')}
            className="nes-btn is-warning hud-btn"
            title="Fast Travel to Petrel Command Lab [2]"
          >
            <span>2:💻 Petrel Lab</span>
          </button>
          <button
            onClick={() => onTeleport('rig')}
            className="nes-btn is-error hud-btn"
            title="Fast Travel to Active Rig Floor [3]"
          >
            <span>3:🛢️ Rig Floor</span>
          </button>
          <button
            onClick={onToggleElevator}
            className="nes-btn is-primary hud-btn elevator-nav-btn"
            title="Subsurface Stratigraphic Depth Elevator"
          >
            <span>⬇️ Depth Bar</span>
          </button>
          <button
            onClick={onOpenBackpack}
            className="nes-btn hud-btn"
            title="Inspect Equipment Backpack [I]"
          >
            <span>🎒 [I] Items</span>
          </button>
          <button
            onClick={onOpenLiveUpdater}
            className="nes-btn is-success hud-btn live-updater-btn"
            title="Add / Edit Milestones Live [U]"
          >
            <span>➕ [U] Milestones</span>
          </button>
        </div>
      </div>

      {/* Right HUD: Shift Lighting Toggle, Audio & BOSS PANIC BUTTON */}
      <div className="hud-right">
        {/* 24-hr Shift Lighting Mode Toggle */}
        <button
          onClick={onToggleLighting}
          className="nes-btn hud-btn lighting-btn"
          title="Toggle Day / Sunset / 24-hr Night Shift Floodlights"
        >
          <span>{lightingIcon}</span> <span>{lightingLabel}</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          className="nes-btn hud-btn audio-btn"
          title="Toggle 8-bit Synth Audio & Sound Effects"
        >
          <span>{isAudioOn ? '🔊' : '🔇'}</span>
        </button>

        {/* FIXED BOSS MODE PANIC BUTTON */}
        <button
          onClick={onOpenBossResume}
          className="nes-btn is-error boss-btn"
          title="Instant Boss Panic: Switch to ATS Printable Resume"
        >
          <span className="boss-icon">🚨</span>
          <span className="boss-text">BOSS MODE: STANDARD CV</span>
        </button>
      </div>
    </header>
  );
};
