import { sprites, TILE_SIZE, MAP_COLS, MAP_ROWS } from './sprites';
import { Hotspot, PropItem, RockOutcrop, Achievement } from '../types/game';

export class GameMap {
  public cols: number = MAP_COLS;
  public rows: number = MAP_ROWS;
  public width: number = MAP_COLS * TILE_SIZE;
  public height: number = MAP_ROWS * TILE_SIZE;

  public solidGrid: number[][];
  public floorGrid: string[][];
  public wallGrid: (string | null)[][];

  public props: PropItem[] = [];
  public hotspots: Hotspot[] = [];
  public rockOutcrops: RockOutcrop[] = [];

  constructor() {
    this.solidGrid = Array(this.rows).fill(0).map(() => Array(this.cols).fill(0));
    this.floorGrid = Array(this.rows).fill(0).map(() => Array(this.cols).fill('tile_floor_acad'));
    this.wallGrid = Array(this.rows).fill(0).map(() => Array(this.cols).fill(null));

    this.generateLayout();
  }

  public generateLayout() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        // Outer boundaries
        if (r <= 1 || r === this.rows - 1 || c === 0 || c === this.cols - 1) {
          this.solidGrid[r][c] = 1;
        }

        // ZONE 1: ALMA MATER & EXPEDITION COURTYARD (Cols 0 to 19)
        if (c < 20) {
          if (c < 10) {
            this.floorGrid[r][c] = (r >= 8 && r <= 14 && c >= 2 && c <= 8) ? 'tile_floor_carpet' : 'tile_floor_acad';
            if (r <= 1) this.wallGrid[r][c] = 'tile_wall_acad';
          } else {
            this.floorGrid[r][c] = (c === 10 || r === 11 || (r >= 9 && r <= 13 && c === 15)) ? 'tile_floor_stone' : 'tile_floor_grass';
            if (r <= 1) this.wallGrid[r][c] = 'tile_wall_brick';
          }

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
    // ZONE 1 PROPS: ALMA MATER & COURTYARD
    // -------------------------------------------------------------
    this.addProp('prop_bookshelf', 2 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);
    this.addProp('prop_bookshelf', 4 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);
    this.addProp('prop_bookshelf', 6 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);

    this.addProp('prop_epma_terminal', 2 * TILE_SIZE, 5 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_epma', 'EPMA Geochemistry & Python ML Terminal', 2 * TILE_SIZE, 5 * TILE_SIZE, 64, 48, 'minigame_kimberlite');

    this.addProp('prop_marine_lab', 5 * TILE_SIZE, 5 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_marine', 'Marine Biogeochemistry Lab Bench (Jadavpur Fe Aerosols)', 5 * TILE_SIZE, 5 * TILE_SIZE, 64, 48);

    this.addProp('prop_fossil_case', 2 * TILE_SIZE, 9 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_fossil', 'Glass Mineral & Fossil Display Case (Pyrope, Quartz, BIF)', 2 * TILE_SIZE, 9 * TILE_SIZE, 48, 48);

    this.addProp('prop_field_table', 5 * TILE_SIZE, 9 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_field', 'Expedition Field Mapping Table (Brunton Compass & Topo Maps)', 5 * TILE_SIZE, 9 * TILE_SIZE, 64, 48);

    this.addProp('prop_gym_bench', 2 * TILE_SIZE, 14 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_gym', 'Heavy Gym Barbell Rack (Loaded Core-Box Weights)', 2 * TILE_SIZE, 14 * TILE_SIZE, 64, 48);

    this.addProp('prop_trophy_media', 5 * TILE_SIZE, 14 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_media', 'Academic Trophies & Media Desk (Flysch 22 / Lithify 19)', 5 * TILE_SIZE, 14 * TILE_SIZE, 64, 48);

    this.addProp('prop_football_pitch', 11 * TILE_SIZE, 3 * TILE_SIZE, 160, 110, true);
    this.addHotspot('hotspot_football', 'Centre-Back Pitch (Press [F] for Slide Tackle!)', 11 * TILE_SIZE, 3 * TILE_SIZE, 160, 110, 'slide_tackle');

    this.addProp('prop_art_easel', 11 * TILE_SIZE, 14 * TILE_SIZE, 32, 48, true);
    this.addHotspot('hotspot_art', 'Fine-Art Acrylic Painting Easel (Rajdeep Tarafder)', 11 * TILE_SIZE, 14 * TILE_SIZE, 32, 48, 'art_exhibit');

    this.addProp('prop_trekking_camp', 14 * TILE_SIZE, 13 * TILE_SIZE, 96, 64, true);
    this.addHotspot('hotspot_trekking', 'Himalayan Expedition Camp (Dafeybhir Pass Sikkim)', 14 * TILE_SIZE, 13 * TILE_SIZE, 96, 64);

    this.addProp('prop_pedestal', 8 * TILE_SIZE, 3 * TILE_SIZE, 32, 48, true);
    this.addHotspot('hotspot_thesis', 'Academic Foundations & M.Sc. ML Thesis', 8 * TILE_SIZE, 3 * TILE_SIZE, 32, 48);

    // -------------------------------------------------------------
    // ZONE 2 PROPS: ONGC SUBSURFACE INTERPRETATION COMMAND
    // -------------------------------------------------------------
    this.addProp('prop_petrel_desk', 23 * TILE_SIZE, 4 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_petrel', 'Petrel & PaleoScan Seismic Workstation', 23 * TILE_SIZE, 4 * TILE_SIZE, 64, 48, 'minigame_seismic');

    this.addProp('prop_plotter_roll', 29 * TILE_SIZE, 4 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_plotter', 'Wide-Format GIS Map Plotter (Vindhyan Prospect Folios)', 29 * TILE_SIZE, 4 * TILE_SIZE, 64, 48);

    this.addProp('prop_gas_canisters', 35 * TILE_SIZE, 4 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_helium', 'Unconventional Natural H2 & Helium (He) Canisters', 35 * TILE_SIZE, 4 * TILE_SIZE, 48, 48, 'helium_gag');

    this.addProp('prop_office_cubicle', 23 * TILE_SIZE, 9 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_cubicle', 'G&G Interpretation Office Cubicle & Well Dockets', 23 * TILE_SIZE, 9 * TILE_SIZE, 64, 48);

    this.addProp('prop_gis_table', 29 * TILE_SIZE, 9 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_sar', 'Holographic GIS & Sentinel-1 SAR Analysis Table', 29 * TILE_SIZE, 9 * TILE_SIZE, 64, 48, 'minigame_sar');

    this.addProp('prop_server_racks', 35 * TILE_SIZE, 9 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_servers', 'High-Performance Seismic & MEM Compute Cluster', 35 * TILE_SIZE, 9 * TILE_SIZE, 48, 48);

    this.addProp('prop_paleoscan_desk', 23 * TILE_SIZE, 14 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_pda_lab', 'PaleoScan RGT Model & 3D Mechanical Earth Model (MEM)', 23 * TILE_SIZE, 14 * TILE_SIZE, 64, 48);

    this.addProp('prop_conference_room', 29 * TILE_SIZE, 14 * TILE_SIZE, 80, 48, true);
    this.addHotspot('hotspot_conference', 'Management Review Conference Room (BExB/EPMB Defense)', 29 * TILE_SIZE, 14 * TILE_SIZE, 80, 48);

    this.addProp('prop_core_shelves', 36 * TILE_SIZE, 14 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_cores', 'Basin Core Repository (Vindhyan & Son Valley Drill Cores)', 36 * TILE_SIZE, 14 * TILE_SIZE, 48, 48);

    this.addProp('prop_internship_locker', 24 * TILE_SIZE, 18 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_internship', 'Industry Internship Archive (OIL Assam & SAIL Mines)', 24 * TILE_SIZE, 18 * TILE_SIZE, 48, 48);

    this.addProp('prop_breakroom', 35 * TILE_SIZE, 18 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_breakroom', 'Geologist Breakroom (Water Cooler & 3 AM Sticky Notes)', 35 * TILE_SIZE, 18 * TILE_SIZE, 48, 48);

    // -------------------------------------------------------------
    // ZONE 3 PROPS: ACTIVE RIG FLOOR - GDA-A SAMASTIPUR
    // -------------------------------------------------------------
    this.addProp('prop_derrick_rotary', 43 * TILE_SIZE, 3 * TILE_SIZE, 96, 80, true);
    this.addHotspot('hotspot_derrick', 'Drilling Derrick Mast & Rotary Table (Active Drilling)', 43 * TILE_SIZE, 3 * TILE_SIZE, 96, 80);

    this.addProp('prop_shale_shakers', 51 * TILE_SIZE, 3 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_shaker', 'Mud Shaker Cuttings & Hydrocarbon Shows (UV Cut)', 51 * TILE_SIZE, 3 * TILE_SIZE, 64, 48);

    this.addProp('prop_bop_stack', 56 * TILE_SIZE, 3 * TILE_SIZE, 48, 64, true);
    this.addHotspot('hotspot_bop', 'High-Pressure BOP Stack & Hydraulic Koomey Unit', 56 * TILE_SIZE, 3 * TILE_SIZE, 48, 64);

    this.addProp('prop_flare_stack', 48 * TILE_SIZE, 1 * TILE_SIZE, 32, 48, true);
    this.addHotspot('hotspot_flare', 'Rig Flare Boom & Mud Gas Degasser Stack', 48 * TILE_SIZE, 1 * TILE_SIZE, 32, 48);

    this.addProp('prop_pipe_rack', 43 * TILE_SIZE, 9 * TILE_SIZE, 96, 48, true);
    this.addHotspot('hotspot_piperack', '8.5" Drill Pipe Rack & Catwalk (Tubular Staging)', 43 * TILE_SIZE, 9 * TILE_SIZE, 96, 48);

    this.addProp('prop_mud_tanks', 51 * TILE_SIZE, 8 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_mudtanks', 'Active Mud Tanks & Motor Agitator Pits (1.28 SG Mud)', 51 * TILE_SIZE, 8 * TILE_SIZE, 64, 48);

    this.addProp('prop_drawworks', 56 * TILE_SIZE, 8 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_drawworks', 'Drawworks Drum & Driller Electronic Console', 56 * TILE_SIZE, 8 * TILE_SIZE, 48, 48);

    this.addProp('prop_cementing_unit', 43 * TILE_SIZE, 15 * TILE_SIZE, 64, 48, true);
    this.addHotspot('hotspot_cementing', 'High-Pressure Cementing Unit (8.5" Cement Squeeze at GDA-A)', 43 * TILE_SIZE, 15 * TILE_SIZE, 64, 48);

    this.addProp('prop_doghouse_cabin', 51 * TILE_SIZE, 14 * TILE_SIZE, 80, 48, true);
    this.addHotspot('hotspot_kick', 'Doghouse Pressure & Mud Logging Unit (Kill the Kick!)', 51 * TILE_SIZE, 14 * TILE_SIZE, 80, 48, 'minigame_kick');

    this.addProp('prop_diesel_generator', 56 * TILE_SIZE, 15 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_generator', 'Rig Prime Power Diesel Generator Skid', 56 * TILE_SIZE, 15 * TILE_SIZE, 48, 48);

    this.addProp('prop_rig_coffee_locker', 48 * TILE_SIZE, 16 * TILE_SIZE, 48, 48, true);
    this.addHotspot('hotspot_coffee', 'Rig Coffee Station & Safety PPE Locker (24h Shift Dodge)', 48 * TILE_SIZE, 16 * TILE_SIZE, 48, 48, 'minigame_shift');

    // 5 Geological Rock Outcrops
    const rockLocations = [
      { x: 18 * TILE_SIZE, y: 15 * TILE_SIZE, name: 'Sedimentary Outcrop (Chandipur Facies & Walther Log)', type: 'dolomite' },
      { x: 18 * TILE_SIZE, y: 7 * TILE_SIZE, name: 'Ghatsila Structural Quartz & Fold Axial Plane', type: 'quartz' },
      { x: 32 * TILE_SIZE, y: 18 * TILE_SIZE, name: 'Vindhyan Rohtas Limestone & Chert Outcrop', type: 'garnet' },
      { x: 47 * TILE_SIZE, y: 7 * TILE_SIZE, name: 'Bundelkhand Archean Granite Float (He Carrier)', type: 'helium' },
      { x: 55 * TILE_SIZE, y: 13 * TILE_SIZE, name: 'Precambrian High-Grade Gneissic Sample', type: 'bif' }
    ];

    rockLocations.forEach((loc, i) => {
      this.addProp('prop_rock_outcrop', loc.x, loc.y, 32, 32, true);
      this.addHotspot(`rock_${i}`, loc.name, loc.x, loc.y, 32, 32, 'minigame_rock');
      this.rockOutcrops.push(loc);
    });
  }

  public addProp(spriteKey: string, x: number, y: number, width: number, height: number, isSolid: boolean = true) {
    this.props.push({ id: `prop_${this.props.length}`, spriteKey, x, y, width, height, isSolid });
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

  public addHotspot(id: string, title: string, x: number, y: number, width: number, height: number, specialType?: string) {
    this.hotspots.push({ id, title, x, y, width, height, specialType });
  }

  public spawnAchievementPedestal(achievement: Achievement) {
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

  public isSolid(x: number, y: number, w: number = 18, h: number = 12): boolean {
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

  public getNearbyHotspot(px: number, py: number): Hotspot | null {
    for (const h of this.hotspots) {
      const cx = h.x + h.width / 2;
      const cy = h.y + h.height / 2;
      if (Math.hypot(px - cx, py - cy) <= 48) return h;
    }
    return null;
  }

  public getZone(px: number): { id: 'academic' | 'lab' | 'rig'; name: string; desc: string } {
    if (px < 20 * TILE_SIZE) {
      return { id: 'academic', name: 'Alma Mater & Art/Gym Wing', desc: 'IIT (ISM) Dhanbad, Jadavpur Univ & Geological Expeditions' };
    } else if (px < 40 * TILE_SIZE) {
      return { id: 'lab', name: 'Subsurface Interpretation Command Lab', desc: 'Petrel, PaleoScan, 3D MEM & Unconventional H2/He Exploration' };
    } else {
      return { id: 'rig', name: 'Active Rig Floor & Doghouse', desc: 'Real-Time Drilling, Cuttings Lithology & GDA-A Cement Squeeze' };
    }
  }

  public render(ctx: CanvasRenderingContext2D, cam: { x: number; y: number; width: number; height: number }) {
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
        const sprite = sprites.get(p.spriteKey);
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
