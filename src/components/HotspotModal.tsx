import React, { useEffect, useRef } from 'react';
import { OutfitType } from '../types/game';
import { sprites, PORTRAIT_EXPRESSIONS } from '../engine/sprites';

interface HotspotModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  outfit: OutfitType;
  expressionId?: string;
  onClose: () => void;
}

export const HotspotModal: React.FC<HotspotModalProps> = ({
  isOpen,
  title,
  content,
  outfit,
  expressionId = 'wicked_smirk',
  onClose
}) => {
  const portraitRef = useRef<HTMLCanvasElement | null>(null);

  const currentExpr = PORTRAIT_EXPRESSIONS.find(e => e.id === expressionId) || PORTRAIT_EXPRESSIONS[0];

  useEffect(() => {
    if (isOpen && portraitRef.current) {
      const ctx = portraitRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 80, 80);
        const outfitKey = outfit === 'scholar' ? 'academic' : outfit;
        const spr = sprites.get(`portrait_${currentExpr.id}_${outfitKey}`) ||
                    sprites.get(`portrait_${currentExpr.id}`) ||
                    sprites.get(`portrait_${outfitKey}`);
        if (spr) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(spr, 0, 0, 80, 80);
        }
      }
    }
  }, [isOpen, outfit, currentExpr.id]);

  if (!isOpen) return null;

  return (
    <div className="rpg-modal-overlay">
      <div className="nes-container is-dark with-title modal-window">
        <p className="title">{title}</p>
        <div className="modal-body-layout">
          <div className="modal-portrait-frame">
            <div className="portrait-frame-wrapper">
              <canvas
                ref={portraitRef}
                width={80}
                height={80}
                className="dialog-portrait-canvas"
              />
            </div>
            <div className="dialog-mood-badge" id="dialog-mood-badge">
              🎭 {currentExpr.name}
            </div>
            <div className="dialog-quote-bubble" id="dialog-quote-bubble">
              &ldquo;{currentExpr.quote}&rdquo;
            </div>
            <span className="pilot-caption">Rajdeep Tarafder &bull; ONGC</span>
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
