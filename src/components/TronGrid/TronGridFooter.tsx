import { useEffect, useRef } from 'react';
import s from './TronGridFooter.module.scss';

const CELL      = 90;
const GRID_A    = 0.06;
const MAX_ALIVE = 10;
const SPAWN_MIN = 1200;
const SPAWN_MAX = 3000;
const TURN_PROB = 0.3;
const WEIGHTS   = [0.35, 0.28, 0.2, 0.17];
const COMPANION = 0.25;
const SEG       = 3;
const FADE_MS   = 3000;
const LOOK      = 12;
const TLOOK     = 17;
const HEAD_LEN  = 8;

type Color = { r: number; g: number; b: number };

const COLORS_DARK: Color[] = [
  { r: 27,  g: 93,  b: 239 },  // accent blue
  { r: 88,  g: 145, b: 255 },  // bright blue
  { r: 50,  g: 115, b: 250 },  // medium blue
  { r: 155, g: 190, b: 255 },  // pale blue
];

const COLORS_LIGHT: Color[] = [
  { r: 212, g: 175, b: 55  },  // accent gold
  { r: 240, g: 205, b: 80  },  // bright gold
  { r: 180, g: 145, b: 25  },  // dark gold
  { r: 155, g: 118, b: 10  },  // deep gold
];

function getThemeColors(): Color[] {
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? COLORS_LIGHT
    : COLORS_DARK;
}

const DIR: Record<string, [number, number]> = {
  up:    [0, -1],
  down:  [0,  1],
  left:  [-1, 0],
  right: [ 1, 0],
};
type Dir = 'up' | 'down' | 'left' | 'right';

interface Line {
  id: number;
  col: number; row: number;
  prevCol: number; prevRow: number;
  dir: Dir;
  stepInterval: number;
  stepAccum: number;
  brightness: number;
  colorIdx: number;
  trail: { x: number; y: number }[];
  alive: boolean;
  deadAt: number;
  turnTimer: number;
  turnInterval: number;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  colorIdx: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function pickColor(): number {
  let acc = 0;
  const r = Math.random();
  for (let i = 0; i < WEIGHTS.length; i++) {
    acc += WEIGHTS[i];
    if (r < acc) return i;
  }
  return 0;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function TronGridFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const container = containerRef.current!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const canvas    = canvasRef.current!;

    const ctx  = canvas.getContext('2d', { alpha: false })!;
    const dpr  = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0;
    let gridCanvas: HTMLCanvasElement | null = null;
    let cgCols = 0, cgRows = 0;
    let collision = new Int16Array(0);
    let sprites: HTMLCanvasElement[] = [];
    let colors: Color[] = getThemeColors();
    let lines: Line[]     = [];
    let particles: Particle[] = [];
    let spawnTimer = 0;
    let nextSpawn  = SPAWN_MIN;
    let lastTime   = 0;
    let idCounter  = 0;
    let rafId      = 0;
    let aborted    = false;
    let visible    = true;

    // ── Setup ──────────────────────────────────────────────────────────────
    function measure() {
      const r = container.getBoundingClientRect();
      W = r.width; H = r.height;
      if (!W || !H) return;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function buildGrid() {
      if (!W || !H) return;
      gridCanvas = document.createElement('canvas');
      gridCanvas.width  = W * dpr;
      gridCanvas.height = H * dpr;
      const gc = gridCanvas.getContext('2d')!;
      gc.setTransform(dpr, 0, 0, dpr, 0, 0);

      // read current bg color from CSS variable
      const bg = getComputedStyle(document.documentElement)
        .getPropertyValue('--bg').trim() || '#080c10';
      gc.fillStyle = bg;
      gc.fillRect(0, 0, W, H);

      // Use theme-aware border color instead of hardcoded white
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      gc.strokeStyle = isLight
        ? `rgba(0,0,0,${GRID_A})`
        : `rgba(255,255,255,${GRID_A})`;
      gc.lineWidth = 0.5;
      for (let x = 0; x <= W; x += CELL) {
        gc.beginPath(); gc.moveTo(x, 0); gc.lineTo(x, H); gc.stroke();
      }
      for (let y = 0; y <= H; y += CELL) {
        gc.beginPath(); gc.moveTo(0, y); gc.lineTo(W, y); gc.stroke();
      }
    }

    function buildSprites() {
      sprites = colors.map(c => {
        const sp = document.createElement('canvas');
        sp.width = 12; sp.height = 12;
        const sc = sp.getContext('2d')!;
        sc.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
        sc.beginPath();
        sc.arc(6, 6, 5, 0, Math.PI * 2);
        sc.fill();
        return sp;
      });
    }

    function initCollision() {
      if (!W || !H) return;
      cgCols = Math.ceil(W / SEG);
      cgRows = Math.ceil(H / SEG);
      collision = new Int16Array(cgCols * cgRows).fill(-1);
    }

    // ── Collision helpers ──────────────────────────────────────────────────
    function markCell(col: number, row: number, id: number) {
      if (col >= 0 && col < cgCols && row >= 0 && row < cgRows)
        collision[row * cgCols + col] = id;
    }
    function occupant(col: number, row: number) {
      if (col < 0 || col >= cgCols || row < 0 || row >= cgRows) return -1;
      return collision[row * cgCols + col];
    }
    function isOcc(col: number, row: number) { return occupant(col, row) !== -1; }
    function isOOB(col: number, row: number, m: number) {
      return col < -m || col >= cgCols + m || row < -m || row >= cgRows + m;
    }

    function scanAhead(col: number, row: number, dir: Dir, steps: number) {
      const [dc, dr] = DIR[dir];
      for (let i = 1; i <= steps; i++) {
        const c = col + dc * i, r = row + dr * i;
        if (c < 1 || c >= cgCols - 1 || r < 1 || r >= cgRows - 1 || isOcc(c, r))
          return true;
      }
      return false;
    }

    function safeTurn(line: Line): Dir | null {
      const opts: Dir[] = (line.dir === 'up' || line.dir === 'down')
        ? ['left', 'right'] : ['up', 'down'];
      if (Math.random() > 0.5) opts.reverse();
      for (const d of opts) if (!scanAhead(line.col, line.row, d, TLOOK)) return d;
      return null;
    }

    function clearTrail(id: number) {
      for (let i = 0; i < collision.length; i++)
        if (collision[i] === id) collision[i] = -1;
    }

    function cx(col: number) { return col * SEG + SEG * 0.5; }
    function cy(row: number) { return row * SEG + SEG * 0.5; }

    function renderPos(l: Line) {
      const t = Math.min(l.stepAccum / l.stepInterval, 1);
      return {
        x: cx(l.prevCol) + (cx(l.col) - cx(l.prevCol)) * t,
        y: cy(l.prevRow) + (cy(l.row) - cy(l.prevRow)) * t,
      };
    }

    // ── Spawn ──────────────────────────────────────────────────────────────
    function spawn() {
      if (lines.filter(l => l.alive).length >= MAX_ALIVE) return;
      const id      = idCounter++;
      const side    = Math.floor(Math.random() * 4);
      const ci      = pickColor();
      const margin  = Math.floor(10 / SEG);
      let col: number, row: number, dir: Dir;

      switch (side) {
        case 0: col = margin + Math.floor(Math.random() * (cgCols - margin * 2)); row = -1;     dir = 'down';  break;
        case 1: col = margin + Math.floor(Math.random() * (cgCols - margin * 2)); row = cgRows; dir = 'up';    break;
        case 2: col = -1;    row = margin + Math.floor(Math.random() * (cgRows - margin * 2)); dir = 'right'; break;
        default:col = cgCols;row = margin + Math.floor(Math.random() * (cgRows - margin * 2)); dir = 'left';  break;
      }

      const speed = 0.8 + Math.random() * 1.4;
      const si    = SEG / speed * 33;

      lines.push({
        id, col, row, prevCol: col, prevRow: row, dir,
        stepInterval: si, stepAccum: 0,
        brightness: 0.5 + Math.random() * 0.35,
        colorIdx: ci, trail: [{ x: cx(col), y: cy(row) }],
        alive: true, deadAt: 0, turnTimer: 0,
        turnInterval: 80 + Math.floor(Math.random() * 160),
      });

      if (Math.random() < COMPANION) {
        const off   = 5 + Math.floor(Math.random() * 4);
        const horiz = dir === 'up' || dir === 'down';
        const cc    = horiz ? col + off : col;
        const cr    = horiz ? row : row + off;
        const cs    = speed * (0.85 + Math.random() * 0.3);
        lines.push({
          id: idCounter++, col: cc, row: cr, prevCol: cc, prevRow: cr, dir,
          stepInterval: SEG / cs * 33, stepAccum: 0,
          brightness: 0.4 + Math.random() * 0.3,
          colorIdx: ci, trail: [{ x: cx(cc), y: cy(cr) }],
          alive: true, deadAt: 0, turnTimer: 0,
          turnInterval: 100 + Math.floor(Math.random() * 140),
        });
      }
    }

    function kill(line: Line) {
      line.alive = false;
      line.deadAt = performance.now();
      const p = renderPos(line);
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 0.5 + Math.random() * 2;
        particles.push({ x: p.x, y: p.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, colorIdx: line.colorIdx });
      }
    }

    // ── Update ─────────────────────────────────────────────────────────────
    function update(now: number) {
      if (!W || !H) return;
      if (now - lastTime < 33) return;
      const dt = Math.min(now - (lastTime || now), 50);
      lastTime = now;

      spawnTimer += dt;
      if (spawnTimer >= nextSpawn) {
        spawn();
        spawnTimer = 0;
        nextSpawn = SPAWN_MIN + Math.random() * (SPAWN_MAX - SPAWN_MIN);
      }

      for (const l of lines) if (l.alive) l.stepAccum += dt;

      const toStep = lines.filter(l => l.alive && l.stepAccum >= l.stepInterval);
      const toKill = new Set<number>();
      const moves  = new Map<Line, { col: number; row: number }>();

      for (const l of toStep) {
        if (scanAhead(l.col, l.row, l.dir, LOOK)) {
          const t = safeTurn(l); if (t) l.dir = t;
        }
        l.turnTimer++;
        if (l.turnTimer >= l.turnInterval && Math.random() < TURN_PROB) {
          l.turnTimer = 0;
          l.turnInterval = 120 + Math.floor(Math.random() * 200);
          const t = safeTurn(l); if (t) l.dir = t;
        }
        const [dc, dr] = DIR[l.dir];
        moves.set(l, { col: l.col + dc, row: l.row + dr });
      }

      // head-on & multi-occupancy collision
      const cells = new Map<string, Line[]>();
      for (const [l, n] of moves) {
        const k = `${n.col},${n.row}`;
        const a = cells.get(k) || []; a.push(l); cells.set(k, a);
      }
      for (const [, arr] of cells) if (arr.length > 1) arr.forEach(l => toKill.add(l.id));
      for (const [l1, n1] of moves)
        for (const [l2, n2] of moves) {
          if (l1.id >= l2.id) continue;
          if (n1.col === l2.col && n1.row === l2.row && n2.col === l1.col && n2.row === l1.row)
            { toKill.add(l1.id); toKill.add(l2.id); }
        }
      for (const [l, n] of moves) {
        if (toKill.has(l.id)) continue;
        if (isOOB(n.col, n.row, 13)) { toKill.add(l.id); continue; }
        if (isOcc(n.col, n.row))     { toKill.add(l.id); continue; }
      }

      for (const [l, n] of moves) {
        if (!toKill.has(l.id)) {
          markCell(l.col, l.row, l.id);
          l.prevCol = l.col; l.prevRow = l.row;
          l.col = n.col; l.row = n.row;
          l.stepAccum -= l.stepInterval;
          l.trail.push({ x: cx(l.col), y: cy(l.row) });
        }
      }
      for (const l of lines) if (l.alive && toKill.has(l.id)) kill(l);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.96; p.vy *= 0.96;
        p.life -= 0.025;
      }
      particles = particles.filter(p => p.life > 0);

      const cutoff = now - FADE_MS;
      for (const l of lines) if (!l.alive && l.deadAt > 0 && l.deadAt < cutoff) clearTrail(l.id);
      lines = lines.filter(l => l.alive || (l.deadAt > 0 && now - l.deadAt < FADE_MS));
    }

    // ── Render ─────────────────────────────────────────────────────────────
    function render(now: number) {
      if (gridCanvas) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(gridCanvas, 0, 0);
        ctx.restore();
      }
      ctx.lineCap  = 'round';
      ctx.lineJoin = 'round';

      for (const l of lines) {
        if (l.trail.length < 2) continue;
        const c = colors[l.colorIdx];
        let br = l.brightness;
        if (!l.alive && l.deadAt > 0)
          br *= Math.max(0, 1 - (now - l.deadAt) / FADE_MS);
        if (br <= 0.01) continue;

        const tr  = l.trail;
        const len = tr.length;
        const hp  = renderPos(l);
        const hx  = l.alive ? hp.x : tr[len - 1].x;
        const hy  = l.alive ? hp.y : tr[len - 1].y;
        const end = l.alive ? Math.max(1, len - HEAD_LEN) : len;

        // body — two strokes in one path
        if (end > 1) {
          ctx.beginPath();
          for (let i = 1; i < end; i++) { ctx.moveTo(tr[i-1].x,tr[i-1].y); ctx.lineTo(tr[i].x,tr[i].y); }
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${br * 0.12})`;
          ctx.lineWidth = 4.2; ctx.stroke();

          ctx.beginPath();
          for (let i = 1; i < end; i++) { ctx.moveTo(tr[i-1].x,tr[i-1].y); ctx.lineTo(tr[i].x,tr[i].y); }
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${br * 0.7})`;
          ctx.lineWidth = 1.2; ctx.stroke();
        }

        // glowing head segments
        for (let i = end; i < len; i++) {
          const u  = 1 - (len - i) / HEAD_LEN;
          const p  = br + (1 - br) * u * u;
          const lw = 1.2 + 0.6 * u;
          if (p < 0.01) continue;
          const ex = (i === len - 1 && l.alive) ? hx : tr[i].x;
          const ey = (i === len - 1 && l.alive) ? hy : tr[i].y;

          ctx.beginPath(); ctx.moveTo(tr[i-1].x,tr[i-1].y); ctx.lineTo(ex,ey);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${p * 0.12})`;
          ctx.lineWidth = lw + 3; ctx.stroke();

          ctx.beginPath(); ctx.moveTo(tr[i-1].x,tr[i-1].y); ctx.lineTo(ex,ey);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${p * 0.7})`;
          ctx.lineWidth = lw; ctx.stroke();
        }

        // head sprite (three layers)
        if (l.alive) {
          const sp = sprites[l.colorIdx];
          ctx.globalAlpha = 0.15; ctx.drawImage(sp, hx-5, hy-5, 10, 10);
          ctx.globalAlpha = 0.35; ctx.drawImage(sp, hx-3, hy-3, 6,  6);
          ctx.globalAlpha = 0.95; ctx.drawImage(sp, hx-1.5, hy-1.5, 3, 3);
          ctx.globalAlpha = 1;
        }
      }

      for (const p of particles) {
        const c = colors[p.colorIdx];
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${p.life * 0.6})`;
        ctx.fillRect(p.x - 0.5, p.y - 0.5, 1, 1);
      }
    }

    // ── RAF loop ───────────────────────────────────────────────────────────
    function tick(now: number) {
      if (aborted) { rafId = 0; return; }
      if (!visible) { rafId = 0; return; }
      update(now);
      render(now);
      rafId = requestAnimationFrame(tick);
    }

    function init() {
      measure();
      buildGrid();
      initCollision();
      buildSprites();
      for (let i = 0; i < 5; i++) spawn();
      rafId = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(() => {
      measure(); buildGrid(); initCollision();
      lines = []; particles = [];
      for (let i = 0; i < 4; i++) spawn();
    });

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && rafId === 0 && !aborted) {
        lastTime = 0;
        rafId = requestAnimationFrame(tick);
      }
    }, { threshold: 0 });

    // Rebuild grid texture + snake colors when theme switches (dark ↔ light)
    const themeObs = new MutationObserver(() => {
      colors = getThemeColors();
      buildGrid();
      buildSprites();
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    init();
    ro.observe(container);
    io.observe(container);

    return () => {
      aborted = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
    };
  }, []);

  return (
    <div className={s.container} ref={containerRef}>
      <canvas className={s.canvas} ref={canvasRef} />
    </div>
  );
}
