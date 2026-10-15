// World Map, Tile Layout, Zone Partitioning & Hotspot Management
// 3 Connected Themed Zones: Academic Wing -> Subsurface Lab -> Rig Floor

import { TILE_SIZE } from './sprites.js';

export const MAP_COLS = 60;
export const MAP_ROWS = 22;

export class WorldMap {
  constructor() {
    this.cols = MAP_COLS;
    this.rows = MAP_ROWS;
    this.width = this.cols * TILE_SIZE;
    this.height = this.rows * TILE_SIZE;

    // Grid representations: 0 = walkable, 1 = solid collision
    this.collisionGrid = Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
    // Tile texture grid
    this.floorGrid = Array(this.rows).fill(0).map(() => Array(this.cols).fill('floor_academic'));
    this.wallGrid = Array(this.rows).fill(0).map(() => Array(this.cols).fill(null));

    // Props list to render
    this.props = [];

    // Interactive Hotspots list
    this.hotspots = [];

    this.buildMap();
  }

  buildMap() {
    // 1. Build Base Floor & Wall Structure
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        // Outer boundaries are solid walls
        if (r === 0 || r === 1 || r === this.rows - 1 || c === 0 || c === this.cols - 1) {
          this.collisionGrid[r][c] = 1;
        }

        // Zone Floor Assignment
        if (c < 20) {
          // Zone A: Academic Wing
          this.floorGrid[r][c] = (r >= 9 && r <= 13 && c >= 3 && c <= 17) ? 'floor_academic_carpet' : 'floor_academic';
          if (r <= 1) this.wallGrid[r][c] = 'wall_academic';
        } else if (c < 40) {
          // Zone B: Subsurface Interpretation Lab
          this.floorGrid[r][c] = (c % 4 === 0 && r >= 4 && r <= 18) ? 'floor_lab_vent' : 'floor_lab';
          if (r <= 1) this.wallGrid[r][c] = 'wall_lab';
        } else {
          // Zone C: Rig Floor & Doghouse
          this.floorGrid[r][c] = (r === 2 || r === this.rows - 2 || (c === 40 && r >= 3 && r <= 19)) ? 'floor_rig_hazard' : 'floor_rig';
          if (r <= 1) this.wallGrid[r][c] = 'wall_rig';
        }

        // Dividing Walls between Zones with Open Archway Doors (Rows 9-13 are open)
        if (c === 20 || c === 40) {
          if (r < 9 || r > 13) {
            this.collisionGrid[r][c] = 1;
            this.wallGrid[r][c] = (c === 20) ? 'wall_academic' : 'wall_lab';
          }
        }
      }
    }

    // 2. Add Props and Decor in Zone A: Academic Wing (c: 1..19)
    // Bookshelves on the north wall
    this.addProp('prop_bookshelf', 2 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);
    this.addProp('prop_bookshelf', 4 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);
    this.addProp('prop_bookshelf', 14 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);
    this.addProp('prop_bookshelf', 16 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);

    // Hotspot 4: Foundations Archive & Thesis Pedestal (IIT ISM Dhanbad & Jadavpur Univ)
    this.addProp('prop_thesis_pedestal', 8 * TILE_SIZE, 5 * TILE_SIZE, 48, 48, true);
    this.addHotspot({
      id: 'foundations_archive',
      title: 'Academic Theses & Machine Learning Archive',
      zone: 'Academic Wing',
      x: 8 * TILE_SIZE,
      y: 5 * TILE_SIZE,
      width: 48,
      height: 48,
      triggerRadius: 44
    });

    // Hotspot 5: Pre-Professional Industry Internships (OIL Assam & SAIL Dalli-Rajhara)
    this.addProp('prop_bookshelf', 2 * TILE_SIZE, 15 * TILE_SIZE, 32, 48, true);
    this.addHotspot({
      id: 'industry_internships',
      title: 'Industry Internships Archive (OIL & SAIL)',
      zone: 'Academic Wing',
      x: 2 * TILE_SIZE,
      y: 15 * TILE_SIZE,
      width: 32,
      height: 48,
      triggerRadius: 40
    });

    // Hotspot 6: Geological Fieldwork Expeditions (Chandipur, Chhota Nagpur, Ghatsila)
    this.addProp('prop_thesis_pedestal', 14 * TILE_SIZE, 15 * TILE_SIZE, 48, 48, true);
    this.addHotspot({
      id: 'fieldwork_exhibits',
      title: 'Geological Field Mapping & Facies Expeditions',
      zone: 'Academic Wing',
      x: 14 * TILE_SIZE,
      y: 15 * TILE_SIZE,
      width: 48,
      height: 48,
      triggerRadius: 44
    });

    // Hotspot 7: Athletics, Leadership & Certifications (Football Championship & High-Altitude Trekking)
    this.addProp('prop_trophy_cabinet', 2 * TILE_SIZE, 7 * TILE_SIZE, 48, 48, true);
    this.addHotspot({
      id: 'trophies_certifications',
      title: 'Athletics, Leadership & Certifications',
      zone: 'Academic Wing',
      x: 2 * TILE_SIZE,
      y: 7 * TILE_SIZE,
      width: 48,
      height: 48,
      triggerRadius: 44
    });

    // 3. Add Props and Decor in Zone B: Subsurface Lab (c: 21..39)
    // Hotspot 1: Subsurface Interpretation Workstations (Petrel, PaleoScan, QGIS, DSPetrophysics)
    this.addProp('prop_workstation', 26 * TILE_SIZE, 4 * TILE_SIZE, 64, 48, true);
    this.addHotspot({
      id: 'subsurface_workstations',
      title: 'Subsurface Interpretation Workstation (Petrel & PaleoScan)',
      zone: 'Command Lab',
      x: 26 * TILE_SIZE,
      y: 4 * TILE_SIZE,
      width: 64,
      height: 48,
      triggerRadius: 50
    });

    this.addProp('prop_workstation', 34 * TILE_SIZE, 4 * TILE_SIZE, 64, 48, true);
    this.addHotspot({
      id: 'prospect_generation',
      title: 'Exploration Prospect Maturation (BExB & EPMB Blocks)',
      zone: 'Command Lab',
      x: 34 * TILE_SIZE,
      y: 4 * TILE_SIZE,
      width: 64,
      height: 48,
      triggerRadius: 50
    });

    // Hotspot 2: Glowing H2 & He Gas Canisters (Unconventional Clean Energy)
    this.addProp('prop_gas_tanks', 28 * TILE_SIZE, 15 * TILE_SIZE, 48, 48, true);
    this.addHotspot({
      id: 'unconventional_gas',
      title: 'Unconventional Frontier: Natural Hydrogen (H2) & Helium (He)',
      zone: 'Command Lab',
      x: 28 * TILE_SIZE,
      y: 15 * TILE_SIZE,
      width: 48,
      height: 48,
      triggerRadius: 46
    });

    // Additional Workstation / PDA Analysis Center
    this.addProp('prop_workstation', 34 * TILE_SIZE, 15 * TILE_SIZE, 64, 48, true);
    this.addHotspot({
      id: 'pda_analysis',
      title: 'Pore Pressure & Drillability Analysis (PDA)',
      zone: 'Command Lab',
      x: 34 * TILE_SIZE,
      y: 15 * TILE_SIZE,
      width: 64,
      height: 48,
      triggerRadius: 50
    });

    // 4. Add Props and Decor in Zone C: Rig Floor & Doghouse (c: 41..59)
    // Drill pipe racks on north side
    this.addProp('prop_pipe_rack', 42 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);
    this.addProp('prop_pipe_rack', 44 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);
    this.addProp('prop_pipe_rack', 56 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);

    // Rotating Hazard Beacon
    this.addProp('prop_beacon', 48 * TILE_SIZE, 1 * TILE_SIZE, 32, 32, true);
    this.addProp('prop_beacon', 54 * TILE_SIZE, 1 * TILE_SIZE, 32, 32, true);

    // Hotspot 3: Mud Shaker & Doghouse Real-Time Surveillance
    this.addProp('prop_mud_shaker', 45 * TILE_SIZE, 6 * TILE_SIZE, 64, 48, true);
    this.addHotspot({
      id: 'rig_mudshaker',
      title: 'Real-Time Cuttings Lithology & Hydrocarbon Surveillance',
      zone: 'Rig Floor',
      x: 45 * TILE_SIZE,
      y: 6 * TILE_SIZE,
      width: 64,
      height: 48,
      triggerRadius: 52
    });

    // Active Doghouse Cabin & Cement Squeeze Supervision
    this.addProp('prop_mud_shaker', 52 * TILE_SIZE, 14 * TILE_SIZE, 64, 48, true);
    this.addHotspot({
      id: 'rig_doghouse_ops',
      title: 'Wellsite Operations, Formation Tops & Cement Squeeze Oversight',
      zone: 'Rig Floor',
      x: 52 * TILE_SIZE,
      y: 14 * TILE_SIZE,
      width: 64,
      height: 48,
      triggerRadius: 52
    });
  }

  addProp(spriteId, x, y, width, height, isCollidable = true) {
    this.props.push({ spriteId, x, y, width, height });
    if (isCollidable) {
      // Mark collision grid
      const startC = Math.floor(x / TILE_SIZE);
      const endC = Math.floor((x + width - 1) / TILE_SIZE);
      const startR = Math.floor(y / TILE_SIZE);
      const endR = Math.floor((y + height - 1) / TILE_SIZE);

      for (let r = startR; r <= endR; r++) {
        for (let c = startC; c <= endC; c++) {
          if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
            this.collisionGrid[r][c] = 1;
          }
        }
      }
    }
  }

  addHotspot(hotspot) {
    this.hotspots.push(hotspot);
  }

  // Determine current zone based on player X coordinate
  getZone(px) {
    if (px < 20 * TILE_SIZE) {
      return {
        id: 'academic',
        name: 'Academic & Early Foundations Wing',
        desc: 'IIT (ISM) Dhanbad, Jadavpur University, ML Theses, Internships & Fieldwork'
      };
    } else if (px < 40 * TILE_SIZE) {
      return {
        id: 'lab',
        name: 'Subsurface Interpretation Command Lab',
        desc: 'ONGC Vindhyan Block, Petrel, PaleoScan, Unconventional H2 & He Exploration'
      };
    } else {
      return {
        id: 'rig',
        name: 'Rig Floor & Doghouse Telemetry',
        desc: 'Active Drilling Ops, Real-Time Formation Tops, Mud Gas & Cuttings Surveillance'
      };
    }
  }

  // Check if a bounding box collides with walls or props
  checkCollision(x, y, w = 18, h = 14) {
    // Check against map bounds
    if (x < 16 || x + w > this.width - 16 || y < 32 || y + h > this.height - 16) {
      return true;
    }

    const startC = Math.floor(x / TILE_SIZE);
    const endC = Math.floor((x + w) / TILE_SIZE);
    const startR = Math.floor(y / TILE_SIZE);
    const endR = Math.floor((y + h) / TILE_SIZE);

    for (let r = startR; r <= endR; r++) {
      for (let c = startC; c <= endC; c++) {
        if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
          if (this.collisionGrid[r][c] === 1) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // Find nearest hotspot to player position
  getNearbyHotspot(px, py) {
    for (const h of this.hotspots) {
      const centerX = h.x + h.width / 2;
      const centerY = h.y + h.height / 2;
      const dist = Math.hypot(px - centerX, py - centerY);
      if (dist <= h.triggerRadius) {
        return h;
      }
    }
    return null;
  }

  // Render ground, walls, and props
  render(ctx, camera) {
    const startCol = Math.max(0, Math.floor(camera.x / TILE_SIZE));
    const endCol = Math.min(this.cols - 1, Math.ceil((camera.x + camera.width) / TILE_SIZE));
    const startRow = Math.max(0, Math.floor(camera.y / TILE_SIZE));
    const endRow = Math.min(this.rows - 1, Math.ceil((camera.y + camera.height) / TILE_SIZE));

    // 1. Draw Floor Tiles
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const floorSpriteId = this.floorGrid[r][c];
        const sprite = window.spriteFactory.get(floorSpriteId);
        if (sprite) {
          ctx.drawImage(sprite, c * TILE_SIZE - camera.x, r * TILE_SIZE - camera.y);
        }
      }
    }

    // 2. Draw Wall Tiles
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const wallSpriteId = this.wallGrid[r][c];
        if (wallSpriteId) {
          const sprite = window.spriteFactory.get(wallSpriteId);
          if (sprite) {
            ctx.drawImage(sprite, c * TILE_SIZE - camera.x, r * TILE_SIZE - camera.y);
          }
        }
      }
    }

    // 3. Draw Props
    this.props.forEach(p => {
      // Frustum culling
      if (
        p.x + p.width >= camera.x &&
        p.x <= camera.x + camera.width &&
        p.y + p.height >= camera.y &&
        p.y <= camera.y + camera.height
      ) {
        const sprite = window.spriteFactory.get(p.spriteId);
        if (sprite) {
          ctx.drawImage(sprite, p.x - camera.x, p.y - camera.y);
        }
      }
    });

    // 4. Draw Atmospheric Effects (Gas vapor glow & beacon flash)
    this.renderAtmosphere(ctx, camera);
  }

  renderAtmosphere(ctx, camera) {
    const time = performance.now() * 0.003;

    // Glowing Gas Canisters in Command Lab (x: 28*32, y: 15*32)
    const gx = 28 * TILE_SIZE + 24 - camera.x;
    const gy = 15 * TILE_SIZE + 24 - camera.y;
    if (gx >= -50 && gx <= camera.width + 50 && gy >= -50 && gy <= camera.height + 50) {
      const pulse = 0.2 + 0.1 * Math.sin(time * 2);
      // Cyan/green Hydrogen aura
      const gradH2 = ctx.createRadialGradient(gx - 10, gy, 4, gx - 10, gy, 32);
      gradH2.addColorStop(0, `rgba(52, 211, 153, ${pulse})`);
      gradH2.addColorStop(1, 'rgba(52, 211, 153, 0)');
      ctx.fillStyle = gradH2;
      ctx.beginPath();
      ctx.arc(gx - 10, gy, 32, 0, Math.PI * 2);
      ctx.fill();

      // Violet/purple Helium aura
      const gradHe = ctx.createRadialGradient(gx + 10, gy, 4, gx + 10, gy, 32);
      gradHe.addColorStop(0, `rgba(168, 85, 247, ${pulse})`);
      gradHe.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = gradHe;
      ctx.beginPath();
      ctx.arc(gx + 10, gy, 32, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rotating Amber Beacon in Rig Floor (x: 48*32, y: 1*32)
    const bx = 48 * TILE_SIZE + 16 - camera.x;
    const by = 1 * TILE_SIZE + 16 - camera.y;
    if (bx >= -50 && bx <= camera.width + 50 && by >= -50 && by <= camera.height + 50) {
      const beaconFlash = (Math.sin(time * 4) + 1) * 0.5;
      const gradBeacon = ctx.createRadialGradient(bx, by, 6, bx, by, 48);
      gradBeacon.addColorStop(0, `rgba(245, 158, 11, ${beaconFlash * 0.4})`);
      gradBeacon.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = gradBeacon;
      ctx.beginPath();
      ctx.arc(bx, by, 48, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
