// Rajdeep's World: 16-Bit Retro RPG Portfolio Engine
// Main Loop, Camera, Input Orchestration, HUD & Mini-map

import { spriteFactory, TILE_SIZE } from './engine/sprites.js';
import { WorldMap } from './engine/map.js';
import { Player } from './engine/player.js';
import { sound } from './engine/sound.js';
import { ModalManager } from './ui/modal.js';
import { ResumeManager } from './ui/resume.js';

// Expose spriteFactory globally for map & modal rendering
window.spriteFactory = spriteFactory;

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    // Internal Native Retro Resolution (16:9 widescreen retro)
    this.viewWidth = 640;
    this.viewHeight = 360;

    this.camera = {
      x: 0,
      y: 0,
      width: this.viewWidth,
      height: this.viewHeight
    };

    this.worldMap = new WorldMap();
    this.player = new Player(8 * TILE_SIZE, 11 * TILE_SIZE); // starts in Academic Wing

    this.modal = new ModalManager();
    this.resume = new ResumeManager();

    // Input State
    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      action: false
    };

    // Active Hotspot in range
    this.activeHotspot = null;

    // Timing
    this.lastTime = performance.now();

    // HUD Elements
    this.zoneToast = document.getElementById('zone-toast');
    this.zoneToastTitle = document.getElementById('zone-toast-title');
    this.zoneToastDesc = document.getElementById('zone-toast-desc');
    this.interactPrompt = document.getElementById('interact-prompt');
    this.audioToggleBtn = document.getElementById('audio-toggle-btn');
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.setupKeyboard();
    this.setupTouchControls();
    this.setupAudioButton();
    this.setupZoneEvents();

    // Show initial welcome zone notification
    this.showZoneToast('Academic & Early Foundations Wing', 'IIT (ISM) Dhanbad, Jadavpur Univ, Theses & Geological Fieldwork');

    // Kickoff main loop
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  resizeCanvas() {
    this.canvas.width = this.viewWidth;
    this.canvas.height = this.viewHeight;
    this.ctx.imageSmoothingEnabled = false;
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      // If modal or resume is open, allow closing or default typing
      if (this.modal.isOpen || this.resume.isOpen) {
        if (e.key === 'Escape') {
          if (this.modal.isOpen) this.modal.close();
          if (this.resume.isOpen) this.resume.close();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          this.input.left = true;
          break;
        case 'arrowright':
        case 'd':
          this.input.right = true;
          break;
        case 'arrowup':
        case 'w':
          this.input.up = true;
          break;
        case 'arrowdown':
        case 's':
          this.input.down = true;
          break;
        case ' ':
        case 'e':
        case 'enter':
          e.preventDefault();
          this.triggerAction();
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          this.input.left = false;
          break;
        case 'arrowright':
        case 'd':
          this.input.right = false;
          break;
        case 'arrowup':
        case 'w':
          this.input.up = false;
          break;
        case 'arrowdown':
        case 's':
          this.input.down = false;
          break;
      }
    });
  }

  setupTouchControls() {
    const dpadButtons = document.querySelectorAll('.dpad-btn');
    dpadButtons.forEach(btn => {
      const dir = btn.getAttribute('data-dir');
      const startHandler = (e) => {
        e.preventDefault();
        this.input[dir] = true;
      };
      const endHandler = (e) => {
        e.preventDefault();
        this.input[dir] = false;
      };

      btn.addEventListener('touchstart', startHandler, { passive: false });
      btn.addEventListener('touchend', endHandler, { passive: false });
      btn.addEventListener('mousedown', startHandler);
      btn.addEventListener('mouseup', endHandler);
      btn.addEventListener('mouseleave', endHandler);
    });

    const actionBtn = document.getElementById('mobile-action-btn');
    if (actionBtn) {
      actionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.triggerAction();
      });
      actionBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.triggerAction();
      }, { passive: false });
    }
  }

  setupAudioButton() {
    if (this.audioToggleBtn) {
      this.audioToggleBtn.addEventListener('click', () => {
        const isNowAudioOn = sound.toggleMute();
        this.audioToggleBtn.innerHTML = isNowAudioOn
          ? '<span>🔊 Audio: ON</span>'
          : '<span>🔇 Audio: MUTED</span>';
        this.audioToggleBtn.classList.toggle('active', isNowAudioOn);
      });
    }
  }

  setupZoneEvents() {
    window.addEventListener('zone-changed', (e) => {
      const { zoneName, desc, outfit } = e.detail;
      this.showZoneToast(zoneName, desc);

      // Flash outfit badge in HUD
      const outfitBadge = document.getElementById('hud-outfit-badge');
      if (outfitBadge) {
        let label = "Casual Scholar";
        if (outfit === 'lab') label = "Tech Geologist (Glasses + ID)";
        if (outfit === 'rig') label = "Rig Coveralls + Hard Hat";
        outfitBadge.textContent = label;
      }
    });
  }

  showZoneToast(title, desc) {
    if (!this.zoneToast) return;
    this.zoneToastTitle.textContent = title;
    this.zoneToastDesc.textContent = desc;

    this.zoneToast.classList.remove('hidden', 'fade-out');
    this.zoneToast.classList.add('slide-in');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.zoneToast.classList.add('fade-out');
      setTimeout(() => {
        this.zoneToast.classList.add('hidden');
      }, 600);
    }, 3800);
  }

  triggerAction() {
    if (this.modal.isOpen) {
      this.modal.close();
      return;
    }
    if (this.activeHotspot) {
      this.modal.openHotspot(this.activeHotspot.id, this.player.outfit);
    }
  }

  gameLoop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    if (!this.modal.isOpen && !this.resume.isOpen) {
      this.update(dt);
    }

    this.render();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(dt) {
    this.player.update(dt, this.input, this.worldMap);

    // Smooth camera following player
    const targetCamX = this.player.x - this.viewWidth / 2;
    const targetCamY = this.player.y - this.viewHeight / 2;

    this.camera.x += (targetCamX - this.camera.x) * 0.1;
    this.camera.y += (targetCamY - this.camera.y) * 0.1;

    // Clamp camera within map bounds
    this.camera.x = Math.max(0, Math.min(this.camera.x, this.worldMap.width - this.viewWidth));
    this.camera.y = Math.max(0, Math.min(this.camera.y, this.worldMap.height - this.viewHeight));

    // Check Hotspot Proximity
    this.activeHotspot = this.worldMap.getNearbyHotspot(this.player.x, this.player.y);

    // Update Floating Interaction Prompt
    if (this.interactPrompt) {
      if (this.activeHotspot) {
        this.interactPrompt.classList.remove('hidden');
        this.interactPrompt.querySelector('.prompt-text').textContent = `[SPACE / E] Inspect: ${this.activeHotspot.title}`;
      } else {
        this.interactPrompt.classList.add('hidden');
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);

    // 1. Draw Tilemap & Props
    this.worldMap.render(this.ctx, this.camera);

    // 2. Draw Hotspot Ground Indicators (Pulsing glowing target circle)
    this.renderHotspotIndicators();

    // 3. Draw Player Avatar
    this.player.render(this.ctx, this.camera);

    // 4. Render Retro Scanlines / CRT effect if needed
    // 5. Render Minimap
    this.renderMinimap();
  }

  renderHotspotIndicators() {
    const time = performance.now() * 0.004;
    this.worldMap.hotspots.forEach(h => {
      const hx = h.x + h.width / 2 - this.camera.x;
      const hy = h.y + h.height / 2 - this.camera.y;

      // Only draw if on screen
      if (hx >= -40 && hx <= this.viewWidth + 40 && hy >= -40 && hy <= this.viewHeight + 40) {
        const isNear = (this.activeHotspot && this.activeHotspot.id === h.id);
        const radius = isNear ? 18 + Math.sin(time * 3) * 3 : 14;

        this.ctx.save();
        this.ctx.strokeStyle = isNear ? '#FACC15' : 'rgba(56, 189, 248, 0.6)';
        this.ctx.lineWidth = isNear ? 2 : 1.5;
        this.ctx.setLineDash([4, 4]);

        this.ctx.beginPath();
        this.ctx.arc(hx, hy, radius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Pulsing exclamation badge above hotspot
        if (isNear) {
          this.ctx.fillStyle = '#FACC15';
          this.ctx.beginPath();
          this.ctx.arc(hx, hy - 32 + Math.sin(time * 4) * 3, 7, 0, Math.PI * 2);
          this.ctx.fill();

          this.ctx.fillStyle = '#0F172A';
          this.ctx.font = 'bold 9px monospace';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText('!', hx, hy - 32 + Math.sin(time * 4) * 3);
        }
        this.ctx.restore();
      }
    });
  }

  renderMinimap() {
    if (!this.minimapCtx) return;
    const mCtx = this.minimapCtx;
    const mW = this.minimapCanvas.width;
    const mH = this.minimapCanvas.height;

    mCtx.clearRect(0, 0, mW, mH);

    // Background zones
    // Zone 1: Academic (Left 1/3)
    mCtx.fillStyle = '#5A2E16';
    mCtx.fillRect(0, 0, mW / 3, mH);

    // Zone 2: Lab (Middle 1/3)
    mCtx.fillStyle = '#0F172A';
    mCtx.fillRect(mW / 3, 0, mW / 3, mH);

    // Zone 3: Rig (Right 1/3)
    mCtx.fillStyle = '#334155';
    mCtx.fillRect((mW / 3) * 2, 0, mW / 3, mH);

    // Dividing lines
    mCtx.fillStyle = '#64748B';
    mCtx.fillRect(mW / 3, 0, 1, mH);
    mCtx.fillRect((mW / 3) * 2, 0, 1, mH);

    // Hotspot dots
    mCtx.fillStyle = '#38BDF8';
    this.worldMap.hotspots.forEach(h => {
      const mx = (h.x / this.worldMap.width) * mW;
      const my = (h.y / this.worldMap.height) * mH;
      mCtx.fillRect(mx - 1, my - 1, 2, 2);
    });

    // Player position dot (Pulsing Red/Gold)
    const px = (this.player.x / this.worldMap.width) * mW;
    const py = (this.player.y / this.worldMap.height) * mH;

    mCtx.fillStyle = '#FACC15';
    mCtx.beginPath();
    mCtx.arc(px, py, 2.5, 0, Math.PI * 2);
    mCtx.fill();
  }
}

// Boot application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new GameEngine();
});
