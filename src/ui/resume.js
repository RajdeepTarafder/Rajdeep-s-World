// Executive Resume (Recruiter Mode) & Print PDF Controller
// Seamlessly merges extracted historical CV data and current ONGC milestones

import { PROFILE_DATA } from '../data/profile.js';
import { sound } from '../engine/sound.js';

export class ResumeManager {
  constructor() {
    this.resumeModal = document.getElementById('recruiter-modal');
    this.recruiterBtn = document.getElementById('recruiter-mode-btn');
    this.backToGameBtn = document.getElementById('resume-back-btn');
    this.printBtn = document.getElementById('resume-print-btn');
    this.copyBtn = document.getElementById('resume-copy-btn');
    this.resumeContainer = document.getElementById('resume-container');

    this.isOpen = false;

    this.init();
  }

  init() {
    if (this.recruiterBtn) {
      this.recruiterBtn.addEventListener('click', () => this.toggle());
    }

    if (this.backToGameBtn) {
      this.backToGameBtn.addEventListener('click', () => this.close());
    }

    if (this.printBtn) {
      this.printBtn.addEventListener('click', () => this.printResume());
    }

    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.copyPlainText());
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    this.renderResumeHTML();
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    sound.playDialogueBlip();
    if (this.resumeModal) {
      this.resumeModal.classList.remove('hidden');
      document.body.classList.add('resume-open');
    }
  }

  close() {
    this.isOpen = false;
    sound.playDialogueBlip();
    if (this.resumeModal) {
      this.resumeModal.classList.add('hidden');
      document.body.classList.remove('resume-open');
    }
  }

  printResume() {
    window.print();
  }

  copyPlainText() {
    const p = PROFILE_DATA;
    const text = `
${p.personal.name}
${p.personal.title} | ${p.personal.organization}
CPF: ${p.personal.cpf} | DOJ: ${p.personal.doj}
Phone: ${p.personal.phone} | Email: ${p.personal.email}
LinkedIn: ${p.personal.linkedin} | Location: ${p.personal.location}

PROFESSIONAL SUMMARY
${p.personal.summary}

PROFESSIONAL EXPERIENCE
${p.currentMilestones.map(m => `
${m.role} - ${m.company} (${m.period})
Location: ${m.location}
${m.highlights.map(h => `* ${h}`).join('\n')}
`).join('\n')}

PRE-PROFESSIONAL INDUSTRY INTERNSHIPS
${p.internships.map(i => `
${i.role} - ${i.company} (${i.period})
Location: ${i.location}
${i.highlights.map(h => `* ${h}`).join('\n')}
`).join('\n')}

ACADEMIC RESEARCH THESES & MACHINE LEARNING
${p.researchTheses.map(t => `
${t.title} (${t.type})
${t.institution} (${t.period})
* ${t.description}
`).join('\n')}

EDUCATION
${p.education.map(e => `
${e.degree} - ${e.institution} (${e.period})
Score: ${e.score} ${e.honors ? `(${e.honors})` : ''}
`).join('\n')}

GEOLOGICAL FIELD TRAINING & EXPEDITIONS
${p.fieldwork.map(f => `
${f.title} (${f.area})
* ${f.highlights}
`).join('\n')}

TECHNICAL SKILLS
* Subsurface & G&G: ${p.skills.subsurface.join(', ')}
* Wellsite Operations: ${p.skills.wellsite.join(', ')}
* Unconventional Energy: ${p.skills.unconventional.join(', ')}
* Programming & Data Science: ${p.skills.programming.join(', ')}
* Design & Drafting: ${p.skills.design.join(', ')}

CERTIFICATIONS
${p.certifications.map(c => `* ${c.name} - ${c.issuer} (${c.grade || 'Certified'})`).join('\n')}

POSITIONS OF RESPONSIBILITY & EXTRACURRICULAR LEADERSHIP
${p.extracurriculars.map(ex => `* ${ex.role} - ${ex.event} (${ex.period}): ${ex.description}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      const originalText = this.copyBtn.innerHTML;
      this.copyBtn.innerHTML = `<span>Copied to Clipboard!</span>`;
      setTimeout(() => {
        this.copyBtn.innerHTML = originalText;
      }, 2000);
    }).catch(err => {
      console.error("Clipboard copy failed", err);
    });
  }

  renderResumeHTML() {
    if (!this.resumeContainer) return;
    const p = PROFILE_DATA;

    this.resumeContainer.innerHTML = `
      <div class="resume-paper">
        <!-- HEADER -->
        <header class="resume-header">
          <div class="resume-title-block">
            <h1 class="candidate-name">${p.personal.name}</h1>
            <h2 class="candidate-title">${p.personal.title} &bull; ${p.personal.organization}</h2>
          </div>
          <div class="resume-meta-grid">
            <div class="meta-item"><strong>CPF:</strong> ${p.personal.cpf}</div>
            <div class="meta-item"><strong>DOJ:</strong> ${p.personal.doj}</div>
            <div class="meta-item"><strong>Phone:</strong> ${p.personal.phone}</div>
            <div class="meta-item"><strong>Email:</strong> <a href="mailto:${p.personal.email}">${p.personal.email}</a></div>
            <div class="meta-item"><strong>LinkedIn:</strong> <a href="${p.personal.linkedin}" target="_blank">rajdeep-tarafder</a></div>
            <div class="meta-item"><strong>Location:</strong> ${p.personal.location}</div>
          </div>
        </header>

        <!-- SUMMARY -->
        <section class="resume-section">
          <h3 class="section-title">Professional Executive Summary</h3>
          <p class="section-paragraph">${p.personal.summary}</p>
        </section>

        <!-- CURRENT & INDUSTRY TRACK RECORD -->
        <section class="resume-section">
          <h3 class="section-title">Current & Recent Industry Track Record</h3>
          ${p.currentMilestones.map(m => `
            <div class="job-entry">
              <div class="job-header">
                <div>
                  <h4 class="job-role">${m.role}</h4>
                  <span class="job-company">${m.company} ${m.group ? `&bull; ${m.group}` : ''}</span>
                </div>
                <div class="job-dates">
                  <span class="badge-tag">${m.badge}</span>
                  <span class="date-text">${m.period}</span>
                </div>
              </div>
              <ul class="job-bullets">
                ${m.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>

        <!-- PRE-PROFESSIONAL INDUSTRY INTERNSHIPS -->
        <section class="resume-section">
          <h3 class="section-title">Pre-Professional Industry Experience & Internships</h3>
          ${p.internships.map(i => `
            <div class="job-entry">
              <div class="job-header">
                <div>
                  <h4 class="job-role">${i.role}</h4>
                  <span class="job-company">${i.company} &bull; ${i.location}</span>
                </div>
                <div class="job-dates">
                  <span class="date-text">${i.period}</span>
                </div>
              </div>
              <ul class="job-bullets">
                ${i.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>

        <!-- ACADEMIC RESEARCH & MACHINE LEARNING THESES -->
        <section class="resume-section">
          <h3 class="section-title">Academic Theses & Machine Learning Research</h3>
          ${p.researchTheses.map(t => `
            <div class="thesis-entry">
              <div class="job-header">
                <div>
                  <h4 class="job-role">${t.title}</h4>
                  <span class="job-company">${t.type} &bull; ${t.institution}</span>
                </div>
                <div class="job-dates">
                  <span class="date-text">${t.period}</span>
                </div>
              </div>
              <p class="thesis-desc">${t.description}</p>
              ${t.skills ? `<div class="pill-row">${t.skills.map(s => `<span class="res-skill-pill">${s}</span>`).join('')}</div>` : ''}
            </div>
          `).join('')}
        </section>

        <!-- EDUCATION -->
        <section class="resume-section">
          <h3 class="section-title">Academic Qualifications</h3>
          <div class="edu-grid">
            ${p.education.map(e => `
              <div class="edu-card">
                <div class="edu-deg">${e.degree}</div>
                <div class="edu-inst">${e.institution}</div>
                <div class="edu-meta">${e.period} &bull; <strong>${e.score}</strong> ${e.honors ? `(${e.honors})` : ''}</div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- GEOLOGICAL FIELD TRAINING -->
        <section class="resume-section">
          <h3 class="section-title">Geological Field Mapping & Terrains</h3>
          <div class="field-list">
            ${p.fieldwork.map(f => `
              <div class="field-item">
                <strong>${f.title} (${f.area}):</strong> ${f.highlights}
              </div>
            `).join('')}
          </div>
        </section>

        <!-- TECHNICAL SKILLS MATRIX -->
        <section class="resume-section">
          <h3 class="section-title">Technical Skills & Software Matrix</h3>
          <div class="skills-matrix">
            <div class="skill-row">
              <span class="skill-label">Subsurface G&G & Modeling:</span>
              <span class="skill-vals">${p.skills.subsurface.join(' &bull; ')}</span>
            </div>
            <div class="skill-row">
              <span class="skill-label">Wellsite & Drilling Ops:</span>
              <span class="skill-vals">${p.skills.wellsite.join(' &bull; ')}</span>
            </div>
            <div class="skill-row">
              <span class="skill-label">Unconventional Clean Energy:</span>
              <span class="skill-vals">${p.skills.unconventional.join(' &bull; ')}</span>
            </div>
            <div class="skill-row">
              <span class="skill-label">Programming & Machine Learning:</span>
              <span class="skill-vals">${p.skills.programming.join(' &bull; ')}</span>
            </div>
            <div class="skill-row">
              <span class="skill-label">Drafting & Digital Media:</span>
              <span class="skill-vals">${p.skills.design.join(' &bull; ')}</span>
            </div>
          </div>
        </section>

        <!-- CERTIFICATIONS & LEADERSHIP -->
        <section class="resume-section">
          <h3 class="section-title">Certifications & Positions of Responsibility</h3>
          <div class="cert-grid">
            ${p.certifications.map(c => `
              <div class="cert-item">
                &bull; <strong>${c.name}</strong> - ${c.issuer} ${c.grade ? `(Score: ${c.grade})` : ''}
              </div>
            `).join('')}
          </div>
          <div class="extra-list" style="margin-top: 10px;">
            ${p.extracurriculars.map(ex => `
              <div class="extra-item">
                &bull; <strong>${ex.role} (${ex.event}, ${ex.period}):</strong> ${ex.description}
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  }
}
