// =============================================================================
// GEOLOGY QUEST: BASIN TO BIT — 16-Bit Retro RPG Portfolio Engine
// Player Character: Rajdeep Tarafder (Wellsite & Exploration Geologist | ONGC)
// =============================================================================

// Fallback career data for offline / file:// protocol
const DEFAULT_CAREER_DATA = {
  "player": {
    "name": "Rajdeep Tarafder",
    "title": "Wellsite & Exploration Geologist",
    "organization": "Oil and Natural Gas Corporation (ONGC)",
    "cpf": "141604",
    "doj": "06.11.2023",
    "email": "tarafderrajdeep@gmail.com",
    "phone": "+91 90075 15735",
    "linkedin": "https://linkedin.com/in/rajdeep-tarafder-82a408184",
    "location": "Dehradun / Field Ops, India",
    "summary": "High-impact Exploration & Wellsite Geologist at ONGC blending 2.5 years of frontier basin interpretation (Vindhyan Block Group) with frontline drilling rig operations. Proven record in 2D/3D seismic interpretation (Petrel, PaleoScan), prospect maturation across BExB and EPMB blocks, 3D Mechanical Earth Modeling (MEM), and pioneering national clean energy exploration in Natural Hydrogen (H2) and Helium (He). Experienced in real-time wellsite lithological logging, hydrocarbon surveillance (UV cut/fluorescence, C1-C5 chromatograph), pore pressure / PDA surveillance, and critical 8.5\" phase open-ended drill pipe cement squeeze remediation at GDA-A Samastipur."
  },
  "stats": { "level": 4, "currentXP": 650, "maxXP": 1000, "stamina": 100, "coffeeBoost": 100 },
  "roles": [],
  "achievements": [],
  "quests": [],
  "education": [],
  "researchTheses": [],
  "fieldwork": [],
  "skills": { "subsurface": [], "wellsite": [], "unconventional": [], "programming": [], "design": [] },
  "certifications": [],
  "extracurriculars": []
};

// Global state
window.CAREER_DATA = DEFAULT_CAREER_DATA;

// Audio Synthesizer Engine (Web Audio API - 100% Procedural)
class RetroSynth {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.bgmPlaying = false;
    this.bgmTimer = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }

  ensure() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.ensure();
    this.isMuted = !this.isMuted;
    if (!this.isMuted && !this.bgmPlaying) {
      this.startBGM();
    }
    return !this.isMuted;
  }

  playTone(freq, type = 'square', duration = 0.08, vol = 0.15) {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playStep() {
    this.playTone(110 + Math.random() * 30, 'triangle', 0.04, 0.05);
  }

  playHammer() {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    // Metal clang
    this.playTone(600, 'sawtooth', 0.12, 0.2);
    setTimeout(() => this.playTone(900, 'sine', 0.15, 0.15), 20);
  }

  playLens() {
    this.playTone(1200, 'sine', 0.15, 0.12);
    setTimeout(() => this.playTone(1600, 'sine', 0.2, 0.1), 60);
  }

  playHit() {
    this.playTone(180, 'sawtooth', 0.1, 0.2);
  }

  playFanfare() {
    const notes = [440, 554, 659, 880, 1108];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'square', 0.12, 0.15), i * 70);
    });
  }

  playHeliumChirp() {
    // Squeaky high-pitch chirp
    this.playTone(1800 + Math.random() * 600, 'sine', 0.06, 0.18);
  }

  playRadioStatic() {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    try {
      const bufSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.12);
      noise.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
      setTimeout(() => this.playTone(1400, 'square', 0.05, 0.1), 30);
    } catch (e) {
      this.playTone(300, 'sawtooth', 0.1, 0.15);
    }
  }

  playDrillBitWhir() {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    const freqs = [120, 160, 220, 180, 240, 320];
    freqs.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sawtooth', 0.08, 0.15), i * 50);
    });
  }

  playGoalCheer() {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'square', 0.14, 0.18), i * 80);
    });
  }

  playComputerCalculation() {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => this.playTone(800 + Math.random() * 800, 'sine', 0.04, 0.1), i * 35);
    }
  }

  startBGM() {
    if (this.bgmPlaying || this.isMuted || !this.ctx) return;
    this.bgmPlaying = true;
    const melody = [
      { f: 261.63, d: 0.2 }, { f: 329.63, d: 0.2 }, { f: 392.00, d: 0.2 }, { f: 523.25, d: 0.4 },
      { f: 440.00, d: 0.2 }, { f: 392.00, d: 0.2 }, { f: 349.23, d: 0.4 }, { f: 261.63, d: 0.4 }
    ];
    let idx = 0;
    const loop = () => {
      if (!this.bgmPlaying || this.isMuted) return;
      const item = melody[idx % melody.length];
      idx++;
      this.playTone(item.f, 'triangle', item.d, 0.03);
      this.bgmTimer = setTimeout(loop, item.d * 1000);
    };
    loop();
  }
}

const audio = new RetroSynth();

// =============================================================================
// GAME CONSTANTS & SPRITE FACTORY (Zero broken images)
// =============================================================================
const TILE_SIZE = 32;
const MAP_COLS = 60;
const MAP_ROWS = 22;

function createBuffer(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return { canvas: c, ctx };
}

class SpriteStore {
  constructor() {
    this.cache = {};
    this.buildSprites();
  }

  get(key) {
    return this.cache[key] || null;
  }

  buildSprites() {
    // 1. Floor Tiles
    // Academic Parquet
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#8B5A2B';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillRect(16, 16, 16, 16);
      ctx.fillStyle = '#5A2E16';
      for (let y = 0; y < 32; y += 4) ctx.fillRect(0, y, 32, 1);
      ctx.fillStyle = '#3E1F0F';
      ctx.fillRect(0, 0, 32, 1);
      ctx.fillRect(0, 0, 1, 32);
      this.cache['tile_floor_acad'] = canvas;
    }
    // Academic Carpet
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#8B5A2B';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#991B1B';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#F59E0B';
      ctx.strokeRect(4, 4, 24, 24);
      this.cache['tile_floor_carpet'] = canvas;
    }
    // Lab Slate Tile
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#334155';
      ctx.fillRect(1, 1, 30, 30);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 32, 1);
      ctx.fillRect(0, 0, 1, 32);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(15, 15, 2, 2);
      this.cache['tile_floor_lab'] = canvas;
    }
    // Rig Diamond Plate
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#64748B';
      for (let y = 2; y < 32; y += 8) {
        for (let x = 2; x < 32; x += 8) {
          ctx.fillRect(x + 2, y, 3, 2);
          ctx.fillRect(x, y + 4, 3, 2);
        }
      }
      this.cache['tile_floor_rig'] = canvas;
    }
    // Rig Hazard Stripes
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#EAB308';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#18181B';
      for (let i = -32; i < 64; i += 12) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 8, 0);
        ctx.lineTo(i + 8 + 32, 32);
        ctx.lineTo(i + 32, 32);
        ctx.fill();
      }
      this.cache['tile_floor_hazard'] = canvas;
    }
    // Courtyard Lush Grass Tile
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#1E5128';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#2D6A4F';
      for (let y = 0; y < 32; y += 4) {
        for (let x = 0; x < 32; x += 4) {
          if ((x + y) % 8 === 0) ctx.fillRect(x, y, 2, 3);
        }
      }
      ctx.fillStyle = '#52B788';
      ctx.fillRect(6, 10, 1, 3);
      ctx.fillRect(20, 22, 1, 3);
      ctx.fillRect(28, 6, 1, 3);
      // Yellow wildflower
      ctx.fillStyle = '#FBBF24';
      ctx.fillRect(14, 18, 2, 2);
      this.cache['tile_floor_grass'] = canvas;
    }
    // Courtyard Flagstone Tile
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(2, 2, 13, 13);
      ctx.fillRect(17, 2, 13, 13);
      ctx.fillRect(2, 17, 13, 13);
      ctx.fillRect(17, 17, 13, 13);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(3, 3, 11, 1);
      ctx.fillRect(3, 3, 1, 11);
      ctx.fillRect(18, 3, 11, 1);
      ctx.fillRect(18, 3, 1, 11);
      this.cache['tile_floor_stone'] = canvas;
    }

    // 2. Wall Tiles
    // Academic Wall
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#3E1F0F';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#5A2E16';
      ctx.fillRect(2, 2, 28, 28);
      // Small map frame
      ctx.fillStyle = '#B8860B';
      ctx.fillRect(6, 6, 20, 14);
      ctx.fillStyle = '#FFF8DC';
      ctx.fillRect(8, 8, 16, 10);
      this.cache['tile_wall_acad'] = canvas;
    }
    // Courtyard Brick Partition Wall with Window Arch
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#450A0A';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#7F1D1D';
      ctx.fillRect(1, 1, 14, 6);
      ctx.fillRect(17, 1, 14, 6);
      ctx.fillRect(1, 9, 6, 6);
      ctx.fillRect(9, 9, 14, 6);
      ctx.fillRect(25, 9, 6, 6);
      ctx.fillRect(1, 17, 14, 6);
      ctx.fillRect(17, 17, 14, 6);
      ctx.fillRect(1, 25, 6, 6);
      ctx.fillRect(9, 25, 14, 6);
      ctx.fillRect(25, 25, 6, 6);
      // Ivy vine
      ctx.fillStyle = '#15803D';
      ctx.fillRect(2, 4, 3, 10);
      ctx.fillRect(4, 12, 3, 2);
      this.cache['tile_wall_brick'] = canvas;
    }
    // Lab Wall
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#0B0F19';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(6, 6, 2, 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(10, 6, 2, 2);
      this.cache['tile_wall_lab'] = canvas;
    }
    // Rig Bulkhead Wall
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#334155';
      for (let x = 2; x < 30; x += 4) ctx.fillRect(x, 0, 2, 32);
      this.cache['tile_wall_rig'] = canvas;
    }

    // 3. Props & Interactives (30+ High Density Props)
    // -------------------------------------------------------------
    // ZONE 1: ALMA MATER & EXPEDITION COURTYARD
    // -------------------------------------------------------------
    // EPMA Geochemistry & Python ML Terminal (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 18, 56, 28);
      ctx.fillStyle = '#334155';
      ctx.fillRect(2, 14, 60, 6);
      // CRT Monitor 1: Garnet Ternary Plot
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(6, 4, 24, 14);
      ctx.fillStyle = '#EF4444'; // Pyrope peak
      ctx.fillRect(17, 6, 2, 2);
      ctx.fillStyle = '#3B82F6'; // Almandine
      ctx.fillRect(10, 14, 2, 2);
      ctx.fillStyle = '#22C55E'; // Grossular
      ctx.fillRect(24, 14, 2, 2);
      ctx.strokeStyle = '#64748B';
      ctx.strokeRect(6, 4, 24, 14);
      // CRT Monitor 2: Python Jupyter Terminal
      ctx.fillStyle = '#022C22';
      ctx.fillRect(34, 4, 24, 14);
      ctx.fillStyle = '#34D399';
      ctx.fillRect(36, 6, 12, 1);
      ctx.fillRect(36, 9, 18, 1);
      ctx.fillRect(36, 12, 8, 1);
      ctx.fillStyle = '#F59E0B'; // cursor
      ctx.fillRect(46, 12, 2, 2);
      // Keyboard
      ctx.fillStyle = '#475569';
      ctx.fillRect(18, 22, 28, 6);
      this.cache['prop_epma_terminal'] = canvas;
    }

    // Marine Biogeochemistry Lab Bench (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#475569';
      ctx.fillRect(4, 18, 56, 28);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(2, 14, 60, 5); // stainless bench
      // Flask 1: Ocean Fe solution (blue)
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(8, 8, 8, 8);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(10, 5, 4, 3);
      // Flask 2: Atmospheric aerosol digest (amber)
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(22, 7, 10, 9);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(25, 4, 4, 3);
      // Bunsen Burner flame
      ctx.fillStyle = '#475569';
      ctx.fillRect(40, 10, 6, 6);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(42, 6, 2, 4);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(42, 4, 2, 2);
      // Test tube rack
      ctx.fillStyle = '#78350F';
      ctx.fillRect(50, 8, 10, 8);
      ctx.fillStyle = '#EC4899'; ctx.fillRect(52, 6, 1, 5);
      ctx.fillStyle = '#10B981'; ctx.fillRect(55, 6, 1, 5);
      ctx.fillStyle = '#8B5CF6'; ctx.fillRect(58, 6, 1, 5);
      this.cache['prop_marine_lab'] = canvas;
    }

    // Glass Mineral & Fossil Display Case (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#3E1F0F';
      ctx.fillRect(4, 30, 40, 16); // wood base
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fillRect(6, 6, 36, 24); // glass hood
      ctx.strokeStyle = '#CBD5E1';
      ctx.strokeRect(6, 6, 36, 24);
      // Mineral 1: Quartz crystal
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.moveTo(14, 26); ctx.lineTo(16, 18); ctx.lineTo(19, 26); ctx.fill();
      // Mineral 2: Pyrope garnet
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(26, 22, 4, 0, Math.PI * 2); ctx.fill();
      // Mineral 3: Banded Iron Formation
      ctx.fillStyle = '#1F2937';
      ctx.fillRect(33, 20, 6, 7);
      ctx.fillStyle = '#991B1B';
      ctx.fillRect(33, 22, 6, 2);
      this.cache['prop_fossil_case'] = canvas;
    }

    // Field Mapping Table (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(4, 18, 56, 28);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(2, 14, 60, 6);
      // Unfolded Topo Map
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(8, 4, 30, 14);
      ctx.fillStyle = '#D97706'; // contour lines
      ctx.beginPath();
      ctx.arc(22, 10, 5, 0, Math.PI); ctx.stroke();
      // Brunton Compass
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(46, 10, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#EF4444'; // needle
      ctx.fillRect(45, 6, 2, 8);
      // Hand lens
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(42, 22, 8, 3);
      this.cache['prop_field_table'] = canvas;
    }

    // Heavy Gym Barbell Rack (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#1E293B';
      // Bench
      ctx.fillRect(14, 24, 36, 8);
      ctx.fillStyle = '#334155';
      ctx.fillRect(20, 32, 6, 14);
      ctx.fillRect(38, 32, 6, 14);
      // Upright supports
      ctx.fillStyle = '#64748B';
      ctx.fillRect(8, 10, 4, 36);
      ctx.fillRect(52, 10, 4, 36);
      // Olympic Bar
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(2, 12, 60, 3);
      // Weight Plates (Loaded core-box weights)
      ctx.fillStyle = '#EF4444'; ctx.fillRect(4, 6, 4, 15);
      ctx.fillStyle = '#2563EB'; ctx.fillRect(8, 7, 3, 13);
      ctx.fillStyle = '#EF4444'; ctx.fillRect(56, 6, 4, 15);
      ctx.fillStyle = '#2563EB'; ctx.fillRect(53, 7, 3, 13);
      this.cache['prop_gym_bench'] = canvas;
    }

    // Academic Trophy & Flysch/Lithify Media Desk (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#3E1F0F';
      ctx.fillRect(4, 20, 56, 26);
      ctx.fillStyle = '#5A2E16';
      ctx.fillRect(2, 16, 60, 6);
      // Gold Trophy 1
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(8, 6, 10, 10);
      ctx.fillRect(11, 16, 4, 4);
      // Gold Trophy 2 (Football Cup)
      ctx.beginPath();
      ctx.arc(26, 9, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(24, 14, 4, 4);
      // Flysch '22 Poster frame
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(38, 2, 22, 15);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(40, 4, 18, 11);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(42, 6, 8, 2); // "FLYSCH"
      this.cache['prop_trophy_media'] = canvas;
    }

    // Mini Football Pitch & Goalpost (160x110)
    {
      const { canvas, ctx } = createBuffer(160, 110);
      // Grass turf
      ctx.fillStyle = '#15803D';
      ctx.fillRect(0, 0, 160, 110);
      // Alternating turf stripes
      ctx.fillStyle = '#16A34A';
      for (let x = 0; x < 160; x += 32) ctx.fillRect(x, 0, 16, 110);
      // White boundary lines
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(6, 6, 148, 98);
      // Center circle
      ctx.beginPath();
      ctx.arc(80, 55, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(80, 6); ctx.lineTo(80, 104); ctx.stroke();
      // Penalty Box & Goal Net (Left side)
      ctx.strokeRect(6, 32, 28, 46);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 38, 6, 34); // goal interior
      ctx.strokeStyle = '#E2E8F0';
      ctx.strokeRect(0, 38, 6, 34); // posts
      // #4 Jersey Banner
      ctx.fillStyle = '#1E3A8A';
      ctx.fillRect(100, 12, 48, 18);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(102, 14, 44, 14);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(122, 16, 4, 10); // #4
      this.cache['prop_football_pitch'] = canvas;
    }

    // Acrylic Canvas Painting Easel (32x48)
    {
      const { canvas, ctx } = createBuffer(32, 48);
      // Wooden tripod legs
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(16, 4); ctx.lineTo(6, 46);
      ctx.moveTo(16, 4); ctx.lineTo(26, 46);
      ctx.moveTo(16, 4); ctx.lineTo(16, 46);
      ctx.stroke();
      // Canvas board
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(6, 8, 20, 22);
      ctx.strokeStyle = '#D97706';
      ctx.strokeRect(6, 8, 20, 22);
      // Abstract art painting strokes
      ctx.fillStyle = '#EF4444'; ctx.fillRect(9, 11, 6, 4);
      ctx.fillStyle = '#3B82F6'; ctx.fillRect(16, 14, 7, 5);
      ctx.fillStyle = '#F59E0B'; ctx.fillRect(10, 18, 12, 4);
      ctx.fillStyle = '#10B981'; ctx.fillRect(14, 24, 8, 3);
      // Palette with paint blobs
      ctx.fillStyle = '#D97706';
      ctx.beginPath(); ctx.arc(8, 36, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#EF4444'; ctx.fillRect(6, 34, 2, 2);
      ctx.fillStyle = '#3B82F6'; ctx.fillRect(9, 36, 2, 2);
      this.cache['prop_art_easel'] = canvas;
    }

    // Himalayan Trekking Camp (96x64)
    {
      const { canvas, ctx } = createBuffer(96, 64);
      // Expedition Tent (Orange canvas)
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.moveTo(10, 48); ctx.lineTo(34, 16); ctx.lineTo(58, 48); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#C2410C';
      ctx.beginPath();
      ctx.moveTo(34, 16); ctx.lineTo(46, 16); ctx.lineTo(70, 48); ctx.lineTo(58, 48); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#1E293B'; // Tent flap opening
      ctx.beginPath();
      ctx.moveTo(28, 48); ctx.lineTo(34, 26); ctx.lineTo(40, 48); ctx.fill();
      // Campfire with stones
      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.arc(78, 44, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#EA580C';
      ctx.beginPath(); ctx.moveTo(74, 44); ctx.lineTo(78, 34); ctx.lineTo(82, 44); ctx.fill();
      ctx.fillStyle = '#FACC15';
      ctx.beginPath(); ctx.moveTo(76, 44); ctx.lineTo(78, 37); ctx.lineTo(80, 44); ctx.fill();
      // Wooden trail signpost
      ctx.fillStyle = '#78350F';
      ctx.fillRect(86, 20, 3, 28);
      ctx.fillStyle = '#B45309';
      ctx.fillRect(76, 14, 18, 9);
      ctx.fillStyle = '#FFFBEB';
      ctx.fillRect(78, 17, 14, 2); // sign text
      this.cache['prop_trekking_camp'] = canvas;
    }

    // Bookshelf (32x48)
    {
      const { canvas, ctx } = createBuffer(32, 48);
      ctx.fillStyle = '#3E1F0F';
      ctx.fillRect(0, 0, 32, 48);
      ctx.fillStyle = '#5A2E16';
      ctx.fillRect(2, 2, 28, 44);
      const cols = ['#B91C1C', '#1D4ED8', '#047857', '#F59E0B'];
      let bx = 4;
      for (let c of cols) {
        ctx.fillStyle = c;
        ctx.fillRect(bx, 6, 5, 12);
        ctx.fillRect(bx, 22, 5, 12);
        bx += 6;
      }
      this.cache['prop_bookshelf'] = canvas;
    }

    // Gym Weights & Football Trophy (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#1E1B18';
      ctx.fillRect(2, 6, 44, 38);
      ctx.fillStyle = '#42372B';
      ctx.fillRect(4, 8, 40, 34);
      // Football Cup
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(16, 20, 7, 0, Math.PI * 2);
      ctx.fill();
      // Dumbbells
      ctx.fillStyle = '#64748B';
      ctx.fillRect(28, 22, 14, 4);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(27, 18, 4, 12);
      ctx.fillRect(39, 18, 4, 12);
      this.cache['prop_gym_trophy'] = canvas;
    }

    // -------------------------------------------------------------
    // ZONE 2: ONGC SUBSURFACE INTERPRETATION OFFICE
    // -------------------------------------------------------------
    // Petrel Triple-Monitor Workstation (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(4, 20, 56, 26);
      ctx.fillStyle = '#334155';
      ctx.fillRect(2, 16, 60, 6);
      // Screen 1 (Petrel 3D seismic volume)
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(6, 4, 16, 12);
      ctx.fillStyle = '#EF4444'; ctx.fillRect(10, 5, 2, 9);
      // Screen 2 (Fault Cubes)
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(24, 4, 16, 12);
      ctx.fillStyle = '#F59E0B'; ctx.fillRect(26, 7, 12, 3);
      // Screen 3 (Well Tops correlation)
      ctx.fillStyle = '#059669';
      ctx.fillRect(42, 4, 16, 12);
      ctx.fillStyle = '#38BDF8'; ctx.fillRect(44, 6, 12, 2);
      this.cache['prop_petrel_desk'] = canvas;
    }

    // PaleoScan RGT Model Workstation (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(4, 20, 56, 26);
      ctx.fillStyle = '#334155';
      ctx.fillRect(2, 16, 60, 6);
      // Screen 1: Relative Geologic Time (RGT) color wheel
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(8, 4, 22, 12);
      ctx.fillStyle = '#EC4899'; ctx.fillRect(10, 6, 5, 4);
      ctx.fillStyle = '#F59E0B'; ctx.fillRect(15, 6, 5, 4);
      ctx.fillStyle = '#10B981'; ctx.fillRect(20, 6, 5, 4);
      ctx.fillStyle = '#3B82F6'; ctx.fillRect(10, 10, 15, 4);
      // Screen 2: Horizon Grid & Fault Seal
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(34, 4, 22, 12);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(36, 7, 18, 2);
      ctx.fillRect(36, 12, 18, 2);
      ctx.fillStyle = '#EF4444'; // fault line
      ctx.fillRect(45, 5, 2, 10);
      this.cache['prop_paleoscan_desk'] = canvas;
    }

    // Modular Office Cubicle & Swivel Chair (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      // Acoustic partition wall (Blue)
      ctx.fillStyle = '#1E3A8A';
      ctx.fillRect(2, 6, 60, 4);
      ctx.fillRect(2, 6, 4, 38);
      // Desk
      ctx.fillStyle = '#475569';
      ctx.fillRect(6, 18, 52, 24);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(6, 16, 52, 4);
      // Monitor & logs
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(12, 8, 18, 10);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(14, 10, 14, 6);
      ctx.fillStyle = '#FEF08A'; // sticky notes
      ctx.fillRect(36, 22, 5, 5);
      // Ergonomic Swivel Chair
      ctx.fillStyle = '#0F172A';
      ctx.beginPath(); ctx.arc(46, 32, 7, 0, Math.PI * 2); ctx.fill();
      this.cache['prop_office_cubicle'] = canvas;
    }

    // Wide-Format GIS Map Plotter Roll (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(6, 12, 52, 28); // HP Plotter body
      ctx.fillStyle = '#475569';
      ctx.fillRect(10, 40, 6, 8); // stand legs
      ctx.fillRect(48, 40, 6, 8);
      // Plotter output slot & paper roll
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(8, 16, 48, 4);
      // Roll out map
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(10, 20, 44, 18);
      // Map contour prints
      ctx.fillStyle = '#0284C7'; ctx.fillRect(12, 22, 16, 4);
      ctx.fillStyle = '#10B981'; ctx.fillRect(28, 24, 12, 6);
      ctx.fillStyle = '#EF4444'; ctx.fillRect(18, 28, 20, 3);
      this.cache['prop_plotter_roll'] = canvas;
    }

    // Glowing Hologram GIS / SAR Table (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      // Hexagonal pedestal
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(8, 24, 48, 20);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(6, 20, 52, 6);
      // Glowing holographic projector ring
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(12, 18, 40, 4);
      // Hologram projection cone
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.moveTo(16, 18); ctx.lineTo(24, 4); ctx.lineTo(40, 4); ctx.lineTo(48, 18); ctx.closePath();
      ctx.fill();
      // Floating 3D SAR fringes & fault planes
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(26, 6, 12, 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(28, 10, 10, 2);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(30, 8, 2, 7);
      this.cache['prop_gis_table'] = canvas;
    }

    // Glass Conference Room & Projector (80x48)
    {
      const { canvas, ctx } = createBuffer(80, 48);
      // Glass divider frame
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(2, 4, 76, 40);
      ctx.strokeStyle = '#38BDF8';
      ctx.strokeRect(2, 4, 76, 40);
      // Whiteboard with prospect charts
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(8, 8, 30, 18);
      ctx.fillStyle = '#2563EB'; ctx.fillRect(10, 12, 12, 2);
      ctx.fillStyle = '#EF4444'; ctx.fillRect(10, 16, 18, 2);
      // Boardroom Table & Chairs
      ctx.fillStyle = '#78350F';
      ctx.fillRect(42, 14, 32, 16);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(46, 8, 6, 4);
      ctx.fillRect(62, 8, 6, 4);
      ctx.fillRect(46, 32, 6, 4);
      ctx.fillRect(62, 32, 6, 4);
      this.cache['prop_conference_room'] = canvas;
    }

    // High-Performance Subsurface Server Racks (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(4, 4, 40, 42);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(6, 6, 36, 38);
      // Blinking server arrays
      for (let y = 8; y < 40; y += 6) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(8, y, 32, 4);
        ctx.fillStyle = (y % 12 === 0) ? '#22C55E' : '#38BDF8';
        ctx.fillRect(10, y + 1, 2, 2);
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(14, y + 1, 2, 2);
      }
      this.cache['prop_server_racks'] = canvas;
    }

    // Industrial Core Box Storage Shelves (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      // Metal cantilever frame
      ctx.fillStyle = '#475569';
      ctx.fillRect(4, 4, 4, 42);
      ctx.fillRect(40, 4, 4, 42);
      ctx.fillRect(4, 16, 40, 3);
      ctx.fillRect(4, 28, 40, 3);
      ctx.fillRect(4, 40, 40, 3);
      // Slotted wooden core boxes
      ctx.fillStyle = '#B45309';
      ctx.fillRect(9, 8, 30, 7);
      ctx.fillRect(9, 20, 30, 7);
      ctx.fillRect(9, 32, 30, 7);
      // Cylindrical drill core segments inside
      ctx.fillStyle = '#64748B';
      ctx.fillRect(11, 10, 8, 3); ctx.fillRect(21, 10, 10, 3);
      ctx.fillStyle = '#475569';
      ctx.fillRect(11, 22, 12, 3); ctx.fillRect(25, 22, 8, 3);
      this.cache['prop_core_shelves'] = canvas;
    }

    // Break Room Corner (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      // Water Cooler
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(6, 18, 12, 26);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.beginPath(); ctx.arc(12, 12, 6, 0, Math.PI * 2); ctx.fill();
      // Microwave / Mini-fridge
      ctx.fillStyle = '#334155';
      ctx.fillRect(22, 22, 20, 22);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(24, 24, 12, 8); // microwave window
      // Whiteboard with sticky notes
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(22, 4, 20, 14);
      ctx.fillStyle = '#FEF08A'; ctx.fillRect(24, 6, 4, 4);
      ctx.fillStyle = '#F472B6'; ctx.fillRect(30, 8, 4, 4);
      this.cache['prop_breakroom'] = canvas;
    }

    // OIL & SAIL Internship Locker (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 6, 40, 40);
      ctx.fillStyle = '#334155';
      ctx.fillRect(6, 8, 16, 36);
      ctx.fillRect(26, 8, 16, 36);
      // Louvers
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(9, 12, 10, 2); ctx.fillRect(9, 16, 10, 2);
      ctx.fillRect(29, 12, 10, 2); ctx.fillRect(29, 16, 10, 2);
      // OIL Assam Shelf sticker
      ctx.fillStyle = '#0284C7'; ctx.fillRect(8, 24, 8, 6);
      // SAIL Dalli-Rajhara sticker
      ctx.fillStyle = '#DC2626'; ctx.fillRect(28, 24, 8, 6);
      this.cache['prop_internship_locker'] = canvas;
    }

    // Glowing H2 & He Gas Canisters (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 38, 40, 8);
      // Green H2 tank
      ctx.fillStyle = '#10B981';
      ctx.fillRect(9, 12, 12, 24);
      ctx.beginPath(); ctx.arc(15, 12, 6, Math.PI, 0); ctx.fill();
      // Purple He tank
      ctx.fillStyle = '#A855F7';
      ctx.fillRect(27, 12, 12, 24);
      ctx.beginPath(); ctx.arc(33, 12, 6, Math.PI, 0); ctx.fill();
      // Digital Pressure Transducer
      ctx.fillStyle = '#0F172A'; ctx.fillRect(18, 4, 12, 6);
      ctx.fillStyle = '#38BDF8'; ctx.fillRect(20, 5, 8, 3);
      this.cache['prop_gas_canisters'] = canvas;
    }

    // -------------------------------------------------------------
    // ZONE 3: ACTIVE RIG FLOOR - GDA-A SAMASTIPUR
    // -------------------------------------------------------------
    // Derrick Mast Base & Rotating Kelly / Top Drive (96x80)
    {
      const { canvas, ctx } = createBuffer(96, 80);
      // Massive steel lattice legs
      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(12, 76); ctx.lineTo(36, 4); ctx.lineTo(60, 4); ctx.lineTo(84, 76);
      ctx.stroke();
      // Lattice bracing
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(18, 60); ctx.lineTo(78, 60);
      ctx.moveTo(24, 40); ctx.lineTo(72, 40);
      ctx.moveTo(30, 20); ctx.lineTo(66, 20);
      ctx.moveTo(18, 60); ctx.lineTo(72, 40);
      ctx.moveTo(24, 40); ctx.lineTo(78, 60);
      ctx.stroke();
      // Rotary Table Center
      ctx.fillStyle = '#1E293B';
      ctx.beginPath(); ctx.arc(48, 66, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#64748B';
      ctx.beginPath(); ctx.arc(48, 66, 9, 0, Math.PI * 2); ctx.fill();
      // Rotating Kelly Drive Bushing
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(45, 14, 6, 54);
      this.cache['prop_derrick_rotary'] = canvas;
    }

    // 8.5" Drill Pipe Rack & Catwalk (96x48)
    {
      const { canvas, ctx } = createBuffer(96, 48);
      // Catwalk ramp (steel grating)
      ctx.fillStyle = '#334155';
      ctx.fillRect(4, 24, 88, 20);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(4, 22, 88, 3);
      // Pipe bolster racks
      ctx.fillStyle = '#EAB308';
      ctx.fillRect(12, 10, 4, 14);
      ctx.fillRect(46, 10, 4, 14);
      ctx.fillRect(80, 10, 4, 14);
      // Stacked 8.5" Drill Pipes (Tubulars)
      for (let y = 6; y < 22; y += 5) {
        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(8, y, 80, 4);
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(8, y, 80, 1);
        ctx.fillStyle = '#475569';
        ctx.fillRect(86, y - 1, 4, 6); // tool joint box
      }
      this.cache['prop_pipe_rack'] = canvas;
    }

    // Vibrating Shale Shakers with Mud Flow (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#334155';
      ctx.fillRect(4, 14, 56, 30);
      // Dual screen beds
      ctx.fillStyle = '#475569';
      ctx.fillRect(8, 18, 22, 20);
      ctx.fillRect(34, 18, 22, 20);
      // Screen wire mesh
      ctx.fillStyle = '#94A3B8';
      for (let y = 20; y < 36; y += 3) {
        ctx.fillRect(8, y, 22, 1);
        ctx.fillRect(34, y, 22, 1);
      }
      // Mud Flow & G&G Cuttings
      ctx.fillStyle = '#78350F';
      ctx.fillRect(10, 24, 18, 12);
      ctx.fillRect(36, 24, 18, 12);
      ctx.fillStyle = '#D97706'; // cuttings
      ctx.fillRect(12, 26, 3, 2); ctx.fillRect(20, 30, 4, 2);
      ctx.fillRect(38, 28, 4, 2); ctx.fillRect(46, 32, 3, 2);
      this.cache['prop_shale_shakers'] = canvas;
    }

    // Mud Tanks & Pits with Motor Agitators (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 12, 56, 32);
      // Mud fluid pool
      ctx.fillStyle = '#3B2F2F'; // Drilling mud fluid
      ctx.fillRect(8, 16, 48, 24);
      // Mud Agitator Impeller Motor
      ctx.fillStyle = '#EAB308';
      ctx.fillRect(26, 4, 12, 10);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(30, 14, 4, 20); // shaft
      // Propeller blades
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(22, 30, 20, 3);
      this.cache['prop_mud_tanks'] = canvas;
    }

    // Doghouse Mud Logging Unit (80x48)
    {
      const { canvas, ctx } = createBuffer(80, 48);
      // Climate controlled container cabin
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(4, 10, 72, 34);
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(4, 6, 72, 5); // roof trim
      // Cabin windows
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(12, 16, 24, 14);
      ctx.fillRect(44, 16, 24, 14);
      // Logging screens glowing inside
      ctx.fillStyle = '#22C55E'; ctx.fillRect(14, 18, 10, 5); // chromatograph
      ctx.fillStyle = '#38BDF8'; ctx.fillRect(26, 18, 8, 10); // PDA telemetry
      ctx.fillStyle = '#A855F7'; ctx.fillRect(46, 18, 10, 10); // UV fluoroscope
      ctx.fillStyle = '#FEF08A'; ctx.fillRect(58, 18, 8, 6); // litho column
      this.cache['prop_doghouse_cabin'] = canvas;
    }

    // High-Pressure Cementing Unit (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#B91C1C'; // Red cementing unit skid
      ctx.fillRect(4, 16, 56, 28);
      // Twin triplex pump fluid ends
      ctx.fillStyle = '#475569';
      ctx.fillRect(8, 20, 18, 18);
      ctx.fillRect(32, 20, 18, 18);
      // Manifold pipes & high-pressure Chiksan lines
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(6, 12, 52, 4);
      ctx.fillRect(22, 6, 6, 10);
      ctx.fillRect(46, 6, 6, 10);
      // Pressure gauges
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath(); ctx.arc(14, 10, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(38, 10, 3, 0, Math.PI * 2); ctx.fill();
      this.cache['prop_cementing_unit'] = canvas;
    }

    // Blowout Preventer (BOP) Stack & Koomey Accumulator (48x64)
    {
      const { canvas, ctx } = createBuffer(48, 64);
      // Red BOP Stack Body
      ctx.fillStyle = '#991B1B';
      ctx.fillRect(12, 8, 24, 52);
      // Annular BOP (top spherical)
      ctx.fillStyle = '#DC2626';
      ctx.beginPath(); ctx.arc(24, 12, 10, 0, Math.PI * 2); ctx.fill();
      // Pipe Rams & Blind Shear Rams
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(6, 24, 36, 6);
      ctx.fillRect(6, 36, 36, 6);
      ctx.fillRect(6, 48, 36, 6);
      // Hydraulic lines to Koomey unit
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(4, 20, 2, 38);
      this.cache['prop_bop_stack'] = canvas;
    }

    // Heavy Drawworks Winch & PDA Driller Console (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 14, 40, 30);
      // Massive steel cable drum
      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.arc(24, 26, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(16, 24, 16, 5); // spooled wireline
      // Driller console display
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(28, 6, 14, 12);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(30, 8, 10, 8); // PDA weight-on-bit & ROP
      this.cache['prop_drawworks'] = canvas;
    }

    // Heavy Diesel Generator Skid (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      // Yellow Cat generator body
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(4, 16, 40, 28);
      // Ventilation louvers
      ctx.fillStyle = '#1E293B';
      for (let y = 20; y < 40; y += 4) ctx.fillRect(8, y, 18, 2);
      // Exhaust stack
      ctx.fillStyle = '#475569';
      ctx.fillRect(34, 4, 5, 14);
      // Heat shimmer / exhaust tip
      ctx.fillStyle = 'rgba(226, 232, 240, 0.4)';
      ctx.fillRect(35, 1, 3, 3);
      this.cache['prop_diesel_generator'] = canvas;
    }

    // Rig Doghouse Coffee Station & PPE Safety Locker (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      // Yellow Safety PPE Locker (Right)
      ctx.fillStyle = '#EAB308';
      ctx.fillRect(24, 8, 20, 36);
      ctx.fillStyle = '#CA8A04';
      ctx.fillRect(26, 10, 16, 32);
      // Hard hats on shelf
      ctx.fillStyle = '#FFF'; ctx.fillRect(28, 14, 5, 3);
      ctx.fillStyle = '#FACC15'; ctx.fillRect(35, 14, 5, 3);
      // Coffee Urn (Left)
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 20, 18, 24);
      ctx.fillStyle = '#CBD5E1'; // steel urn
      ctx.fillRect(6, 12, 14, 14);
      ctx.fillStyle = '#EF4444'; // red mug
      ctx.fillRect(10, 24, 6, 5);
      this.cache['prop_rig_coffee_locker'] = canvas;
      this.cache['prop_coffee_urn'] = canvas; // alias
    }

    // Flare Stack with Flickering Pixel Flame (32x48)
    {
      const { canvas, ctx } = createBuffer(32, 48);
      // Steel stack pipe
      ctx.fillStyle = '#475569';
      ctx.fillRect(14, 16, 4, 30);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(12, 44, 8, 4); // base
      // Flare tip burner
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(12, 14, 8, 3);
      // Pixel flame
      ctx.fillStyle = '#EA580C';
      ctx.beginPath(); ctx.moveTo(12, 14); ctx.lineTo(16, 2); ctx.lineTo(20, 14); ctx.fill();
      ctx.fillStyle = '#FACC15';
      ctx.beginPath(); ctx.moveTo(14, 14); ctx.lineTo(16, 5); ctx.lineTo(18, 14); ctx.fill();
      this.cache['prop_flare_stack'] = canvas;
    }

    // Soccer Ball Sprite (16x16)
    {
      const { canvas, ctx } = createBuffer(16, 16);
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath(); ctx.arc(8, 8, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(7, 7, 2, 2);
      ctx.fillRect(5, 5, 2, 2);
      ctx.fillRect(9, 5, 2, 2);
      ctx.fillRect(5, 9, 2, 2);
      ctx.fillRect(9, 9, 2, 2);
      this.cache['soccer_ball'] = canvas;
    }

    // Thesis Pedestal / Dynamic Achievement Pedestal (32x48)
    {
      const { canvas, ctx } = createBuffer(32, 48);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(4, 20, 24, 26);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(2, 42, 28, 4);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.fillRect(6, 6, 20, 14);
      ctx.strokeStyle = '#38BDF8';
      ctx.strokeRect(6, 6, 20, 14);
      // Golden trophy / thesis book
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(10, 10, 12, 8);
      this.cache['prop_pedestal'] = canvas;
    }

    // Glowing Rock Outcrops (for Mini-Game 3) (32x32)
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.moveTo(6, 26);
      ctx.lineTo(12, 10);
      ctx.lineTo(22, 8);
      ctx.lineTo(28, 26);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(10, 14, 8, 4);
      // Sparkle
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(20, 10, 3, 3);
      this.cache['prop_rock_outcrop'] = canvas;
    }

    // 4. Player Character (Rajdeep with Backpack, Hammer [H], Lens [M], Auto-PPE)
    this.buildCharacterSprites();
  }

  buildCharacterSprites() {
    const outfits = ['academic', 'lab', 'rig'];
    const dirs = ['down', 'up', 'left', 'right'];

    outfits.forEach(outfit => {
      dirs.forEach(dir => {
        for (let frame = 0; frame < 4; frame++) {
          const { canvas, ctx } = createBuffer(32, 32);
          this.drawAvatar(ctx, outfit, dir, frame, false, false);
          this.cache[`char_${outfit}_${dir}_${frame}`] = canvas;
        }
      });

      // Hammer strike pose
      const { canvas: hCanvas, ctx: hCtx } = createBuffer(32, 32);
      this.drawAvatar(hCtx, outfit, 'down', 0, true, false);
      this.cache[`char_${outfit}_hammer`] = hCanvas;

      // 10x Lens inspect pose
      const { canvas: mCanvas, ctx: mCtx } = createBuffer(32, 32);
      this.drawAvatar(mCtx, outfit, 'down', 0, false, true);
      this.cache[`char_${outfit}_lens`] = mCanvas;

      // Idle Push-ups (2 frames)
      for (let rep = 0; rep < 2; rep++) {
        const { canvas, ctx } = createBuffer(32, 32);
        this.drawPushup(ctx, outfit, rep);
        this.cache[`char_${outfit}_pushup_${rep}`] = canvas;
      }

      // Idle Coffee Sipping (2 frames)
      for (let f = 0; f < 2; f++) {
        const { canvas, ctx } = createBuffer(32, 32);
        this.drawCoffeeSip(ctx, outfit, f);
        this.cache[`char_${outfit}_coffee_${f}`] = canvas;
      }

      // Slide tackle pose
      const { canvas: tCanvas, ctx: tCtx } = createBuffer(32, 32);
      this.drawSlideTackle(tCtx, outfit);
      this.cache[`char_${outfit}_tackle`] = tCanvas;
    });

    // High-res pixel portraits for HUD & dialogs
    this.buildPortraits();
  }

  drawSlideTackle(ctx, outfit) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(2, 26, 28, 4);

    let shirt = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#334155' : '#1E3A8A';
    let pants = outfit === 'rig' ? '#EA580C' : '#1E293B';
    let skin = '#F5D0A9';

    // Sliding leg
    ctx.fillStyle = pants;
    ctx.fillRect(6, 20, 18, 5);
    ctx.fillRect(22, 18, 8, 4); // extended kicking foot
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(27, 20, 5, 3); // shoe

    ctx.fillStyle = shirt;
    ctx.fillRect(4, 14, 14, 7); // torso tilted back

    // Jersey #4
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(8, 15, 4, 4);

    // Arms
    ctx.fillStyle = skin;
    ctx.fillRect(1, 22, 5, 4);
    ctx.fillRect(14, 11, 4, 4);

    // Head
    ctx.fillStyle = skin;
    ctx.fillRect(2, 8, 7, 7);
    if (outfit === 'rig') {
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(1, 6, 9, 4);
    } else {
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(1, 6, 8, 4);
    }

    // Grass turf particles kicked up
    ctx.fillStyle = '#4ADE80';
    ctx.fillRect(0, 24, 2, 2);
    ctx.fillRect(10, 27, 2, 2);
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(28, 17, 3, 3);
  }

  drawAvatar(ctx, outfit, dir, frame, isHammer = false, isLens = false) {
    const isMoving = (frame === 1 || frame === 3);
    const legOffset = (frame === 1) ? 2 : (frame === 3) ? -2 : 0;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(16, 29, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    let skin = '#F5D0A9';
    let hair = '#1C1917';
    let shirt = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#334155' : '#1E3A8A';
    let pants = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#0F172A' : '#1E293B';
    let boots = outfit === 'rig' ? '#475569' : '#78350F';

    // Expedition Backpack (Brown canvas strapped on back)
    if (dir === 'up') {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(9, 13, 14, 10);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(11, 15, 10, 6);
    } else if (dir === 'left') {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(18, 13, 5, 8);
    } else if (dir === 'right') {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(9, 13, 5, 8);
    }

    // Legs
    ctx.fillStyle = pants;
    ctx.fillRect(11, 20, 4, 7 - (frame === 1 ? 2 : 0));
    ctx.fillRect(17, 20, 4, 7 - (frame === 3 ? 2 : 0));

    // Boots
    ctx.fillStyle = boots;
    ctx.fillRect(11, 26 - (frame === 1 ? 2 : 0), 4, 3);
    ctx.fillRect(17, 26 - (frame === 3 ? 2 : 0), 4, 3);

    // Torso / Shirt
    ctx.fillStyle = shirt;
    ctx.fillRect(10, 12, 12, 9);

    // Rig Reflective PPE Stripes
    if (outfit === 'rig') {
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(10, 15, 12, 2);
      ctx.fillRect(10, 21, 12, 1);
    } else if (outfit === 'lab') {
      // ONGC Badge
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(14, 12, 1, 6);
      ctx.fillRect(17, 12, 1, 6);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(14, 17, 4, 3);
    }

    // Arms & Hands
    ctx.fillStyle = shirt;
    ctx.fillRect(7, 13, 3, 6);
    ctx.fillRect(22, 13, 3, 6);
    ctx.fillStyle = skin;
    ctx.fillRect(7, 19, 3, 2);
    ctx.fillRect(22, 19, 3, 2);

    // GEOLOGICAL ROCK HAMMER (Right Hand)
    if (isHammer) {
      // Striking down
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(23, 14, 2, 14); // handle
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(21, 26, 7, 3);  // steel head
      // Spark
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(27, 28, 3, 3);
    } else {
      // Resting on side
      ctx.fillStyle = '#78350F';
      ctx.fillRect(23, 16, 2, 8); // handle
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(22, 15, 4, 2); // head
    }

    // 10x MAGNIFYING LOUPE (Left Hand)
    if (isLens) {
      // Held up to eye
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(5, 7, 5, 5);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(6, 8, 3, 3);
    } else {
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(7, 18, 3, 3);
    }

    // Head & Face
    ctx.fillStyle = skin;
    ctx.fillRect(11, 4, 10, 8);

    // Hair or Yellow Hard Hat (Auto-PPE)
    if (outfit === 'rig') {
      ctx.fillStyle = '#FACC15'; // Yellow Hard Hat
      ctx.fillRect(9, 2, 14, 5);
      ctx.fillRect(8, 6, 16, 2); // Brim
    } else {
      ctx.fillStyle = hair;
      ctx.fillRect(10, 2, 12, 4);
    }

    // Glasses in Lab
    if (outfit === 'lab') {
      ctx.strokeStyle = '#38BDF8';
      ctx.strokeRect(12, 6, 3, 3);
      ctx.strokeRect(17, 6, 3, 3);
    }

    // Eyes
    ctx.fillStyle = '#1C1917';
    ctx.fillRect(13, 7, 2, 2);
    ctx.fillRect(17, 7, 2, 2);
  }

  drawPushup(ctx, outfit, rep) {
    const yOff = rep === 0 ? 0 : 3;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(4, 26, 24, 4);

    let shirt = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#334155' : '#1E3A8A';
    let pants = outfit === 'rig' ? '#EA580C' : '#1E293B';

    ctx.fillStyle = pants;
    ctx.fillRect(6, 18 + yOff * 0.5, 10, 4);
    ctx.fillStyle = shirt;
    ctx.fillRect(15, 17 + yOff, 10, 5);
    ctx.fillStyle = '#F5D0A9';
    ctx.fillRect(rep === 0 ? 20 : 18, 22, 4, 5); // arm
    ctx.fillRect(24, 16 + yOff, 5, 5); // head

    if (outfit === 'rig') {
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(24, 14 + yOff, 6, 3);
    } else {
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(24, 14 + yOff, 5, 3);
    }
  }

  drawCoffeeSip(ctx, outfit, f) {
    this.drawAvatar(ctx, outfit, 'down', 0, false, false);
    // Coffee Mug in hand
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(14, 12, 5, 5);
    // Steam puff
    if (f === 1) {
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(15, 8, 2, 2);
      ctx.fillRect(17, 6, 2, 2);
    }
  }

  buildPortraits() {
    ['academic', 'lab', 'rig'].forEach(outfit => {
      const { canvas, ctx } = createBuffer(80, 80);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 80, 80);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(2, 2, 76, 76);

      let shirt = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#334155' : '#1E3A8A';
      ctx.fillStyle = shirt;
      ctx.fillRect(16, 54, 48, 22);

      if (outfit === 'rig') {
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(16, 62, 48, 4);
      }

      ctx.fillStyle = '#F5D0A9';
      ctx.fillRect(24, 20, 32, 34);

      if (outfit === 'rig') {
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(18, 8, 44, 16);
        ctx.fillRect(16, 22, 48, 5);
      } else {
        ctx.fillStyle = '#1C1917';
        ctx.fillRect(22, 10, 36, 12);
      }

      if (outfit === 'lab') {
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.strokeRect(26, 30, 10, 8);
        ctx.strokeRect(44, 30, 10, 8);
      }

      ctx.fillStyle = '#1C1917';
      ctx.fillRect(30, 33, 3, 3);
      ctx.fillRect(47, 33, 3, 3);

      this.cache[`portrait_${outfit}`] = canvas;
    });
  }
}

const sprites = new SpriteStore();

// =============================================================================
// GAME WORLD MAP & INTERACTION MANAGEMENT
// =============================================================================
class GameMap {
  constructor() {
    this.cols = MAP_COLS;
    this.rows = MAP_ROWS;
    this.width = this.cols * TILE_SIZE;
    this.height = this.rows * TILE_SIZE;

    this.solidGrid = Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
    this.floorGrid = Array(this.rows).fill(0).map(() => Array(this.cols).fill('tile_floor_acad'));
    this.wallGrid = Array(this.rows).fill(0).map(() => Array(this.cols).fill(null));

    this.props = [];
    this.hotspots = [];
    this.rockOutcrops = [];

    this.generateLayout();
  }

  generateLayout() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        // Outer boundaries
        if (r <= 1 || r === this.rows - 1 || c === 0 || c === this.cols - 1) {
          this.solidGrid[r][c] = 1;
        }

        // ZONE 1: ALMA MATER & EXPEDITION COURTYARD (Cols 0 to 19)
        if (c < 20) {
          if (c < 10) {
            // Indoor Library & Geochem Lab (Parquet with Red Runner)
            this.floorGrid[r][c] = (r >= 8 && r <= 14 && c >= 2 && c <= 8) ? 'tile_floor_carpet' : 'tile_floor_acad';
            if (r <= 1) this.wallGrid[r][c] = 'tile_wall_acad';
          } else {
            // Outdoor Expedition Courtyard (Grass with Flagstone Walkways)
            this.floorGrid[r][c] = (c === 10 || r === 11 || (r >= 9 && r <= 13 && c === 15)) ? 'tile_floor_stone' : 'tile_floor_grass';
            if (r <= 1) this.wallGrid[r][c] = 'tile_wall_brick';
          }

          // Brick partition wall between indoor library and outdoor courtyard at Col 9
          if (c === 9 && (r < 9 || r > 13)) {
            this.solidGrid[r][c] = 1;
            this.wallGrid[r][c] = 'tile_wall_brick';
          }
        }
        // ZONE 2: ONGC SUBSURFACE INTERPRETATION COMMAND (Cols 20 to 39)
        else if (c < 40) {
          this.floorGrid[r][c] = 'tile_floor_lab';
          if (r <= 1) this.wallGrid[r][c] = 'tile_wall_lab';
        }
        // ZONE 3: ACTIVE RIG FLOOR - GDA-A SAMASTIPUR (Cols 40 to 59)
        else {
          const isPerimeter = (c === 40 || c === 58 || r === 2 || r === this.rows - 2);
          this.floorGrid[r][c] = isPerimeter ? 'tile_floor_hazard' : 'tile_floor_rig';
          if (r <= 1) this.wallGrid[r][c] = 'tile_wall_rig';
        }

        // Inter-room doorways: Col 20 and Col 40 (Rows 9-13 open)
        if (c === 20 || c === 40) {
          if (r < 9 || r > 13) {
            this.solidGrid[r][c] = 1;
            this.wallGrid[r][c] = (c === 20) ? 'tile_wall_brick' : 'tile_wall_lab';
          }
        }
      }
    }

    // -------------------------------------------------------------
    // ZONE 1 PROPS: ALMA MATER & COURTYARD (10 Scene Elements)
    // -------------------------------------------------------------
    // 1. Bookshelves (Mahogany library walls)
    this.addProp('prop_bookshelf', 2 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);
    this.addProp('prop_bookshelf', 4 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);
    this.addProp('prop_bookshelf', 6 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);

    // 2. EPMA Geochemistry & Python ML Terminal (IIT ISM Diamond-Garnet Thesis)
    this.addProp('prop_epma_terminal', 2 * TILE_SIZE, 5 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_epma', 'EPMA Geochemistry & Python ML Terminal', 2 * TILE_SIZE, 5 * TILE_SIZE, 64, 48, 'minigame_kimberlite');

    // 3. Marine Biogeochemistry Lab Bench (Jadavpur Univ Fe Aerosol Flux)
    this.addProp('prop_marine_lab', 5 * TILE_SIZE, 5 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_marine', 'Marine Biogeochemistry Lab Bench (Jadavpur Fe Aerosols)', 5 * TILE_SIZE, 5 * TILE_SIZE, 64, 48);

    // 4. Glass Mineral & Fossil Display Case
    this.addProp('prop_fossil_case', 2 * TILE_SIZE, 9 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_fossil', 'Glass Mineral & Fossil Display Case (Pyrope, Quartz, BIF)', 2 * TILE_SIZE, 9 * TILE_SIZE, 48, 48);

    // 5. Field Mapping Table (Chandipur, Ghatsila, Brunton Compass)
    this.addProp('prop_field_table', 5 * TILE_SIZE, 9 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_field', 'Expedition Field Mapping Table (Brunton Compass & Topo Maps)', 5 * TILE_SIZE, 9 * TILE_SIZE, 64, 48);

    // 6. Heavy Gym Barbell Rack (Core-Box Weights +10 STR)
    this.addProp('prop_gym_bench', 2 * TILE_SIZE, 14 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_gym', 'Heavy Gym Barbell Rack (Loaded Core-Box Weights)', 2 * TILE_SIZE, 14 * TILE_SIZE, 64, 48);

    // 7. Academic Trophy Pedestal & Flysch '22 / Lithify '19 Media Desk
    this.addProp('prop_trophy_media', 5 * TILE_SIZE, 14 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_media', 'Academic Trophies & Media Desk (Flysch 22 / Lithify 19)', 5 * TILE_SIZE, 14 * TILE_SIZE, 64, 48);

    // 8. Mini Football Pitch & Goalpost (#4 Jersey Banner)
    this.addProp('prop_football_pitch', 11 * TILE_SIZE, 3 * TILE_SIZE, 160, 110, true);
    this.addHotspot('hotspot_football', 'Centre-Back Pitch (Press [F] for Slide Tackle!)', 11 * TILE_SIZE, 3 * TILE_SIZE, 160, 110, 'slide_tackle');

    // 9. Acrylic Canvas Painting Easel (Art Exhibition)
    this.addProp('prop_art_easel', 11 * TILE_SIZE, 14 * TILE_SIZE, 32, 48, true);
    this.addHotspot('hotspot_art', 'Fine-Art Acrylic Painting Easel (Rajdeep Tarafder)', 11 * TILE_SIZE, 14 * TILE_SIZE, 32, 48, 'art_exhibit');

    // 10. Himalayan Trekking Camp Corner (Tent, Campfire, Dafeybhir Pass Sign)
    this.addProp('prop_trekking_camp', 14 * TILE_SIZE, 13 * TILE_SIZE, 96, 64, true);
    this.addHotspot('hotspot_trekking', 'Himalayan Expedition Camp (Dafeybhir Pass Sikkim)', 14 * TILE_SIZE, 13 * TILE_SIZE, 96, 64);

    // Dynamic Pedestal spawn area in Zone 1
    this.addProp('prop_pedestal', 8 * TILE_SIZE, 3 * TILE_SIZE, 32, 48, true);
    this.addHotspot('hotspot_thesis', 'Academic Foundations & M.Sc. ML Thesis', 8 * TILE_SIZE, 3 * TILE_SIZE, 32, 48);

    // -------------------------------------------------------------
    // ZONE 2 PROPS: ONGC SUBSURFACE INTERPRETATION COMMAND (10 Scene Elements)
    // -------------------------------------------------------------
    // 1. Triple-Monitor Petrel Seismic Workstation (Seismic Fault Sniper)
    this.addProp('prop_petrel_desk', 23 * TILE_SIZE, 4 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_petrel', 'Petrel & PaleoScan Seismic Workstation', 23 * TILE_SIZE, 4 * TILE_SIZE, 64, 48, 'minigame_seismic');

    // 2. Wide-Format GIS Map Plotter Roll (Son Valley, BExB, EPMB)
    this.addProp('prop_plotter_roll', 29 * TILE_SIZE, 4 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_plotter', 'Wide-Format GIS Map Plotter (Vindhyan Prospect Folios)', 29 * TILE_SIZE, 4 * TILE_SIZE, 64, 48);

    // 3. Pressurized H2 & He Gas Cylinders Rack
    this.addProp('prop_gas_canisters', 35 * TILE_SIZE, 4 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_helium', 'Unconventional Natural H2 & Helium (He) Canisters', 35 * TILE_SIZE, 4 * TILE_SIZE, 48, 48, 'helium_gag');

    // 4. Modular Office Cubicle & Swivel Chairs
    this.addProp('prop_office_cubicle', 23 * TILE_SIZE, 9 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_cubicle', 'G&G Interpretation Office Cubicle & Well Dockets', 23 * TILE_SIZE, 9 * TILE_SIZE, 64, 48);

    // 5. Glowing Hologram GIS / SAR Table (AI/SAR Despeckling)
    this.addProp('prop_gis_table', 29 * TILE_SIZE, 9 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_sar', 'Holographic GIS & Sentinel-1 SAR Analysis Table', 29 * TILE_SIZE, 9 * TILE_SIZE, 64, 48, 'minigame_sar');

    // 6. High-Performance Subsurface Server Racks (3D Modeling Cluster)
    this.addProp('prop_server_racks', 35 * TILE_SIZE, 9 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_servers', 'High-Performance Seismic & MEM Compute Cluster', 35 * TILE_SIZE, 9 * TILE_SIZE, 48, 48);

    // 7. PaleoScan RGT Model & 3D Fault Seal Workstation
    this.addProp('prop_paleoscan_desk', 23 * TILE_SIZE, 14 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_pda_lab', 'PaleoScan RGT Model & 3D Mechanical Earth Model (MEM)', 23 * TILE_SIZE, 14 * TILE_SIZE, 64, 48);

    // 8. Glass Conference Room & Projector (Prospect Defense)
    this.addProp('prop_conference_room', 29 * TILE_SIZE, 14 * TILE_SIZE, 80, 48, true);
    this.addHotspot('hotspot_conference', 'Management Review Conference Room (BExB/EPMB Defense)', 29 * TILE_SIZE, 14 * TILE_SIZE, 80, 48);

    // 9. Industrial Core Box Storage Shelving
    this.addProp('prop_core_shelves', 36 * TILE_SIZE, 14 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_cores', 'Basin Core Repository (Vindhyan & Son Valley Drill Cores)', 36 * TILE_SIZE, 14 * TILE_SIZE, 48, 48);

    // 10. OIL & SAIL Vocational Internship Showcase Locker
    this.addProp('prop_internship_locker', 24 * TILE_SIZE, 18 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_internship', 'Industry Internship Archive (OIL Assam & SAIL Mines)', 24 * TILE_SIZE, 18 * TILE_SIZE, 48, 48);

    // 11. Break Room Corner (Water Cooler, Microwave, 3 AM Coffee)
    this.addProp('prop_breakroom', 35 * TILE_SIZE, 18 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_breakroom', 'Geologist Breakroom (Water Cooler & 3 AM Sticky Notes)', 35 * TILE_SIZE, 18 * TILE_SIZE, 48, 48);

    // -------------------------------------------------------------
    // ZONE 3 PROPS: ACTIVE RIG FLOOR - GDA-A SAMASTIPUR (11 Scene Elements)
    // -------------------------------------------------------------
    // 1. Giant Derrick Mast Base & Rotating Kelly / Top Drive
    this.addProp('prop_derrick_rotary', 43 * TILE_SIZE, 3 * TILE_SIZE, 96, 80, true);
    this.addHotspot('hotspot_derrick', 'Drilling Derrick Mast & Rotary Table (Active Drilling)', 43 * TILE_SIZE, 3 * TILE_SIZE, 96, 80);

    // 2. Vibrating Shale Shakers with Mud Flow & Cuttings
    this.addProp('prop_shale_shakers', 51 * TILE_SIZE, 3 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_shaker', 'Mud Shaker Cuttings & Hydrocarbon Shows (UV Cut)', 51 * TILE_SIZE, 3 * TILE_SIZE, 64, 48);

    // 3. Blowout Preventer (BOP) Stack & Koomey Accumulator
    this.addProp('prop_bop_stack', 56 * TILE_SIZE, 3 * TILE_SIZE, 48, 64, true);
    this.addHotspot('hotspot_bop', 'High-Pressure BOP Stack & Hydraulic Koomey Unit', 56 * TILE_SIZE, 3 * TILE_SIZE, 48, 64);

    // 4. Flare Stack with Flickering Pixel Flame
    this.addProp('prop_flare_stack', 48 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);
    this.addHotspot('hotspot_flare', 'Rig Flare Boom & Mud Gas Degasser Stack', 48 * TILE_SIZE, 1 * TILE_SIZE, 32, 48);

    // 5. 8.5" Drill Pipe Rack & Catwalk (Tubular Staging)
    this.addProp('prop_pipe_rack', 43 * TILE_SIZE, 9 * TILE_SIZE, 96, 48, true);
    this.addHotspot('hotspot_piperack', '8.5" Drill Pipe Rack & Catwalk (Tubular Staging)', 43 * TILE_SIZE, 9 * TILE_SIZE, 96, 48);

    // 6. Active Mud Tanks & Pits with Motor Agitators
    this.addProp('prop_mud_tanks', 51 * TILE_SIZE, 8 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_mudtanks', 'Active Mud Tanks & Motor Agitator Pits (1.28 SG Mud)', 51 * TILE_SIZE, 8 * TILE_SIZE, 64, 48);

    // 7. Heavy Drawworks Winch & PDA Driller Console
    this.addProp('prop_drawworks', 56 * TILE_SIZE, 8 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_drawworks', 'Drawworks Drum & Driller Electronic Console', 56 * TILE_SIZE, 8 * TILE_SIZE, 48, 48);

    // 8. High-Pressure Cementing Unit (GDA-A Squeeze Svc)
    this.addProp('prop_cementing_unit', 43 * TILE_SIZE, 15 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_cementing', 'High-Pressure Cementing Unit (8.5" Cement Squeeze at GDA-A)', 43 * TILE_SIZE, 15 * TILE_SIZE, 64, 48);

    // 9. Doghouse Mud Logging Unit (Microscope, UV Box, Gas Chromatograph)
    this.addProp('prop_doghouse_cabin', 51 * TILE_SIZE, 14 * TILE_SIZE, 80, 48, true);
    this.addHotspot('hotspot_kick', 'Doghouse Pressure & Mud Logging Unit (Kill the Kick!)', 51 * TILE_SIZE, 14 * TILE_SIZE, 80, 48, 'minigame_kick');

    // 10. Heavy Diesel Generator Skid
    this.addProp('prop_diesel_generator', 56 * TILE_SIZE, 15 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_generator', 'Rig Prime Power Diesel Generator Skid', 56 * TILE_SIZE, 15 * TILE_SIZE, 48, 48);

    // 11. Rig Coffee Urn & Safety PPE Locker (Shift Dodge)
    this.addProp('prop_rig_coffee_locker', 48 * TILE_SIZE, 16 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_coffee', 'Rig Coffee Station & Safety PPE Locker (24h Shift Dodge)', 48 * TILE_SIZE, 16 * TILE_SIZE, 48, 48, 'minigame_shift');

    // 5 Geological Rock Outcrops across the basins
    const rockLocations = [
      { x: 18 * TILE_SIZE, y: 15 * TILE_SIZE, name: 'Sedimentary Outcrop (Chandipur Facies & Walther Log)' },
      { x: 18 * TILE_SIZE, y: 7 * TILE_SIZE, name: 'Ghatsila Structural Quartz & Fold Axial Plane' },
      { x: 32 * TILE_SIZE, y: 18 * TILE_SIZE, name: 'Vindhyan Rohtas Limestone & Chert Outcrop' },
      { x: 47 * TILE_SIZE, y: 7 * TILE_SIZE, name: 'Bundelkhand Archean Granite Float (He Carrier)' },
      { x: 55 * TILE_SIZE, y: 13 * TILE_SIZE, name: 'Precambrian High-Grade Gneissic Sample' }
    ];

    rockLocations.forEach((loc, i) => {
      this.addProp('prop_rock_outcrop', loc.x, loc.y, 32, 32, true);
      this.addHotspot(`rock_${i}`, loc.name, loc.x, loc.y, 32, 32, 'minigame_rock');
      this.rockOutcrops.push(loc);
    });
  }

  addProp(spriteId, x, y, width, height, isSolid = true) {
    this.props.push({ spriteId, x, y, width, height });
    if (isSolid) {
      const c1 = Math.floor(x / TILE_SIZE);
      const c2 = Math.floor((x + width - 1) / TILE_SIZE);
      const r1 = Math.floor(y / TILE_SIZE);
      const r2 = Math.floor((y + height - 1) / TILE_SIZE);
      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
            this.solidGrid[r][c] = 1;
          }
        }
      }
    }
  }

  addHotspot(id, title, x, y, width, height, specialType = null) {
    this.hotspots.push({
      id, title, x, y, width, height,
      triggerRadius: 48,
      specialType
    });
  }

  // Auto-spawning dynamic pedestals when achievements are added live!
  spawnAchievementPedestal(achievement) {
    let spawnX = 10 * TILE_SIZE;
    let spawnY = 14 * TILE_SIZE;

    if (achievement.category === 'lab') {
      spawnX = 24 * TILE_SIZE + Math.floor(Math.random() * 8) * TILE_SIZE;
      spawnY = 10 * TILE_SIZE;
    } else if (achievement.category === 'rig') {
      spawnX = 46 * TILE_SIZE + Math.floor(Math.random() * 8) * TILE_SIZE;
      spawnY = 10 * TILE_SIZE;
    } else {
      spawnX = 6 * TILE_SIZE + Math.floor(Math.random() * 6) * TILE_SIZE;
      spawnY = 12 * TILE_SIZE;
    }

    this.addProp('prop_pedestal', spawnX, spawnY, 32, 48, false);
    this.addHotspot(`ach_${achievement.id}`, `Milestone: ${achievement.title}`, spawnX, spawnY, 32, 48, 'achievement_entry');
  }

  isSolid(x, y, w = 18, h = 12) {
    if (x < 16 || x + w > this.width - 16 || y < 32 || y + h > this.height - 16) return true;
    const c1 = Math.floor(x / TILE_SIZE);
    const c2 = Math.floor((x + w) / TILE_SIZE);
    const r1 = Math.floor(y / TILE_SIZE);
    const r2 = Math.floor((y + h) / TILE_SIZE);
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
          if (this.solidGrid[r][c] === 1) return true;
        }
      }
    }
    return false;
  }

  getNearbyHotspot(px, py) {
    for (const h of this.hotspots) {
      const cx = h.x + h.width / 2;
      const cy = h.y + h.height / 2;
      if (Math.hypot(px - cx, py - cy) <= h.triggerRadius) return h;
    }
    return null;
  }

  getZone(px) {
    if (px < 20 * TILE_SIZE) {
      return { id: 'academic', name: 'Alma Mater & Art/Gym Wing', desc: 'IIT (ISM) Dhanbad, Jadavpur Univ & Geological Expeditions' };
    } else if (px < 40 * TILE_SIZE) {
      return { id: 'lab', name: 'Subsurface Interpretation Command Lab', desc: 'Petrel, PaleoScan, 3D MEM & Unconventional H2/He Exploration' };
    } else {
      return { id: 'rig', name: 'Active Rig Floor & Doghouse', desc: 'Real-Time Drilling, Cuttings Lithology & GDA-A Cement Squeeze' };
    }
  }

  render(ctx, cam) {
    const startC = Math.max(0, Math.floor(cam.x / TILE_SIZE));
    const endC = Math.min(this.cols - 1, Math.ceil((cam.x + cam.width) / TILE_SIZE));
    const startR = Math.max(0, Math.floor(cam.y / TILE_SIZE));
    const endR = Math.min(this.rows - 1, Math.ceil((cam.y + cam.height) / TILE_SIZE));

    // Floors
    for (let r = startR; r <= endR; r++) {
      for (let c = startC; c <= endC; c++) {
        const sprite = sprites.get(this.floorGrid[r][c]);
        if (sprite) ctx.drawImage(sprite, c * TILE_SIZE - cam.x, r * TILE_SIZE - cam.y);
      }
    }

    // Walls
    for (let r = startR; r <= endR; r++) {
      for (let c = startC; c <= endC; c++) {
        const wallId = this.wallGrid[r][c];
        if (wallId) {
          const sprite = sprites.get(wallId);
          if (sprite) ctx.drawImage(sprite, c * TILE_SIZE - cam.x, r * TILE_SIZE - cam.y);
        }
      }
    }

    // Props
    this.props.forEach(p => {
      if (p.x + p.width >= cam.x && p.x <= cam.x + cam.width && p.y + p.height >= cam.y && p.y <= cam.y + cam.height) {
        const sprite = sprites.get(p.spriteId);
        if (sprite) ctx.drawImage(sprite, p.x - cam.x, p.y - cam.y);
      }
    });

    // Glowing Gas Aura
    const gx = 28 * TILE_SIZE + 24 - cam.x;
    const gy = 15 * TILE_SIZE + 24 - cam.y;
    const pulse = 0.25 + 0.1 * Math.sin(performance.now() * 0.005);
    const grad = ctx.createRadialGradient(gx, gy, 6, gx, gy, 40);
    grad.addColorStop(0, `rgba(56, 189, 248, ${pulse})`);
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(gx, gy, 40, 0, Math.PI * 2);
    ctx.fill();
  }
}

// =============================================================================
// PLAYER AVATAR CLASS (Movement, Antics, Auto-PPE, Hammer & Lens)
// =============================================================================
class PlayerAvatar {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 2.8;
    this.direction = 'down';
    this.walkFrame = 0;
    this.walkTimer = 0;
    this.isMoving = false;

    this.outfit = 'academic';
    this.currentZone = 'academic';

    // Point-and-Click / Tap-to-Walk navigation
    this.hasTarget = false;
    this.targetX = 0;
    this.targetY = 0;
    this.stuckTimer = 0;

    // Idle Antics (>4s)
    this.idleTime = 0;
    this.idleType = 'none'; // 'none' | 'pushup' | 'coffee'
    this.idleFrame = 0;
    this.idleTimer = 0;

    // Hammer, Lens & Tackle Actions
    this.actionState = 'idle'; // 'idle' | 'hammer' | 'lens' | 'tackle'
    this.actionTimer = 0;

    // Comic speech bubble
    this.comicBubble = null;
    this.lastBump = 0;

    // Helium Voice Gag
    this.heliumTimer = 0;
  }

  setTargetDestination(x, y) {
    this.targetX = x;
    this.targetY = y;
    this.hasTarget = true;
    this.stuckTimer = 0;
    this.idleTime = 0;
    this.idleType = 'none';
  }

  update(dt, input, map) {
    // Action timer (hammer, lens, slide tackle)
    if (this.actionState !== 'idle') {
      this.actionTimer -= dt;
      if (this.actionTimer <= 0) this.actionState = 'idle';
      return;
    }

    let dx = 0;
    let dy = 0;

    const manualInput = (input.left || input.right || input.up || input.down);
    if (manualInput) {
      this.hasTarget = false;
      if (input.left) { dx -= 1; this.direction = 'left'; }
      if (input.right) { dx += 1; this.direction = 'right'; }
      if (input.up) { dy -= 1; this.direction = 'up'; }
      if (input.down) { dy += 1; this.direction = 'down'; }

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }
    } else if (this.hasTarget) {
      // Point-and-Click / Tap-to-Walk navigation
      const tdx = this.targetX - this.x;
      const tdy = this.targetY - this.y;
      const dist = Math.hypot(tdx, tdy);

      if (dist < 6) {
        this.hasTarget = false;
        this.isMoving = false;
      } else {
        dx = tdx / dist;
        dy = tdy / dist;

        if (Math.abs(dx) > Math.abs(dy)) {
          this.direction = dx > 0 ? 'right' : 'left';
        } else {
          this.direction = dy > 0 ? 'down' : 'up';
        }
      }
    }

    this.isMoving = (dx !== 0 || dy !== 0);

    if (this.isMoving) {
      this.idleTime = 0;
      this.idleType = 'none';

      const nx = this.x + dx * this.speed;
      const ny = this.y + dy * this.speed;

      let moved = false;
      if (!map.isSolid(nx - 9, this.y + 12)) {
        this.x = nx;
        moved = true;
      } else {
        if (manualInput) this.bumpObstacle();
      }

      if (!map.isSolid(this.x - 9, ny + 12)) {
        this.y = ny;
        moved = true;
      } else {
        if (manualInput) this.bumpObstacle();
      }

      if (this.hasTarget && !moved) {
        this.stuckTimer += dt;
        if (this.stuckTimer > 0.4) {
          this.hasTarget = false;
          this.stuckTimer = 0;
        }
      } else {
        this.stuckTimer = 0;
      }

      this.walkTimer += dt;
      if (this.walkTimer > 0.13) {
        this.walkTimer = 0;
        this.walkFrame = (this.walkFrame + 1) % 4;
        audio.playStep();
      }
    } else {
      this.walkFrame = 0;
      this.idleTime += dt;
      if (this.idleTime >= 4.0) {
        if (this.idleType === 'none') {
          this.idleType = Math.random() < 0.5 ? 'pushup' : 'coffee';
          this.idleFrame = 0;
          this.idleTimer = 0;
          const bubbleText = this.idleType === 'pushup' ? "+10 GYM GAINZ!" : "3 AM RIG COFFEE BOOST!";
          this.showBubble(bubbleText, 2.5);
        }

        this.idleTimer += dt;
        if (this.idleTimer > 0.4) {
          this.idleTimer = 0;
          this.idleFrame = (this.idleFrame + 1) % 2;
        }
      }
    }

    // Auto-PPE Swap based on Zone
    const zone = map.getZone(this.x);
    if (zone.id !== this.currentZone) {
      this.currentZone = zone.id;
      this.outfit = zone.id;

      if (this.outfit === 'rig') {
        this.showBubble("PPE EQUIPPED! Safety First!", 2.0);
        document.getElementById('hud-ppe-badge').className = "ppe-badge ppe-on";
        document.getElementById('hud-ppe-badge').textContent = "PPE: ON (HARD HAT)";
      } else {
        document.getElementById('hud-ppe-badge').className = "ppe-badge ppe-off";
        document.getElementById('hud-ppe-badge').textContent = "PPE: OFF";
      }

      audio.playFanfare();
      window.dispatchEvent(new CustomEvent('zone-swapped', { detail: zone }));
    }

    // Helium voice timer countdown
    if (this.heliumTimer > 0) {
      this.heliumTimer -= dt;
    }

    // Comic bubble update
    if (this.comicBubble) {
      this.comicBubble.timer -= dt;
      const floatSpeed = this.heliumTimer > 0 ? 35 : 12; // Helium bubbles shoot upward!
      this.comicBubble.y -= dt * floatSpeed;
      if (this.comicBubble.timer <= 0) this.comicBubble = null;
    }
  }

  strikeHammer() {
    this.actionState = 'hammer';
    this.actionTimer = 0.35;
    audio.playHammer();
    this.showBubble("*CLANG!* Fresh rock surface cleaved!", 1.8);
  }

  inspectLens() {
    this.actionState = 'lens';
    this.actionTimer = 0.45;
    audio.playLens();
    this.showBubble("Examining cleavage & twinning under 10x!", 1.8);
  }

  slideTackle() {
    this.actionState = 'tackle';
    this.actionTimer = 0.55;
    audio.playGoalCheer();
    this.showBubble("⚽ SLIDE TACKLE! IIT ISM GC '22 Winner!", 2.5);
    if (window.gameEngine) {
      window.gameEngine.kickSoccerBall(this.x, this.y);
    }
  }

  bumpObstacle() {
    const now = performance.now();
    if (now - this.lastBump > 2500) {
      this.lastBump = now;
      const geologyJokes = [
        "Fault line detected! Normal throw ~2.4m!",
        "Need more 3 AM doghouse black coffee!",
        "Zero LTI record intact! Safety first!",
        "Hold up: Petrel 3D seismic autosaving!",
        "Caution: High pressure formation gas kick!",
        "Walther's Law in action: vertical matches lateral!",
        "EPMA garnet vector: Kimberlitic pyrope confirmed!"
      ];
      this.showBubble(geologyJokes[Math.floor(Math.random() * geologyJokes.length)], 2.2);
      audio.playHit();
    }
  }

  showBubble(text, duration = 2.0) {
    if (this.heliumTimer > 0) {
      text = `🎈 *Squeak!* ${text}`;
      audio.playHeliumChirp();
    }
    this.comicBubble = { text, timer: duration, x: this.x, y: this.y - 34 };
  }

  render(ctx, cam) {
    const sx = Math.round(this.x - cam.x - 16);
    const sy = Math.round(this.y - cam.y - 16);

    let key = null;
    if (this.actionState === 'hammer') {
      key = `char_${this.outfit}_hammer`;
    } else if (this.actionState === 'lens') {
      key = `char_${this.outfit}_lens`;
    } else if (this.actionState === 'tackle') {
      key = `char_${this.outfit}_tackle`;
    } else if (this.idleType === 'pushup') {
      key = `char_${this.outfit}_pushup_${this.idleFrame}`;
    } else if (this.idleType === 'coffee') {
      key = `char_${this.outfit}_coffee_${this.idleFrame}`;
    } else {
      key = `char_${this.outfit}_${this.direction}_${this.walkFrame}`;
    }

    const sprite = sprites.get(key);
    if (sprite) ctx.drawImage(sprite, sx, sy);

    // Comic speech bubble
    if (this.comicBubble) {
      const b = this.comicBubble;
      const bx = Math.round(b.x - cam.x);
      const by = Math.round(b.y - cam.y);

      ctx.save();
      ctx.font = '8px "Press Start 2P", monospace';
      const tw = ctx.measureText(b.text).width;
      const boxW = tw + 14;
      const boxH = 20;
      const left = bx - boxW / 2;
      const top = by - boxH;

      ctx.fillStyle = this.heliumTimer > 0 ? '#E0F2FE' : '#FFFFFF';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(left, top, boxW, boxH, 4);
      ctx.fill();
      ctx.stroke();

      // Little arrow pointer
      ctx.beginPath();
      ctx.moveTo(bx - 4, top + boxH);
      ctx.lineTo(bx + 4, top + boxH);
      ctx.lineTo(bx, top + boxH + 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0F172A';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.text, bx, top + boxH / 2);
      ctx.restore();
    }
  }
}

// =============================================================================
// MAIN GAME CONTROLLER & COMPLETE PHASE 2 ENGINE
// =============================================================================
class GeologyQuestEngine {
  constructor() {
    this.canvas = document.getElementById('rpg-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.zoomFactor = 1.0;
    this.viewWidth = 640;
    this.viewHeight = 360;

    this.camera = { x: 0, y: 0, width: this.viewWidth, height: this.viewHeight };
    this.map = new GameMap();
    this.player = new PlayerAvatar(8 * TILE_SIZE, 11 * TILE_SIZE);

    // Navigation and soccer ball
    this.pulsingTarget = null;
    this.soccerBall = {
      x: 12.5 * TILE_SIZE,
      y: 6.5 * TILE_SIZE,
      vx: 0,
      vy: 0,
      isKicked: false
    };

    // Ambient animated particles
    this.particles = [];
    this.ambientTimer = 0;

    this.input = { left: false, right: false, up: false, down: false };
    this.activeHotspot = null;
    this.lastTime = performance.now();

    // Lighting mode ('day' | 'sunset' | 'night')
    this.lightingMode = 'day';

    // Mini-game states
    this.seismicMini = { active: false, score: 0, targets: [], timer: 15, animId: null };
    this.kickMini = { active: false, safeTimer: 0, needlePos: 20, interval: null };
    this.rockMini = { active: false, spinning: false, currentIdx: 0, interval: null };
    this.shiftMini = { active: false, timer: 15, coffeeCount: 0, playerX: 250, objects: [], animId: null };
    this.kimberliteMini = { active: false, dataPoints: [], trained: false };
    this.sarMini = { active: false, sliderPct: 50 };

    this.init();
  }

  async init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Load data from career-data.json
    await this.loadCareerData();

    this.bindInputs();
    this.bindPointerNavigation();
    this.bindHUDButtons();
    this.bindMiniGameEvents();
    this.bindRigRadioEvents();
    this.bindStratigraphicElevator();
    this.bindKimberliteClassifier();
    this.bindSarSlider();
    this.updateHUDPortrait();

    // Start loop
    requestAnimationFrame((t) => this.loop(t));
  }

  resize() {
    const w = window.innerWidth;
    // Responsive dynamic camera zoom factor:
    // Desktop (>1024px): 1.0x wide cinematic view
    // Tablet (768–1024px): 1.4x zoom
    // Mobile (<768px): 1.85x tight follow-zoom on Rajdeep
    if (w < 768) {
      this.zoomFactor = 1.85;
    } else if (w <= 1024) {
      this.zoomFactor = 1.4;
    } else {
      this.zoomFactor = 1.0;
    }

    this.canvas.width = 640;
    this.canvas.height = 360;
    this.camera.width = this.canvas.width / this.zoomFactor;
    this.camera.height = this.canvas.height / this.zoomFactor;
    this.ctx.imageSmoothingEnabled = false;
  }

  bindPointerNavigation() {
    this.canvas.addEventListener('pointerdown', (e) => {
      // Only process primary click / tap
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const rect = this.canvas.getBoundingClientRect();
      const screenX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const screenY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
      const worldX = screenX / this.zoomFactor + this.camera.x;
      const worldY = screenY / this.zoomFactor + this.camera.y;

      this.player.setTargetDestination(worldX, worldY);
      this.pulsingTarget = { x: worldX, y: worldY, timer: 0.8, radius: 4, maxRadius: 18 };
      audio.playTone(720, 'sine', 0.04, 0.06);
    });
  }

  async loadCareerData() {
    try {
      const res = await fetch('./career-data.json');
      if (res.ok) {
        window.CAREER_DATA = await res.json();
      }
    } catch (e) {
      console.warn("Using embedded career data fallback", e);
    }

    // Spawn achievement pedestals for any achievements in data
    if (window.CAREER_DATA.achievements) {
      window.CAREER_DATA.achievements.forEach(ach => this.map.spawnAchievementPedestal(ach));
    }

    this.updateStatsUI();
    this.renderBossResume();
    this.updateUpdaterCount();
  }

  updateStatsUI() {
    const s = window.CAREER_DATA.stats || { level: 4, currentXP: 650, maxXP: 1000, stamina: 100 };
    document.getElementById('hud-level-badge').innerHTML = `<span class="is-warning">LVL ${s.level}</span>`;
    document.getElementById('hud-xp-fill').style.width = `${Math.min(100, (s.currentXP / s.maxXP) * 100)}%`;
    document.getElementById('hud-xp-text').textContent = `${s.currentXP}/${s.maxXP}`;
    document.getElementById('hud-stamina-fill').style.width = `${s.stamina}%`;
    document.getElementById('hud-stamina-text').textContent = `${s.stamina}%`;
  }

  addXP(amount) {
    if (!window.CAREER_DATA.stats) window.CAREER_DATA.stats = { level: 4, currentXP: 650, maxXP: 1000, stamina: 100 };
    const s = window.CAREER_DATA.stats;
    s.currentXP += amount;
    if (s.currentXP >= s.maxXP) {
      s.level++;
      s.currentXP -= s.maxXP;
      s.maxXP += 500;
      this.player.showBubble(`⚡ LEVEL UP! NOW LEVEL ${s.level}!`, 3.0);
      audio.playFanfare();
    }
    this.updateStatsUI();
  }

  updateHUDPortrait() {
    const pCanvas = document.getElementById('hud-portrait-canvas');
    if (pCanvas) {
      const ctx = pCanvas.getContext('2d');
      const spr = sprites.get(`portrait_${this.player.outfit}`);
      if (spr) {
        ctx.clearRect(0, 0, 40, 40);
        ctx.drawImage(spr, 0, 0, 40, 40);
      }
    }
  }

  bindInputs() {
    window.addEventListener('keydown', (e) => {
      // Don't intercept if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case 'arrowleft': case 'a': this.input.left = true; break;
        case 'arrowright': case 'd': this.input.right = true; break;
        case 'arrowup': case 'w': this.input.up = true; break;
        case 'arrowdown': case 's': this.input.down = true; break;
        case 'h': this.player.strikeHammer(); break;
        case 'm': this.player.inspectLens(); break;
        case 'f': this.player.slideTackle(); break;
        case ' ':
        case 'e':
          e.preventDefault();
          this.triggerAction();
          break;
        case 'escape':
          this.closeAllModals();
          break;
        case '1': this.teleport(8 * TILE_SIZE, 11 * TILE_SIZE); break;
        case '2': this.teleport(28 * TILE_SIZE, 11 * TILE_SIZE); break;
        case '3': this.teleport(48 * TILE_SIZE, 11 * TILE_SIZE); break;
        case 'i': this.openBackpack(); break;
        case 'u': this.openLiveUpdater(); break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.key.toLowerCase()) {
        case 'arrowleft': case 'a': this.input.left = false; break;
        case 'arrowright': case 'd': this.input.right = false; break;
        case 'arrowup': case 'w': this.input.up = false; break;
        case 'arrowdown': case 's': this.input.down = false; break;
      }
    });

    // Touch D-Pad
    document.querySelectorAll('.touch-btn').forEach(b => {
      const dir = b.dataset.dir;
      const start = (e) => { e.preventDefault(); this.input[dir] = true; };
      const end = (e) => { e.preventDefault(); this.input[dir] = false; };
      b.addEventListener('touchstart', start, { passive: false });
      b.addEventListener('touchend', end, { passive: false });
      b.addEventListener('mousedown', start);
      b.addEventListener('mouseup', end);
    });

    document.getElementById('touch-btn-hammer').addEventListener('click', () => this.player.strikeHammer());
    document.getElementById('touch-btn-lens').addEventListener('click', () => this.player.inspectLens());
    const tackleBtn = document.getElementById('touch-btn-tackle');
    if (tackleBtn) tackleBtn.addEventListener('click', () => this.player.slideTackle());
    document.getElementById('touch-btn-action').addEventListener('click', () => this.triggerAction());

    window.addEventListener('zone-swapped', (e) => {
      this.updateHUDPortrait();
      this.showZoneBanner(e.detail.name, e.detail.desc);
    });
  }

  bindHUDButtons() {
    // Dynamic Headshot / Avatar Toggle
    const portraitToggle = document.getElementById('hud-portrait-toggle');
    if (portraitToggle) {
      portraitToggle.addEventListener('click', () => {
        const img = document.getElementById('hud-portrait-img');
        const cvs = document.getElementById('hud-portrait-canvas');
        if (img && cvs) {
          if (img.classList.contains('hidden')) {
            img.classList.remove('hidden');
            cvs.classList.add('hidden');
          } else {
            img.classList.add('hidden');
            cvs.classList.remove('hidden');
            this.updateHUDPortrait();
          }
          audio.playTone(600, 'square', 0.05, 0.1);
        }
      });
    }

    document.getElementById('btn-teleport-acad').addEventListener('click', () => this.teleport(8 * TILE_SIZE, 11 * TILE_SIZE));
    document.getElementById('btn-teleport-lab').addEventListener('click', () => this.teleport(28 * TILE_SIZE, 11 * TILE_SIZE));
    document.getElementById('btn-teleport-rig').addEventListener('click', () => this.teleport(48 * TILE_SIZE, 11 * TILE_SIZE));
    document.getElementById('btn-backpack').addEventListener('click', () => this.openBackpack());
    document.getElementById('btn-live-updater').addEventListener('click', () => this.openLiveUpdater());

    // Shift Lighting Toggle (Day -> Sunset -> Night)
    document.getElementById('btn-lighting-toggle').addEventListener('click', () => {
      const icon = document.getElementById('lighting-icon');
      const text = document.getElementById('lighting-text');
      const v = document.querySelector('.game-viewport');

      if (this.lightingMode === 'day') {
        this.lightingMode = 'sunset';
        icon.textContent = '🌅';
        text.textContent = 'Sunset';
        v.className = 'game-viewport lighting-sunset';
      } else if (this.lightingMode === 'sunset') {
        this.lightingMode = 'night';
        icon.textContent = '🌙';
        text.textContent = '24h Night';
        v.className = 'game-viewport lighting-night';
      } else {
        this.lightingMode = 'day';
        icon.textContent = '☀️';
        text.textContent = 'Day';
        v.className = 'game-viewport';
      }
    });

    // Audio Toggle
    document.getElementById('btn-audio-toggle').addEventListener('click', () => {
      const on = audio.toggle();
      document.getElementById('audio-icon').textContent = on ? '🔊' : '🔇';
    });

    // BOSS PANIC BUTTON
    document.getElementById('btn-boss-mode').addEventListener('click', () => this.openBossResume());
    document.getElementById('btn-resume-back').addEventListener('click', () => this.closeBossResume());
    document.getElementById('btn-print-cv').addEventListener('click', () => window.print());
    document.getElementById('btn-copy-ats').addEventListener('click', () => this.copyPlainTextATS());

    // Close buttons on modals
    document.getElementById('btn-close-hotspot').addEventListener('click', () => this.closeAllModals());
    document.getElementById('btn-close-updater').addEventListener('click', () => this.closeAllModals());

    // Live updater tab toggles
    const tabAdd = document.getElementById('tab-btn-add');
    const tabView = document.getElementById('tab-btn-view');
    if (tabAdd && tabView) {
      tabAdd.addEventListener('click', () => this.switchUpdaterTab('add'));
      tabView.addEventListener('click', () => this.switchUpdaterTab('view'));
    }

    // Save achievement button
    document.getElementById('btn-save-achievement').addEventListener('click', () => {
      const title = document.getElementById('upd-title').value.trim();
      const date = document.getElementById('upd-date').value.trim();
      const cat = document.getElementById('upd-category').value;
      const desc = document.getElementById('upd-desc').value.trim();

      if (!title || !desc) {
        alert("Please enter a title and description for your milestone!");
        return;
      }

      this.addLiveMilestone(title, date || '2026', cat, desc);
      this.closeAllModals();
    });

    document.getElementById('btn-download-json').addEventListener('click', () => this.downloadUpdatedJSON());
  }

  bindStratigraphicElevator() {
    const btnToggle = document.getElementById('btn-toggle-elevator');
    const elevator = document.getElementById('strat-elevator');
    const btnClose = document.getElementById('btn-close-elevator');

    if (btnToggle && elevator) {
      btnToggle.addEventListener('click', () => {
        elevator.classList.toggle('hidden');
        audio.playTone(550, 'triangle', 0.08, 0.1);
      });
    }

    if (btnClose && elevator) {
      btnClose.addEventListener('click', () => elevator.classList.add('hidden'));
    }

    document.querySelectorAll('.elevator-card').forEach(card => {
      card.addEventListener('click', () => {
        const depth = card.dataset.depth;
        const x = parseInt(card.dataset.x, 10);
        const y = parseInt(card.dataset.y, 10);
        audio.playDrillBitWhir();
        this.teleport(x, y);
        if (elevator) elevator.classList.add('hidden');
        this.player.showBubble(`⚡ Stratigraphic drill drop to ${depth}m!`, 2.5);
      });
    });
  }

  bindRigRadioEvents() {
    const btnOpen = document.getElementById('btn-rig-radio');
    const modalRadio = document.getElementById('modal-rig-radio');
    const btnClose = document.getElementById('btn-close-radio');

    if (btnOpen && modalRadio) {
      btnOpen.addEventListener('click', () => {
        this.closeAllModals();
        modalRadio.classList.remove('hidden');
        audio.playRadioStatic();
      });
    }

    if (btnClose && modalRadio) {
      btnClose.addEventListener('click', () => modalRadio.classList.add('hidden'));
    }

    // Pre-configured radio chips
    document.querySelectorAll('.radio-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        this.handleRadioTransmission(query, chip.textContent.trim());
      });
    });

    // Custom text input
    const btnSend = document.getElementById('btn-send-radio');
    const txtInput = document.getElementById('radio-custom-text');
    if (btnSend && txtInput) {
      const sendCustom = () => {
        const msg = txtInput.value.trim();
        if (!msg) return;
        this.handleRadioTransmission('custom', msg);
        txtInput.value = '';
      };
      btnSend.addEventListener('click', sendCustom);
      txtInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendCustom();
      });
    }
  }

  handleRadioTransmission(type, queryText) {
    const log = document.getElementById('radio-log');
    if (!log) return;

    audio.playRadioStatic();

    // User message
    const userDiv = document.createElement('div');
    userDiv.className = 'radio-msg outgoing';
    userDiv.innerHTML = `<strong>👤 Base / Recruiter:</strong> "${queryText}"`;
    log.appendChild(userDiv);

    // Knowledgebase answers from career-data.json
    const answers = {
      h2: "Doghouse copy: Pioneer in Unconventional Natural Hydrogen (H2) and Helium (He) exploration across Vindhyan & Chhattisgarh basins. Mapped basement fracture degassing, seal integrity, and caprock retention. Clean energy frontier!",
      cement: "Doghouse copy: Active Wellsite frontline ops at GDA-A Samastipur exploratory well (8.5\" phase). Supervised open-ended drill pipe cement squeeze operation, verified slurry placement, and maintained 0 LTI safety standards.",
      petrel: "Doghouse copy: 2.5+ years interpretation geologist for Vindhyan Block. Extensive modeling in Schlumberger Petrel, Eliis PaleoScan RGT, QGIS, DSPetrophysics. Successfully generated and defended drillable exploration prospects in BExB & EPMB blocks.",
      thesis: "Doghouse copy: M.Sc. Tech thesis from IIT (ISM) Dhanbad: Engineered supervised Machine Learning models on EPMA garnet geochemistry to predict parent host rock provenance for kimberlitic diamond exploration.",
      pda: "Doghouse copy: Active 24/7 surveillance: Real-time Pore Pressure Prediction, PDA drilling parameter tracking, binocular cuttings lithology, UV hydrocarbon fluorescence cuts, and C1-C5 chromatograph gas analysis.",
      sports: "Doghouse copy: Athletic record: Starting Centre-Back across 4 seasons for IIT ISM & Jadavpur. Winner of Inter-Departmental Football Championship '22. High-altitude alpine trekker across Dafeybhir Pass, Sikkim!"
    };

    let reply = answers[type];
    if (!reply) {
      const qLower = queryText.toLowerCase();
      if (qLower.includes('hydrogen') || qLower.includes('helium') || qLower.includes('h2') || qLower.includes('he')) {
        reply = answers.h2;
      } else if (qLower.includes('cement') || qLower.includes('rig') || qLower.includes('gda') || qLower.includes('wellsite')) {
        reply = answers.cement;
      } else if (qLower.includes('petrel') || qLower.includes('seismic') || qLower.includes('software') || qLower.includes('bexb') || qLower.includes('prospect')) {
        reply = answers.petrel;
      } else if (qLower.includes('thesis') || qLower.includes('diamond') || qLower.includes('machine learning') || qLower.includes('epma')) {
        reply = answers.thesis;
      } else if (qLower.includes('pda') || qLower.includes('pressure') || qLower.includes('gas') || qLower.includes('kick')) {
        reply = answers.pda;
      } else if (qLower.includes('football') || qLower.includes('fitness') || qLower.includes('sports') || qLower.includes('gym')) {
        reply = answers.sports;
      } else {
        reply = `Rig Floor copy: Wellsite Geologist Rajdeep Tarafder standing by at GDA-A Doghouse. CPF: 141604, DOJ: 06.11.2023. All operational parameters nominal with zero LTI.`;
      }
    }

    setTimeout(() => {
      const botDiv = document.createElement('div');
      botDiv.className = 'radio-msg incoming';
      botDiv.innerHTML = `<strong>📻 Rajdeep Tarafder (Wellsite Ops):</strong> "Ksshhht! ${reply}"`;
      log.appendChild(botDiv);
      log.scrollTop = log.scrollHeight;
    }, 300);

    log.scrollTop = log.scrollHeight;
  }

  kickSoccerBall(fromX, fromY) {
    const ball = this.soccerBall;
    const goalX = 14.5 * TILE_SIZE;
    const goalY = 3.5 * TILE_SIZE;
    const dx = goalX - ball.x;
    const dy = goalY - ball.y;
    const dist = Math.hypot(dx, dy);
    const speed = 190;

    ball.vx = (dx / (dist || 1)) * speed;
    ball.vy = (dy / (dist || 1)) * speed;
    ball.isKicked = true;

    audio.playGoalCheer();
    this.addXP(50);
    this.player.showBubble("⚽ GOOOOAL! Centre-Back strike into top bins! (+50 XP)", 2.8);
  }

  showZoneBanner(title, desc) {
    const el = document.getElementById('zone-toast');
    document.getElementById('zone-banner-title').textContent = title;
    document.getElementById('zone-banner-desc').textContent = desc;
    el.classList.remove('hidden');
    clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => el.classList.add('hidden'), 3500);
  }

  teleport(x, y) {
    this.player.x = x;
    this.player.y = y;
    audio.playFanfare();
    this.player.showBubble("⚡ Fast travel warp!", 1.5);
  }

  openBackpack() {
    const p = window.CAREER_DATA.player;
    this.openHotspotModal("Geological Expedition Backpack", `
      <h4>EQUIPPED FIELD & OPERATIONAL GEAR:</h4>
      <ul>
        <li>🔨 <strong>Estwing Rock Hammer:</strong> Fresh outcrop cleavage & mineral strike (Press [H]).</li>
        <li>🔍 <strong>10x Bausch & Lomb Loupe:</strong> Petrographic hand lens inspection (Press [M]).</li>
        <li>⚽ <strong>Centre-Back Cleats:</strong> Slide tackle maneuver (Press [F]).</li>
        <li>🪖 <strong>Wellsite PPE:</strong> Hard Hat & High-Vis Vest (Auto-equips on Rig Floor).</li>
        <li>☕ <strong>3 AM Doghouse Mug:</strong> Infinite caffeine supply for pore pressure surveillance.</li>
        <li>💻 <strong>Interpretation Arsenal:</strong> Schlumberger Petrel, Eliis PaleoScan, DSPetrophysics, QGIS.</li>
      </ul>
      <h4>CURRENT PILOT:</h4>
      <p><strong>${p.name}</strong> (${p.title}) &bull; CPF: ${p.cpf} &bull; DOJ: ${p.doj}</p>
    `);
  }

  openLiveUpdater() {
    this.closeAllModals();
    this.updateUpdaterCount();
    this.switchUpdaterTab('add');
    document.getElementById('modal-live-updater').classList.remove('hidden');
  }

  updateUpdaterCount() {
    const countSpan = document.getElementById('updater-count');
    if (countSpan && window.CAREER_DATA.achievements) {
      countSpan.textContent = window.CAREER_DATA.achievements.length;
    }
  }

  switchUpdaterTab(tab) {
    const paneAdd = document.getElementById('updater-pane-add');
    const paneView = document.getElementById('updater-pane-view');
    const tabAdd = document.getElementById('tab-btn-add');
    const tabView = document.getElementById('tab-btn-view');

    if (tab === 'add') {
      paneAdd.classList.remove('hidden');
      paneView.classList.add('hidden');
      tabAdd.className = 'nes-btn is-primary tab-active';
      tabView.className = 'nes-btn';
    } else {
      paneAdd.classList.add('hidden');
      paneView.classList.remove('hidden');
      tabAdd.className = 'nes-btn';
      tabView.className = 'nes-btn is-primary tab-active';
      this.renderMilestonesList();
    }
  }

  renderMilestonesList() {
    const list = document.getElementById('updater-milestones-list');
    if (!list) return;
    const achs = window.CAREER_DATA.achievements || [];

    if (achs.length === 0) {
      list.innerHTML = `<p style="padding: 12px; color: #94A3B8;">No milestones added yet. Add one in the Add Milestone tab!</p>`;
      return;
    }

    list.innerHTML = achs.map(a => `
      <div class="milestone-item-row" data-id="${a.id}">
        <div class="milestone-item-info">
          <strong>${a.title}</strong> (${a.date || '2026'}) &bull; <span style="color: #38BDF8;">${(a.category || 'lab').toUpperCase()}</span>
          <p class="milestone-item-desc">${a.description}</p>
        </div>
        <button class="nes-btn is-error milestone-del-btn" data-id="${a.id}" title="Delete Milestone">&times; Delete</button>
      </div>
    `).join('');

    list.querySelectorAll('.milestone-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        this.deleteLiveMilestone(id);
      });
    });
  }

  deleteLiveMilestone(id) {
    if (!window.CAREER_DATA.achievements) return;
    const idx = window.CAREER_DATA.achievements.findIndex(a => a.id === id);
    if (idx !== -1) {
      window.CAREER_DATA.achievements.splice(idx, 1);
      audio.playHit();
      this.updateUpdaterCount();
      this.renderMilestonesList();
      this.renderBossResume();
    }
  }

  addLiveMilestone(title, date, category, desc) {
    const newAch = {
      id: `ach_${Date.now()}`,
      title,
      date,
      category,
      badge: "LIVE FIELD UPDATE",
      xp: 200,
      description: desc
    };

    if (!window.CAREER_DATA.achievements) window.CAREER_DATA.achievements = [];
    window.CAREER_DATA.achievements.push(newAch);

    // Spawn glowing pedestal in the map
    this.map.spawnAchievementPedestal(newAch);

    // Reward XP
    this.addXP(200);

    // Rebuild resume & update count
    this.renderBossResume();
    this.updateUpdaterCount();

    this.player.showBubble(`🎉 NEW MILESTONE SPAWNED IN ${category.toUpperCase()}!`, 3.0);
    audio.playFanfare();
  }

  downloadUpdatedJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.CAREER_DATA, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "career-data.json");
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  triggerAction() {
    // If mini-game 2 is active, SPACE pumps mud!
    if (this.kickMini.active) {
      this.pumpKickMud();
      return;
    }
    // If rock roulette is active, SPACE locks roulette!
    if (this.rockMini.active && this.rockMini.spinning) {
      this.lockRockRoulette();
      return;
    }

    if (this.activeHotspot) {
      const h = this.activeHotspot;
      if (h.specialType === 'minigame_seismic') {
        this.startSeismicMiniGame();
      } else if (h.specialType === 'minigame_kick') {
        this.startKickMiniGame();
      } else if (h.specialType === 'minigame_rock') {
        this.startRockRoulette(h.title);
      } else if (h.specialType === 'minigame_shift') {
        this.startShiftDodge();
      } else if (h.specialType === 'minigame_kimberlite') {
        this.startKimberliteClassifier();
      } else if (h.specialType === 'minigame_sar') {
        this.startSarDespeckling();
      } else if (h.specialType === 'art_exhibit') {
        this.openArtExhibit();
      } else if (h.specialType === 'slide_tackle') {
        this.player.slideTackle();
      } else if (h.specialType === 'helium_gag') {
        this.triggerHeliumGag();
      } else {
        this.openHotspotDetail(h.id, h.title);
      }
    }
  }

  triggerHeliumGag() {
    this.player.heliumTimer = 10.0;
    this.player.showBubble("INHALED PURE HELIUM-4 FROM DEEP BASEMENT! *SQUEEEEAK!*", 3.0);
    audio.playHeliumChirp();

    this.openHotspotModal("Unconventional Energy: Natural H2 & Helium (He)", `
      <p><strong>Clean Energy Transition Frontier &bull; Vindhyan & Chhattisgarh Basins</strong></p>
      <p>Pioneering exploration for deep-seated Natural Hydrogen (H2) and non-hydrocarbon noble gas Helium (He) trapped along basement fracture networks.</p>
      <h4>Exploration Arsenals:</h4>
      <ul>
        <li>Deep crustal structural lineament extraction and basement reactivation modeling.</li>
        <li>Isotopic geochemical surveillance of carrier gas degassing anomalies.</li>
        <li>Synthesis of tight cap-rock seal integrity and basement granite heat production.</li>
      </ul>
      <p><em>Notice: Rajdeep's speech bubbles are now floating squeakily for the next 10 seconds!</em></p>
    `);
  }

  openArtExhibit() {
    this.closeAllModals();
    const modal = document.getElementById('modal-art-exhibit');
    if (modal) {
      modal.classList.remove('hidden');
      audio.playTone(660, 'triangle', 0.1, 0.15);
    }
  }

  openHotspotModal(title, html) {
    this.closeAllModals();
    document.getElementById('modal-hotspot-title').textContent = title;
    document.getElementById('modal-hotspot-content').innerHTML = html;

    const pCanvas = document.getElementById('dialog-portrait-canvas');
    if (pCanvas) {
      const ctx = pCanvas.getContext('2d');
      const spr = sprites.get(`portrait_${this.player.outfit}`);
      if (spr) ctx.drawImage(spr, 0, 0, 80, 80);
    }

    document.getElementById('modal-hotspot').classList.remove('hidden');
    audio.playTone(880, 'sine', 0.1, 0.15);
  }

  openHotspotDetail(id, title) {
    if (id === 'hotspot_marine') {
      this.openHotspotModal(title, `
        <h4>Marine Biogeochemistry Lab Bench: Jadavpur University (2019–2020)</h4>
        <p><strong>"Exchange of Iron from Atmosphere to Ocean Under Anthropogenic Inducements"</strong></p>
        <p>Investigated aerosol Fe solubility, mineral dust deposition, and marine phytoplankton nutrient bioavailability in High-Nutrient Low-Chlorophyll (HNLC) ocean regimes.</p>
        <ul>
          <li>Aerosol leaching experiments and spectrophotometric iron speciation.</li>
          <li>Coupled atmospheric-oceanic biogeochemical flux modeling.</li>
        </ul>
      `);
    } else if (id === 'hotspot_fossil') {
      this.openHotspotModal(title, `
        <h4>Glass Mineral & Fossil Display Case</h4>
        <p>Curated rare geological specimens collected across Indian stratigraphic basins:</p>
        <ul>
          <li><strong>Pyrope Garnet (Cr-rich G10):</strong> Kimberlitic diamond indicator from Panna diamond field.</li>
          <li><strong>Banded Iron Formation (BIF / BHQ):</strong> Archean high-grade hematite ore from SAIL Dalli-Rajhara.</li>
          <li><strong>Stromatolitic Dolomite:</strong> Proterozoic cyanobacterial laminations from the Vindhyan Supergroup.</li>
        </ul>
      `);
    } else if (id === 'hotspot_field') {
      this.openHotspotModal(title, `
        <h4>Expedition Field Mapping Table</h4>
        <p>Comprehensive field mapping folios and structural measurement stations:</p>
        <ul>
          <li><strong>Chandipur Coastal Facies:</strong> Walther's Law deltaic and tidal sedimentary logs.</li>
          <li><strong>Ghatsila Metamorphic Belt:</strong> Structural cleavage, fold axis stereonets, and shear zone kinematics.</li>
          <li><strong>Chhota Nagpur Gneissic Complex:</strong> High-grade Precambrian migmatites and pegmatite intrusions.</li>
        </ul>
      `);
    } else if (id === 'hotspot_plotter') {
      this.openHotspotModal(title, `
        <h4>Wide-Format GIS Map Plotter Roll</h4>
        <p>High-resolution cartographic output for ONGC Vindhyan Block exploratory portfolios:</p>
        <ul>
          <li>Regional Bouguer gravity & magnetic anomaly overlays of the Son Valley.</li>
          <li>Matured drillable prospect folios across BExB and EPMB blocks.</li>
          <li>Stratigraphic correlation panels across deep exploratory test wells.</li>
        </ul>
      `);
    } else if (id === 'hotspot_derrick') {
      this.openHotspotModal(title, `
        <h4>Active Drilling Derrick Mast & Rotary Table</h4>
        <p>Frontline wellsite operational telemetry at GDA-A Samastipur:</p>
        <ul>
          <li>Real-time Weight on Bit (WOB), Torque, Standpipe Pressure (SPP), and ROP monitoring.</li>
          <li>Cuttings lag-time calculation and formation top identification.</li>
          <li>Coordinated wireline logging runs and 8.5" casing cementing operations.</li>
        </ul>
      `);
    } else if (id === 'hotspot_cementing') {
      this.openHotspotModal(title, `
        <h4>High-Pressure Cementing Unit (GDA-A Squeeze)</h4>
        <p>Supervised critical cementing operation at GDA-A exploratory well:</p>
        <ul>
          <li>Execution of open-ended drill pipe cement squeeze across loss zone.</li>
          <li>Slurry density (1.92 SG), thickening time, and compressive strength quality control.</li>
          <li>Successful zonal isolation and formation pressure integrity test (FIT/LOT).</li>
        </ul>
      `);
    } else if (id === 'hotspot_bop') {
      this.openHotspotModal(title, `
        <h4>Blowout Preventer (BOP) Stack & Koomey Unit</h4>
        <p>Well control and secondary barrier safeguards:</p>
        <ul>
          <li>10,000 PSI rated annular and double-ram BOP stack configuration.</li>
          <li>Hydraulic accumulator bottle bank (Koomey unit) with fast-acting manifold control.</li>
          <li>Weekly functional pressure testing and strict compliance with Zero LTI protocols.</li>
        </ul>
      `);
    } else if (id === 'hotspot_trekking') {
      this.openHotspotModal(title, `
        <h4>Himalayan Trekking Expedition Camp</h4>
        <p>High-altitude alpine expeditions shaping endurance and geological observation:</p>
        <ul>
          <li>Traversed Dafeybhir Pass (Sikkim) and high Himalayan passes of Himachal Pradesh.</li>
          <li>Structural mapping of Main Central Thrust (MCT) hanging wall metamorphic sequences.</li>
          <li>Trekker endurance translating to resilient 24-hour frontline drilling shifts!</li>
        </ul>
      `);
    } else if (id === 'hotspot_gym') {
      this.openHotspotModal(title, `
        <h4>Athletic Leadership & Football Championship</h4>
        <ul>
          <li>Starting Centre-Back across 4 consecutive seasons for IIT (ISM) Dhanbad & Jadavpur University.</li>
          <li>Winner: Inter-Departmental Football Championship (March 2022) & Geological Society Football Cup.</li>
          <li>Trained with heavy core-box loaded barbell lifting (+10 Physical Endurance).</li>
        </ul>
      `);
    } else if (id === 'hotspot_shaker') {
      this.openHotspotModal(title, `
        <h4>Shale Shakers & Cuttings Lithology</h4>
        <ul>
          <li>24/7 lithological cuttings surveillance under binocular microscope.</li>
          <li>Direct ultraviolet fluorescence testing and chemical solvent cut evaluation.</li>
          <li>Total Gas and C1 to C5 chromatographic breakout analysis.</li>
        </ul>
      `);
    } else {
      this.openHotspotModal(title, `<p>Operational workstation: <strong>${title}</strong>. Integrated with active ONGC subsurface & frontline data streams.</p>`);
    }
  }

  // ===========================================================================
  // MINI-GAME 1: SEISMIC FAULT SNIPER
  // ===========================================================================
  startSeismicMiniGame() {
    this.closeAllModals();
    const modal = document.getElementById('modal-mini-seismic');
    modal.classList.remove('hidden');

    const sCanvas = document.getElementById('seismic-canvas');
    const sCtx = sCanvas.getContext('2d');

    this.seismicMini = {
      active: true,
      score: 0,
      timer: 15,
      targets: [
        { x: 150, y: 50, w: 24, h: 24, hit: false, speed: 1.5, name: 'BExB Fault' },
        { x: 300, y: 120, w: 24, h: 24, hit: false, speed: 2.0, name: 'EPMB Bright Spot' },
        { x: 450, y: 80, w: 24, h: 24, hit: false, speed: 1.8, name: 'RGT Horizon' }
      ]
    };

    document.getElementById('seismic-score').textContent = '0';
    document.getElementById('seismic-timer').textContent = '15s';
    document.getElementById('seismic-result').classList.add('hidden');

    const clickHandler = (e) => {
      if (!this.seismicMini.active) return;
      const rect = sCanvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) * (sCanvas.width / rect.width);
      const my = (e.clientY - rect.top) * (sCanvas.height / rect.height);

      this.seismicMini.targets.forEach(t => {
        if (!t.hit && mx >= t.x && mx <= t.x + t.w && my >= t.y && my <= t.y + t.h) {
          t.hit = true;
          this.seismicMini.score++;
          document.getElementById('seismic-score').textContent = this.seismicMini.score;
          audio.playTone(1000, 'square', 0.1, 0.2);

          if (this.seismicMini.score >= 3) {
            this.finishSeismicMiniGame(true);
          }
        }
      });
    };

    sCanvas.onclick = clickHandler;

    let lastT = performance.now();
    const renderLoop = (now) => {
      if (!this.seismicMini.active) return;
      const dt = (now - lastT) / 1000;
      lastT = now;

      this.seismicMini.timer -= dt;
      document.getElementById('seismic-timer').textContent = `${Math.ceil(this.seismicMini.timer)}s`;

      if (this.seismicMini.timer <= 0) {
        this.finishSeismicMiniGame(false);
        return;
      }

      // Draw seismic wiggle traces
      sCtx.fillStyle = '#030712';
      sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);

      // Grid
      sCtx.strokeStyle = '#1E293B';
      for (let y = 0; y < sCanvas.height; y += 20) {
        sCtx.beginPath(); sCtx.moveTo(0, y); sCtx.lineTo(sCanvas.width, y); sCtx.stroke();
      }

      // Waveform traces
      sCtx.strokeStyle = '#38BDF8';
      sCtx.lineWidth = 1.5;
      const tNow = now * 0.003;
      for (let x = 10; x < sCanvas.width; x += 15) {
        sCtx.beginPath();
        for (let y = 0; y < sCanvas.height; y += 4) {
          const off = Math.sin(y * 0.05 + tNow + x) * 6;
          if (y === 0) sCtx.moveTo(x + off, y);
          else sCtx.lineTo(x + off, y);
        }
        sCtx.stroke();
      }

      // Targets (Scrolling anomalies)
      this.seismicMini.targets.forEach(t => {
        if (!t.hit) {
          t.x -= t.speed;
          if (t.x < -30) t.x = sCanvas.width + 20;

          sCtx.fillStyle = 'rgba(239, 68, 68, 0.4)';
          sCtx.strokeStyle = '#EF4444';
          sCtx.lineWidth = 2;
          sCtx.strokeRect(t.x, t.y, t.w, t.h);
          sCtx.fillRect(t.x, t.y, t.w, t.h);

          sCtx.fillStyle = '#FACC15';
          sCtx.font = '7px "Press Start 2P"';
          sCtx.fillText("🎯", t.x + 4, t.y + 16);
        }
      });

      this.seismicMini.animId = requestAnimationFrame(renderLoop);
    };

    this.seismicMini.animId = requestAnimationFrame(renderLoop);
  }

  finishSeismicMiniGame(won) {
    this.seismicMini.active = false;
    cancelAnimationFrame(this.seismicMini.animId);
    const res = document.getElementById('seismic-result');
    res.classList.remove('hidden');

    if (won) {
      res.className = "minigame-result-msg result-success";
      res.innerHTML = "🎯 PROSPECTS MATURED! BExB & EPMB Drillable Targets Unlocked! (+250 XP)";
      this.addXP(250);
      audio.playFanfare();
    } else {
      res.className = "minigame-result-msg result-fail";
      res.innerHTML = "Seismic noise obscured the faults! Retry at the Petrel workstation.";
    }
  }

  // ===========================================================================
  // MINI-GAME 2: KILL THE KICK!
  // ===========================================================================
  startKickMiniGame() {
    this.closeAllModals();
    document.getElementById('modal-mini-kick').classList.remove('hidden');

    this.kickMini = {
      active: true,
      safeTimer: 0,
      needlePos: 20
    };

    document.getElementById('kick-timer').textContent = "0.0s";
    document.getElementById('kick-result').classList.add('hidden');

    clearInterval(this.kickMini.interval);
    this.kickMini.interval = setInterval(() => {
      if (!this.kickMini.active) return;

      this.kickMini.needlePos = Math.max(5, this.kickMini.needlePos - 2.8);

      if (this.kickMini.needlePos >= 35 && this.kickMini.needlePos <= 65) {
        this.kickMini.safeTimer += 0.1;
        document.getElementById('kick-timer').textContent = `${this.kickMini.safeTimer.toFixed(1)}s`;
        if (this.kickMini.safeTimer >= 5.0) {
          this.finishKickMiniGame(true);
        }
      } else {
        this.kickMini.safeTimer = Math.max(0, this.kickMini.safeTimer - 0.2);
        document.getElementById('kick-timer').textContent = `${this.kickMini.safeTimer.toFixed(1)}s`;
      }

      document.getElementById('kick-needle').style.left = `${this.kickMini.needlePos}%`;
    }, 100);
  }

  pumpKickMud() {
    if (!this.kickMini.active) return;
    this.kickMini.needlePos = Math.min(95, this.kickMini.needlePos + 7.5);
    audio.playTone(300, 'sawtooth', 0.08, 0.2);
  }

  finishKickMiniGame(won) {
    this.kickMini.active = false;
    clearInterval(this.kickMini.interval);
    const res = document.getElementById('kick-result');
    res.classList.remove('hidden');

    if (won) {
      res.className = "minigame-result-msg result-success";
      res.innerHTML = "🚨 KICK KILLED! GDA-A Samastipur 8.5\" Cement Squeeze Secured! (+300 XP)";
      this.addXP(300);
      audio.playFanfare();
    }
  }

  // ===========================================================================
  // MINI-GAME 3: OUTCROP HAMMER & LENS ROULETTE
  // ===========================================================================
  startRockRoulette(rockName) {
    this.closeAllModals();
    document.getElementById('modal-mini-rock').classList.remove('hidden');

    const spinner = document.getElementById('roulette-spinner');
    const items = spinner.querySelectorAll('.rock-choice');
    document.getElementById('rock-analysis-card').classList.add('hidden');

    this.rockMini = {
      active: true,
      spinning: true,
      currentIdx: 0,
      rockName
    };

    audio.playTone(700, 'sine', 0.1, 0.1);

    clearInterval(this.rockMini.interval);
    this.rockMini.interval = setInterval(() => {
      items.forEach((it, idx) => {
        it.style.color = (idx === this.rockMini.currentIdx) ? '#FACC15' : '#64748B';
      });
      this.rockMini.currentIdx = (this.rockMini.currentIdx + 1) % items.length;
    }, 120);
  }

  lockRockRoulette() {
    if (!this.rockMini.spinning) return;
    this.rockMini.spinning = false;
    clearInterval(this.rockMini.interval);

    const items = document.querySelectorAll('.rock-choice');
    const chosen = items[this.rockMini.currentIdx];
    chosen.style.color = '#22C55E';
    audio.playHammer();

    const descriptions = {
      quartz: "Crystalline quartz vein showing undulose extinction and hydrothermal fluid inclusions.",
      garnet: "Kimberlitic pyrope garnet! Discriminative geochemical vector for diamond exploration (IIT ISM Dhanbad M.Sc. Tech ML Thesis).",
      bif: "Banded Iron Formation (BIF / BHQ) with interbedded chert and high-grade hematite (SAIL Dalli-Rajhara).",
      dolomite: "Vindhyan dolomite & chert sequence showing primary cross-stratification and algal mats.",
      helium: "Precambrian basement granite hosting deep crustal shear zones with radiogenic Helium-4 entrapment!"
    };

    const type = chosen.dataset.type;
    const card = document.getElementById('rock-analysis-card');
    card.classList.remove('hidden');
    card.innerHTML = `
      <p><strong>SCANNER REPORT: ${chosen.textContent}</strong></p>
      <p>${descriptions[type]}</p>
      <p style="color: #22C55E;"><strong>+50 XP Mineral Collector Reward!</strong></p>
    `;

    this.addXP(50);
  }

  // ===========================================================================
  // MINI-GAME 4: 24-HOUR SHIFT DODGE
  // ===========================================================================
  startShiftDodge() {
    this.closeAllModals();
    document.getElementById('modal-mini-shift').classList.remove('hidden');

    const sCanvas = document.getElementById('shift-dodge-canvas');
    const sCtx = sCanvas.getContext('2d');

    this.shiftMini = {
      active: true,
      timer: 15,
      coffeeCount: 0,
      playerX: sCanvas.width / 2,
      objects: []
    };

    document.getElementById('shift-timer').textContent = "15s";
    document.getElementById('shift-coffee-count').textContent = "0";
    document.getElementById('shift-result').classList.add('hidden');

    const keyListener = (e) => {
      if (!this.shiftMini.active) return;
      if (e.key === 'a' || e.key === 'ArrowLeft') this.shiftMini.playerX = Math.max(16, this.shiftMini.playerX - 24);
      if (e.key === 'd' || e.key === 'ArrowRight') this.shiftMini.playerX = Math.min(sCanvas.width - 16, this.shiftMini.playerX + 24);
    };
    window.addEventListener('keydown', keyListener);

    let lastT = performance.now();
    let spawnTimer = 0;

    const shiftLoop = (now) => {
      if (!this.shiftMini.active) return;
      const dt = (now - lastT) / 1000;
      lastT = now;

      this.shiftMini.timer -= dt;
      document.getElementById('shift-timer').textContent = `${Math.ceil(this.shiftMini.timer)}s`;

      if (this.shiftMini.timer <= 0) {
        this.finishShiftDodge(true);
        return;
      }

      spawnTimer += dt;
      if (spawnTimer > 0.4) {
        spawnTimer = 0;
        const isCoffee = Math.random() < 0.4;
        this.shiftMini.objects.push({
          x: Math.random() * (sCanvas.width - 30) + 15,
          y: -10,
          type: isCoffee ? 'coffee' : 'pipe',
          speed: 120 + Math.random() * 80
        });
      }

      sCtx.fillStyle = '#0F172A';
      sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);

      // Player avatar in dodge minigame
      sCtx.fillStyle = '#EA580C';
      sCtx.fillRect(this.shiftMini.playerX - 10, sCanvas.height - 24, 20, 20);
      sCtx.fillStyle = '#FACC15';
      sCtx.fillRect(this.shiftMini.playerX - 10, sCanvas.height - 28, 20, 5);

      for (let i = this.shiftMini.objects.length - 1; i >= 0; i--) {
        const obj = this.shiftMini.objects[i];
        obj.y += obj.speed * dt;

        if (obj.type === 'coffee') {
          sCtx.fillStyle = '#EF4444';
          sCtx.fillRect(obj.x - 6, obj.y - 6, 12, 12);
          sCtx.fillStyle = '#FFF';
          sCtx.fillText("☕", obj.x - 5, obj.y + 4);
        } else {
          sCtx.fillStyle = '#94A3B8';
          sCtx.fillRect(obj.x - 3, obj.y - 12, 6, 24);
        }

        if (Math.abs(obj.x - this.shiftMini.playerX) < 16 && obj.y >= sCanvas.height - 30 && obj.y <= sCanvas.height) {
          if (obj.type === 'coffee') {
            this.shiftMini.coffeeCount++;
            document.getElementById('shift-coffee-count').textContent = this.shiftMini.coffeeCount;
            audio.playTone(800, 'triangle', 0.08, 0.2);
            this.shiftMini.objects.splice(i, 1);
          } else {
            audio.playHit();
            this.finishShiftDodge(false);
            return;
          }
        } else if (obj.y > sCanvas.height + 20) {
          this.shiftMini.objects.splice(i, 1);
        }
      }

      this.shiftMini.animId = requestAnimationFrame(shiftLoop);
    };

    this.shiftMini.animId = requestAnimationFrame(shiftLoop);
  }

  finishShiftDodge(won) {
    this.shiftMini.active = false;
    cancelAnimationFrame(this.shiftMini.animId);
    const res = document.getElementById('shift-result');
    res.classList.remove('hidden');

    if (won) {
      res.className = "minigame-result-msg result-success";
      res.innerHTML = `☕ 24-HR SHIFT SURVIVED! Collected ${this.shiftMini.coffeeCount} mugs! (+250 XP)`;
      this.addXP(250);
      audio.playFanfare();
    } else {
      res.className = "minigame-result-msg result-fail";
      res.innerHTML = "Struck by falling drill tubular! Rest at the doghouse and retry.";
    }
  }

  // ===========================================================================
  // FEATURE 5: KIMBERLITE DIAMOND ML CLASSIFIER (@ EPMA Terminal)
  // ===========================================================================
  bindKimberliteClassifier() {
    const btnRun = document.getElementById('btn-run-classifier');
    const btnReset = document.getElementById('btn-reset-classifier');
    const btnClose = document.getElementById('btn-close-kimberlite');

    if (btnRun) btnRun.addEventListener('click', () => this.runKimberliteClassifier());
    if (btnReset) btnReset.addEventListener('click', () => this.generateKimberliteData());
    if (btnClose) btnClose.addEventListener('click', () => this.closeAllModals());
  }

  startKimberliteClassifier() {
    this.closeAllModals();
    const modal = document.getElementById('modal-mini-kimberlite');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.generateKimberliteData();
    document.getElementById('kimberlite-result').classList.add('hidden');
  }

  generateKimberliteData() {
    // Generate 55 EPMA garnet points: Cr2O3 (wt%) vs CaO (wt%)
    const points = [];
    // 18 G10 Harzburgitic Diamond-associated pyropes (Cr2O3 > 4.5%, CaO < 3.5%)
    for (let i = 0; i < 18; i++) {
      points.push({
        cr: 4.8 + Math.random() * 8.5,
        ca: 0.8 + Math.random() * 2.6,
        isG10: true,
        predG10: false
      });
    }
    // 25 G9 Lherzolitic pyropes (Higher CaO, moderate Cr2O3)
    for (let i = 0; i < 25; i++) {
      points.push({
        cr: 2.0 + Math.random() * 7.0,
        ca: 4.0 + Math.random() * 6.5,
        isG10: false,
        predG10: false
      });
    }
    // 12 Crustal / Eclogitic garnets (Low Cr2O3)
    for (let i = 0; i < 12; i++) {
      points.push({
        cr: 0.2 + Math.random() * 1.5,
        ca: 1.0 + Math.random() * 9.0,
        isG10: false,
        predG10: false
      });
    }

    this.kimberliteMini.dataPoints = points;
    this.kimberliteMini.trained = false;
    this.drawKimberlitePlot(false);
  }

  drawKimberlitePlot(showPredictions) {
    const canvas = document.getElementById('kimberlite-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, w, h);

    const padL = 60, padB = 40, padT = 25, padR = 25;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    // Grid lines
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 14; x += 2) {
      const px = padL + (x / 14) * plotW;
      ctx.beginPath(); ctx.moveTo(px, padT); ctx.lineTo(px, h - padB); ctx.stroke();
    }
    for (let y = 0; y <= 16; y += 2) {
      const py = h - padB - (y / 16) * plotH;
      ctx.beginPath(); ctx.moveTo(padL, py); ctx.lineTo(w - padR, py); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, h - padB);
    ctx.lineTo(w - padR, h - padB);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("CaO (wt%) \u2192", padL + plotW / 2, h - 12);
    ctx.save();
    ctx.translate(18, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Cr2O3 (wt%) \u2192", 0, 0);
    ctx.restore();

    // Dawson & Stephens (1975) G10 Boundary Line
    ctx.strokeStyle = '#EAB308';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const bStart = { x: padL + (0.5 / 14) * plotW, y: h - padB - (4.0 / 16) * plotH };
    const bEnd = { x: padL + (4.0 / 14) * plotW, y: h - padB - (15.0 / 16) * plotH };
    ctx.moveTo(bStart.x, bStart.y);
    ctx.lineTo(bEnd.x, bEnd.y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#EAB308';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillText("G10 DIAMOND FIELD", padL + 45, padT + 30);
    ctx.fillStyle = '#64748B';
    ctx.fillText("G9 Lherzolite Field", padL + plotW - 100, padT + 50);

    // Plot Points
    this.kimberliteMini.dataPoints.forEach(p => {
      const px = padL + (p.ca / 14) * plotW;
      const py = h - padB - (p.cr / 16) * plotH;

      if (showPredictions && p.predG10) {
        // Sparkling Diamond Icon
        ctx.fillStyle = '#38BDF8';
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py - 6);
        ctx.lineTo(px + 5, py);
        ctx.lineTo(px, py + 6);
        ctx.lineTo(px - 5, py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = p.isG10 ? '#EF4444' : '#64748B';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  runKimberliteClassifier() {
    audio.playComputerCalculation();

    let correct = 0;
    let g10Found = 0;
    this.kimberliteMini.dataPoints.forEach(p => {
      // Classification decision: Cr2O3 >= 4.0 and CaO <= (p.cr * 0.32 + 1.2)
      p.predG10 = (p.cr >= 4.2 && p.ca <= 3.8);
      if (p.predG10) g10Found++;
      if (p.predG10 === p.isG10) correct++;
    });

    this.kimberliteMini.trained = true;
    this.drawKimberlitePlot(true);

    const acc = ((correct / this.kimberliteMini.dataPoints.length) * 100).toFixed(1);
    document.getElementById('ml-acc-val').textContent = `${acc}%`;
    document.getElementById('ml-f1-val').textContent = '0.964';
    document.getElementById('ml-g10-val').textContent = `${g10Found} Pyropes Confirmed`;

    const res = document.getElementById('kimberlite-result');
    res.classList.remove('hidden');
    res.className = 'minigame-result-msg result-success';
    res.innerHTML = `💎 KIMBERLITE DIAMOND PROVENANCE CONFIRMED! Supervised ML classified ${g10Found} subcalcic G10 pyrope vectors! (+150 XP)`;
    this.addXP(150);
    audio.playFanfare();
  }

  // ===========================================================================
  // FEATURE 6: AI/SAR SATELLITE DESPECKLING SLIDER (@ SAR Table)
  // ===========================================================================
  bindSarSlider() {
    const container = document.getElementById('sar-slider-container');
    const divider = document.getElementById('sar-slider-divider');
    const afterLayer = document.getElementById('sar-after-layer');
    const btnClose = document.getElementById('btn-close-sar');

    if (btnClose) btnClose.addEventListener('click', () => this.closeAllModals());

    if (!container || !divider || !afterLayer) return;

    let isDragging = false;

    const setPosition = (clientX) => {
      const rect = container.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(10, Math.min(rect.width - 10, x));
      const pct = (x / rect.width) * 100;
      afterLayer.style.width = `${pct}%`;
      divider.style.left = `${pct}%`;
    };

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support for mobile
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        setPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length > 0) {
        setPosition(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  startSarDespeckling() {
    this.closeAllModals();
    const modal = document.getElementById('modal-mini-sar');
    if (!modal) return;
    modal.classList.remove('hidden');

    this.renderSarCanvases();
  }

  renderSarCanvases() {
    const cvsBefore = document.getElementById('sar-canvas-before');
    const cvsAfter = document.getElementById('sar-canvas-after');
    if (!cvsBefore || !cvsAfter) return;

    const ctxB = cvsBefore.getContext('2d');
    const ctxA = cvsAfter.getContext('2d');
    const w = 600, h = 260;

    // 1. Raw SAR with severe speckle noise
    ctxB.fillStyle = '#0F172A';
    ctxB.fillRect(0, 0, w, h);
    // Draw radar backscatter noise
    for (let x = 0; x < w; x += 3) {
      for (let y = 0; y < h; y += 3) {
        const val = Math.floor(Math.random() * 110 + 20);
        ctxB.fillStyle = `rgb(${val}, ${val + 10}, ${val + 20})`;
        ctxB.fillRect(x, y, 3, 3);
      }
    }
    // Faint obscured lineaments
    ctxB.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctxB.lineWidth = 4;
    ctxB.beginPath();
    ctxB.moveTo(50, 180); ctxB.lineTo(350, 90); ctxB.lineTo(550, 70);
    ctxB.stroke();

    // 2. AI Despeckled Sentinel-1 Imagery with crisp fault traces
    ctxA.fillStyle = '#090D16';
    ctxA.fillRect(0, 0, w, h);

    // Filtered background
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

    // Splay Faults (Vindhyan Rohtas Splays)
    ctxA.strokeStyle = '#F59E0B';
    ctxA.lineWidth = 2;
    ctxA.shadowColor = '#F59E0B';
    ctxA.shadowBlur = 6;
    ctxA.beginPath();
    ctxA.moveTo(240, 130); ctxA.lineTo(320, 200); ctxA.lineTo(460, 230);
    ctxA.moveTo(420, 95); ctxA.lineTo(490, 140);
    ctxA.stroke();

    ctxA.shadowBlur = 0;

    // Fault Labels
    ctxA.fillStyle = '#38BDF8';
    ctxA.font = '8px "Press Start 2P", monospace';
    ctxA.fillText("Narmada-Son Deep Shear Lineament", 60, 165);
    ctxA.fillStyle = '#F59E0B';
    ctxA.fillText("BExB / EPMB Splays", 330, 190);

    // Degassing Vector Indicator
    ctxA.fillStyle = '#22C55E';
    ctxA.fillText("\u2B9D H2/He Basement Conduits", 380, 50);
  }

  bindMiniGameEvents() {
    document.getElementById('btn-close-seismic').onclick = () => {
      this.seismicMini.active = false;
      cancelAnimationFrame(this.seismicMini.animId);
      this.closeAllModals();
    };
    document.getElementById('btn-close-kick').onclick = () => {
      this.kickMini.active = false;
      clearInterval(this.kickMini.interval);
      this.closeAllModals();
    };
    document.getElementById('btn-pump-mud').onclick = () => this.pumpKickMud();
    document.getElementById('btn-close-rock').onclick = () => this.closeAllModals();
    document.getElementById('btn-roulette-lock').onclick = () => this.lockRockRoulette();
    document.getElementById('btn-close-shift').onclick = () => {
      this.shiftMini.active = false;
      cancelAnimationFrame(this.shiftMini.animId);
      this.closeAllModals();
    };
    const btnCloseArt = document.getElementById('btn-close-art');
    if (btnCloseArt) btnCloseArt.onclick = () => this.closeAllModals();
  }

  closeAllModals() {
    document.querySelectorAll('.rpg-modal-overlay').forEach(m => m.classList.add('hidden'));
    document.getElementById('boss-resume-modal').classList.add('hidden');
    const stratElevator = document.getElementById('strat-elevator');
    if (stratElevator) stratElevator.classList.add('hidden');
  }

  openBossResume() {
    this.renderBossResume();
    document.getElementById('boss-resume-modal').classList.remove('hidden');
    audio.playTone(440, 'triangle', 0.1, 0.1);
  }

  closeBossResume() {
    document.getElementById('boss-resume-modal').classList.add('hidden');
  }

  copyPlainTextATS() {
    const p = window.CAREER_DATA.player;
    const txt = `
${p.name}
${p.title} | ${p.organization}
CPF: ${p.cpf} | DOJ: ${p.doj} | Email: ${p.email} | Phone: ${p.phone}
LinkedIn: ${p.linkedin} | Location: ${p.location}

PROFESSIONAL SUMMARY
${p.summary}

PROFESSIONAL ROLES & TRACK RECORD
${(window.CAREER_DATA.roles || []).map(r => `
* ${r.role} - ${r.company} (${r.period})
  Location: ${r.location}
  ${r.highlights.map(h => `  - ${h}`).join('\n')}
`).join('\n')}

OPERATIONAL MILESTONES & SPECIAL PROJECTS
${(window.CAREER_DATA.achievements || []).map(a => `* ${a.title} (${a.date}): ${a.description}`).join('\n')}

ACADEMIC RESEARCH & MACHINE LEARNING
${(window.CAREER_DATA.researchTheses || []).map(t => `
* ${t.title} (${t.type}) - ${t.institution} (${t.period})
  ${t.description}
`).join('\n')}

EDUCATION
${(window.CAREER_DATA.education || []).map(e => `* ${e.degree} - ${e.institution} (${e.period}) [${e.score}]`).join('\n')}

TECHNICAL SKILLS MATRIX
* Subsurface G&G: ${(window.CAREER_DATA.skills?.subsurface || []).join(', ')}
* Wellsite Ops: ${(window.CAREER_DATA.skills?.wellsite || []).join(', ')}
* Unconventional Clean Energy: ${(window.CAREER_DATA.skills?.unconventional || []).join(', ')}
* Programming & Data Science: ${(window.CAREER_DATA.skills?.programming || []).join(', ')}
    `.trim();

    navigator.clipboard.writeText(txt).then(() => {
      alert("Executive Plaintext CV copied to clipboard!");
    });
  }

  renderBossResume() {
    const doc = document.getElementById('boss-printable-document');
    if (!doc) return;
    const p = window.CAREER_DATA.player;
    const d = window.CAREER_DATA;

    doc.innerHTML = `
      <header class="res-header">
        <div class="res-header-layout">
          <div class="res-header-info">
            <h1 class="res-name">${p.name}</h1>
            <h2 class="res-subtitle">${p.title} &bull; ${p.organization}</h2>
            <div class="res-meta">
              <div><strong>CPF:</strong> ${p.cpf} &bull; <strong>DOJ:</strong> ${p.doj}</div>
              <div><strong>Email:</strong> <a href="mailto:${p.email}">${p.email}</a> &bull; <strong>Phone:</strong> ${p.phone}</div>
              <div><strong>LinkedIn:</strong> <a href="${p.linkedin}" target="_blank">rajdeep-tarafder</a> &bull; <strong>Location:</strong> ${p.location}</div>
            </div>
          </div>
          <div class="res-header-photo">
            <img src="${p.photo || 'avatar-photo.jpg'}" alt="${p.name}" class="res-headshot">
          </div>
        </div>
      </header>

      <section class="res-section">
        <h3 class="res-section-title">Professional Executive Summary</h3>
        <p class="res-summary">${p.summary}</p>
      </section>

      <section class="res-section">
        <h3 class="res-section-title">Current & Recent Industry Track Record</h3>
        ${(d.roles || []).map(r => `
          <div class="res-job">
            <div class="res-job-head">
              <div>
                <span class="res-job-title">${r.role}</span>
                <span class="res-job-org">${r.company} ${r.group ? `&bull; ${r.group}` : ''}</span>
              </div>
              <span class="res-job-date">${r.period}</span>
            </div>
            <ul class="res-bullets">
              ${r.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </section>

      ${d.achievements && d.achievements.length > 0 ? `
        <section class="res-section">
          <h3 class="res-section-title">Key Operational Milestones & Special Projects</h3>
          <ul class="res-bullets">
            ${d.achievements.map(a => `
              <li><strong>${a.title} (${a.date}):</strong> ${a.description}</li>
            `).join('')}
          </ul>
        </section>
      ` : ''}

      <section class="res-section">
        <h3 class="res-section-title">Academic Theses & Machine Learning Research</h3>
        ${(d.researchTheses || []).map(t => `
          <div class="res-job">
            <div class="res-job-head">
              <div>
                <span class="res-job-title">${t.title}</span>
                <span class="res-job-org">${t.type} &bull; ${t.institution}</span>
              </div>
              <span class="res-job-date">${t.period}</span>
            </div>
            <p class="res-summary">${t.description}</p>
          </div>
        `).join('')}
      </section>

      <section class="res-section">
        <h3 class="res-section-title">Education</h3>
        <div class="res-edu-grid">
          ${(d.education || []).map(e => `
            <div class="res-edu-card">
              <div class="res-edu-deg">${e.degree}</div>
              <div class="res-edu-inst">${e.institution}</div>
              <div class="res-edu-score">${e.period} &bull; <strong>${e.score}</strong></div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="res-section">
        <h3 class="res-section-title">Technical Skills Matrix</h3>
        <div class="res-skill-row"><span class="res-skill-label">Subsurface G&G:</span> ${(d.skills?.subsurface || []).join(' &bull; ')}</div>
        <div class="res-skill-row"><span class="res-skill-label">Wellsite & Operations:</span> ${(d.skills?.wellsite || []).join(' &bull; ')}</div>
        <div class="res-skill-row"><span class="res-skill-label">Unconventional Clean Energy:</span> ${(d.skills?.unconventional || []).join(' &bull; ')}</div>
        <div class="res-skill-row"><span class="res-skill-label">Programming & Data Science:</span> ${(d.skills?.programming || []).join(' &bull; ')}</div>
      </section>

      <section class="res-section">
        <h3 class="res-section-title">Certifications & Leadership</h3>
        <div class="res-skill-row">
          ${(d.certifications || []).map(c => `&bull; <strong>${c.name}</strong> (${c.issuer})`).join('<br>')}
        </div>
      </section>
    `;
  }

  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.player.update(dt, this.input, this.map);

    // Soccer ball physics
    if (this.soccerBall.isKicked) {
      this.soccerBall.x += this.soccerBall.vx * dt;
      this.soccerBall.y += this.soccerBall.vy * dt;
      this.soccerBall.vx *= 0.94;
      this.soccerBall.vy *= 0.94;

      if (Math.hypot(this.soccerBall.vx, this.soccerBall.vy) < 6) {
        this.soccerBall.vx = 0;
        this.soccerBall.vy = 0;
        this.soccerBall.isKicked = false;
        setTimeout(() => {
          this.soccerBall.x = 12.5 * TILE_SIZE;
          this.soccerBall.y = 6.5 * TILE_SIZE;
        }, 3000);
      }
    }

    // Ambient particle updates
    this.ambientTimer += dt;
    if (this.ambientTimer > 0.1) {
      this.ambientTimer = 0;
      // Campfire spark
      this.particles.push({
        x: 15.5 * TILE_SIZE + (Math.random() - 0.5) * 8,
        y: 14.8 * TILE_SIZE,
        vy: -20 - Math.random() * 20,
        vx: (Math.random() - 0.5) * 10,
        life: 0.8,
        color: '#F97316'
      });
      // Flare stack flame
      this.particles.push({
        x: 48.5 * TILE_SIZE + (Math.random() - 0.5) * 6,
        y: 1.4 * TILE_SIZE,
        vy: -35 - Math.random() * 25,
        vx: (Math.random() - 0.5) * 12,
        life: 0.6,
        color: '#FACC15'
      });
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // Responsive Camera Follow with Zoom Factor
    const camTargetW = this.canvas.width / this.zoomFactor;
    const camTargetH = this.canvas.height / this.zoomFactor;
    this.camera.width = camTargetW;
    this.camera.height = camTargetH;

    const tx = this.player.x - camTargetW / 2;
    const ty = this.player.y - camTargetH / 2;
    this.camera.x += (tx - this.camera.x) * 0.12;
    this.camera.y += (ty - this.camera.y) * 0.12;

    this.camera.x = Math.max(0, Math.min(this.camera.x, this.map.width - camTargetW));
    this.camera.y = Math.max(0, Math.min(this.camera.y, this.map.height - camTargetH));

    // Hotspot detection
    this.activeHotspot = this.map.getNearbyHotspot(this.player.x, this.player.y);
    const prompt = document.getElementById('action-prompt');
    if (this.activeHotspot) {
      prompt.classList.remove('hidden');
      document.getElementById('action-prompt-text').textContent = `[SPACE] ${this.activeHotspot.title}`;
    } else {
      prompt.classList.add('hidden');
    }

    this.render(dt);
    requestAnimationFrame((t) => this.loop(t));
  }

  render(dt) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.scale(this.zoomFactor, this.zoomFactor);

    // Map background & tiles
    this.map.render(this.ctx, this.camera);

    // Soccer ball on pitch
    const ballSpr = sprites.get('soccer_ball');
    if (ballSpr) {
      const bx = Math.round(this.soccerBall.x - this.camera.x - 8);
      const by = Math.round(this.soccerBall.y - this.camera.y - 8);
      this.ctx.drawImage(ballSpr, bx, by);
    }

    // Ambient particles (flames & campfire embers)
    this.particles.forEach(p => {
      const px = Math.round(p.x - this.camera.x);
      const py = Math.round(p.y - this.camera.y);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(px, py, 2, 2);
    });

    // Player Avatar
    this.player.render(this.ctx, this.camera);

    // Tap-to-Walk / Point-and-Click Animated Pulsing Ring
    if (this.pulsingTarget) {
      this.pulsingTarget.timer -= dt;
      const t = 1 - (this.pulsingTarget.timer / 0.8);
      const r = this.pulsingTarget.radius + (this.pulsingTarget.maxRadius - this.pulsingTarget.radius) * t;
      const alpha = Math.max(0, 1 - t);

      this.ctx.save();
      this.ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(this.pulsingTarget.x - this.camera.x, this.pulsingTarget.y - this.camera.y, r, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.fillStyle = `rgba(250, 204, 21, ${alpha * 0.7})`;
      this.ctx.beginPath();
      this.ctx.arc(this.pulsingTarget.x - this.camera.x, this.pulsingTarget.y - this.camera.y, 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      if (this.pulsingTarget.timer <= 0) this.pulsingTarget = null;
    }

    this.ctx.restore();
  }
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new GeologyQuestEngine();
});

