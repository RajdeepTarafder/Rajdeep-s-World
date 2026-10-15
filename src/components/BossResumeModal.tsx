import React from 'react';
import { CareerData } from '../types/game';

interface BossResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerData: CareerData;
}

export const BossResumeModal: React.FC<BossResumeModalProps> = ({
  isOpen,
  onClose,
  careerData
}) => {
  if (!isOpen) return null;

  const { player: p, roles, achievements, education, researchTheses, skills, certifications } = careerData;

  const copyPlainTextATS = () => {
    const txt = `
${p.name}
${p.title} | ${p.organization}
CPF: ${p.cpf} | DOJ: ${p.doj} | Email: ${p.email} | Phone: ${p.phone}
LinkedIn: ${p.linkedin} | Location: ${p.location}

PROFESSIONAL SUMMARY
${p.summary}

PROFESSIONAL ROLES & TRACK RECORD
${(roles || []).map(r => `
* ${r.role} - ${r.company} (${r.period})
  Location: ${r.location}
${r.highlights.map(h => `  - ${h}`).join('\n')}
`).join('\n')}

OPERATIONAL MILESTONES & SPECIAL PROJECTS
${(achievements || []).map(a => `* ${a.title} (${a.date}): ${a.description}`).join('\n')}

ACADEMIC RESEARCH & MACHINE LEARNING
${(researchTheses || []).map(t => `
* ${t.title} (${t.type}) - ${t.institution} (${t.period})
  ${t.description}
`).join('\n')}

EDUCATION
${(education || []).map(e => `* ${e.degree} - ${e.institution} (${e.period}) [${e.score}]`).join('\n')}

TECHNICAL SKILLS MATRIX
* Subsurface G&G: ${(skills?.subsurface || []).join(', ')}
* Wellsite Ops: ${(skills?.wellsite || []).join(', ')}
* Unconventional Clean Energy: ${(skills?.unconventional || []).join(', ')}
* Programming & Data Science: ${(skills?.programming || []).join(', ')}
    `.trim();

    navigator.clipboard.writeText(txt);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="boss-resume-modal">
      {/* Fixed Print & Close Toolbar */}
      <div className="boss-toolbar no-print">
        <div className="toolbar-left">
          <button onClick={onClose} className="nes-btn is-primary">
            <span>&larr; Resume Geology Quest</span>
          </button>
          <span className="boss-notice">🚨 BOSS PANIC VIEW: CLEAN EXECUTIVE RESUME (ATS OPTIMIZED)</span>
        </div>
        <div className="toolbar-right">
          <button onClick={copyPlainTextATS} className="nes-btn">📋 Copy Plaintext</button>
          <button onClick={handlePrint} className="nes-btn is-success">🖨️ Print / Save PDF</button>
        </div>
      </div>

      {/* Printable Resume Paper Document */}
      <div className="boss-resume-scroll">
        <div className="printable-paper">
          <header className="res-header">
            <div className="res-header-layout">
              <div className="res-header-info">
                <h1 className="res-name">{p.name}</h1>
                <h2 className="res-subtitle">{p.title} &bull; {p.organization}</h2>
                <div className="res-meta">
                  <div><strong>CPF:</strong> {p.cpf} &bull; <strong>DOJ:</strong> {p.doj}</div>
                  <div><strong>Email:</strong> <a href={`mailto:${p.email}`}>{p.email}</a> &bull; <strong>Phone:</strong> {p.phone}</div>
                  <div><strong>LinkedIn:</strong> <a href={p.linkedin} target="_blank" rel="noreferrer">rajdeep-tarafder</a> &bull; <strong>Location:</strong> {p.location}</div>
                </div>
              </div>
              <div className="res-header-photo">
                <img src={p.photo || 'avatar-photo.jpg'} alt={p.name} className="res-headshot" />
              </div>
            </div>
          </header>

          <section className="res-section">
            <h3 className="res-section-title">Professional Executive Summary</h3>
            <p className="res-summary">{p.summary}</p>
          </section>

          <section className="res-section">
            <h3 className="res-section-title">Current &amp; Recent Industry Track Record</h3>
            {(roles || []).map(r => (
              <div key={r.id} className="res-job">
                <div className="res-job-head">
                  <div>
                    <span className="res-job-title">{r.role}</span>
                    <span className="res-job-org">{r.company} {r.group ? `• ${r.group}` : ''}</span>
                  </div>
                  <span className="res-job-date">{r.period}</span>
                </div>
                <ul className="res-bullets">
                  {r.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            ))}
          </section>

          {achievements && achievements.length > 0 && (
            <section className="res-section">
              <h3 className="res-section-title">Key Operational Milestones &amp; Special Projects</h3>
              <ul className="res-bullets">
                {achievements.map(a => (
                  <li key={a.id}><strong>{a.title} ({a.date}):</strong> {a.description}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="res-section">
            <h3 className="res-section-title">Academic Theses &amp; Machine Learning Research</h3>
            {(researchTheses || []).map((t, idx) => (
              <div key={idx} className="res-job">
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

          <section className="res-section">
            <h3 className="res-section-title">Technical Skills Matrix</h3>
            <div className="res-skill-row"><span className="res-skill-label">Subsurface G&amp;G:</span> {(skills?.subsurface || []).join(' • ')}</div>
            <div className="res-skill-row"><span className="res-skill-label">Wellsite &amp; Operations:</span> {(skills?.wellsite || []).join(' • ')}</div>
            <div className="res-skill-row"><span className="res-skill-label">Unconventional Clean Energy:</span> {(skills?.unconventional || []).join(' • ')}</div>
            <div className="res-skill-row"><span className="res-skill-label">Programming &amp; Data Science:</span> {(skills?.programming || []).join(' • ')}</div>
          </section>

          <section className="res-section">
            <h3 className="res-section-title">Certifications &amp; Leadership</h3>
            <div className="res-skill-row">
              {(certifications || []).map((c, idx) => (
                <div key={idx}>&bull; <strong>{c.name}</strong> ({c.issuer})</div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
