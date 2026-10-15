// Procedural 16-bit Retro Pixel Art Generator
// Zero external image dependencies - all generated via crisp canvas pixel buffers

export const TILE_SIZE = 32;
export const MAP_COLS = 60;
export const MAP_ROWS = 22;

export function createBuffer(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

export class SpriteStore {
  private cache: Record<string, HTMLCanvasElement> = {};

  constructor() {
    this.buildSprites();
  }

  public get(key: string): HTMLCanvasElement | null {
    return this.cache[key] || null;
  }

  public buildSprites() {
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
      ctx.fillStyle = '#B8860B';
      ctx.fillRect(6, 6, 20, 14);
      ctx.fillStyle = '#FFF8DC';
      ctx.fillRect(8, 8, 16, 10);
      this.cache['tile_wall_acad'] = canvas;
    }

    // Courtyard Brick Partition Wall with Ivy
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

    // Rig Wall
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#334155';
      for (let x = 2; x < 30; x += 4) ctx.fillRect(x, 0, 2, 32);
      this.cache['tile_wall_rig'] = canvas;
    }

    // 3. Props
    // EPMA Geochemistry & Python ML Terminal (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 18, 56, 28);
      ctx.fillStyle = '#334155';
      ctx.fillRect(2, 14, 60, 6);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(6, 4, 24, 14);
      ctx.fillStyle = '#EF4444'; ctx.fillRect(17, 6, 2, 2);
      ctx.fillStyle = '#3B82F6'; ctx.fillRect(10, 14, 2, 2);
      ctx.fillStyle = '#22C55E'; ctx.fillRect(24, 14, 2, 2);
      ctx.strokeStyle = '#64748B';
      ctx.strokeRect(6, 4, 24, 14);
      ctx.fillStyle = '#022C22';
      ctx.fillRect(34, 4, 24, 14);
      ctx.fillStyle = '#34D399';
      ctx.fillRect(36, 6, 12, 1);
      ctx.fillRect(36, 9, 18, 1);
      ctx.fillRect(36, 12, 8, 1);
      ctx.fillStyle = '#F59E0B'; ctx.fillRect(46, 12, 2, 2);
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
      ctx.fillRect(2, 14, 60, 5);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(8, 8, 8, 8);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(10, 5, 4, 3);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(22, 7, 10, 9);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(25, 4, 4, 3);
      ctx.fillStyle = '#475569';
      ctx.fillRect(40, 10, 6, 6);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(42, 6, 2, 4);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(42, 4, 2, 2);
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
      ctx.fillRect(4, 30, 40, 16);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fillRect(6, 6, 36, 24);
      ctx.strokeStyle = '#CBD5E1';
      ctx.strokeRect(6, 6, 36, 24);
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.moveTo(14, 26); ctx.lineTo(16, 18); ctx.lineTo(19, 26); ctx.fill();
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(26, 22, 4, 0, Math.PI * 2); ctx.fill();
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
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(8, 4, 30, 14);
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(22, 10, 5, 0, Math.PI); ctx.stroke();
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(46, 10, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(45, 6, 2, 8);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(42, 22, 8, 3);
      this.cache['prop_field_table'] = canvas;
    }

    // Heavy Gym Barbell Rack (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(14, 24, 36, 8);
      ctx.fillStyle = '#334155';
      ctx.fillRect(20, 32, 6, 14);
      ctx.fillRect(38, 32, 6, 14);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(8, 10, 4, 36);
      ctx.fillRect(52, 10, 4, 36);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(2, 12, 60, 3);
      ctx.fillStyle = '#EF4444'; ctx.fillRect(4, 6, 4, 15);
      ctx.fillStyle = '#2563EB'; ctx.fillRect(8, 7, 3, 13);
      ctx.fillStyle = '#EF4444'; ctx.fillRect(56, 6, 4, 15);
      ctx.fillStyle = '#2563EB'; ctx.fillRect(53, 7, 3, 13);
      this.cache['prop_gym_bench'] = canvas;
    }

    // Academic Trophy & Media Desk (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#3E1F0F';
      ctx.fillRect(4, 20, 56, 26);
      ctx.fillStyle = '#5A2E16';
      ctx.fillRect(2, 16, 60, 6);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(8, 6, 10, 10);
      ctx.fillRect(11, 16, 4, 4);
      ctx.beginPath();
      ctx.arc(26, 9, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(24, 14, 4, 4);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(38, 2, 22, 15);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(40, 4, 18, 11);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(42, 6, 8, 2);
      this.cache['prop_trophy_media'] = canvas;
    }

    // Mini Football Pitch & Goalpost (160x110)
    {
      const { canvas, ctx } = createBuffer(160, 110);
      ctx.fillStyle = '#15803D';
      ctx.fillRect(0, 0, 160, 110);
      ctx.fillStyle = '#16A34A';
      for (let x = 0; x < 160; x += 32) ctx.fillRect(x, 0, 16, 110);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(6, 6, 148, 98);
      ctx.beginPath();
      ctx.arc(80, 55, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(80, 6); ctx.lineTo(80, 104); ctx.stroke();
      ctx.strokeRect(6, 32, 28, 46);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 38, 6, 34);
      ctx.strokeStyle = '#E2E8F0';
      ctx.strokeRect(0, 38, 6, 34);
      ctx.fillStyle = '#1E3A8A';
      ctx.fillRect(100, 12, 48, 18);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(102, 14, 44, 14);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(122, 16, 4, 10);
      this.cache['prop_football_pitch'] = canvas;
    }

    // Acrylic Canvas Painting Easel (32x48)
    {
      const { canvas, ctx } = createBuffer(32, 48);
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(16, 4); ctx.lineTo(6, 46);
      ctx.moveTo(16, 4); ctx.lineTo(26, 46);
      ctx.moveTo(16, 4); ctx.lineTo(16, 46);
      ctx.stroke();
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(6, 8, 20, 22);
      ctx.strokeStyle = '#D97706';
      ctx.strokeRect(6, 8, 20, 22);
      ctx.fillStyle = '#EF4444'; ctx.fillRect(9, 11, 6, 4);
      ctx.fillStyle = '#3B82F6'; ctx.fillRect(16, 14, 7, 5);
      ctx.fillStyle = '#F59E0B'; ctx.fillRect(10, 18, 12, 4);
      ctx.fillStyle = '#10B981'; ctx.fillRect(14, 24, 8, 3);
      ctx.fillStyle = '#D97706';
      ctx.beginPath(); ctx.arc(8, 36, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#EF4444'; ctx.fillRect(6, 34, 2, 2);
      ctx.fillStyle = '#3B82F6'; ctx.fillRect(9, 36, 2, 2);
      this.cache['prop_art_easel'] = canvas;
    }

    // Himalayan Trekking Camp (96x64)
    {
      const { canvas, ctx } = createBuffer(96, 64);
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.moveTo(10, 48); ctx.lineTo(34, 16); ctx.lineTo(58, 48); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#C2410C';
      ctx.beginPath();
      ctx.moveTo(34, 16); ctx.lineTo(46, 16); ctx.lineTo(70, 48); ctx.lineTo(58, 48); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.moveTo(28, 48); ctx.lineTo(34, 26); ctx.lineTo(40, 48); ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.arc(78, 44, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#EA580C';
      ctx.beginPath(); ctx.moveTo(74, 44); ctx.lineTo(78, 34); ctx.lineTo(82, 44); ctx.fill();
      ctx.fillStyle = '#FACC15';
      ctx.beginPath(); ctx.moveTo(76, 44); ctx.lineTo(78, 37); ctx.lineTo(80, 44); ctx.fill();
      ctx.fillStyle = '#78350F';
      ctx.fillRect(86, 20, 3, 28);
      ctx.fillStyle = '#B45309';
      ctx.fillRect(76, 14, 18, 9);
      ctx.fillStyle = '#FFFBEB';
      ctx.fillRect(78, 17, 14, 2);
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
      for (const c of cols) {
        ctx.fillStyle = c;
        ctx.fillRect(bx, 6, 5, 12);
        ctx.fillRect(bx, 22, 5, 12);
        bx += 6;
      }
      this.cache['prop_bookshelf'] = canvas;
    }

    // Petrel Triple-Monitor Workstation (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(4, 20, 56, 26);
      ctx.fillStyle = '#334155';
      ctx.fillRect(2, 16, 60, 6);
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(6, 4, 16, 12);
      ctx.fillStyle = '#EF4444'; ctx.fillRect(10, 5, 2, 9);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(24, 4, 16, 12);
      ctx.fillStyle = '#F59E0B'; ctx.fillRect(26, 7, 12, 3);
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
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(8, 4, 22, 12);
      ctx.fillStyle = '#EC4899'; ctx.fillRect(10, 6, 5, 4);
      ctx.fillStyle = '#F59E0B'; ctx.fillRect(15, 6, 5, 4);
      ctx.fillStyle = '#10B981'; ctx.fillRect(20, 6, 5, 4);
      ctx.fillStyle = '#3B82F6'; ctx.fillRect(10, 10, 15, 4);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(34, 4, 22, 12);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(36, 7, 18, 2);
      ctx.fillRect(36, 12, 18, 2);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(45, 5, 2, 10);
      this.cache['prop_paleoscan_desk'] = canvas;
    }

    // Office Cubicle (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#1E3A8A';
      ctx.fillRect(2, 6, 60, 4);
      ctx.fillRect(2, 6, 4, 38);
      ctx.fillStyle = '#475569';
      ctx.fillRect(6, 18, 52, 24);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(6, 16, 52, 4);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(12, 8, 18, 10);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(14, 10, 14, 6);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(36, 22, 5, 5);
      ctx.fillStyle = '#0F172A';
      ctx.beginPath(); ctx.arc(46, 32, 7, 0, Math.PI * 2); ctx.fill();
      this.cache['prop_office_cubicle'] = canvas;
    }

    // Wide-Format GIS Map Plotter Roll (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(6, 12, 52, 28);
      ctx.fillStyle = '#475569';
      ctx.fillRect(10, 40, 6, 8);
      ctx.fillRect(48, 40, 6, 8);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(8, 16, 48, 4);
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(10, 20, 44, 18);
      ctx.fillStyle = '#0284C7'; ctx.fillRect(12, 22, 16, 4);
      ctx.fillStyle = '#10B981'; ctx.fillRect(28, 24, 12, 6);
      ctx.fillStyle = '#EF4444'; ctx.fillRect(18, 28, 20, 3);
      this.cache['prop_plotter_roll'] = canvas;
    }

    // Hologram GIS Table (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(8, 24, 48, 20);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(6, 20, 52, 6);
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(12, 18, 40, 4);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.moveTo(16, 18); ctx.lineTo(24, 4); ctx.lineTo(40, 4); ctx.lineTo(48, 18); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#38BDF8'; ctx.fillRect(26, 6, 12, 2);
      ctx.fillStyle = '#F59E0B'; ctx.fillRect(28, 10, 10, 2);
      ctx.fillStyle = '#EF4444'; ctx.fillRect(30, 8, 2, 7);
      this.cache['prop_gis_table'] = canvas;
    }

    // Glass Conference Room (80x48)
    {
      const { canvas, ctx } = createBuffer(80, 48);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(2, 4, 76, 40);
      ctx.strokeStyle = '#38BDF8';
      ctx.strokeRect(2, 4, 76, 40);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(8, 8, 30, 18);
      ctx.fillStyle = '#2563EB'; ctx.fillRect(10, 12, 12, 2);
      ctx.fillStyle = '#EF4444'; ctx.fillRect(10, 16, 18, 2);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(42, 14, 32, 16);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(46, 8, 6, 4);
      ctx.fillRect(62, 8, 6, 4);
      ctx.fillRect(46, 32, 6, 4);
      ctx.fillRect(62, 32, 6, 4);
      this.cache['prop_conference_room'] = canvas;
    }

    // Server Racks (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(4, 4, 40, 42);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(6, 6, 36, 38);
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

    // Core Shelves (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#475569';
      ctx.fillRect(4, 4, 4, 42);
      ctx.fillRect(40, 4, 4, 42);
      ctx.fillRect(4, 16, 40, 3);
      ctx.fillRect(4, 28, 40, 3);
      ctx.fillRect(4, 40, 40, 3);
      ctx.fillStyle = '#B45309';
      ctx.fillRect(9, 8, 30, 7);
      ctx.fillRect(9, 20, 30, 7);
      ctx.fillRect(9, 32, 30, 7);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(11, 10, 8, 3); ctx.fillRect(21, 10, 10, 3);
      ctx.fillStyle = '#475569';
      ctx.fillRect(11, 22, 12, 3); ctx.fillRect(25, 22, 8, 3);
      this.cache['prop_core_shelves'] = canvas;
    }

    // Breakroom (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(6, 18, 12, 26);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.beginPath(); ctx.arc(12, 12, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.fillRect(22, 22, 20, 22);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(24, 24, 12, 8);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(22, 4, 20, 14);
      ctx.fillStyle = '#FEF08A'; ctx.fillRect(24, 6, 4, 4);
      ctx.fillStyle = '#F472B6'; ctx.fillRect(30, 8, 4, 4);
      this.cache['prop_breakroom'] = canvas;
    }

    // Internship Locker (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 6, 40, 40);
      ctx.fillStyle = '#334155';
      ctx.fillRect(6, 8, 16, 36);
      ctx.fillRect(26, 8, 16, 36);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(9, 12, 10, 2); ctx.fillRect(9, 16, 10, 2);
      ctx.fillRect(29, 12, 10, 2); ctx.fillRect(29, 16, 10, 2);
      ctx.fillStyle = '#0284C7'; ctx.fillRect(8, 24, 8, 6);
      ctx.fillStyle = '#DC2626'; ctx.fillRect(28, 24, 8, 6);
      this.cache['prop_internship_locker'] = canvas;
    }

    // Gas Canisters (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 38, 40, 8);
      ctx.fillStyle = '#10B981';
      ctx.fillRect(9, 12, 12, 24);
      ctx.beginPath(); ctx.arc(15, 12, 6, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#A855F7';
      ctx.fillRect(27, 12, 12, 24);
      ctx.beginPath(); ctx.arc(33, 12, 6, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#0F172A'; ctx.fillRect(18, 4, 12, 6);
      ctx.fillStyle = '#38BDF8'; ctx.fillRect(20, 5, 8, 3);
      this.cache['prop_gas_canisters'] = canvas;
    }

    // Derrick Rotary Table (96x80)
    {
      const { canvas, ctx } = createBuffer(96, 80);
      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(12, 76); ctx.lineTo(36, 4); ctx.lineTo(60, 4); ctx.lineTo(84, 76);
      ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(18, 60); ctx.lineTo(78, 60);
      ctx.moveTo(24, 40); ctx.lineTo(72, 40);
      ctx.moveTo(30, 20); ctx.lineTo(66, 20);
      ctx.moveTo(18, 60); ctx.lineTo(72, 40);
      ctx.moveTo(24, 40); ctx.lineTo(78, 60);
      ctx.stroke();
      ctx.fillStyle = '#1E293B';
      ctx.beginPath(); ctx.arc(48, 66, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#64748B';
      ctx.beginPath(); ctx.arc(48, 66, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(45, 14, 6, 54);
      this.cache['prop_derrick_rotary'] = canvas;
    }

    // Pipe Rack (96x48)
    {
      const { canvas, ctx } = createBuffer(96, 48);
      ctx.fillStyle = '#334155';
      ctx.fillRect(4, 24, 88, 20);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(4, 22, 88, 3);
      ctx.fillStyle = '#EAB308';
      ctx.fillRect(12, 10, 4, 14);
      ctx.fillRect(46, 10, 4, 14);
      ctx.fillRect(80, 10, 4, 14);
      for (let y = 6; y < 22; y += 5) {
        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(8, y, 80, 4);
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(8, y, 80, 1);
        ctx.fillStyle = '#475569';
        ctx.fillRect(86, y - 1, 4, 6);
      }
      this.cache['prop_pipe_rack'] = canvas;
    }

    // Shale Shakers (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#334155';
      ctx.fillRect(4, 14, 56, 30);
      ctx.fillStyle = '#475569';
      ctx.fillRect(8, 18, 22, 20);
      ctx.fillRect(34, 18, 22, 20);
      ctx.fillStyle = '#94A3B8';
      for (let y = 20; y < 36; y += 3) {
        ctx.fillRect(8, y, 22, 1);
        ctx.fillRect(34, y, 22, 1);
      }
      ctx.fillStyle = '#78350F';
      ctx.fillRect(10, 24, 18, 12);
      ctx.fillRect(36, 24, 18, 12);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(12, 26, 3, 2); ctx.fillRect(20, 30, 4, 2);
      ctx.fillRect(38, 28, 4, 2); ctx.fillRect(46, 32, 3, 2);
      this.cache['prop_shale_shakers'] = canvas;
    }

    // Mud Tanks (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 12, 56, 32);
      ctx.fillStyle = '#3B2F2F';
      ctx.fillRect(8, 16, 48, 24);
      ctx.fillStyle = '#EAB308';
      ctx.fillRect(26, 4, 12, 10);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(30, 14, 4, 20);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(22, 30, 20, 3);
      this.cache['prop_mud_tanks'] = canvas;
    }

    // Doghouse Mud Logging Unit (80x48)
    {
      const { canvas, ctx } = createBuffer(80, 48);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(4, 10, 72, 34);
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(4, 6, 72, 5);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(12, 16, 24, 14);
      ctx.fillRect(44, 16, 24, 14);
      ctx.fillStyle = '#22C55E'; ctx.fillRect(14, 18, 10, 5);
      ctx.fillStyle = '#38BDF8'; ctx.fillRect(26, 18, 8, 10);
      ctx.fillStyle = '#A855F7'; ctx.fillRect(46, 18, 10, 10);
      ctx.fillStyle = '#FEF08A'; ctx.fillRect(58, 18, 8, 6);
      this.cache['prop_doghouse_cabin'] = canvas;
    }

    // High Pressure Cementing Unit (64x48)
    {
      const { canvas, ctx } = createBuffer(64, 48);
      ctx.fillStyle = '#B91C1C';
      ctx.fillRect(4, 16, 56, 28);
      ctx.fillStyle = '#475569';
      ctx.fillRect(8, 20, 18, 18);
      ctx.fillRect(32, 20, 18, 18);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(6, 12, 52, 4);
      ctx.fillRect(22, 6, 6, 10);
      ctx.fillRect(46, 6, 6, 10);
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath(); ctx.arc(14, 10, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(38, 10, 3, 0, Math.PI * 2); ctx.fill();
      this.cache['prop_cementing_unit'] = canvas;
    }

    // BOP Stack (48x64)
    {
      const { canvas, ctx } = createBuffer(48, 64);
      ctx.fillStyle = '#991B1B';
      ctx.fillRect(12, 8, 24, 52);
      ctx.fillStyle = '#DC2626';
      ctx.beginPath(); ctx.arc(24, 12, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(6, 24, 36, 6);
      ctx.fillRect(6, 36, 36, 6);
      ctx.fillRect(6, 48, 36, 6);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(4, 20, 2, 38);
      this.cache['prop_bop_stack'] = canvas;
    }

    // Drawworks (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 14, 40, 30);
      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.arc(24, 26, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(16, 24, 16, 5);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(28, 6, 14, 12);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(30, 8, 10, 8);
      this.cache['prop_drawworks'] = canvas;
    }

    // Diesel Generator (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(4, 16, 40, 28);
      ctx.fillStyle = '#1E293B';
      for (let y = 20; y < 40; y += 4) ctx.fillRect(8, y, 18, 2);
      ctx.fillStyle = '#475569';
      ctx.fillRect(34, 4, 5, 14);
      ctx.fillStyle = 'rgba(226, 232, 240, 0.4)';
      ctx.fillRect(35, 1, 3, 3);
      this.cache['prop_diesel_generator'] = canvas;
    }

    // Rig Coffee Locker (48x48)
    {
      const { canvas, ctx } = createBuffer(48, 48);
      ctx.fillStyle = '#EAB308';
      ctx.fillRect(24, 8, 20, 36);
      ctx.fillStyle = '#CA8A04';
      ctx.fillRect(26, 10, 16, 32);
      ctx.fillStyle = '#FFF'; ctx.fillRect(28, 14, 5, 3);
      ctx.fillStyle = '#FACC15'; ctx.fillRect(35, 14, 5, 3);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 20, 18, 24);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(6, 12, 14, 14);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(10, 24, 6, 5);
      this.cache['prop_rig_coffee_locker'] = canvas;
      this.cache['prop_coffee_urn'] = canvas;
    }

    // Flare Stack (32x48)
    {
      const { canvas, ctx } = createBuffer(32, 48);
      ctx.fillStyle = '#475569';
      ctx.fillRect(14, 16, 4, 30);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(12, 44, 8, 4);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(12, 14, 8, 3);
      ctx.fillStyle = '#EA580C';
      ctx.beginPath(); ctx.moveTo(12, 14); ctx.lineTo(16, 2); ctx.lineTo(20, 14); ctx.fill();
      ctx.fillStyle = '#FACC15';
      ctx.beginPath(); ctx.moveTo(14, 14); ctx.lineTo(16, 5); ctx.lineTo(18, 14); ctx.fill();
      this.cache['prop_flare_stack'] = canvas;
    }

    // Soccer Ball (16x16)
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

    // Pedestal (32x48)
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
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(10, 10, 12, 8);
      this.cache['prop_pedestal'] = canvas;
    }

    // Rock Outcrop (32x32)
    {
      const { canvas, ctx } = createBuffer(32, 32);
      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.moveTo(6, 26); ctx.lineTo(12, 10); ctx.lineTo(22, 8); ctx.lineTo(28, 26);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(10, 14, 8, 4);
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(20, 10, 3, 3);
      this.cache['prop_rock_outcrop'] = canvas;
    }

    this.buildCharacterSprites();
  }

  public buildCharacterSprites() {
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

      const { canvas: hCanvas, ctx: hCtx } = createBuffer(32, 32);
      this.drawAvatar(hCtx, outfit, 'down', 0, true, false);
      this.cache[`char_${outfit}_hammer`] = hCanvas;

      const { canvas: mCanvas, ctx: mCtx } = createBuffer(32, 32);
      this.drawAvatar(mCtx, outfit, 'down', 0, false, true);
      this.cache[`char_${outfit}_lens`] = mCanvas;

      for (let rep = 0; rep < 2; rep++) {
        const { canvas, ctx } = createBuffer(32, 32);
        this.drawPushup(ctx, outfit, rep);
        this.cache[`char_${outfit}_pushup_${rep}`] = canvas;
      }

      for (let f = 0; f < 2; f++) {
        const { canvas, ctx } = createBuffer(32, 32);
        this.drawCoffeeSip(ctx, outfit, f);
        this.cache[`char_${outfit}_coffee_${f}`] = canvas;
      }

      const { canvas: tCanvas, ctx: tCtx } = createBuffer(32, 32);
      this.drawSlideTackle(tCtx, outfit);
      this.cache[`char_${outfit}_tackle`] = tCanvas;
    });

    this.buildPortraits();
  }

  public drawSlideTackle(ctx: CanvasRenderingContext2D, outfit: string) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(2, 26, 28, 4);

    const shirt = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#334155' : '#1E3A8A';
    const pants = outfit === 'rig' ? '#EA580C' : '#1E293B';
    const skin = '#F5D0A9';

    ctx.fillStyle = pants;
    ctx.fillRect(6, 20, 18, 5);
    ctx.fillRect(22, 18, 8, 4);
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(27, 20, 5, 3);

    ctx.fillStyle = shirt;
    ctx.fillRect(4, 14, 14, 7);

    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(8, 15, 4, 4);

    ctx.fillStyle = skin;
    ctx.fillRect(1, 22, 5, 4);
    ctx.fillRect(14, 11, 4, 4);

    ctx.fillStyle = skin;
    ctx.fillRect(2, 8, 7, 7);
    if (outfit === 'rig') {
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(1, 6, 9, 4);
    } else {
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(1, 6, 8, 4);
    }

    ctx.fillStyle = '#4ADE80';
    ctx.fillRect(0, 24, 2, 2);
    ctx.fillRect(10, 27, 2, 2);
    ctx.fillStyle = '#FACC15';
    ctx.fillRect(28, 17, 3, 3);
  }

  public drawAvatar(
    ctx: CanvasRenderingContext2D,
    outfit: string,
    dir: string,
    frame: number,
    isHammer: boolean = false,
    isLens: boolean = false
  ) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(16, 29, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    const skin = '#F5D0A9';
    const hair = '#1C1917';
    const shirt = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#334155' : '#1E3A8A';
    const pants = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#0F172A' : '#1E293B';
    const boots = outfit === 'rig' ? '#475569' : '#78350F';

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

    ctx.fillStyle = pants;
    ctx.fillRect(11, 20, 4, 7 - (frame === 1 ? 2 : 0));
    ctx.fillRect(17, 20, 4, 7 - (frame === 3 ? 2 : 0));

    ctx.fillStyle = boots;
    ctx.fillRect(11, 26 - (frame === 1 ? 2 : 0), 4, 3);
    ctx.fillRect(17, 26 - (frame === 3 ? 2 : 0), 4, 3);

    ctx.fillStyle = shirt;
    ctx.fillRect(10, 12, 12, 9);

    if (outfit === 'rig') {
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(10, 15, 12, 2);
      ctx.fillRect(10, 21, 12, 1);
    } else if (outfit === 'lab') {
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(14, 12, 1, 6);
      ctx.fillRect(17, 12, 1, 6);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(14, 17, 4, 3);
    }

    ctx.fillStyle = shirt;
    ctx.fillRect(7, 13, 3, 6);
    ctx.fillRect(22, 13, 3, 6);
    ctx.fillStyle = skin;
    ctx.fillRect(7, 19, 3, 2);
    ctx.fillRect(22, 19, 3, 2);

    if (isHammer) {
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(23, 14, 2, 14);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(21, 26, 7, 3);
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(27, 28, 3, 3);
    } else {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(23, 16, 2, 8);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(22, 15, 4, 2);
    }

    if (isLens) {
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(5, 7, 5, 5);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(6, 8, 3, 3);
    } else {
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(7, 18, 3, 3);
    }

    ctx.fillStyle = skin;
    ctx.fillRect(11, 4, 10, 8);

    if (outfit === 'rig') {
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(9, 2, 14, 5);
      ctx.fillRect(8, 6, 16, 2);
    } else {
      ctx.fillStyle = hair;
      ctx.fillRect(10, 2, 12, 4);
    }

    if (outfit === 'lab') {
      ctx.strokeStyle = '#38BDF8';
      ctx.strokeRect(12, 6, 3, 3);
      ctx.strokeRect(17, 6, 3, 3);
    }

    ctx.fillStyle = '#1C1917';
    ctx.fillRect(13, 7, 2, 2);
    ctx.fillRect(17, 7, 2, 2);
  }

  public drawPushup(ctx: CanvasRenderingContext2D, outfit: string, rep: number) {
    const yOff = rep === 0 ? 0 : 3;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(4, 26, 24, 4);

    const shirt = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#334155' : '#1E3A8A';
    const pants = outfit === 'rig' ? '#EA580C' : '#1E293B';

    ctx.fillStyle = pants;
    ctx.fillRect(6, 18 + yOff * 0.5, 10, 4);
    ctx.fillStyle = shirt;
    ctx.fillRect(15, 17 + yOff, 10, 5);
    ctx.fillStyle = '#F5D0A9';
    ctx.fillRect(rep === 0 ? 20 : 18, 22, 4, 5);
    ctx.fillRect(24, 16 + yOff, 5, 5);

    if (outfit === 'rig') {
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(24, 14 + yOff, 6, 3);
    } else {
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(24, 14 + yOff, 5, 3);
    }
  }

  public drawCoffeeSip(ctx: CanvasRenderingContext2D, outfit: string, f: number) {
    this.drawAvatar(ctx, outfit, 'down', 0, false, false);
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(14, 12, 5, 5);
    if (f === 1) {
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(15, 8, 2, 2);
      ctx.fillRect(17, 6, 2, 2);
    }
  }

  public buildPortraits() {
    ['academic', 'lab', 'rig'].forEach(outfit => {
      const { canvas, ctx } = createBuffer(80, 80);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 80, 80);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(2, 2, 76, 76);

      const shirt = outfit === 'rig' ? '#EA580C' : outfit === 'lab' ? '#334155' : '#1E3A8A';
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

export const sprites = new SpriteStore();
