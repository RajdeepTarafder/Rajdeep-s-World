// Audio Synthesizer Engine (Web Audio API - 100% Procedural)

export class RetroSynth {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = true;
  private bgmPlaying: boolean = false;
  private bgmTimer: any = null;

  private init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) {
        this.ctx = new AC();
      }
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }

  public ensure() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.ensure();
    this.isMuted = !this.isMuted;
    if (!this.isMuted && !this.bgmPlaying) {
      this.startBGM();
    } else if (this.isMuted && this.bgmPlaying) {
      this.stopBGM();
    }
    return !this.isMuted;
  }

  public playTone(freq: number, type: OscillatorType = 'square', duration: number = 0.08, vol: number = 0.15) {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    try {
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
    } catch {
      // Audio error suppressed
    }
  }

  public playStep() {
    this.playTone(110 + Math.random() * 30, 'triangle', 0.04, 0.05);
  }

  public playHammer() {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    this.playTone(600, 'sawtooth', 0.12, 0.2);
    setTimeout(() => this.playTone(900, 'sine', 0.15, 0.15), 20);
  }

  public playLens() {
    this.playTone(1200, 'sine', 0.15, 0.12);
    setTimeout(() => this.playTone(1600, 'sine', 0.2, 0.1), 60);
  }

  public playHit() {
    this.playTone(180, 'sawtooth', 0.1, 0.2);
  }

  public playFanfare() {
    const notes = [440, 554, 659, 880, 1108];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'square', 0.12, 0.15), i * 70);
    });
  }

  public playHeliumChirp() {
    this.playTone(1800 + Math.random() * 600, 'sine', 0.06, 0.18);
  }

  public playRadioStatic() {
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
    } catch {
      this.playTone(300, 'sawtooth', 0.1, 0.15);
    }
  }

  public playDrillBitWhir() {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    const freqs = [120, 160, 220, 180, 240, 320];
    freqs.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sawtooth', 0.08, 0.15), i * 50);
    });
  }

  public playGoalCheer() {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'square', 0.14, 0.18), i * 80);
    });
  }

  public playComputerCalculation() {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => this.playTone(800 + Math.random() * 800, 'sine', 0.04, 0.1), i * 35);
    }
  }

  public playExpressionChirp(freq: number = 740, type: OscillatorType = 'sawtooth', duration: number = 0.15) {
    this.playTone(freq, type, duration, 0.2);
  }

  public playAlarmSiren() {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    const sirenNotes = [880, 580, 880, 580, 880, 580];
    sirenNotes.forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'sawtooth', 0.18, 0.25), idx * 180);
    });
  }

  public playGlitchBuzz() {
    this.playTone(140, 'sawtooth', 0.2, 0.3);
    setTimeout(() => this.playTone(90, 'square', 0.25, 0.25), 80);
  }

  public playGodModeChime() {
    if (this.isMuted || !this.ctx) return;
    this.ensure();
    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    chord.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.35, 0.15), i * 60);
    });
  }

  public startBGM() {
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

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const audio = new RetroSynth();
