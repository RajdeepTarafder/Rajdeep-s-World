// Procedural 16-bit Retro Pixel Art Generator
// Zero external image files - all drawn via crisp canvas pixel buffers

export const TILE_SIZE = 32;

// Utility to create a crisp pixel-art canvas buffer
function makeBuffer(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

// Generate all static and animated sprites into an indexed registry
export class SpriteFactory {
  constructor() {
    this.sprites = {};
    this.init();
  }

  init() {
    this.generateFloorTiles();
    this.generateWallTiles();
    this.generateFurnitureProps();
    this.generateCharacterSprites();
  }

  get(id) {
    return this.sprites[id] || null;
  }

  // 1. FLOOR TILES (32x32)
  generateFloorTiles() {
    // A: Academic Parquet Wood Tile
    {
      const { canvas, ctx } = makeBuffer(32, 32);
      ctx.fillStyle = '#8B5A2B';
      ctx.fillRect(0, 0, 32, 32);
      // Wood plank pattern
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillRect(16, 16, 16, 16);
      ctx.fillStyle = '#6E3E1A';
      // Grain lines
      for (let y = 0; y < 32; y += 4) {
        ctx.fillRect(0, y, 32, 1);
      }
      ctx.fillStyle = '#4A2A10';
      ctx.fillRect(0, 0, 32, 1);
      ctx.fillRect(0, 0, 1, 32);
      ctx.fillRect(16, 0, 1, 32);
      this.sprites['floor_academic'] = canvas;
    }

    // Academic Carpet Runner (Red / Gold Trim)
    {
      const { canvas, ctx } = makeBuffer(32, 32);
      ctx.fillStyle = '#8B5A2B';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#801818';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#DAA520';
      ctx.fillRect(4, 4, 24, 2);
      ctx.fillRect(4, 26, 24, 2);
      ctx.fillStyle = '#5A0E0E';
      ctx.fillRect(6, 6, 20, 20);
      this.sprites['floor_academic_carpet'] = canvas;
    }

    // B: Subsurface Lab Slate / Cyber Tile
    {
      const { canvas, ctx } = makeBuffer(32, 32);
      ctx.fillStyle = '#1E293B'; // Slate dark blue
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#334155';
      ctx.fillRect(1, 1, 30, 30);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 32, 1);
      ctx.fillRect(0, 0, 1, 32);
      // Subtle circuit / cyber accent dot
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(15, 15, 2, 2);
      this.sprites['floor_lab'] = canvas;
    }

    // Lab Grid Server Floor Vent
    {
      const { canvas, ctx } = makeBuffer(32, 32);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#1E293B';
      for (let x = 2; x < 30; x += 4) {
        ctx.fillRect(x, 2, 2, 28);
      }
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(0, 0, 32, 1);
      ctx.fillRect(0, 31, 32, 1);
      this.sprites['floor_lab_vent'] = canvas;
    }

    // C: Rig Floor Industrial Steel Diamond Plate
    {
      const { canvas, ctx } = makeBuffer(32, 32);
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#64748B';
      // Diamond grating notches
      for (let y = 2; y < 32; y += 8) {
        for (let x = 2; x < 32; x += 8) {
          ctx.fillRect(x + 2, y, 3, 2);
          ctx.fillRect(x, y + 4, 3, 2);
        }
      }
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 32, 1);
      ctx.fillRect(0, 0, 1, 32);
      this.sprites['floor_rig'] = canvas;
    }

    // Rig Floor Hazard Stripes
    {
      const { canvas, ctx } = makeBuffer(32, 32);
      ctx.fillStyle = '#EAB308'; // Warning Yellow
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#18181B'; // Black diagonal hazard stripes
      ctx.beginPath();
      for (let i = -32; i < 64; i += 12) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 8, 0);
        ctx.lineTo(i + 8 + 32, 32);
        ctx.lineTo(i + 32, 32);
        ctx.closePath();
      }
      ctx.fill();
      this.sprites['floor_rig_hazard'] = canvas;
    }
  }

  // 2. WALL TILES (32x32)
  generateWallTiles() {
    // Academic Mahogany Wall with Framed Map
    {
      const { canvas, ctx } = makeBuffer(32, 32);
      ctx.fillStyle = '#3E1F0F';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#5A2E16';
      ctx.fillRect(2, 2, 28, 28);
      // Baseboard
      ctx.fillStyle = '#2A1408';
      ctx.fillRect(0, 26, 32, 6);
      // Small framed vintage map
      ctx.fillStyle = '#B8860B';
      ctx.fillRect(6, 6, 20, 14);
      ctx.fillStyle = '#FFF8DC';
      ctx.fillRect(8, 8, 16, 10);
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(10, 10, 5, 3);
      ctx.fillRect(17, 12, 4, 4);
      this.sprites['wall_academic'] = canvas;
    }

    // Lab High-Tech Server Rack Wall
    {
      const { canvas, ctx } = makeBuffer(32, 32);
      ctx.fillStyle = '#0B0F19';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(2, 2, 28, 28);
      // Server bays
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(4, 4, 24, 7);
      ctx.fillRect(4, 13, 24, 7);
      // Status LEDs (Green, Cyan, Amber)
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(6, 6, 2, 2);
      ctx.fillRect(10, 6, 2, 2);
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(6, 15, 2, 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(10, 15, 2, 2);
      // Glass sheen
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(2, 2, 12, 28);
      this.sprites['wall_lab'] = canvas;
    }

    // Rig Industrial Corrugated Steel Wall
    {
      const { canvas, ctx } = makeBuffer(32, 32);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#334155';
      for (let x = 2; x < 30; x += 4) {
        ctx.fillRect(x, 0, 2, 32);
      }
      // Heavy bolts
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(4, 4, 2, 2);
      ctx.fillRect(26, 4, 2, 2);
      ctx.fillRect(4, 26, 2, 2);
      ctx.fillRect(26, 26, 2, 2);
      // Pressure gauge
      ctx.fillStyle = '#CBD5E1';
      ctx.beginPath();
      ctx.arc(16, 14, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(15, 12, 2, 4);
      this.sprites['wall_rig'] = canvas;
    }
  }

  // 3. FURNITURE & INTERACTIVE PROPS
  generateFurnitureProps() {
    // Hotspot 1: Subsurface Dual-Monitor Workstation (64x48)
    {
      const { canvas, ctx } = makeBuffer(64, 48);
      // Desk Base
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(4, 20, 56, 26);
      ctx.fillStyle = '#334155';
      ctx.fillRect(2, 16, 60, 6);
      // Dual Monitors
      // Left Monitor (Petrel 3D seismic)
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(6, 2, 24, 16);
      ctx.fillStyle = '#0284C7'; // Blue seismic screen
      ctx.fillRect(8, 4, 20, 12);
      // Seismic wiggly traces
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(10, 6, 3, 2);
      ctx.fillRect(14, 8, 3, 2);
      ctx.fillRect(18, 7, 4, 2);
      ctx.fillStyle = '#EF4444'; // Red fault line
      ctx.fillRect(12, 5, 2, 9);
      // Right Monitor (PaleoScan Wheeler diagram)
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(34, 2, 24, 16);
      ctx.fillStyle = '#059669'; // Green horizon display
      ctx.fillRect(36, 4, 20, 12);
      ctx.fillStyle = '#F59E0B'; // Stratigraphic layer
      ctx.fillRect(38, 7, 16, 3);
      ctx.fillRect(38, 12, 16, 2);
      // Keyboard & Optical Mouse
      ctx.fillStyle = '#64748B';
      ctx.fillRect(18, 24, 16, 5);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(38, 25, 4, 4);
      this.sprites['prop_workstation'] = canvas;
    }

    // Hotspot 2: Glowing H2 & He Unconventional Gas Tanks (48x48)
    {
      const { canvas, ctx } = makeBuffer(48, 48);
      // Metal retention base
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 38, 40, 8);
      // Tank 1: Natural Hydrogen (Green/Cyan glow, H2)
      ctx.fillStyle = '#065F46';
      ctx.fillRect(8, 10, 14, 28);
      ctx.fillStyle = '#10B981'; // Green Body
      ctx.fillRect(9, 12, 12, 24);
      // Rounded top
      ctx.beginPath();
      ctx.arc(15, 12, 6, Math.PI, 0);
      ctx.fill();
      // Valve & Gauge
      ctx.fillStyle = '#D1D5DB';
      ctx.fillRect(13, 2, 4, 6);
      ctx.fillStyle = '#34D399';
      ctx.fillText = "H2";
      ctx.fillRect(11, 20, 8, 3); // Label plate

      // Tank 2: Helium Gas (Violet/Magenta glow, He)
      ctx.fillStyle = '#581C87';
      ctx.fillRect(26, 10, 14, 28);
      ctx.fillStyle = '#A855F7'; // Purple/Magenta Body
      ctx.fillRect(27, 12, 12, 24);
      ctx.beginPath();
      ctx.arc(33, 12, 6, Math.PI, 0);
      ctx.fill();
      // Valve & Gauge
      ctx.fillStyle = '#D1D5DB';
      ctx.fillRect(31, 2, 4, 6);
      ctx.fillStyle = '#E9D5FF';
      ctx.fillRect(29, 20, 8, 3); // Label plate
      this.sprites['prop_gas_tanks'] = canvas;
    }

    // Hotspot 3: Rig Floor Mud Shaker & Doghouse Screen (64x48)
    {
      const { canvas, ctx } = makeBuffer(64, 48);
      // Shale shaker heavy steel frame
      ctx.fillStyle = '#334155';
      ctx.fillRect(2, 14, 36, 30);
      // Vibrating screen mesh
      ctx.fillStyle = '#64748B';
      ctx.fillRect(6, 18, 28, 18);
      // Drilling mud stream (Brown/grey bentonite foam)
      ctx.fillStyle = '#78350F';
      ctx.fillRect(8, 20, 24, 12);
      ctx.fillStyle = '#D97706'; // Rock cuttings specks
      ctx.fillRect(10, 22, 3, 2);
      ctx.fillRect(18, 25, 4, 2);
      ctx.fillRect(26, 23, 3, 2);
      // Active Doghouse Telemetry Screen on stand (Right side)
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(42, 6, 20, 38);
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(44, 10, 16, 14);
      // Mud gas chromatograph bars (C1, C2, C3, C4, C5)
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(46, 16, 2, 6);
      ctx.fillRect(49, 14, 2, 8);
      ctx.fillStyle = '#EAB308';
      ctx.fillRect(52, 17, 2, 5);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(55, 19, 2, 3);
      // Alarm light
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(46, 28, 4, 4);
      this.sprites['prop_mud_shaker'] = canvas;
    }

    // Hotspot 4: Academic Foundations Archive & Thesis Pedestal (48x48)
    {
      const { canvas, ctx } = makeBuffer(48, 48);
      // Ornate marble pedestal
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(8, 22, 32, 22);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(6, 42, 36, 4);
      ctx.fillRect(6, 20, 36, 4);
      // Glass vitrine display
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fillRect(10, 6, 28, 14);
      ctx.strokeStyle = '#38BDF8';
      ctx.strokeRect(10, 6, 28, 14);
      // Golden M.Sc. Tech Thesis Book & EPMA Garnet Crystal
      ctx.fillStyle = '#B45309';
      ctx.fillRect(14, 12, 10, 6);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(16, 10, 8, 3);
      // Deep red almandine-pyrope garnet crystal
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.moveTo(30, 9);
      ctx.lineTo(33, 12);
      ctx.lineTo(30, 15);
      ctx.lineTo(27, 12);
      ctx.closePath();
      ctx.fill();
      // Sparkle
      ctx.fillStyle = '#FFF';
      ctx.fillRect(29, 11, 2, 2);
      this.sprites['prop_thesis_pedestal'] = canvas;
    }

    // Bookshelf (Library Archive) (32x48)
    {
      const { canvas, ctx } = makeBuffer(32, 48);
      ctx.fillStyle = '#3E1F0F';
      ctx.fillRect(0, 0, 32, 48);
      ctx.fillStyle = '#5A2E16';
      ctx.fillRect(2, 2, 28, 44);
      // Shelf planks
      ctx.fillStyle = '#2A1408';
      ctx.fillRect(2, 16, 28, 3);
      ctx.fillRect(2, 32, 28, 3);
      // Row 1 books (Multi-colored spines)
      const colors = ['#B91C1C', '#1D4ED8', '#047857', '#B45309', '#6D28D9'];
      let bx = 4;
      for (let c of colors) {
        ctx.fillStyle = c;
        ctx.fillRect(bx, 5, 4, 11);
        bx += 5;
      }
      // Row 2 books
      bx = 4;
      for (let c of ['#0369A1', '#C2410C', '#4338CA', '#15803D']) {
        ctx.fillStyle = c;
        ctx.fillRect(bx, 20, 5, 12);
        bx += 6;
      }
      // Row 3: Rolled geological field maps
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(4, 37, 24, 7);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(8, 37, 2, 7);
      ctx.fillRect(16, 37, 2, 7);
      this.sprites['prop_bookshelf'] = canvas;
    }

    // Geological Fieldwork & Sports Trophy Cabinet (48x48)
    {
      const { canvas, ctx } = makeBuffer(48, 48);
      ctx.fillStyle = '#1E1B18';
      ctx.fillRect(2, 4, 44, 40);
      ctx.fillStyle = '#42372B';
      ctx.fillRect(4, 6, 40, 36);
      // Gold Championship Football Trophy
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(12, 22, 8, 4); // base
      ctx.beginPath();
      ctx.arc(16, 16, 6, 0, Math.PI * 2);
      ctx.fill();
      // Mini football pattern
      ctx.fillStyle = '#18181B';
      ctx.fillRect(15, 15, 2, 2);
      // Alpine Trekking Boots & Ice Axe
      ctx.fillStyle = '#78350F';
      ctx.fillRect(28, 22, 6, 4);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(36, 12, 2, 14); // Axe shaft
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(34, 10, 7, 3); // Axe blade
      this.sprites['prop_trophy_cabinet'] = canvas;
    }

    // Drill Pipe Rack (Rig Floor) (32x48)
    {
      const { canvas, ctx } = makeBuffer(32, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 0, 32, 48);
      // Vertical stacked heavy drill pipes / tubulars
      for (let x = 3; x < 30; x += 6) {
        ctx.fillStyle = '#64748B';
        ctx.fillRect(x, 2, 4, 44);
        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(x + 1, 2, 2, 44);
        // Tool joints
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(x - 1, 6, 6, 4);
        ctx.fillRect(x - 1, 38, 6, 4);
      }
      this.sprites['prop_pipe_rack'] = canvas;
    }

    // Warning Strobe Beacon (Rig Floor) (32x32)
    {
      const { canvas, ctx } = makeBuffer(32, 32);
      // Heavy tripod pedestal
      ctx.fillStyle = '#334155';
      ctx.fillRect(12, 18, 8, 12);
      ctx.fillRect(8, 28, 16, 3);
      // Amber Flashing Dome
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(16, 14, 8, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(14, 10, 4, 4);
      this.sprites['prop_beacon'] = canvas;
    }
  }

  // 4. CHARACTER SPRITES (Rajdeep Tarafder in 3 Outfits + Idle Anims)
  generateCharacterSprites() {
    // 3 Outfits:
    // - "academic": Casual scholar (Navy button-down shirt, denim jeans, brown field boots)
    // - "lab": Tech Geologist (Stylish glasses, dark slate polo, ONGC badge lanyard)
    // - "rig": Wellsite Geologist (High-vis orange coveralls, reflective tape, bright yellow Hard Hat)
    const outfits = ['academic', 'lab', 'rig'];
    const directions = ['down', 'up', 'left', 'right'];

    outfits.forEach(outfit => {
      directions.forEach(dir => {
        // 4 walk frames per direction: 0 = idle standing, 1 = step left, 2 = idle, 3 = step right
        for (let frame = 0; frame < 4; frame++) {
          const { canvas, ctx } = makeBuffer(32, 32);
          this.drawAvatarFrame(ctx, outfit, dir, frame);
          this.sprites[`player_${outfit}_${dir}_${frame}`] = canvas;
        }
      });

      // Special Idle Animations:
      // A: Push-ups (reps: down & up, 2 frames)
      for (let rep = 0; rep < 2; rep++) {
        const { canvas, ctx } = makeBuffer(32, 32);
        this.drawPushupFrame(ctx, outfit, rep);
        this.sprites[`player_${outfit}_idle_pushup_${rep}`] = canvas;
      }

      // B: Hand lens inspection (kneeling & examining floor with 10x loupe)
      for (let f = 0; f < 2; f++) {
        const { canvas, ctx } = makeBuffer(32, 32);
        this.drawHandLensFrame(ctx, outfit, f);
        this.sprites[`player_${outfit}_idle_lens_${f}`] = canvas;
      }
    });

    // High-res pixel portrait for dialogue box (64x64)
    this.generatePortraits();
  }

  // Helper to draw walking avatar frames
  drawAvatarFrame(ctx, outfit, dir, frame) {
    const isMoving = (frame === 1 || frame === 3);
    const legOffset = (frame === 1) ? 2 : (frame === 3) ? -2 : 0;

    // Shadow on floor
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(16, 29, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Palette per outfit
    let skinColor = '#F5D0A9';
    let hairColor = '#1C1917'; // Black/dark brown neat hair
    let shirtColor = '#1E3A8A'; // Navy shirt for academic
    let pantsColor = '#1E293B'; // Jeans
    let shoesColor = '#78350F'; // Boots

    if (outfit === 'lab') {
      shirtColor = '#334155'; // Slate dark polo
      pantsColor = '#0F172A'; // Tech chinos
      shoesColor = '#1F2937'; // Black dress shoes
    } else if (outfit === 'rig') {
      shirtColor = '#EA580C'; // High-vis neon orange coveralls
      pantsColor = '#EA580C';
      shoesColor = '#475569'; // Steel-toe boots
    }

    // Legs / Boots
    ctx.fillStyle = pantsColor;
    if (dir === 'down' || dir === 'up') {
      // Left leg
      ctx.fillRect(11, 20, 4, 7 - (frame === 1 ? 2 : 0));
      // Right leg
      ctx.fillRect(17, 20, 4, 7 - (frame === 3 ? 2 : 0));

      // Boots
      ctx.fillStyle = shoesColor;
      ctx.fillRect(11, 26 - (frame === 1 ? 2 : 0), 4, 3);
      ctx.fillRect(17, 26 - (frame === 3 ? 2 : 0), 4, 3);
    } else if (dir === 'left') {
      ctx.fillRect(13 + legOffset, 20, 5, 7);
      ctx.fillStyle = shoesColor;
      ctx.fillRect(11 + legOffset, 26, 6, 3);
    } else if (dir === 'right') {
      ctx.fillRect(14 - legOffset, 20, 5, 7);
      ctx.fillStyle = shoesColor;
      ctx.fillRect(15 - legOffset, 26, 6, 3);
    }

    // Torso / Shirt
    ctx.fillStyle = shirtColor;
    ctx.fillRect(10, 12, 12, 9);

    // Outfit special torso details
    if (outfit === 'academic') {
      // Collar & buttons
      ctx.fillStyle = '#FFFFFF';
      if (dir === 'down') {
        ctx.fillRect(15, 12, 2, 5);
      }
    } else if (outfit === 'lab') {
      // ONGC badge lanyard
      if (dir === 'down') {
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(14, 12, 1, 6);
        ctx.fillRect(17, 12, 1, 6);
        ctx.fillStyle = '#EF4444'; // Red badge
        ctx.fillRect(14, 17, 4, 3);
      }
    } else if (outfit === 'rig') {
      // Reflective safety stripes (silver)
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(10, 15, 12, 2);
      ctx.fillRect(10, 22, 12, 1);
    }

    // Arms
    ctx.fillStyle = shirtColor;
    if (dir === 'down') {
      ctx.fillRect(7, 13 + (frame === 1 ? 1 : 0), 3, 6);
      ctx.fillRect(22, 13 + (frame === 3 ? 1 : 0), 3, 6);
      ctx.fillStyle = skinColor;
      ctx.fillRect(7, 19 + (frame === 1 ? 1 : 0), 3, 2);
      ctx.fillRect(22, 19 + (frame === 3 ? 1 : 0), 3, 2);
    } else if (dir === 'up') {
      ctx.fillRect(7, 13 + (frame === 1 ? 1 : 0), 3, 6);
      ctx.fillRect(22, 13 + (frame === 3 ? 1 : 0), 3, 6);
    } else if (dir === 'left') {
      ctx.fillRect(14 - legOffset, 13, 3, 7);
      ctx.fillStyle = skinColor;
      ctx.fillRect(14 - legOffset, 20, 3, 2);
    } else if (dir === 'right') {
      ctx.fillRect(15 + legOffset, 13, 3, 7);
      ctx.fillStyle = skinColor;
      ctx.fillRect(15 + legOffset, 20, 3, 2);
    }

    // Head / Face
    ctx.fillStyle = skinColor;
    ctx.fillRect(11, 4, 10, 8);

    // Hair or Hard Hat
    if (outfit === 'rig') {
      // High-vis Yellow Hard Hat
      ctx.fillStyle = '#FACC15'; // Bright yellow
      ctx.fillRect(9, 2, 14, 5);
      ctx.fillRect(8, 6, 16, 2); // Brim
      ctx.fillStyle = '#CA8A04';
      ctx.fillRect(10, 1, 12, 2); // Top ridge
    } else {
      // Neat dark hair
      ctx.fillStyle = hairColor;
      ctx.fillRect(10, 2, 12, 4);
      if (dir === 'down') {
        ctx.fillRect(10, 4, 2, 3);
        ctx.fillRect(20, 4, 2, 3);
      } else if (dir === 'up') {
        ctx.fillRect(10, 4, 12, 6);
      } else if (dir === 'left') {
        ctx.fillRect(10, 2, 8, 5);
        ctx.fillRect(18, 4, 2, 2);
      } else if (dir === 'right') {
        ctx.fillRect(14, 2, 8, 5);
        ctx.fillRect(12, 4, 2, 2);
      }
    }

    // Eyes & Glasses
    if (dir === 'down') {
      if (outfit === 'lab') {
        // Stylish wireframe glasses
        ctx.strokeStyle = '#38BDF8';
        ctx.strokeRect(12, 6, 3, 3);
        ctx.strokeRect(17, 6, 3, 3);
        ctx.fillStyle = '#0284C7';
        ctx.fillRect(15, 7, 2, 1); // Bridge
      }
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(13, 7, 2, 2);
      ctx.fillRect(17, 7, 2, 2);
    } else if (dir === 'left') {
      if (outfit === 'lab') {
        ctx.strokeStyle = '#38BDF8';
        ctx.strokeRect(11, 6, 3, 3);
      }
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(12, 7, 2, 2);
    } else if (dir === 'right') {
      if (outfit === 'lab') {
        ctx.strokeStyle = '#38BDF8';
        ctx.strokeRect(18, 6, 3, 3);
      }
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(18, 7, 2, 2);
    }
  }

  // Idle Animation 1: Push-ups
  drawPushupFrame(ctx, outfit, rep) {
    const yOff = rep === 0 ? 0 : 3; // 0 = arms extended, 1 = chest to floor
    // Floor shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(4, 26, 24, 4);

    let shirtColor = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#334155' : '#1E3A8A';
    let pantsColor = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#0F172A' : '#1E293B';

    // Body horizontal
    // Legs
    ctx.fillStyle = pantsColor;
    ctx.fillRect(6, 18 + yOff * 0.5, 10, 4);
    // Shoes touching floor
    ctx.fillStyle = '#78350F';
    ctx.fillRect(4, 20 + yOff * 0.5, 3, 3);

    // Torso
    ctx.fillStyle = shirtColor;
    ctx.fillRect(15, 17 + yOff, 10, 5);

    // Arms pushing
    ctx.fillStyle = '#F5D0A9';
    if (rep === 0) {
      // Arms straight down
      ctx.fillRect(20, 22, 3, 6);
    } else {
      // Arms bent
      ctx.fillRect(18, 22, 5, 4);
    }

    // Head
    ctx.fillStyle = '#F5D0A9';
    ctx.fillRect(24, 16 + yOff, 5, 5);

    // Hard hat or hair
    if (outfit === 'rig') {
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(24, 14 + yOff, 6, 4);
    } else {
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(24, 14 + yOff, 5, 3);
    }

    // Sweat bead / effort puff
    if (rep === 1) {
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(28, 12, 2, 2);
    }
  }

  // Idle Animation 2: Hand Lens Floor Inspection
  drawHandLensFrame(ctx, outfit, f) {
    // Kneeling down, looking through magnifying loupe at rock
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(8, 26, 16, 4);

    let shirtColor = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#334155' : '#1E3A8A';
    let pantsColor = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#0F172A' : '#1E293B';

    // Knees
    ctx.fillStyle = pantsColor;
    ctx.fillRect(10, 20, 8, 7);

    // Torso hunched over
    ctx.fillStyle = shirtColor;
    ctx.fillRect(12, 14, 8, 7);

    // Head tilted down
    ctx.fillStyle = '#F5D0A9';
    ctx.fillRect(18, 12, 6, 6);

    if (outfit === 'rig') {
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(18, 10, 7, 3);
    } else {
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(18, 10, 6, 3);
    }

    // Hand holding 10x lens to eye
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(23, 16, 4, 2); // Loupe body
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(26, 17, 2, 2); // Lens sparkle

    // Rock specimen on floor with examination sparkle
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(25, 27, 4, 3);
    if (f === 1) {
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(27, 25, 2, 2); // Sparkle!
    }
  }

  // Generate large pixel art portrait for the dialogue box
  generatePortraits() {
    ['academic', 'lab', 'rig'].forEach(outfit => {
      const { canvas, ctx } = makeBuffer(64, 64);
      // Background gradient frame
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(2, 2, 60, 60);

      // Shoulders & Shirt
      let shirtCol = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#334155' : '#1E3A8A';
      ctx.fillStyle = shirtCol;
      ctx.fillRect(12, 44, 40, 18);

      if (outfit === 'rig') {
        ctx.fillStyle = '#E2E8F0'; // Reflective tape
        ctx.fillRect(12, 50, 40, 4);
      } else if (outfit === 'lab') {
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(26, 44, 2, 18);
        ctx.fillRect(36, 44, 2, 18);
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(28, 52, 8, 8); // ONGC badge
      }

      // Neck & Face
      ctx.fillStyle = '#F5D0A9';
      ctx.fillRect(26, 36, 12, 10);
      ctx.fillRect(18, 16, 28, 24);

      // Hair or Hard Hat
      if (outfit === 'rig') {
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(14, 6, 36, 14);
        ctx.fillRect(12, 18, 40, 5); // Brim
        ctx.fillStyle = '#CA8A04';
        ctx.fillRect(18, 4, 28, 4);
      } else {
        ctx.fillStyle = '#1C1917';
        ctx.fillRect(16, 10, 32, 10);
        ctx.fillRect(14, 18, 6, 8);
        ctx.fillRect(44, 18, 6, 8);
      }

      // Eyebrows & Eyes
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(22, 24, 6, 2);
      ctx.fillRect(36, 24, 6, 2);
      ctx.fillRect(24, 28, 3, 3);
      ctx.fillRect(37, 28, 3, 3);

      // Glasses in Lab
      if (outfit === 'lab') {
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.strokeRect(21, 26, 8, 7);
        ctx.strokeRect(35, 26, 8, 7);
        ctx.fillStyle = '#0284C7';
        ctx.fillRect(29, 29, 6, 2);
      }

      // Friendly confident smile
      ctx.fillStyle = '#991B1B';
      ctx.fillRect(28, 35, 8, 2);
      ctx.fillRect(29, 37, 6, 1);

      this.sprites[`portrait_${outfit}`] = canvas;
    });
  }
}

export const spriteFactory = new SpriteFactory();
