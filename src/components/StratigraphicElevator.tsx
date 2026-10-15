import React from 'react';

interface StratigraphicElevatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDepth: (depth: number, x: number, y: number) => void;
}

export const StratigraphicElevator: React.FC<StratigraphicElevatorProps> = ({
  isOpen,
  onClose,
  onSelectDepth
}) => {
  if (!isOpen) return null;

  return (
    <aside className="strat-elevator">
      <div className="elevator-header">
        <span className="elevator-title">STRATIGRAPHIC ELEVATOR</span>
        <button onClick={onClose} className="elevator-close-btn" title="Close Elevator">
          &times;
        </button>
      </div>
      <div className="elevator-levels">
        <button
          className="elevator-card"
          onClick={() => onSelectDepth(0, 1536, 352)}
        >
          <span className="depth-num">0m</span>
          <div className="depth-info">
            <strong>Surface Rig Floor</strong>
            <small>GDA-A Samastipur Frontline Ops</small>
          </div>
        </button>
        <button
          className="elevator-card"
          onClick={() => onSelectDepth(1500, 896, 352)}
        >
          <span className="depth-num">1500m</span>
          <div className="depth-info">
            <strong>Miocene Sandstones</strong>
            <small>Assam Shelf Barail &amp; Tipam (OIL)</small>
          </div>
        </button>
        <button
          className="elevator-card"
          onClick={() => onSelectDepth(3000, 768, 352)}
        >
          <span className="depth-num">3000m</span>
          <div className="depth-info">
            <strong>Proterozoic Basin</strong>
            <small>Vindhyan Rohtas Limestone (BExB/EPMB)</small>
          </div>
        </button>
        <button
          className="elevator-card"
          onClick={() => onSelectDepth(4500, 256, 352)}
        >
          <span className="depth-num">4500m</span>
          <div className="depth-info">
            <strong>Archean Basement</strong>
            <small>Bundelkhand Granite &amp; H2/He Degassing</small>
          </div>
        </button>
      </div>
    </aside>
  );
};
