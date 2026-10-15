// Player Entity: Controls, Physics, Collision Humor, Dynamic Outfit Swapping & Idle Antics

import { TILE_SIZE } from './sprites.js';
import { COMIC_BUBBLES } from '../data/profile.js';
import { sound } from './sound.js';

export class Player {
  constructor(startX = 10 * TILE_SIZE, startY = 11 * TILE_SIZE) {
    this.x = startX;
    this.y = startY;
    this.width = 20;
    this.height = 14; // hitbox at feet

    this.speed = 2.6;
    this.direction = 'down';
    this.walkFrame = 0;
    this.walkTimer = 0;
    this.isMoving = false;

    // Dynamic Outfit State
    this.outfit = 'academic'; // 'academic' | 'lab' | 'rig'
    this.currentZoneId = 'academic';

    // Idle Antics State
    this.idleTime = 0; // in seconds
    this.idleType = 'none'; // 'none' | 'pushup' | 'lens'
    this.idleFrame = 0;
    this.idleTimer = 0;

    // Collision Humor Bubble
    this.comicBubble = null;
    this.lastBumpTime = 0;

    // Footstep Sound Throttle
    this.stepSoundTimer = 0;
  }

  update(dt, input, worldMap) {
    let dx = 0;
    let dy = 0;

    if (input.left) {
      dx -= 1;
      this.direction = 'left';
    }
    if (input.right) {
      dx += 1;
      this.direction = 'right';
    }
    if (input.up) {
      dy -= 1;
      this.direction = 'up';
    }
    if (input.down) {
      dy += 1;
      this.direction = 'down';
    }

    // Diagonal movement normalization
    if (dx !== 0 && dy !== 0) {
      const invSqrt2 = 0.7071;
      dx *= invSqrt2;
      dy *= invSqrt2;
    }

    this.isMoving = (dx !== 0 || dy !== 0);

    if (this.isMoving) {
      // Reset idle timer
      this.idleTime = 0;
      this.idleType = 'none';

      const moveX = dx * this.speed;
      const moveY = dy * this.speed;

      // Test X movement & collision
      let targetX = this.x + moveX;
      let targetY = this.y + moveY;

      let collidedX = worldMap.checkCollision(targetX - 9, this.y + 12, 18, 12);
      if (!collidedX) {
        this.x = targetX;
      } else {
        this.handleCollisionBump();
      }

      // Test Y movement & collision
      let collidedY = worldMap.checkCollision(this.x - 9, targetY + 12, 18, 12);
      if (!collidedY) {
        this.y = targetY;
      } else {
        this.handleCollisionBump();
      }

      // Animate walking frame
      this.walkTimer += dt;
      if (this.walkTimer > 0.14) {
        this.walkTimer = 0;
        this.walkFrame = (this.walkFrame + 1) % 4;
      }

      // Play Footstep sound
      this.stepSoundTimer += dt;
      if (this.stepSoundTimer > 0.32) {
        this.stepSoundTimer = 0;
        sound.playStep();
      }
    } else {
      this.walkFrame = 0;

      // Track Idle Antics (>4.0 seconds triggers antics)
      this.idleTime += dt;
      if (this.idleTime >= 4.0) {
        if (this.idleType === 'none') {
          // Choose randomly between pushups and 10x hand lens inspection
          this.idleType = Math.random() < 0.5 ? 'pushup' : 'lens';
          this.idleFrame = 0;
          this.idleTimer = 0;
          sound.playIdleSparkle();
        }

        // Animate idle antics
        this.idleTimer += dt;
        const frameSpeed = this.idleType === 'pushup' ? 0.35 : 0.6;
        if (this.idleTimer > frameSpeed) {
          this.idleTimer = 0;
          this.idleFrame = (this.idleFrame + 1) % 2;
        }
      }
    }

    // Check & Handle Dynamic Outfit Swapping based on Zone
    this.updateOutfitByZone(worldMap);

    // Update Comic Bubble
    if (this.comicBubble) {
      this.comicBubble.timer -= dt;
      this.comicBubble.y -= dt * 10; // gently float upward
      if (this.comicBubble.timer <= 0) {
        this.comicBubble = null;
      }
    }
  }

  // Outfit & Zone Tracking
  updateOutfitByZone(worldMap) {
    const zone = worldMap.getZone(this.x);
    if (zone.id !== this.currentZoneId) {
      const prevZone = this.currentZoneId;
      this.currentZoneId = zone.id;
      this.outfit = zone.id; // 'academic' | 'lab' | 'rig'

      sound.playZoneTransition();

      // Trigger UI Toast for zone & outfit change
      window.dispatchEvent(new CustomEvent('zone-changed', {
        detail: {
          zoneId: zone.id,
          zoneName: zone.name,
          desc: zone.desc,
          outfit: this.outfit
        }
      }));
    }
  }

  // Trigger floating comic speech bubble when bumping into obstacle
  handleCollisionBump() {
    const now = performance.now();
    if (now - this.lastBumpTime > 2400) { // 2.4s cooldown
      this.lastBumpTime = now;
      const text = COMIC_BUBBLES[Math.floor(Math.random() * COMIC_BUBBLES.length)];
      this.comicBubble = {
        text: text,
        timer: 2.2, // displays for 2.2 seconds
        x: this.x,
        y: this.y - 36
      };
      sound.playBump();
    }
  }

  render(ctx, camera) {
    const screenX = Math.round(this.x - camera.x - 16);
    const screenY = Math.round(this.y - camera.y - 16);

    let spriteKey = null;

    if (this.idleType === 'pushup') {
      spriteKey = `player_${this.outfit}_idle_pushup_${this.idleFrame}`;
    } else if (this.idleType === 'lens') {
      spriteKey = `player_${this.outfit}_idle_lens_${this.idleFrame}`;
    } else {
      spriteKey = `player_${this.outfit}_${this.direction}_${this.walkFrame}`;
    }

    const sprite = window.spriteFactory.get(spriteKey);
    if (sprite) {
      ctx.drawImage(sprite, screenX, screenY);
    }

    // Render Comic Bubble if active
    if (this.comicBubble) {
      this.renderComicBubble(ctx, camera);
    }
  }

  renderComicBubble(ctx, camera) {
    const bubble = this.comicBubble;
    const bx = Math.round(bubble.x - camera.x);
    const by = Math.round(bubble.y - camera.y);

    ctx.save();
    ctx.font = '10px "Press Start 2P", monospace, sans-serif';
    const textWidth = ctx.measureText(bubble.text).width;
    const boxW = textWidth + 16;
    const boxH = 22;
    const left = bx - boxW / 2;
    const top = by - boxH;

    const alpha = Math.min(1, bubble.timer * 1.5);
    ctx.globalAlpha = alpha;

    // Comic speech bubble background (White with thick black border)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2;

    // Rounded rectangle
    ctx.beginPath();
    ctx.roundRect(left, top, boxW, boxH, 6);
    ctx.fill();
    ctx.stroke();

    // Little pointer arrow pointing down to player's head
    ctx.beginPath();
    ctx.moveTo(bx - 4, top + boxH);
    ctx.lineTo(bx + 4, top + boxH);
    ctx.lineTo(bx, top + boxH + 6);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.stroke();

    // Text inside bubble
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bubble.text, bx, top + boxH / 2);

    ctx.restore();
  }
}
