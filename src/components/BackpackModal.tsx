import React, { useState, useEffect, useRef } from 'react';
import { OutfitType, PortraitExpressionId, PlayerProfile } from '../types/game';
import { sprites, PORTRAIT_EXPRESSIONS } from '../engine/sprites';
import { audio } from '../engine/audio';

interface BackpackModalProps {
  isOpen: boolean;
  player: PlayerProfile;
  outfit: OutfitType;
  currentExpression: PortraitExpressionId;
  onSelectExpression: (exprId: PortraitExpressionId) => void;
  onClose: () => void;
}

export const BackpackModal: React.FC<BackpackModalProps> = ({
  isOpen,
  player,
  outfit,
  currentExpression,
  onSelectExpression,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'gear' | 'soundboard'>('gear');
  const [previewExprId, setPreviewExprId] = useState<PortraitExpressionId>(currentExpression);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const outfitKey = outfit === 'scholar' ? 'academic' : outfit;
  const activeExpr = PORTRAIT_EXPRESSIONS.find(e => e.id === previewExprId) || PORTRAIT_EXPRESSIONS[0];

  useEffect(() => {
    if (isOpen) {
      setPreviewExprId(currentExpression);
    }
  }, [isOpen, currentExpression]);

  useEffect(() => {
    if (isOpen && activeTab === 'soundboard' && previewCanvasRef.current) {
      const ctx = previewCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 80, 80);
        const spr = sprites.get(`portrait_${previewExprId}_${outfitKey}`) ||
                    sprites.get(`portrait_${previewExprId}`) ||
                    sprites.get(`portrait_${outfitKey}`);
        if (spr) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(spr, 0, 0, 80, 80);
        }
      }
    }
  }, [isOpen, activeTab, previewExprId, outfitKey]);

  if (!isOpen) return null;

  const handleAudition = (expr: typeof PORTRAIT_EXPRESSIONS[0]) => {
    setPreviewExprId(expr.id);
    audio.playExpressionChirp(expr.sound.freq, expr.sound.type, expr.sound.duration);
  };

  const handleSetActive = () => {
    onSelectExpression(previewExprId);
    audio.playFanfare();
  };

  return (
    <div className="rpg-modal-overlay">
      <div className="nes-container is-dark with-title modal-window modal-backpack">
        <p className="title">🎒 GEOLOGICAL EXPEDITION BACKPACK &amp; AVATAR STUDIO</p>

        {/* Tab Selector */}
        <div className="updater-tabs" style={{ marginBottom: '14px' }}>
          <button
            onClick={() => setActiveTab('gear')}
            className={`nes-btn ${activeTab === 'gear' ? 'is-primary tab-active' : ''}`}
          >
            🎒 Field Equipment &amp; Gear
          </button>
          <button
            onClick={() => setActiveTab('soundboard')}
            className={`nes-btn ${activeTab === 'soundboard' ? 'is-warning tab-active' : ''}`}
          >
            🎭 10-Face Expression Soundboard
          </button>
        </div>

        {activeTab === 'gear' ? (
          <div className="backpack-gear-view">
            <h4 style={{ color: '#F59E0B', marginBottom: '8px', fontSize: '11px' }}>
              ACTIVE PILOT: {player.name.toUpperCase()} ({player.title}) &bull; CPF: {player.cpf}
            </h4>
            <div className="gear-grid">
              <div className="gear-card">
                <span className="gear-icon">🔨</span>
                <div className="gear-info">
                  <strong>Estwing Rock Hammer [Press H]</strong>
                  <p>Fresh rock cleavage, mineral streak examination &amp; bedrock strikes.</p>
                </div>
              </div>
              <div className="gear-card">
                <span className="gear-icon">🔍</span>
                <div className="gear-info">
                  <strong>10x Bausch &amp; Lomb Loupe [Press M]</strong>
                  <p>Petrological lens for twinning, euhedral garnets &amp; micro-porosity.</p>
                </div>
              </div>
              <div className="gear-card">
                <span className="gear-icon">⚽</span>
                <div className="gear-info">
                  <strong>Centre-Back Cleats [Press F]</strong>
                  <p>Field slide tackle defense! Winner of Inter-Departmental Football '22.</p>
                </div>
              </div>
              <div className="gear-card">
                <span className="gear-icon">🪖</span>
                <div className="gear-info">
                  <strong>Wellsite PPE (Rig Hard Hat &amp; Vest)</strong>
                  <p>Auto-equips upon entering frontline drilling floor. Zero LTI protocols.</p>
                </div>
              </div>
              <div className="gear-card">
                <span className="gear-icon">☕</span>
                <div className="gear-info">
                  <strong>3 AM Doghouse Masala Chai / Coffee</strong>
                  <p>Infinite caffeine boost for real-time pore pressure &amp; trip-gas monitoring.</p>
                </div>
              </div>
              <div className="gear-card">
                <span className="gear-icon">💻</span>
                <div className="gear-info">
                  <strong>Interpretation Software Arsenal</strong>
                  <p>Schlumberger Petrel, Eliis PaleoScan, DSPetrophysics, QGIS, ArcGIS.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="soundboard-view">
            {/* Top Interactive Preview Bar */}
            <div className="soundboard-preview-bar">
              <div className="soundboard-preview-portrait">
                <canvas
                  ref={previewCanvasRef}
                  width={80}
                  height={80}
                  className="dialog-portrait-canvas"
                />
              </div>
              <div className="soundboard-preview-details">
                <div className="preview-header-line">
                  <span className="preview-title">{activeExpr.name}</span>
                  {currentExpression === previewExprId && (
                    <span className="nes-badge is-success"><span className="is-success">ACTIVE MOOD</span></span>
                  )}
                </div>
                <div className="preview-quote-line">&ldquo;{activeExpr.quote}&rdquo;</div>
                <div className="preview-trigger-line">Trigger: {activeExpr.triggerText}</div>
                <div className="preview-actions">
                  <button
                    onClick={() => handleAudition(activeExpr)}
                    className="nes-btn is-warning"
                    style={{ fontSize: '8px', padding: '4px 10px' }}
                  >
                    🔊 Play Synth Chirp
                  </button>
                  <button
                    onClick={handleSetActive}
                    className="nes-btn is-primary"
                    style={{ fontSize: '8px', padding: '4px 10px' }}
                  >
                    ⭐ Set as Active Avatar Mood
                  </button>
                </div>
              </div>
            </div>

            {/* 10-Face Expression Selection Grid */}
            <div className="soundboard-grid">
              {PORTRAIT_EXPRESSIONS.map((expr, idx) => {
                const isSelected = expr.id === previewExprId;
                const isActive = expr.id === currentExpression;
                return (
                  <div
                    key={expr.id}
                    onClick={() => handleAudition(expr)}
                    className={`soundboard-card ${isSelected ? 'selected' : ''} ${isActive ? 'active-avatar' : ''}`}
                  >
                    <div className="sb-num">#{idx + 1}</div>
                    <div className="sb-name">{expr.name}</div>
                    <div className="sb-trigger">{expr.triggerText}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="modal-footer-bar" style={{ marginTop: '16px' }}>
          <button onClick={onClose} className="nes-btn is-primary">
            Close &bull; [SPACE / ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
