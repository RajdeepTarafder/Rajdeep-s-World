import React, { useEffect, useRef } from 'react';
import { OutfitType } from '../types/game';
import { sprites } from '../engine/sprites';

interface HotspotModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  outfit: OutfitType;
  onClose: () => void;
}

export const HotspotModal: React.FC<HotspotModalProps> = ({
  isOpen,
  title,
  content,
  outfit,
  onClose
}) => {
  const portraitRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen && portraitRef.current) {
      const ctx = portraitRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 80, 80);
        const outfitKey = outfit === 'scholar' ? 'academic' : outfit;
        const spr = sprites.get(`portrait_${outfitKey}`);
        if (spr) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(spr, 0, 0, 80, 80);
        }
      }
    }
  }, [isOpen, outfit]);

  if (!isOpen) return null;

  return (
    <div className="rpg-modal-overlay">
      <div className="nes-container is-dark with-title modal-window">
        <p className="title">{title}</p>
        <div className="modal-body-layout">
          <div className="modal-portrait-frame">
            <canvas
              ref={portraitRef}
              width={80}
              height={80}
              className="dialog-portrait-canvas"
            />
            <span className="pilot-caption">Rajdeep Tarafder</span>
          </div>
          <div
            className="modal-content-area"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <div className="modal-footer-bar">
          <button onClick={onClose} className="nes-btn is-primary">
            Close &bull; [SPACE / ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
