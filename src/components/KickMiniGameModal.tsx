import React, { useEffect, useState, useRef, useCallback } from 'react';
import { audio } from '../engine/audio';

interface KickMiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP: (xp: number) => void;
}

export const KickMiniGameModal: React.FC<KickMiniGameModalProps> = ({
  isOpen,
  onClose,
  onRewardXP
}) => {
  const [needlePos, setNeedlePos] = useState(20);
  const [safeTimer, setSafeTimer] = useState(0);
  const [won, setWon] = useState(false);
  const [active, setActive] = useState(false);

  const stateRef = useRef({
    active: false,
    needlePos: 20,
    safeTimer: 0,
    interval: 0
  });

  const pumpMud = useCallback(() => {
    if (!stateRef.current.active) return;
    stateRef.current.needlePos = Math.min(95, stateRef.current.needlePos + 7.5);
    setNeedlePos(stateRef.current.needlePos);
    audio.playTone(300, 'sawtooth', 0.08, 0.2);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (stateRef.current.interval) clearInterval(stateRef.current.interval);
      stateRef.current.active = false;
      return;
    }

    setWon(false);
    setActive(true);
    setSafeTimer(0);
    setNeedlePos(20);

    stateRef.current = {
      active: true,
      needlePos: 20,
      safeTimer: 0,
      interval: 0
    };

    const interval = window.setInterval(() => {
      if (!stateRef.current.active) return;

      // Decay pressure left
      stateRef.current.needlePos = Math.max(5, stateRef.current.needlePos - 2.8);
      setNeedlePos(stateRef.current.needlePos);

      // Check if inside green window (35% to 65%)
      if (stateRef.current.needlePos >= 35 && stateRef.current.needlePos <= 65) {
        stateRef.current.safeTimer += 0.1;
        setSafeTimer(Number(stateRef.current.safeTimer.toFixed(1)));

        if (stateRef.current.safeTimer >= 5.0) {
          stateRef.current.active = false;
          setActive(false);
          setWon(true);
          onRewardXP(300);
          audio.playFanfare();
          clearInterval(interval);
        }
      } else {
        stateRef.current.safeTimer = Math.max(0, stateRef.current.safeTimer - 0.2);
        setSafeTimer(Number(stateRef.current.safeTimer.toFixed(1)));
      }
    }, 100);

    stateRef.current.interval = interval;

    const keyHandler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        pumpMud();
      }
    };
    window.addEventListener('keydown', keyHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', keyHandler);
    };
  }, [isOpen, pumpMud, onRewardXP]);

  if (!isOpen) return null;

  return (
    <div className="rpg-modal-overlay">
      <div className="nes-container is-dark with-title modal-window">
        <p className="title">KILL THE KICK! (GDA-A WELL CONTROL)</p>
        <p className="minigame-instructions">
          Abnormal formation pressure encountered! Pump heavy drilling mud to hold bottom-hole hydrostatic balance in the GREEN SAFE ZONE for 5 consecutive seconds!
        </p>

        <div className="minigame-hud-row">
          <span>Safe Pressure Time: <strong>{safeTimer.toFixed(1)}s / 5.0s</strong></span>
        </div>

        {/* Gauge Track */}
        <div className="gauge-container" style={{ position: 'relative', width: '100%', height: '36px', background: '#1E293B', borderRadius: '4px', overflow: 'hidden', margin: '14px 0', border: '2px solid #475569' }}>
          {/* Underbalanced Danger (0-35%) */}
          <div style={{ position: 'absolute', left: 0, width: '35%', height: '100%', background: 'rgba(239, 68, 68, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#FFF' }}>
            UNDERBALANCED (GAS KICK)
          </div>
          {/* Balanced Safe Zone (35-65%) */}
          <div style={{ position: 'absolute', left: '35%', width: '30%', height: '100%', background: 'rgba(34, 197, 94, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#FFF', fontWeight: 'bold' }}>
            SAFE WINDOW (1.28 SG)
          </div>
          {/* Overbalanced Danger (65-100%) */}
          <div style={{ position: 'absolute', left: '65%', width: '35%', height: '100%', background: 'rgba(245, 158, 11, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#FFF' }}>
            OVERBALANCED (LOSSES)
          </div>
          {/* Indicator Needle */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${needlePos}%`,
              width: '6px',
              height: '100%',
              background: '#FFF',
              border: '1px solid #000',
              transform: 'translateX(-50%)',
              transition: 'left 0.08s ease-out',
              boxShadow: '0 0 8px #FFF'
            }}
          />
        </div>

        {won && (
          <div className="minigame-result-msg result-success">
            🚨 KICK KILLED! GDA-A Samastipur 8.5&quot; Cement Squeeze Secured! (+300 XP)
          </div>
        )}

        <div style={{ textAlign: 'center', margin: '12px 0' }}>
          <button
            onClick={pumpMud}
            disabled={!active}
            className="nes-btn is-success"
            style={{ fontSize: '12px', padding: '10px 20px' }}
          >
            🛢️ PUMP HEAVY MUD [SPACE]
          </button>
        </div>

        <div className="modal-footer-bar">
          <button onClick={onClose} className="nes-btn is-error">
            Exit Well Control Console
          </button>
        </div>
      </div>
    </div>
  );
};
