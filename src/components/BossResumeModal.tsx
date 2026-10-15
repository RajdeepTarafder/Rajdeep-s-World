import React, { useState, useEffect, useRef } from 'react';
import {
  CareerData,
  OperationsTallyRow,
  TechnicalReport,
  SpecializedTraining,
  CustomSection
} from '../types/game';
import { INITIAL_CAREER_DATA } from '../data/careerData';
import { audio } from '../engine/audio';

interface BossResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerData: CareerData;
  onUpdateCareerData: (data: CareerData) => void;
}

type CvFilter = 'all' | 'interpretation' | 'wellsite' | 'ai_data';
type CvTheme = 'theme-white' | 'theme-ongc' | 'theme-terminal';

export const BossResumeModal: React.FC<BossResumeModalProps> = ({
  isOpen,
  onClose,
  careerData,
  onUpdateCareerData
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<CvFilter>('all');
  const [activeTheme, setActiveTheme] = useState<CvTheme>('theme-white');
  const [pinPromptOpen, setPinPromptOpen] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const saveTimeoutRef = useRef<any>(null);

  // Auto-sync edits to localStorage & parent state
  const handleDataChange = (updater: (prev: CareerData) => CareerData) => {
    const updated = updater(careerData);
    onUpdateCareerData(updated);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('rajdeep_boss_cv_custom', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save to localStorage', err);
      }
    }, 400);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all Boss CV sections and text to canonical defaults? Any unsaved edits will be cleared.')) {
      localStorage.removeItem('rajdeep_boss_cv_custom');
      onUpdateCareerData(INITIAL_CAREER_DATA);
      audio.playFanfare();
    }
  };

  const handleAdminExport = () => {
    setPinError('');
    setPinInput('');
    setPinPromptOpen(true);
  };

  const verifyPinAndDownload = () => {
    if (pinInput.trim() === '141604') {
      setPinPromptOpen(false);
      audio.playFanfare();
      const blob = new Blob([JSON.stringify(careerData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `career-data-CPF-141604-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      setPinError('INVALID PIN! Access restricted to CPF: 141604');
      audio.playHit();
    }
  };

  // Micro-Control Operations for Tally Table
  const addTallyRow = () => {
    const newRow: OperationsTallyRow = {
      id: `tally_${Date.now()}`,
      basin: "New Basin / Exploration Block",
      roleScope: "Lead Geologist / Subsurface Specialist",
      software: "Petrel, PaleoScan, Python",
      outcome: "Successfully delineated prospective reservoir closure and verified formation seal.",
      category: activeFilter === 'all' ? 'interpretation' : activeFilter
    };
    handleDataChange(prev => ({
      ...prev,
      operationsTally: [...(prev.operationsTally || []), newRow]
    }));
  };

  const updateTallyCell = (id: string, field: keyof OperationsTallyRow, val: string) => {
    handleDataChange(prev => ({
      ...prev,
      operationsTally: (prev.operationsTally || []).map(r => r.id === id ? { ...r, [field]: val } : r)
    }));
  };

  const moveTallyRow = (idx: number, direction: 'up' | 'down') => {
    handleDataChange(prev => {
      const list = [...(prev.operationsTally || [])];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      return { ...prev, operationsTally: list };
    });
  };

  const deleteTallyRow = (id: string) => {
    handleDataChange(prev => ({
      ...prev,
      operationsTally: (prev.operationsTally || []).filter(r => r.id !== id)
    }));
  };

  // Micro-Control Operations for Roles
  const updateRoleBullet = (roleId: string, bIdx: number, val: string) => {
    handleDataChange(prev => ({
      ...prev,
      roles: (prev.roles || []).map(r => {
        if (r.id !== roleId) return r;
        const newHighlights = [...r.highlights];
        newHighlights[bIdx] = val;
        return { ...r, highlights: newHighlights };
      })
    }));
  };

  const addRoleBullet = (roleId: string) => {
    handleDataChange(prev => ({
      ...prev,
      roles: (prev.roles || []).map(r => {
        if (r.id !== roleId) return r;
        return { ...r, highlights: [...r.highlights, "New technical achievement or operational surveillance milestone."] };
      })
    }));
  };

  const moveRoleBullet = (roleId: string, bIdx: number, direction: 'up' | 'down') => {
    handleDataChange(prev => ({
      ...prev,
      roles: (prev.roles || []).map(r => {
        if (r.id !== roleId) return r;
        const list = [...r.highlights];
        const targetIdx = direction === 'up' ? bIdx - 1 : bIdx + 1;
        if (targetIdx < 0 || targetIdx >= list.length) return r;
        const temp = list[bIdx];
        list[bIdx] = list[targetIdx];
        list[targetIdx] = temp;
        return { ...r, highlights: list };
      })
    }));
  };

  const deleteRoleBullet = (roleId: string, bIdx: number) => {
    handleDataChange(prev => ({
      ...prev,
      roles: (prev.roles || []).map(r => {
        if (r.id !== roleId) return r;
        return { ...r, highlights: r.highlights.filter((_, i) => i !== bIdx) };
      })
    }));
  };

  // Micro-Control Operations for Reports
  const addReport = () => {
    const newReport: TechnicalReport = {
      id: `rep_${Date.now()}`,
      title: "New Geological Assessment / Subsurface Research Report",
      category: activeFilter === 'all' ? 'interpretation' : activeFilter,
      institution: "ONGC Subsurface G&G Group",
      period: "2024",
      summary: "Comprehensive integration of wireline petrophysics, seismic fault-seal attributes, and basin geomechanics."
    };
    handleDataChange(prev => ({
      ...prev,
      technicalReports: [...(prev.technicalReports || []), newReport]
    }));
  };

  const updateReport = (id: string, field: keyof TechnicalReport, val: string) => {
    handleDataChange(prev => ({
      ...prev,
      technicalReports: (prev.technicalReports || []).map(rep => rep.id === id ? { ...rep, [field]: val } : rep)
    }));
  };

  const moveReport = (idx: number, direction: 'up' | 'down') => {
    handleDataChange(prev => {
      const list = [...(prev.technicalReports || [])];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      return { ...prev, technicalReports: list };
    });
  };

  const deleteReport = (id: string) => {
    handleDataChange(prev => ({
      ...prev,
      technicalReports: (prev.technicalReports || []).filter(rep => rep.id !== id)
    }));
  };

  // Micro-Control Operations for Training
  const addTraining = () => {
    const newTrain: SpecializedTraining = {
      id: `train_${Date.now()}`,
      title: "New Specialized Operational Certification",
      issuer: "Directorate of Drilling & Exploration Operations",
      category: activeFilter === 'all' ? 'wellsite' : activeFilter,
      description: "Advanced certification covering wellbore integrity, formation evaluation, and industrial safety compliance."
    };
    handleDataChange(prev => ({
      ...prev,
      specializedTraining: [...(prev.specializedTraining || []), newTrain]
    }));
  };

  const updateTraining = (id: string, field: keyof SpecializedTraining, val: string) => {
    handleDataChange(prev => ({
      ...prev,
      specializedTraining: (prev.specializedTraining || []).map(t => t.id === id ? { ...t, [field]: val } : t)
    }));
  };

  const moveTraining = (idx: number, direction: 'up' | 'down') => {
    handleDataChange(prev => {
      const list = [...(prev.specializedTraining || [])];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      return { ...prev, specializedTraining: list };
    });
  };

  const deleteTraining = (id: string) => {
    handleDataChange(prev => ({
      ...prev,
      specializedTraining: (prev.specializedTraining || []).filter(t => t.id !== id)
    }));
  };

  // Custom Section Operations
  const addCustomSection = () => {
    const newSec: CustomSection = {
      id: `custom_${Date.now()}`,
      title: "Special Executive Advisory / Custom Portfolio",
      bullets: [
        "First milestone or achievement bullet for this custom section.",
        "Second high-impact metric or strategic deliverable."
      ]
    };
    handleDataChange(prev => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSec]
    }));
  };

  const updateCustomSectionTitle = (id: string, title: string) => {
    handleDataChange(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s => s.id === id ? { ...s, title } : s)
    }));
  };

  const addCustomBullet = (id: string) => {
    handleDataChange(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s => s.id === id ? { ...s, bullets: [...s.bullets, "New customized bullet point."] } : s)
    }));
  };

  const updateCustomBullet = (secId: string, bIdx: number, val: string) => {
    handleDataChange(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s => {
        if (s.id !== secId) return s;
        const newB = [...s.bullets];
        newB[bIdx] = val;
        return { ...s, bullets: newB };
      })
    }));
  };

  const deleteCustomBullet = (secId: string, bIdx: number) => {
    handleDataChange(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s => {
        if (s.id !== secId) return s;
        return { ...s, bullets: s.bullets.filter((_, i) => i !== bIdx) };
      })
    }));
  };

  const deleteCustomSection = (id: string) => {
    handleDataChange(prev => ({
      ...prev,
      customSections: (prev.customSections || []).filter(s => s.id !== id)
    }));
  };

  if (!isOpen) return null;

  const { player: p, roles, achievements, education, researchTheses, skills, operationsTally, technicalReports, specializedTraining, customSections } = careerData;

  const copyPlainTextATS = () => {
    const txt = `
${p.name}
${p.title} | ${p.organization}
CPF: ${p.cpf} | DOJ: ${p.doj} | Email: ${p.email} | Phone: ${p.phone}
LinkedIn: ${p.linkedin} | Location: ${p.location}

PROFESSIONAL SUMMARY
${p.summary}

BASIN & WELLSITE OPERATIONS TALLY
${(operationsTally || []).map(t => `* ${t.basin} | Role: ${t.roleScope} | Tools: ${t.software} | Outcome: ${t.outcome}`).join('\n')}

CURRENT & RECENT INDUSTRY TRACK RECORD
${(roles || []).map(r => `
* ${r.role} - ${r.company} (${r.period})
  Location: ${r.location}
${r.highlights.map(h => `  - ${h}`).join('\n')}
`).join('\n')}

KEY TECHNICAL REPORTS & RESEARCH
${(technicalReports || []).map(r => `* ${r.title} (${r.period}) - ${r.institution}: ${r.summary}`).join('\n')}

SPECIALIZED OPERATIONAL & TECHNICAL TRAINING
${(specializedTraining || []).map(t => `* ${t.title} (${t.issuer}): ${t.description}`).join('\n')}

EDUCATION
${(education || []).map(e => `* ${e.degree} - ${e.institution} (${e.period}) [${e.score}]`).join('\n')}

TECHNICAL SKILLS MATRIX
* Subsurface G&G: ${(skills?.subsurface || []).join(', ')}
* Wellsite Ops: ${(skills?.wellsite || []).join(', ')}
* Unconventional Clean Energy: ${(skills?.unconventional || []).join(', ')}
* Programming & Data Science: ${(skills?.programming || []).join(', ')}
    `.trim();

    navigator.clipboard.writeText(txt);
    alert('Plaintext resume copied to clipboard for ATS portals!');
  };

  // Filter helper functions to categorize items
  const getItemClass = (category?: string) => {
    if (activeFilter === 'all') return '';
    return category === activeFilter ? 'filter-highlight' : 'filter-dimmed';
  };

  return (
    <div className="boss-resume-modal" id="boss-resume-modal">
      {/* Upgraded Boss Studio Toolbar */}
      <div className="boss-toolbar no-print">
        <div className="toolbar-row-top">
          <div className="toolbar-left">
            <button onClick={onClose} className="nes-btn is-primary" style={{ padding: '4px 10px', fontSize: '9px' }}>
              &larr; Resume Geology Quest
            </button>
            <span className="boss-notice" style={{ fontSize: '9px', fontWeight: 'bold' }}>
              👔 BOSS MODE: 100% INLINE-EDITABLE CV STUDIO
            </span>
          </div>
          <div className="toolbar-right">
            <button
              onClick={() => setIsEditMode(prev => !prev)}
              className={`nes-btn ${isEditMode ? 'is-warning' : ''}`}
              style={{ padding: '4px 10px', fontSize: '9px' }}
            >
              {isEditMode ? '💾 Finish Editing' : '✏️ Live Edit Mode'}
            </button>
            <button
              onClick={addCustomSection}
              className="nes-btn"
              style={{ padding: '4px 10px', fontSize: '9px' }}
            >
              ➕ Add Section
            </button>
            <button
              onClick={handleResetDefaults}
              className="nes-btn"
              style={{ padding: '4px 10px', fontSize: '9px' }}
            >
              🔄 Reset Defaults
            </button>
            <button
              onClick={handleAdminExport}
              className="nes-btn is-error"
              style={{ padding: '4px 10px', fontSize: '9px' }}
            >
              🔒 Admin Export (PIN)
            </button>
            <button
              onClick={copyPlainTextATS}
              className="nes-btn"
              style={{ padding: '4px 10px', fontSize: '9px' }}
            >
              📋 Copy Plaintext
            </button>
            <button
              onClick={() => window.print()}
              className="nes-btn is-success"
              style={{ padding: '4px 10px', fontSize: '9px' }}
            >
              🖨️ Print / Clean PDF
            </button>
          </div>
        </div>

        {/* Second Row: Recruiter Filter Tabs & Theme Presets */}
        <div className="toolbar-row-bottom">
          <div className="filter-group">
            <span className="filter-label">Recruiter Filter:</span>
            <button
              onClick={() => setActiveFilter('all')}
              className={`cv-filter-btn ${activeFilter === 'all' ? 'filter-active' : ''}`}
            >
              All Complete
            </button>
            <button
              onClick={() => setActiveFilter('interpretation')}
              className={`cv-filter-btn ${activeFilter === 'interpretation' ? 'filter-active' : ''}`}
            >
              Focus: G&amp;G Interpretation
            </button>
            <button
              onClick={() => setActiveFilter('wellsite')}
              className={`cv-filter-btn ${activeFilter === 'wellsite' ? 'filter-active' : ''}`}
            >
              Focus: Wellsite &amp; Drilling Ops
            </button>
            <button
              onClick={() => setActiveFilter('ai_data')}
              className={`cv-filter-btn ${activeFilter === 'ai_data' ? 'filter-active' : ''}`}
            >
              Focus: AI / SAR &amp; Data Science
            </button>
          </div>

          <div className="theme-group">
            <span className="filter-label">Theme:</span>
            <button
              onClick={() => setActiveTheme('theme-white')}
              className={`cv-theme-btn ${activeTheme === 'theme-white' ? 'theme-active' : ''}`}
            >
              Classic White (ATS)
            </button>
            <button
              onClick={() => setActiveTheme('theme-ongc')}
              className={`cv-theme-btn ${activeTheme === 'theme-ongc' ? 'theme-active' : ''}`}
            >
              ONGC Maroon
            </button>
            <button
              onClick={() => setActiveTheme('theme-terminal')}
              className={`cv-theme-btn ${activeTheme === 'theme-terminal' ? 'theme-active' : ''}`}
            >
              Dark Terminal
            </button>
          </div>
        </div>
      </div>

      {/* Admin PIN Verification Modal Dialog */}
      {pinPromptOpen && (
        <div className="rpg-modal-overlay" style={{ zIndex: 100000 }}>
          <div className="nes-container is-dark with-title" style={{ maxWidth: '420px', width: '90%' }}>
            <p className="title">🔒 SECURITY PIN VERIFICATION</p>
            <p style={{ fontSize: '10px', marginBottom: '10px' }}>
              Exporting master <code>career-data.json</code> is gated by employee CPF security PIN.
            </p>
            <div className="nes-field">
              <label htmlFor="pin_input" style={{ fontSize: '9px' }}>Enter CPF PIN (141604):</label>
              <input
                type="password"
                id="pin_input"
                className="nes-input"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="CPF PIN..."
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') verifyPinAndDownload(); }}
              />
            </div>
            {pinError && <p style={{ color: '#EF4444', fontSize: '9px', marginTop: '6px' }}>{pinError}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
              <button onClick={() => setPinPromptOpen(false)} className="nes-btn" style={{ fontSize: '8px' }}>
                Cancel
              </button>
              <button onClick={verifyPinAndDownload} className="nes-btn is-primary" style={{ fontSize: '8px' }}>
                Verify &amp; Download JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Resume Scroll Viewport */}
      <div className={`boss-resume-scroll ${activeTheme}`}>
        <div className={`printable-paper ${activeTheme} ${isEditMode ? 'cv-edit-active' : ''}`}>
          
          {/* Executive Header */}
          <header className="res-header">
            <div className="res-header-layout">
              <div className="res-header-info">
                <h1
                  className="res-name"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => handleDataChange(prev => ({ ...prev, player: { ...prev.player, name: e.currentTarget.textContent || prev.player.name } }))}
                >
                  {p.name}
                </h1>
                <h2 className="res-subtitle">
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => handleDataChange(prev => ({ ...prev, player: { ...prev.player, title: e.currentTarget.textContent || prev.player.title } }))}
                  >
                    {p.title}
                  </span> &bull; <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => handleDataChange(prev => ({ ...prev, player: { ...prev.player, organization: e.currentTarget.textContent || prev.player.organization } }))}
                  >
                    {p.organization}
                  </span>
                </h2>
                <div className="res-meta">
                  <div>
                    <strong>CPF:</strong> <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleDataChange(prev => ({ ...prev, player: { ...prev.player, cpf: e.currentTarget.textContent || prev.player.cpf } }))}
                    >{p.cpf}</span> &bull; <strong>DOJ:</strong> <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleDataChange(prev => ({ ...prev, player: { ...prev.player, doj: e.currentTarget.textContent || prev.player.doj } }))}
                    >{p.doj}</span>
                  </div>
                  <div>
                    <strong>Email:</strong> <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleDataChange(prev => ({ ...prev, player: { ...prev.player, email: e.currentTarget.textContent || prev.player.email } }))}
                    >{p.email}</span> &bull; <strong>Phone:</strong> <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleDataChange(prev => ({ ...prev, player: { ...prev.player, phone: e.currentTarget.textContent || prev.player.phone } }))}
                    >{p.phone}</span>
                  </div>
                  <div>
                    <strong>LinkedIn:</strong> <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleDataChange(prev => ({ ...prev, player: { ...prev.player, linkedin: e.currentTarget.textContent || prev.player.linkedin } }))}
                    >{p.linkedin}</span> &bull; <strong>Location:</strong> <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleDataChange(prev => ({ ...prev, player: { ...prev.player, location: e.currentTarget.textContent || prev.player.location } }))}
                    >{p.location}</span>
                  </div>
                </div>
              </div>
              <div className="res-header-photo">
                <img src={p.photo || 'avatar-photo.jpg'} alt={p.name} className="res-headshot" />
              </div>
            </div>
          </header>

          {/* Professional Executive Summary */}
          <section className="res-section">
            <h3 className="res-section-title">Professional Executive Summary</h3>
            <p
              className="res-summary"
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => handleDataChange(prev => ({ ...prev, player: { ...prev.player, summary: e.currentTarget.textContent || prev.player.summary } }))}
            >
              {p.summary}
            </p>
          </section>

          {/* Specialized Section A: Basin & Wellsite Operations Tally (Editable Table) */}
          <section className="res-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="res-section-title">Basin &amp; Wellsite Operations Tally</h3>
              {isEditMode && (
                <button onClick={addTallyRow} className="nes-btn is-primary no-print add-bullet-btn">
                  ➕ Add Tally Row
                </button>
              )}
            </div>
            <div className="tally-table-wrapper" style={{ overflowX: 'auto', marginTop: '6px' }}>
              <table className="tally-table">
                <thead>
                  <tr>
                    <th className="tally-th" style={{ width: '22%' }}>Basin / Block / Well</th>
                    <th className="tally-th" style={{ width: '22%' }}>Role &amp; Scope</th>
                    <th className="tally-th" style={{ width: '22%' }}>Software / Tools</th>
                    <th className="tally-th" style={{ width: '28%' }}>Key Outcome &amp; Impact</th>
                    {isEditMode && <th className="tally-th no-print" style={{ width: '6%' }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {(operationsTally || []).map((row, idx) => {
                    const rowClass = getItemClass(row.category);
                    return (
                      <tr key={row.id} className={rowClass}>
                        <td
                          className="tally-td"
                          contentEditable={isEditMode}
                          suppressContentEditableWarning
                          onBlur={(e) => updateTallyCell(row.id, 'basin', e.currentTarget.textContent || row.basin)}
                        >
                          <strong>{row.basin}</strong>
                        </td>
                        <td
                          className="tally-td"
                          contentEditable={isEditMode}
                          suppressContentEditableWarning
                          onBlur={(e) => updateTallyCell(row.id, 'roleScope', e.currentTarget.textContent || row.roleScope)}
                        >
                          {row.roleScope}
                        </td>
                        <td
                          className="tally-td"
                          contentEditable={isEditMode}
                          suppressContentEditableWarning
                          onBlur={(e) => updateTallyCell(row.id, 'software', e.currentTarget.textContent || row.software)}
                        >
                          {row.software}
                        </td>
                        <td
                          className="tally-td"
                          contentEditable={isEditMode}
                          suppressContentEditableWarning
                          onBlur={(e) => updateTallyCell(row.id, 'outcome', e.currentTarget.textContent || row.outcome)}
                        >
                          {row.outcome}
                        </td>
                        {isEditMode && (
                          <td className="tally-td no-print" style={{ whiteSpace: 'nowrap' }}>
                            <div className="edit-micro-controls">
                              <button onClick={() => moveTallyRow(idx, 'up')} className="micro-btn" title="Move Up">⬆️</button>
                              <button onClick={() => moveTallyRow(idx, 'down')} className="micro-btn" title="Move Down">⬇️</button>
                              <button onClick={() => deleteTallyRow(row.id)} className="micro-btn is-del" title="Delete">🗑️</button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Current & Recent Industry Track Record */}
          <section className="res-section">
            <h3 className="res-section-title">Current &amp; Recent Industry Track Record</h3>
            {(roles || []).map(r => (
              <div key={r.id} className={`res-job ${getItemClass(r.id === 'wellsite_geologist' ? 'wellsite' : 'interpretation')}`}>
                <div className="res-job-head">
                  <div>
                    <span className="res-job-title">{r.role}</span>
                    <span className="res-job-org">{r.company} {r.group ? `• ${r.group}` : ''}</span>
                  </div>
                  <span className="res-job-date">{r.period}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>
                  <strong>Location:</strong> {r.location}
                </div>
                <ul className="res-bullets">
                  {r.highlights.map((h, bIdx) => (
                    <li key={bIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <span
                        style={{ flex: 1 }}
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => updateRoleBullet(r.id, bIdx, e.currentTarget.textContent || h)}
                      >
                        {h}
                      </span>
                      {isEditMode && (
                        <span className="edit-micro-controls no-print">
                          <button onClick={() => moveRoleBullet(r.id, bIdx, 'up')} className="micro-btn">⬆️</button>
                          <button onClick={() => moveRoleBullet(r.id, bIdx, 'down')} className="micro-btn">⬇️</button>
                          <button onClick={() => deleteRoleBullet(r.id, bIdx)} className="micro-btn is-del">🗑️</button>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {isEditMode && (
                  <div className="no-print" style={{ marginTop: '4px' }}>
                    <button onClick={() => addRoleBullet(r.id)} className="nes-btn is-primary add-bullet-btn">
                      ➕ Add Role Bullet
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Specialized Section B: Key Technical Reports & Research */}
          <section className="res-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="res-section-title">Key Technical Reports &amp; Research</h3>
              {isEditMode && (
                <button onClick={addReport} className="nes-btn is-primary no-print add-bullet-btn">
                  ➕ Add Report
                </button>
              )}
            </div>
            {(technicalReports || []).map((rep, idx) => (
              <div key={rep.id} className={`res-job ${getItemClass(rep.category)}`} style={{ marginBottom: '8px' }}>
                <div className="res-job-head">
                  <div style={{ flex: 1 }}>
                    <span
                      className="res-job-title"
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => updateReport(rep.id, 'title', e.currentTarget.textContent || rep.title)}
                    >
                      {rep.title}
                    </span>
                    <span className="res-job-org">&bull; {rep.institution}</span>
                  </div>
                  <span className="res-job-date">{rep.period}</span>
                  {isEditMode && (
                    <span className="edit-micro-controls no-print" style={{ marginLeft: '10px' }}>
                      <button onClick={() => moveReport(idx, 'up')} className="micro-btn">⬆️</button>
                      <button onClick={() => moveReport(idx, 'down')} className="micro-btn">⬇️</button>
                      <button onClick={() => deleteReport(rep.id)} className="micro-btn is-del">🗑️</button>
                    </span>
                  )}
                </div>
                <p
                  className="res-summary"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateReport(rep.id, 'summary', e.currentTarget.textContent || rep.summary)}
                >
                  {rep.summary}
                </p>
              </div>
            ))}
          </section>

          {/* Specialized Section C: Specialized Training & Certifications */}
          <section className="res-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="res-section-title">Specialized Operational &amp; Technical Training</h3>
              {isEditMode && (
                <button onClick={addTraining} className="nes-btn is-primary no-print add-bullet-btn">
                  ➕ Add Certification
                </button>
              )}
            </div>
            <ul className="res-bullets">
              {(specializedTraining || []).map((t, idx) => (
                <li key={t.id} className={getItemClass(t.category)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <strong
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => updateTraining(t.id, 'title', e.currentTarget.textContent || t.title)}
                    >
                      {t.title}
                    </strong> ({t.issuer}):{' '}
                    <span
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => updateTraining(t.id, 'description', e.currentTarget.textContent || t.description)}
                    >
                      {t.description}
                    </span>
                  </div>
                  {isEditMode && (
                    <span className="edit-micro-controls no-print">
                      <button onClick={() => moveTraining(idx, 'up')} className="micro-btn">⬆️</button>
                      <button onClick={() => moveTraining(idx, 'down')} className="micro-btn">⬇️</button>
                      <button onClick={() => deleteTraining(t.id)} className="micro-btn is-del">🗑️</button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Academic Theses & Machine Learning Research */}
          <section className="res-section">
            <h3 className="res-section-title">Academic Theses &amp; Machine Learning Research</h3>
            {(researchTheses || []).map((t, idx) => (
              <div key={idx} className={`res-job ${getItemClass('ai_data')}`}>
                <div className="res-job-head">
                  <div>
                    <span className="res-job-title">{t.title}</span>
                    <span className="res-job-org">{t.type} &bull; {t.institution}</span>
                  </div>
                  <span className="res-job-date">{t.period}</span>
                </div>
                <p className="res-summary">{t.description}</p>
              </div>
            ))}
          </section>

          {/* Education */}
          <section className="res-section">
            <h3 className="res-section-title">Education</h3>
            <div className="res-edu-grid">
              {(education || []).map((e, idx) => (
                <div key={idx} className="res-edu-card">
                  <div className="res-edu-deg">{e.degree}</div>
                  <div className="res-edu-inst">{e.institution}</div>
                  <div className="res-edu-score">{e.period} &bull; <strong>{e.score}</strong></div>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Skills Matrix */}
          <section className="res-section">
            <h3 className="res-section-title">Technical Skills Matrix</h3>
            <div className={`res-skill-row ${getItemClass('interpretation')}`}>
              <span className="res-skill-label">Subsurface G&amp;G:</span> {(skills?.subsurface || []).join(' • ')}
            </div>
            <div className={`res-skill-row ${getItemClass('wellsite')}`}>
              <span className="res-skill-label">Wellsite &amp; Operations:</span> {(skills?.wellsite || []).join(' • ')}
            </div>
            <div className={`res-skill-row ${getItemClass('interpretation')}`}>
              <span className="res-skill-label">Unconventional Clean Energy:</span> {(skills?.unconventional || []).join(' • ')}
            </div>
            <div className={`res-skill-row ${getItemClass('ai_data')}`}>
              <span className="res-skill-label">Programming &amp; Data Science:</span> {(skills?.programming || []).join(' • ')}
            </div>
          </section>

          {/* Dynamic Custom Sections (Created by User) */}
          {(customSections || []).map((sec) => (
            <section key={sec.id} className="res-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3
                  className="res-section-title"
                  contentEditable={isEditMode}
                  suppressContentEditableWarning
                  onBlur={(e) => updateCustomSectionTitle(sec.id, e.currentTarget.textContent || sec.title)}
                >
                  {sec.title}
                </h3>
                {isEditMode && (
                  <div className="no-print" style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => addCustomBullet(sec.id)} className="nes-btn is-primary add-bullet-btn">
                      ➕ Add Bullet
                    </button>
                    <button onClick={() => deleteCustomSection(sec.id)} className="nes-btn is-error add-bullet-btn">
                      🗑️ Delete Section
                    </button>
                  </div>
                )}
              </div>
              <ul className="res-bullets">
                {sec.bullets.map((b, bIdx) => (
                  <li key={bIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <span
                      style={{ flex: 1 }}
                      contentEditable={isEditMode}
                      suppressContentEditableWarning
                      onBlur={(e) => updateCustomBullet(sec.id, bIdx, e.currentTarget.textContent || b)}
                    >
                      {b}
                    </span>
                    {isEditMode && (
                      <span className="edit-micro-controls no-print">
                        <button onClick={() => deleteCustomBullet(sec.id, bIdx)} className="micro-btn is-del">🗑️</button>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* Bottom Custom Section Button */}
          {isEditMode && (
            <div className="section-ctrl-bar no-print" style={{ textAlign: 'center', marginTop: '16px' }}>
              <button onClick={addCustomSection} className="nes-btn is-success" style={{ fontSize: '9px', padding: '6px 14px' }}>
                ➕ Add New Custom Section
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
