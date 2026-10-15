import React, { useEffect, useRef, useState, useCallback } from 'react';

interface SarDespecklingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SarDespecklingModal: React.FC<SarDespecklingModalProps> = ({
  isOpen,
  onClose
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const beforeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const w = 600, h = 260;

    // 1. Raw SAR with severe speckle noise
    if (beforeCanvasRef.current) {
      const ctxB = beforeCanvasRef.current.getContext('2d');
      if (ctxB) {
        ctxB.fillStyle = '#0F172A';
        ctxB.fillRect(0, 0, w, h);
        for (let x = 0; x < w; x += 3) {
          for (let y = 0; y < h; y += 3) {
            const val = Math.floor(Math.random() * 110 + 20);
            ctxB.fillStyle = `rgb(${val}, ${val + 10}, ${val + 20})`;
            ctxB.fillRect(x, y, 3, 3);
          }
        }
        ctxB.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctxB.lineWidth = 4;
        ctxB.beginPath();
        ctxB.moveTo(50, 180); ctxB.lineTo(350, 90); ctxB.lineTo(550, 70);
        ctxB.stroke();
      }
    }

    // 2. AI Despeckled Sentinel-1 Imagery
    if (afterCanvasRef.current) {
      const ctxA = afterCanvasRef.current.getContext('2d');
      if (ctxA) {
        ctxA.fillStyle = '#090D16';
        ctxA.fillRect(0, 0, w, h);

        const grad = ctxA.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0F172A');
        grad.addColorStop(1, '#1E293B');
        ctxA.fillStyle = grad;
        ctxA.fillRect(0, 0, w, h);

        // Major Narmada-Son Fault Trace
        ctxA.strokeStyle = '#38BDF8';
        ctxA.lineWidth = 3;
        ctxA.shadowColor = '#38BDF8';
        ctxA.shadowBlur = 8;
        ctxA.beginPath();
        ctxA.moveTo(40, 190); ctxA.lineTo(240, 130); ctxA.lineTo(420, 95); ctxA.lineTo(570, 75);
        ctxA.stroke();

        // Splay Faults
        ctxA.strokeStyle = '#F59E0B';
        ctxA.lineWidth = 2;
        ctxA.shadowColor = '#F59E0B';
        ctxA.shadowBlur = 6;
        ctxA.beginPath();
        ctxA.moveTo(240, 130); ctxA.lineTo(320, 200); ctxA.lineTo(460, 230);
        ctxA.moveTo(420, 95); ctxA.lineTo(490, 140);
        ctxA.stroke();

        ctxA.shadowBlur = 0;

        // Labels
        ctxA.fillStyle = '#38BDF8';
        ctxA.font = '8px "Press Start 2P", monospace';
        ctxA.fillText("Narmada-Son Deep Shear Lineament", 60, 165);
        ctxA.fillStyle = '#F59E0B';
        ctxA.fillText("BExB / EPMB Splays", 330, 190);

        ctxA.fillStyle = '#22C55E';
        ctxA.fillText("\u2B9D H2/He Basement Conduits", 380, 50);
      }
    }
  }, [isOpen]);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(10, Math.min(rect.width - 10, x));
    const pct = (x / rect.width) * 100;
    setSliderPos(pct);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      updatePosition(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) updatePosition(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) updatePosition(e.touches[0].clientX);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, updatePosition]);

  if (!isOpen) return null;

  return (
    <div className="rpg-modal-overlay">
      <div className="nes-container is-dark with-title modal-window">
        <p className="title">SENTINEL-1 SAR DESPECKLING &amp; STRUCTURAL EXTRACTION</p>
        <p className="minigame-instructions">
          Drag the interactive divider to compare raw speckled radar backscatter vs AI-despeckled deep crustal lineaments and H2/He migration conduits!
        </p>

        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            height: '260px',
            margin: '14px auto',
            overflow: 'hidden',
            border: '3px solid #334155',
            borderRadius: '4px',
            cursor: 'ew-resize',
            userSelect: 'none'
          }}
        >
          {/* Base: Raw SAR Canvas */}
          <canvas
            ref={beforeCanvasRef}
            width={600}
            height={260}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />

          {/* Overlay: AI Despeckled Canvas */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${sliderPos}%`,
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <canvas
              ref={afterCanvasRef}
              width={600}
              height={260}
              style={{ width: '600px', height: '260px', display: 'block', maxWidth: 'none' }}
            />
          </div>

          {/* Draggable Divider */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${sliderPos}%`,
              width: '4px',
              background: '#38BDF8',
              boxShadow: '0 0 10px #38BDF8',
              transform: 'translateX(-50%)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#0F172A',
                border: '2px solid #38BDF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: '#38BDF8'
              }}
            >
              ↔
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '600px', margin: '0 auto', fontSize: '10px', color: '#94A3B8' }}>
          <span>◄ Raw Sentinel-1 SAR Backscatter (Noise)</span>
          <span>AI-Despeckled Deep Shear Conduits ►</span>
        </div>

        <div className="modal-footer-bar">
          <button onClick={onClose} className="nes-btn is-error">
            Return to Petrel Lab
          </button>
        </div>
      </div>
    </div>
  );
};
