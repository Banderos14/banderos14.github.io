/**
 * Conway's Game of Life — canvas background driven by GSAP ticker.
 *
 * Visual design:
 *  - Cells: 8×8px with 1px gap, glow in accent colour
 *  - Birth / death: smooth opacity lerp per frame (no per-cell tweens)
 *  - Toroidal grid — edges wrap, so patterns live forever
 *  - Auto-inject: every ~180 frames sprinkle new live cells → never stagnates
 *  - GSAP ticker drives both the Conway logic and the render loop
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import s from './ConwayBg.module.scss';

// ── Constants ────────────────────────────────────────────────────────────────
const CELL      = 13;   // bigger cells = easier to read text behind them
const UPDATE_MS = 520;  // slow generations = calm texture, not distracting
const FADE_IN   = 0.04; // very gentle appear
const FADE_OUT  = 0.025;// long trailing glow when dying
const MAX_OP    = 0.55; // lower opacity = less competition with text
const DENSITY   = 0.22; // sparser initial fill
const INJECT_EVERY   = 400;
const INJECT_DENSITY = 0.018;

// Accent colours per theme
const COLOR_DARK  = [27,  93, 239] as const; // #1b5def blue
const COLOR_LIGHT = [212, 175, 55] as const; // #D4AF37

// ── Component ────────────────────────────────────────────────────────────────
interface ConwayBgProps { opacity?: number }

export default function ConwayBg({ opacity = 1 }: ConwayBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const canvas    = canvasRef.current!;
    const ctx       = canvas.getContext('2d')!;
    const dpr       = Math.min(window.devicePixelRatio || 1, 2);

    let cols = 0, rows = 0, n = 0;
    let cells!: Uint8Array;   // current gen: 0/1
    let next!:  Uint8Array;   // scratch buffer
    let op!:    Float32Array; // visual opacity 0-1

    let aborted    = false;
    let lastUpdate = 0;
    let frameCount = 0;
    let tickFn: (time: number, dt: number) => void;

    // ── Helpers ──────────────────────────────────────────────────────────────
    const isLight = () =>
      document.documentElement.getAttribute('data-theme') === 'light';

    const idx = (col: number, row: number) =>
      ((row + rows) % rows) * cols + ((col + cols) % cols);

    // ── Initialise canvas & grid ─────────────────────────────────────────────
    function init() {
      const rect = container.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;
      cols = Math.max(1, Math.floor(W / CELL));
      rows = Math.max(1, Math.floor(H / CELL));
      n    = cols * rows;

      canvas.width  = cols * CELL * dpr;
      canvas.height = rows * CELL * dpr;
      canvas.style.width  = `${cols * CELL}px`;
      canvas.style.height = `${rows * CELL}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cells = new Uint8Array(n);
      next  = new Uint8Array(n);
      op    = new Float32Array(n);

      randomise(DENSITY);
    }

    function randomise(density: number) {
      for (let i = 0; i < n; i++) cells[i] = Math.random() < density ? 1 : 0;
    }

    function inject(density = INJECT_DENSITY) {
      for (let i = 0; i < n; i++) if (Math.random() < density) cells[i] = 1;
    }

    // ── Conway step (B3/S23, toroidal) ───────────────────────────────────────
    function step() {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          let nbrs = 0;
          for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              nbrs += cells[idx(col + dc, row + dr)];
            }
          const alive = cells[row * cols + col];
          next[row * cols + col] = alive
            ? (nbrs === 2 || nbrs === 3 ? 1 : 0)
            : (nbrs === 3 ? 1 : 0);
        }
      }
      // Swap buffers
      const tmp = cells; cells = next; next = tmp;
    }

    // ── Render ───────────────────────────────────────────────────────────────
    function render() {
      ctx.clearRect(0, 0, cols * CELL, rows * CELL);
      const [r, g, b] = isLight() ? COLOR_LIGHT : COLOR_DARK;
      const cellDraw = CELL - 1;

      for (let i = 0; i < n; i++) {
        // Lerp opacity toward target
        const target = cells[i] ? MAX_OP : 0;
        const lerp   = cells[i] ? FADE_IN : FADE_OUT;
        op[i] += (target - op[i]) * lerp;
        if (op[i] < 0.008) continue;

        const col = i % cols;
        const row = Math.floor(i / cols);
        ctx.fillStyle = `rgba(${r},${g},${b},${op[i].toFixed(3)})`;
        ctx.fillRect(col * CELL, row * CELL, cellDraw, cellDraw);
      }
    }

    // ── GSAP ticker function ─────────────────────────────────────────────────
    tickFn = (time: number) => {
      if (aborted) return;

      frameCount++;

      // Throttle Conway update to UPDATE_MS interval
      if (time * 1000 - lastUpdate >= UPDATE_MS) {
        step();
        lastUpdate = time * 1000;

        // Periodic injection to prevent stagnation
        if (frameCount % INJECT_EVERY === 0) inject();
      }

      render();
    };

    // ── Visibility & resize ──────────────────────────────────────────────────
    let visible = false;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) gsap.ticker.add(tickFn);
      else          gsap.ticker.remove(tickFn);
    }, { threshold: 0.05 });

    const ro = new ResizeObserver(() => {
      gsap.ticker.remove(tickFn);
      init();
      if (visible) gsap.ticker.add(tickFn);
    });

    // ── GSAP entrance: fade the whole canvas in, then start ticking ──────────
    canvas.style.opacity = '0';
    init();
    io.observe(container);
    ro.observe(container);

    gsap.to(canvas, {
      opacity: opacity,
      duration: 1.2,
      delay: 0.3,
      ease: 'power2.out',
    });

    return () => {
      aborted = true;
      gsap.ticker.remove(tickFn);
      gsap.killTweensOf(canvas);
      io.disconnect();
      ro.disconnect();
    };
  }, [opacity]);

  return (
    <div className={s.wrap} ref={containerRef}>
      <canvas className={s.canvas} ref={canvasRef} />
    </div>
  );
}
