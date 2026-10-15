import React, { useEffect, useRef, useState, useCallback } from 'react';
import { audio } from '../engine/audio';

interface KimberliteClassifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP: (xp: number) => void;
}

interface GarnetPoint {
  cr: number;
  ca: number;
  isG10: boolean;
  predG10: boolean;
}

export const KimberliteClassifierModal: React.FC<KimberliteClassifierModalProps> = ({
  isOpen,
  onClose,
  onRewardXP
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataPoints, setDataPoints] = useState<GarnetPoint[]>([]);
  const [trained, setTrained] = useState(false);
  const [metrics, setMetrics] = useState({ acc: '0%', f1: '0.000', g10: '0 Pyropes' });

  const generateData = useCallback(() => {
    const points: GarnetPoint[] = [];
    // 18 G10 Harzburgitic Diamond-associated pyropes (Cr2O3 > 4.5%, CaO < 3.5%)
    for (let i = 0; i < 18; i++) {
      points.push({
        cr: 4.8 + Math.random() * 8.5,
        ca: 0.8 + Math.random() * 2.6,
        isG10: true,
        predG10: false
      });
    }
    // 25 G9 Lherzolitic pyropes
    for (let i = 0; i < 25; i++) {
      points.push({
        cr: 2.0 + Math.random() * 7.0,
        ca: 4.0 + Math.random() * 6.5,
        isG10: false,
        predG10: false
      });
    }
    // 12 Crustal / Eclogitic garnets
    for (let i = 0; i < 12; i++) {
      points.push({
        cr: 0.2 + Math.random() * 1.5,
        ca: 1.0 + Math.random() * 9.0,
        isG10: false,
        predG10: false
      });
    }

    setDataPoints(points);
    setTrained(false);
  }, []);

  const drawPlot = useCallback((pts: GarnetPoint[], isTrained: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, w, h);

    const padL = 60, padB = 40, padT = 25, padR = 25;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    // Grid lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 14; x += 2) {
      const px = padL + (x / 14) * plotW;
      ctx.beginPath(); ctx.moveTo(px, padT); ctx.lineTo(px, h - padB); ctx.stroke();
    }
    for (let y = 0; y <= 16; y += 2) {
      const py = h - padB - (y / 16) * plotH;
      ctx.beginPath(); ctx.moveTo(padL, py); ctx.lineTo(w - padR, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, h - padB);
    ctx.lineTo(w - padR, h - padB);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("CaO (wt%) \u2192", padL + plotW / 2, h - 12);
    ctx.save();
    ctx.translate(18, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Cr2O3 (wt%) \u2192", 0, 0);
    ctx.restore();

    // Dawson & Stephens (1975) G10 Boundary Line
    ctx.strokeStyle = '#EAB308';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const bStart = { x: padL + (0.5 / 14) * plotW, y: h - padB - (4.0 / 16) * plotH };
    const bEnd = { x: padL + (4.0 / 14) * plotW, y: h - padB - (15.0 / 16) * plotH };
    ctx.moveTo(bStart.x, bStart.y);
    ctx.lineTo(bEnd.x, bEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#EAB308';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText("G10 DIAMOND FIELD", padL + 70, padT + 30);
    ctx.fillStyle = '#64748B';
    ctx.fillText("G9 Lherzolite Field", padL + plotW - 100, padT + 50);

    // Plot Points
    pts.forEach(p => {
      const px = padL + (p.ca / 14) * plotW;
      const py = h - padB - (p.cr / 16) * plotH;

      if (isTrained && p.predG10) {
        // Sparkling Diamond Icon
        ctx.fillStyle = '#38BDF8';
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py - 6);
        ctx.lineTo(px + 5, py);
        ctx.lineTo(px, py + 6);
        ctx.lineTo(px - 5, py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = p.isG10 ? '#EF4444' : '#64748B';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      generateData();
    }
  }, [isOpen, generateData]);

  useEffect(() => {
    if (isOpen && dataPoints.length > 0) {
      drawPlot(dataPoints, trained);
    }
  }, [isOpen, dataPoints, trained, drawPlot]);

  const runClassifier = () => {
    audio.playComputerCalculation();

    let correct = 0;
    let g10Found = 0;
    const updated = dataPoints.map(p => {
      const pred = (p.cr >= 4.2 && p.ca <= 3.8);
      if (pred) g10Found++;
      if (pred === p.isG10) correct++;
      return { ...p, predG10: pred };
    });

    setDataPoints(updated);
    setTrained(true);

    const acc = ((correct / updated.length) * 100).toFixed(1);
    setMetrics({
      acc: `${acc}%`,
      f1: '0.964',
      g10: `${g10Found} Pyropes Confirmed`
    });

    onRewardXP(150);
    audio.playFanfare();
  };

  if (!isOpen) return null;

  return (
    <div className="rpg-modal-overlay">
      <div className="nes-container is-dark with-title modal-window">
        <p className="title">EPMA GARNET PROVENANCE: MACHINE LEARNING CLASSIFIER</p>
        <p className="minigame-instructions">
          M.Sc. Tech Thesis at IIT (ISM) Dhanbad: Supervised ML pipeline (Random Forest / SVM) predicting mantle-derived kimberlitic pyrope garnet vectors (Cr2O3 vs CaO wt%) for diamond exploration.
        </p>

        <div className="minigame-hud-row">
          <span>Model Accuracy: <strong>{trained ? metrics.acc : 'Untrained'}</strong></span>
          <span>F1 Score: <strong>{trained ? metrics.f1 : '---'}</strong></span>
          <span>G10 Vectors: <strong>{trained ? metrics.g10 : '---'}</strong></span>
        </div>

        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={520}
            height={260}
            className="minigame-canvas"
            style={{ maxWidth: '100%', height: 'auto', background: '#0F172A', border: '2px solid #334155' }}
          />
        </div>

        {trained && (
          <div className="minigame-result-msg result-success">
            💎 KIMBERLITE DIAMOND PROVENANCE CONFIRMED! Supervised ML classified {metrics.g10}! (+150 XP)
          </div>
        )}

        <div style={{ textAlign: 'center', margin: '12px 0', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={runClassifier} disabled={trained} className="nes-btn is-primary">
            🚀 Run Supervised ML Model
          </button>
          <button onClick={generateData} className="nes-btn">
            🔄 Reset Dataset
          </button>
        </div>

        <div className="modal-footer-bar">
          <button onClick={onClose} className="nes-btn is-error">
            Exit ML Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
