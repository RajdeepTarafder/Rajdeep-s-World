// 8-bit Retro Audio Synthesizer Engine using Web Audio API
// 100% Procedural - Zero external audio files

class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // start muted to comply with browser autoplay policies
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.15;
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime);
    }
    if (!this.isMuted && !this.bgmPlaying) {
      this.startBGM();
    }
    return !this.isMuted;
  }

  playBeep(freq = 440, type = 'square', duration = 0.08, vol = 0.2) {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playStep() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120 + Math.random() * 40, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.04);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(now + 0.04);
  }

  playBump() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(now + 0.12);
  }

  playChime() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0, now + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.35);
    });
  }

  playZoneTransition() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.08, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.2);
    });
  }

  playIdleSparkle() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [880, 1174.66, 1318.51, 1760];
    freqs.forEach((f, i) => {
      this.playBeep(f, 'sine', 0.1, 0.08);
    });
  }

  playDialogueBlip() {
    if (this.isMuted || !this.ctx) return;
    this.playBeep(520 + (Math.random() * 80 - 40), 'square', 0.03, 0.04);
  }

  startBGM() {
    if (this.bgmPlaying || !this.ctx) return;
    this.bgmPlaying = true;

    // Upbeat retro 16-bit exploratory melody
    const melody = [
      { note: 261.63, dur: 0.25 }, // C4
      { note: 329.63, dur: 0.25 }, // E4
      { note: 392.00, dur: 0.25 }, // G4
      { note: 523.25, dur: 0.50 }, // C5
      { note: 440.00, dur: 0.25 }, // A4
      { note: 392.00, dur: 0.25 }, // G4
      { note: 349.23, dur: 0.50 }, // F4
      { note: 329.63, dur: 0.25 }, // E4
      { note: 293.66, dur: 0.25 }, // D4
      { note: 261.63, dur: 0.75 }, // C4
      { note: 0, dur: 0.25 },      // Rest
      { note: 392.00, dur: 0.25 }, // G4
      { note: 440.00, dur: 0.25 }, // A4
      { note: 493.88, dur: 0.25 }, // B4
      { note: 523.25, dur: 0.50 }, // C5
      { note: 392.00, dur: 0.50 }  // G4
    ];

    let noteIndex = 0;
    const playNextNote = () => {
      if (!this.bgmPlaying || this.isMuted || !this.ctx) return;
      const item = melody[noteIndex % melody.length];
      noteIndex++;

      if (item.note > 0) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.note, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + item.dur * 0.9);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + item.dur);
      }

      this.bgmTimer = setTimeout(playNextNote, item.dur * 1000);
    };

    playNextNote();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sound = new RetroAudioEngine();
