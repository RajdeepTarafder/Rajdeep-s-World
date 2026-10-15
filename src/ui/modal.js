// 16-Bit RPG Interactive Hotspot Modal & Dialogue System

import { PROFILE_DATA } from '../data/profile.js';
import { sound } from '../engine/sound.js';

export class ModalManager {
  constructor() {
    this.modalEl = document.getElementById('rpg-modal');
    this.portraitEl = document.getElementById('modal-portrait');
    this.titleEl = document.getElementById('modal-title');
    this.badgeEl = document.getElementById('modal-badge');
    this.contentEl = document.getElementById('modal-content');
    this.closeBtn = document.getElementById('modal-close-btn');

    this.isOpen = false;

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Close on Escape or click outside
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) {
          this.close();
        }
      });
    }
  }

  openHotspot(hotspotId, currentOutfit = 'academic') {
    const data = this.getContentForHotspot(hotspotId);
    if (!data) return;

    this.isOpen = true;
    sound.playChime();

    // Set Header
    this.titleEl.textContent = data.title;
    this.badgeEl.textContent = data.badge;

    // Set Portrait
    const portraitCanvas = window.spriteFactory.get(`portrait_${currentOutfit}`);
    if (portraitCanvas && this.portraitEl) {
      this.portraitEl.src = portraitCanvas.toDataURL();
    }

    // Set HTML Body
    this.contentEl.innerHTML = data.html;

    // Show Modal
    this.modalEl.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  close() {
    this.isOpen = false;
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
    document.body.classList.remove('modal-open');
    sound.playDialogueBlip();
  }

  getContentForHotspot(id) {
    const p = PROFILE_DATA;

    switch (id) {
      case 'subsurface_workstations':
        return {
          title: "Subsurface Interpretation Command Center",
          badge: "ONGC G&G WORKSTATION",
          html: `
            <div class="rpg-lore-card">
              <div class="lore-header">
                <span class="lore-tag">ROLE: Interpretation Geologist</span>
                <span class="lore-tag">EXPERIENCE: 2.5 Years</span>
                <span class="lore-tag">GROUP: Vindhyan Block</span>
              </div>
              <p class="lore-intro">
                "Welcome to the Subsurface Command Lab. Here we unlock deep Precambrian sedimentary architecture and hydrocarbon systems using cutting-edge seismic and chronostratigraphic modeling."
              </p>
              <div class="lore-section">
                <h4>Core Software Stack & Tooling:</h4>
                <div class="lore-badges">
                  <span class="skill-pill">Schlumberger Petrel</span>
                  <span class="skill-pill">Eliis PaleoScan</span>
                  <span class="skill-pill">QGIS</span>
                  <span class="skill-pill">DSPetrophysics</span>
                  <span class="skill-pill">Python (G&G Analytics)</span>
                </div>
              </div>
              <div class="lore-section">
                <h4>Key Technical Deliverables:</h4>
                <ul>
                  <li><strong>Integrated G&G Projects:</strong> Multi-vintage 2D/3D seismic interpretation, synthetic seismogram tie-ins, and complex fault-seal analysis.</li>
                  <li><strong>PaleoScan Chronostratigraphy:</strong> High-resolution Relative Geologic Time (RGT) models and automated horizon extraction across frontier blocks.</li>
                  <li><strong>Petrophysical Evaluations:</strong> Wireline logging interpretations (Gamma Ray, Density-Neutron, Resistivity, Sonic) for reservoir characterization in DSPetrophysics.</li>
                </ul>
              </div>
            </div>
          `
        };

      case 'prospect_generation':
        return {
          title: "Exploration Prospect Maturation & Defense",
          badge: "BExB & EPMB BLOCKS",
          html: `
            <div class="rpg-lore-card">
              <div class="lore-header">
                <span class="lore-tag">OPERATOR: ONGC</span>
                <span class="lore-tag">BASIN: Vindhyan Basin</span>
                <span class="lore-tag">STATUS: Drillable Prospects Defended</span>
              </div>
              <p class="lore-intro">
                "Transforming acoustic reflections into de-risked, drillable exploration targets. Every prospect represents rigorous volumetric assessment and management review defense."
              </p>
              <div class="lore-section">
                <h4>Operational Highlights:</h4>
                <ul>
                  <li><strong>Prospect Generation:</strong> Delineated and mapped exploration leads into drillable prospects in BExB and EPMB exploration blocks.</li>
                  <li><strong>Executive Committee Defense:</strong> Prepared comprehensive G&G dossiers and defended well proposals before top executive exploration management.</li>
                  <li><strong>Under-Drilling Well Surveillance:</strong> Tracked real-time MWD/LWD drilling returns against pre-drill prognoses, ensuring dynamic trajectory adjustments.</li>
                  <li><strong>Technical Administration:</strong> Coordinated statutory directorate compliance, well handover documentation, and inter-departmental workflows.</li>
                </ul>
              </div>
            </div>
          `
        };

      case 'unconventional_gas':
        return {
          title: "Unconventional Clean Energy: Natural H2 & Helium (He)",
          badge: "CLEAN ENERGY FRONTIER",
          html: `
            <div class="rpg-lore-card">
              <div class="lore-header">
                <span class="lore-tag">COMMODITY: White Hydrogen & Helium</span>
                <span class="lore-tag">MECHANISM: Deep Basement Degassing</span>
                <span class="lore-tag">IMPACT: National Strategic Transition</span>
              </div>
              <p class="lore-intro">
                "Beyond conventional hydrocarbons: pioneering the exploration for pristine Natural Hydrogen (H2) and Helium (He) trapped along deep basement crustal shear zones."
              </p>
              <div class="lore-section">
                <h4>Exploration Methodology:</h4>
                <ul>
                  <li><strong>Deep Crustal Fault Mapping:</strong> Mapped basement reactivation corridors and crustal scale faults acting as conduits for deep-seated gas migration.</li>
                  <li><strong>Noble Gas & Geochemical Surveillance:</strong> Evaluated isotopic signatures, carrier gas dynamics, and degassing anomalies in subsurface formations.</li>
                  <li><strong>Integrated Play Concept:</strong> Synthesized structural traps, crystalline basement sources, and tight cap-rock seal integrity for non-hydrocarbon gas reserves.</li>
                </ul>
              </div>
            </div>
          `
        };

      case 'pda_analysis':
        return {
          title: "Pore Pressure & Drillability Analysis (PDA)",
          badge: "WELLBORE INTEGRITY",
          html: `
            <div class="rpg-lore-card">
              <div class="lore-header">
                <span class="lore-tag">DOMAIN: Geomechanics & Drilling Safety</span>
                <span class="lore-tag">GOAL: Zero Wellbore Incidents</span>
              </div>
              <p class="lore-intro">
                "Calculating subsurface stress regimes and formation pore pressures in real time to ensure drilling optimization and prevent catastrophic well kicks."
              </p>
              <div class="lore-section">
                <h4>PDA Capabilities:</h4>
                <ul>
                  <li><strong>Pore Pressure Prediction:</strong> Overburden gradient calculation, normal compaction trendline analysis, and Eaton's sonic/resistivity method.</li>
                  <li><strong>Drillability Assessment:</strong> Rate of Penetration (ROP) modeling, bit wear evaluation, and rock mechanics characterization.</li>
                  <li><strong>Dynamic Well Monitoring:</strong> Correlated Pressure While Drilling (PDA) downhole sensors with surface mud properties for immediate surge/swab detection.</li>
                </ul>
              </div>
            </div>
          `
        };

      case 'rig_mudshaker':
        return {
          title: "Rig Floor Cuttings Lithology & Hydrocarbon Surveillance",
          badge: "ACTIVE WELLSITE OPS",
          html: `
            <div class="rpg-lore-card">
              <div class="lore-header">
                <span class="lore-tag">ROLE: Wellsite Geologist</span>
                <span class="lore-tag">OPERATIONS: Active Drilling Rig</span>
                <span class="lore-tag">SAFETY: Zero LTI Record</span>
              </div>
              <p class="lore-intro">
                "Where the drill bit meets the earth. 24/7 on-site lithological surveillance, cuttings examination under binocular microscope, and immediate hydrocarbon detection."
              </p>
              <div class="lore-section">
                <h4>Wellsite Geological Protocols:</h4>
                <ul>
                  <li><strong>Lithological Logging:</strong> Collecting, washing, and logging drill cuttings every 1m/2m/5m; determining grain size, roundness, matrix cement, and sorting.</li>
                  <li><strong>Hydrocarbon Surveillance:</strong> Real-time ultraviolet direct fluorescence testing and chemical solvent cut tests (acetone/CCl4) on drill cuttings.</li>
                  <li><strong>Mud Gas Chromatography:</strong> Surveillance of Total Gas and continuous chromatographic breakout of C1 (Methane), C2 (Ethane), C3 (Propane), iC4/nC4 (Butane), and C5 (Pentane).</li>
                  <li><strong>Formation Top Correlation:</strong> Continuous matching of drill returns with pre-drill geological prognoses to spot regional stratigraphic boundaries.</li>
                </ul>
              </div>
            </div>
          `
        };

      case 'rig_doghouse_ops':
        return {
          title: "Doghouse Operations, Formation Tops & Cement Squeeze",
          badge: "RIG TELEMETRY & OPS",
          html: `
            <div class="rpg-lore-card">
              <div class="lore-header">
                <span class="lore-tag">STATION: Drill Rig Doghouse</span>
                <span class="lore-tag">RESPONSIBILITIES: Well Integrity & Testing</span>
              </div>
              <p class="lore-intro">
                "Inside the Doghouse: Telemetry surveillance, trip gas evaluation, casing shoe selection, and critical cement squeeze remediation oversight."
              </p>
              <div class="lore-section">
                <h4>Operational Command:</h4>
                <ul>
                  <li><strong>Formation Top Confirmation:</strong> Declaring official formation boundaries and picking optimal casing setting depths.</li>
                  <li><strong>Cement Squeeze Supervision:</strong> On-site geological supervision of cement squeeze operations for zone isolation and wellbore integrity.</li>
                  <li><strong>Mud Weight Optimization:</strong> Collaborating with mud engineers to maintain balanced mud hydrostatic pressure (e.g. 1.25+ SG) during overpressured transitions.</li>
                  <li><strong>Rig Safety & Environmental Stewardship:</strong> Ensuring strict adherence to safety protocols, H2S monitoring, and zero lost time injury (LTI) standards.</li>
                </ul>
              </div>
            </div>
          `
        };

      case 'foundations_archive':
        return {
          title: "Academic Foundations & AI/ML Geological Research",
          badge: "IIT ISM DHANBAD & JADAVPUR UNIV",
          html: `
            <div class="rpg-lore-card">
              <div class="lore-header">
                <span class="lore-tag">M.Sc. Tech: IIT (ISM) Dhanbad (7.36 CGPA)</span>
                <span class="lore-tag">B.Sc. (Hons): Jadavpur Univ (7.30 CGPA)</span>
              </div>
              <p class="lore-intro">
                "Grounding deep classical geological fundamentals in modern data science and machine learning pipelines."
              </p>
              <div class="lore-section">
                <h4>M.Sc. Tech Thesis (IIT ISM Dhanbad, 2022–2023):</h4>
                <p><strong>"Host Rock Identification & Provenance Detection via Machine Learning"</strong></p>
                <p>Engineered supervised ML pipelines in Python (Scikit-Learn, Pandas) to predict parent host-rock lithologies and tectonic provenance from garnet EPMA geochemical datasets. Overcame classical thermo-barometric limitations where bulk-rock context is missing. Established discriminative geochemical vectors applicable to diamond exploration (identifying mantle-derived kimberlitic pyrope garnets).</p>
                <div class="lore-badges">
                  <span class="skill-pill">Random Forest</span>
                  <span class="skill-pill">SVM</span>
                  <span class="skill-pill">Decision Trees</span>
                  <span class="skill-pill">EPMA Garnet Geochem</span>
                  <span class="skill-pill">Python 3</span>
                </div>
              </div>
              <div class="lore-section">
                <h4>B.Sc. (Hons.) Dissertation (Jadavpur University, 2019–2020):</h4>
                <p><strong>"Exchange of Iron from Atmosphere to Ocean Under Anthropogenic Inducements"</strong></p>
                <p>Evaluated atmospheric transport pathways of combustion-derived iron aerosols and their bioavailable solubility for marine phytoplankton in High-Nutrient Low-Chlorophyll (HNLC) ocean basins, quantifying impacts on global carbon cycling.</p>
              </div>
            </div>
          `
        };

      case 'industry_internships':
        return {
          title: "Pre-Professional Industry Internships",
          badge: "OIL INDIA & SAIL",
          html: `
            <div class="rpg-lore-card">
              <div class="lore-header">
                <span class="lore-tag">OIL: Assam Shelf Basin</span>
                <span class="lore-tag">SAIL: Dalli-Rajhara Iron Ore</span>
              </div>
              <div class="lore-section">
                <h4>Oil India Limited (OIL) – Vocational Trainee (May–Jun 2022):</h4>
                <p><strong>Petroleum Geology & Wellsite Training (Duliajan, Assam)</strong></p>
                <ul>
                  <li>Upstream E&P workflows across Assam Shelf Basin; Barail and Tipam sandstone reservoirs and structural traps.</li>
                  <li>Wireline log interpretation (Gamma Ray, Deep/Shallow Resistivity, RHOB-NPHI, Sonic) for permeable zones and hydrocarbon contacts.</li>
                  <li>On-site drilling operations, mud logging, and drill-cuttings examination.</li>
                </ul>
              </div>
              <div class="lore-section">
                <h4>Steel Authority of India Limited (SAIL) – Vocational Trainee (Dec 2021):</h4>
                <p><strong>Mining Geology & Exploration (Dalli-Rajhara Iron Ore Complex)</strong></p>
                <ul>
                  <li>Open-cast mine bench mapping and structural correlation with borehole lithologs.</li>
                  <li>Iron ore reserve estimation using the geological cross-section method.</li>
                  <li>Petrographic and chemical characterization of Banded Iron Formations (BIF, BHQ) and hematite ore.</li>
                </ul>
              </div>
            </div>
          `
        };

      case 'fieldwork_exhibits':
        return {
          title: "Geological Field Mapping & Facies Expeditions",
          badge: "FIELD GEOLOGY ARCHIVE",
          html: `
            <div class="rpg-lore-card">
              <div class="lore-header">
                <span class="lore-tag">CHANDIPUR</span>
                <span class="lore-tag">CHHOTA NAGPUR</span>
                <span class="lore-tag">GHATSILA</span>
              </div>
              <div class="lore-section">
                <h4>1. Sedimentary Terrain – Chandipur, Odisha:</h4>
                <p>Detailed coastal & estuarine sedimentary facies mapping; documented cross-stratification, flaser/lenticular bedding, modern trace fossils (ichnology), and validated Walther's Law of Facies.</p>
              </div>
              <div class="lore-section">
                <h4>2. Metamorphic Terrain – Chhota Nagpur Gneissic Complex:</h4>
                <p>Precambrian basement crystalline rock mapping; structural elements (foliation, lineation, shear zones, fold axial planes) unraveling polyphase tectonic deformation (D1–D3).</p>
              </div>
              <div class="lore-section">
                <h4>3. Structural Field Mapping – Galudih / Ghatsila, Jharkhand:</h4>
                <p>Mastered Brunton compass & clinometer structural strike/dip measurements, topographic contour navigation, and base map generation.</p>
              </div>
            </div>
          `
        };

      case 'trophies_certifications':
        return {
          title: "Athletics, Leadership & Certifications",
          badge: "BEYOND THE BOREHOLE",
          html: `
            <div class="rpg-lore-card">
              <div class="lore-header">
                <span class="lore-tag">FOOTBALL CHAMPION</span>
                <span class="lore-tag">HIGH-ALTITUDE TREKKER</span>
                <span class="lore-tag">AI/ML CERTIFIED</span>
              </div>
              <div class="lore-section">
                <h4>Athletic & Leadership Milestones:</h4>
                <ul>
                  <li><strong>Starting Centre-Back:</strong> 4 consecutive seasons for IIT (ISM) Dhanbad and Jadavpur University football teams.</li>
                  <li><strong>Football Champion:</strong> Inter-Departmental Football General Championship Winner (IIT ISM, 2022) & Geological Society Football Cup Winner (2022).</li>
                  <li><strong>High-Altitude Trekking:</strong> Successfully completed challenging alpine expeditions including Dafeybhir Pass (Sikkim) and exploratory Himalayan passes in Himachal Pradesh.</li>
                  <li><strong>Leadership:</strong> Head of Graphics & Digital Media (Flysch '22, IIT ISM) and Conclave Convenor (Lithify '19, Jadavpur Univ).</li>
                </ul>
              </div>
              <div class="lore-section">
                <h4>Verified Certifications:</h4>
                <ul>
                  <li><strong>Supervised Machine Learning:</strong> DeepLearning.AI / Coursera (Grade: 90.4%)</li>
                  <li><strong>Global Warming II: Python Climate Models:</strong> Univ. of Chicago / Coursera (Grade: 90.4%)</li>
                  <li><strong>Data Analysis with Python:</strong> freeCodeCamp</li>
                  <li><strong>Scientific Computing with Python:</strong> freeCodeCamp</li>
                </ul>
              </div>
            </div>
          `
        };

      default:
        return null;
    }
  }
}
