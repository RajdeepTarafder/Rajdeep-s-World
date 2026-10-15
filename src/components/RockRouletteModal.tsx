import React, { useEffect, useState, useRef } from 'react';
import { audio } from '../engine/audio';

interface RockRouletteModalProps {
  isOpen: boolean;
  rockName: string;
  onClose: () => void;
  onRewardXP: (xp: number) => void;
}

interface RockItem {
  id: string;
  name: string;
  desc: string;
}

const ROCKS: RockItem[] = [
  { id: 'quartz', name: 'Quartz Vein with Fluid Inclusions', desc: 'Crystalline quartz vein showing undulose extinction and hydrothermal fluid inclusions.' },
  { id: 'garnet', name: 'Kimberlitic Pyrope Garnet (G10)', desc: 'Kimberlitic pyrope garnet! Discriminative geochemical vector for diamond exploration (IIT ISM Dhanbad M.Sc. Tech ML Thesis).' },
  { id: 'bif', name: 'Banded Iron Formation (BIF / BHQ)', desc: 'Banded Iron Formation (BIF / BHQ) with interbedded chert and high-grade hematite (SAIL Dalli-Rajhara).' },
  { id: 'dolomite', name: 'Vindhyan Rohtas Dolomite / Chert', desc: 'Vindhyan dolomite & chert sequence showing primary cross-stratification and algal mats.' },
  { id: 'helium', name: 'Basement Granite (H2/He Conduits)', desc: 'Precambrian basement granite hosting deep crustal shear zones with radiogenic Helium-4 entrapment!' }
];

export const RockRouletteModal: React.FC<RockRouletteModalProps> = ({
  isOpen,
  rockName,
  onClose,
  onRewardXP
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [locked, setLocked] = useState(false);
  const [chosenRock, setChosenRock] = useState<RockItem | null>(null);

  const spinningRef = useRef(true);

  useEffect(() => {
    if (!isOpen) return;

    setLocked(false);
    setChosenRock(null);
    spinningRef.current = true;

    audio.playTone(700, 'sine', 0.1, 0.1);

    const interval = window.setInterval(() => {
      if (!spinningRef.current) return;
      setCurrentIdx(prev => (prev + 1) % ROCKS.length);
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen]);

  const lockRoulette = () => {
    if (locked) return;
    spinningRef.current = false;
    setLocked(true);
    const chosen = ROCKS[currentIdx];
    setChosenRock(chosen);
    audio.playHammer();
    onRewardXP(50);
  };

  if (!isOpen) return null;

  return (
    <div className="rpg-modal-overlay">
      <div className="nes-container is-dark with-title modal-window">
        <p className="title">OUTCROP HAMMER &amp; 10x LENS ROULETTE</p>
        <p className="minigame-instructions">
          Outcrop targeted: <strong>{rockName}</strong>. Lock the spectrometer roulette with [H / SPACE] to identify the mineral specimen and catalog petrographic analysis!
        </p>

        <div className="roulette-spinner" style={{ background: '#0F172A', padding: '12px', border: '2px solid #334155', borderRadius: '4px', margin: '14px 0' }}>
          {ROCKS.map((r, idx) => (
            <div
              key={r.id}
              style={{
                padding: '6px 12px',
                margin: '4px 0',
                fontFamily: 'monospace',
                fontSize: '11px',
                color: locked
                  ? (idx === currentIdx ? '#22C55E' : '#475569')
                  : (idx === currentIdx ? '#FACC15' : '#64748B'),
                background: idx === currentIdx ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                borderLeft: idx === currentIdx ? '4px solid #F59E0B' : '4px solid transparent',
                fontWeight: idx === currentIdx ? 'bold' : 'normal'
              }}
            >
              {idx === currentIdx ? '► ' : '  '}{r.name}
            </div>
          ))}
        </div>

        {!locked ? (
          <div style={{ textAlign: 'center', margin: '12px 0' }}>
            <button onClick={lockRoulette} className="nes-btn is-warning">
              🔨 LOCK ANALYSIS [H / SPACE]
            </button>
          </div>
        ) : (
          <div className="nes-container is-rounded is-dark" style={{ border: '2px solid #22C55E', margin: '12px 0', padding: '10px' }}>
            <p style={{ color: '#22C55E', fontWeight: 'bold' }}>SCANNER REPORT: {chosenRock?.name}</p>
            <p style={{ fontSize: '12px', color: '#CBD5E1', margin: '6px 0' }}>{chosenRock?.desc}</p>
            <p style={{ color: '#FACC15', fontSize: '11px', fontWeight: 'bold' }}>+50 XP Mineral Collector Reward!</p>
          </div>
        )}

        <div className="modal-footer-bar">
          <button onClick={onClose} className="nes-btn is-error">
            Stow Hand Lens &amp; Hammer
          </button>
        </div>
      </div>
    </div>
  );
};
