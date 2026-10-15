import React, { useState } from 'react';
import { Achievement, CareerData } from '../types/game';
import { audio } from '../engine/audio';

interface LiveUpdaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerData: CareerData;
  onAddMilestone: (title: string, date: string, category: string, desc: string) => void;
  onDeleteMilestone: (id: string) => void;
}

export const LiveUpdaterModal: React.FC<LiveUpdaterModalProps> = ({
  isOpen,
  onClose,
  careerData,
  onAddMilestone,
  onDeleteMilestone
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'view'>('add');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026');
  const [category, setCategory] = useState<'lab' | 'rig' | 'academic'>('lab');
  const [desc, setDesc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) {
      return;
    }
    onAddMilestone(title.trim(), date.trim() || '2026', category, desc.trim());
    setTitle('');
    setDesc('');
    setActiveTab('view');
  };

  const downloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(careerData, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'career-data.json');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const achievements = careerData.achievements || [];

  return (
    <div className="rpg-modal-overlay">
      <div className="nes-container is-dark with-title modal-window">
        <p className="title">LIVE CAREER &amp; FIELD MILESTONE UPDATER</p>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <button
            type="button"
            className={`nes-btn ${activeTab === 'add' ? 'is-primary' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            ➕ Add Milestone
          </button>
          <button
            type="button"
            className={`nes-btn ${activeTab === 'view' ? 'is-primary' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            📋 View All ({achievements.length})
          </button>
        </div>

        {activeTab === 'add' ? (
          <form onSubmit={handleSubmit}>
            <div className="nes-field" style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', color: '#94A3B8' }}>Milestone Title / Discovery:</label>
              <input
                type="text"
                className="nes-input is-dark"
                placeholder="e.g. Son Valley Helium Seepage Confirmation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div className="nes-field">
                <label style={{ fontSize: '11px', color: '#94A3B8' }}>Year / Period:</label>
                <input
                  type="text"
                  className="nes-input is-dark"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="nes-field">
                <label style={{ fontSize: '11px', color: '#94A3B8' }}>Sector Category:</label>
                <div className="nes-select is-dark">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                  >
                    <option value="lab">Subsurface G&amp;G (Petrel Lab)</option>
                    <option value="rig">Frontline Operations (Rig Floor)</option>
                    <option value="academic">Academic &amp; Research (Archive)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="nes-field" style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', color: '#94A3B8' }}>Technical Description &amp; Impact:</label>
              <textarea
                className="nes-textarea is-dark"
                rows={3}
                placeholder="Explain the operational breakthrough, seismic interpretation result, or research milestone..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="nes-btn is-success" style={{ width: '100%', marginBottom: '10px' }}>
              💾 Save Milestone &amp; Spawn Pedestal (+200 XP)
            </button>
          </form>
        ) : (
          <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '14px', paddingRight: '4px' }}>
            {achievements.length === 0 ? (
              <p style={{ padding: '12px', color: '#94A3B8' }}>No milestones added yet. Add one in the Add Milestone tab!</p>
            ) : (
              achievements.map(a => (
                <div
                  key={a.id}
                  style={{
                    background: '#1E293B',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    border: '1px solid #334155',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', color: '#FACC15', fontWeight: 'bold' }}>
                      {a.title} ({a.date || '2026'}) &bull; <span style={{ color: '#38BDF8' }}>{a.category.toUpperCase()}</span>
                    </div>
                    <p style={{ fontSize: '10px', color: '#CBD5E1', margin: '4px 0 0 0' }}>{a.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      audio.playHit();
                      onDeleteMilestone(a.id);
                    }}
                    className="nes-btn is-error"
                    style={{ fontSize: '9px', padding: '4px 8px' }}
                    title="Delete Milestone"
                  >
                    &times; Del
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <button
            type="button"
            onClick={downloadJSON}
            className="nes-btn is-primary"
            title="Export updated dataset to JSON file"
          >
            💾 Download JSON
          </button>
          <button type="button" onClick={onClose} className="nes-btn is-error">
            Close [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
