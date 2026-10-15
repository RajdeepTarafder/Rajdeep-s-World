import { sprites } from './sprites';
import { GameMap } from './worldMap';
import { audio } from './audio';
import { COMIC_BUBBLES } from '../data/careerData';
import { OutfitType, DirectionType } from '../types/game';

export interface ComicBubble {
  text: string;
  timer: number;
  x: number;
  y: number;
}

export class PlayerAvatar {
  public x: number;
  public y: number;
  public speed: number = 2.8;
  public baseSpeed: number = 2.8;
  public isGodMode: boolean = false;
  public direction: DirectionType = 'down';
  public walkFrame: number = 0;
  public walkTimer: number = 0;
  public isMoving: boolean = false;

  public outfit: OutfitType = 'scholar';
  public currentZone: 'academic' | 'lab' | 'rig' = 'academic';

  // Point-and-Click / Tap-to-Walk navigation
  public hasTarget: boolean = false;
  public targetX: number = 0;
  public targetY: number = 0;
  public stuckTimer: number = 0;

  // Idle Antics (>4s)
  public idleTime: number = 0;
  public idleType: 'none' | 'pushup' | 'coffee' = 'none';
  public idleFrame: number = 0;
  public idleTimer: number = 0;

  // Hammer, Lens & Tackle Actions
  public actionState: 'idle' | 'hammer' | 'lens' | 'tackle' = 'idle';
  public actionTimer: number = 0;

  // Comic speech bubble
  public comicBubble: ComicBubble | null = null;
  public lastBump: number = 0;

  // Helium Voice Gag
  public heliumTimer: number = 0;

  // Callbacks
  public onZoneChange?: (zone: { id: 'academic' | 'lab' | 'rig'; name: string; desc: string }) => void;
  public onSoccerKick?: (fromX: number, fromY: number) => void;
  public onIdleZombie?: () => void;
  public onHammerGodBurst?: (x: number, y: number) => void;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public setTargetDestination(x: number, y: number) {
    this.targetX = x;
    this.targetY = y;
    this.hasTarget = true;
    this.stuckTimer = 0;
    this.idleTime = 0;
    this.idleType = 'none';
  }

  public update(dt: number, input: { left: boolean; right: boolean; up: boolean; down: boolean }, map: GameMap) {
    // Action timer (hammer, lens, slide tackle)
    if (this.actionState !== 'idle') {
      this.actionTimer -= dt;
      if (this.actionTimer <= 0) this.actionState = 'idle';
      return;
    }

    let dx = 0;
    let dy = 0;

    const manualInput = input.left || input.right || input.up || input.down;
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

    this.isMoving = dx !== 0 || dy !== 0;

    const curSpeed = this.isGodMode ? this.baseSpeed * 2.5 : this.baseSpeed;

    if (this.isMoving) {
      this.idleTime = 0;
      this.idleType = 'none';

      const nx = this.x + dx * curSpeed;
      const ny = this.y + dy * curSpeed;

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

      // 13th-Day Shift Zombie trigger at > 6s
      if (this.idleTime >= 6.0 && this.onIdleZombie) {
        this.onIdleZombie();
      }

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
      this.outfit = zone.id === 'academic' ? 'scholar' : zone.id;

      if (this.outfit === 'rig') {
        this.showBubble("PPE EQUIPPED! Safety First!", 2.0);
      }

      audio.playFanfare();
      if (this.onZoneChange) {
        this.onZoneChange(zone);
      }
    }

    // Helium voice timer countdown
    if (this.heliumTimer > 0) {
      this.heliumTimer -= dt;
    }

    // Comic bubble update
    if (this.comicBubble) {
      this.comicBubble.timer -= dt;
      const floatSpeed = this.heliumTimer > 0 ? 35 : 12;
      this.comicBubble.y -= dt * floatSpeed;
      if (this.comicBubble.timer <= 0) this.comicBubble = null;
    }
  }

  public strikeHammer() {
    this.actionState = 'hammer';
    this.actionTimer = 0.35;
    audio.playHammer();
    if (this.isGodMode && this.onHammerGodBurst) {
      this.onHammerGodBurst(this.x, this.y);
      this.showBubble("💎 CRACKED THE BASEMENT! DIAMONDS & CRUDE SPRAY!", 2.2);
    } else {
      this.showBubble("*CLANG!* Fresh rock surface cleaved!", 1.8);
    }
  }

  public inspectLens() {
    this.actionState = 'lens';
    this.actionTimer = 0.45;
    audio.playLens();
    this.showBubble("Examining cleavage & twinning under 10x!", 1.8);
  }

  public slideTackle() {
    this.actionState = 'tackle';
    this.actionTimer = 0.55;
    audio.playGoalCheer();
    this.showBubble("⚽ SLIDE TACKLE! IIT ISM GC '22 Winner!", 2.5);
    if (this.onSoccerKick) {
      this.onSoccerKick(this.x, this.y);
    }
  }

  public bumpObstacle() {
    const now = performance.now();
    if (now - this.lastBump > 2500) {
      this.lastBump = now;
      const joke = COMIC_BUBBLES[Math.floor(Math.random() * COMIC_BUBBLES.length)];
      this.showBubble(joke, 2.2);
      audio.playHit();
    }
  }

  public showBubble(text: string, duration: number = 2.0) {
    if (this.heliumTimer > 0) {
      text = `🎈 *Squeak!* ${text}`;
      audio.playHeliumChirp();
    }
    this.comicBubble = { text, timer: duration, x: this.x, y: this.y - 34 };
  }

  public render(ctx: CanvasRenderingContext2D, cam: { x: number; y: number }) {
    const sx = Math.round(this.x - cam.x - 16);
    const sy = Math.round(this.y - cam.y - 16);

    // Golden God Mode Aura
    if (this.isGodMode) {
      const pulse = 1 + Math.sin(performance.now() * 0.008) * 0.25;
      ctx.save();
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(this.x - cam.x, this.y - cam.y + 4, 16 * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    const outfitKey = this.outfit === 'scholar' ? 'academic' : this.outfit;
    let key: string | null = null;
    if (this.actionState === 'hammer') {
      key = `char_${outfitKey}_hammer`;
    } else if (this.actionState === 'lens') {
      key = `char_${outfitKey}_lens`;
    } else if (this.actionState === 'tackle') {
      key = `char_${outfitKey}_tackle`;
    } else if (this.idleType === 'pushup') {
      key = `char_${outfitKey}_pushup_${this.idleFrame}`;
    } else if (this.idleType === 'coffee') {
      key = `char_${outfitKey}_coffee_${this.idleFrame}`;
    } else {
      key = `char_${outfitKey}_${this.direction}_${this.walkFrame}`;
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
      const textWidth = ctx.measureText(b.text).width;
      const pad = 6;
      const bw = textWidth + pad * 2;
      const bh = 18;

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(bx - bw / 2, by - bh, bw, bh);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx - bw / 2, by - bh, bw, bh);

      // Tail
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(bx - 3, by);
      ctx.lineTo(bx + 3, by);
      ctx.lineTo(bx, by + 4);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.text, bx, by - bh / 2);
      ctx.restore();
    }
  }
}
