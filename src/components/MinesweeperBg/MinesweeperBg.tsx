import { useEffect, useRef } from 'react';
import s from './MinesweeperBg.module.scss';

// ── Timings (ported from codedgar) ─────────────────────────────────────────
const T = {
  initialDelay:       1200,
  betweenClicksMin:    350,
  betweenClicksMax:    800,
  blinkDuration:       140,
  hitBlinkCount:         3,
  allMinesBlinkCount:    2,
  resetDelay:         1800,
  sweepFlipStagger:     30,
  sweepFlipDuration:   380,
};

interface Cell {
  isMine:        boolean;
  isRevealed:    boolean;
  neighborMines: number;
}

interface Palette {
  bg:          string;
  text:        string;
  borderColor: string;
  borderWidth: number;
}

// ── Component ────────────────────────────────────────────────────────────────
interface MinesweeperBgProps {
  cellSize?:    number;   // px, default 22
  mineDensity?: number;   // percent, default 15
  speed?:       number;   // multiplier, default 1
  opacity?:     number;   // canvas opacity, default 0.35
}

export default function MinesweeperBg({
  cellSize    = 22,
  mineDensity = 15,
  speed       = 1,
  opacity     = 0.35,
}: MinesweeperBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const gridEl    = gridRef.current!;
    if (!container || !gridEl) return;

    // ── State ──────────────────────────────────────────────────────────────
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let cols = 0, rows = 0, dpr = 1;
    let fontSize = 0, baselineOffset = 0;
    let grid: Cell[][] = [];
    let palette = new Map<string, Palette>();
    let aborted = false;
    let paused  = true;
    let pauseResolve: (() => void) | null = null;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let rafId   = 0;
    let sweepActive = false;

    // ── Pause / resume ─────────────────────────────────────────────────────
    const pause  = () => { paused = true; };
    const resume = () => {
      if (!paused) return;
      paused = false;
      pauseResolve?.(); pauseResolve = null;
    };
    const waitResume = () =>
      !paused || aborted ? Promise.resolve()
      : new Promise<void>(res => { pauseResolve = res; });

    const sleep = (ms: number) =>
      waitResume().then(() => new Promise<void>((res, rej) => {
        if (aborted) return rej('aborted');
        timerId = setTimeout(() => aborted ? rej('aborted') : res(), ms / speed);
      }));

    // ── Visibility ─────────────────────────────────────────────────────────
    const io = new IntersectionObserver(([e]) =>
      e.isIntersecting ? resume() : pause(), { threshold: 0.05 });
    io.observe(container);

    const onVis = () => {
      if (document.hidden) pause();
      else if (!container.getBoundingClientRect().bottom) pause();
      else resume();
    };
    document.addEventListener('visibilitychange', onVis);

    // ── Dimensions ────────────────────────────────────────────────────────
    function calcDims() {
      const r = container.getBoundingClientRect();
      cols = Math.floor(r.width  / cellSize);
      rows = Math.floor(r.height / cellSize);
      return cols >= 3 && rows >= 3;
    }

    // ── Color sampling from hidden DOM cell ────────────────────────────────
    function sampleColors() {
      palette = new Map();
      const probe = document.createElement('div');
      probe.className = s.cell;
      probe.style.cssText = `position:absolute;visibility:hidden;width:${cellSize}px;height:${cellSize}px;font-size:${fontSize}px;`;
      gridEl.appendChild(probe);

      const read = (state: string, value?: string, extra?: string): Palette => {
        probe.dataset.state = state;
        if (value !== undefined) probe.dataset.value = value;
        else delete probe.dataset.value;
        probe.className = s.cell + (extra ? ' ' + s[extra] : '');
        const cs = getComputedStyle(probe);
        return {
          bg:          cs.backgroundColor,
          text:        cs.color,
          borderColor: cs.borderColor,
          borderWidth: parseFloat(cs.borderTopWidth) || 0,
        };
      };

      palette.set('unrevealed', read('unrevealed'));
      palette.set('revealed:0', read('revealed'));
      for (let n = 1; n <= 8; n++)
        palette.set(`revealed:${n}`, read('revealed', n.toString()));
      palette.set('mine',     read('mine'));
      palette.set('mine-hit', read('mine-hit'));
      palette.set('blinking', read('mine', undefined, 'blinking'));

      probe.remove();
    }

    // ── Canvas setup ────────────────────────────────────────────────────────
    function measureCanvas() {
      if (!canvas || !ctx) return;
      const w = cols * cellSize;
      const h = rows * cellSize;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      const offX = Math.round((gridEl.clientWidth  - w) / 2);
      const offY = Math.round((gridEl.clientHeight - h) / 2);
      canvas.style.cssText = `position:absolute;top:${offY}px;left:${offX}px;width:${w}px;height:${h}px;pointer-events:none;`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font        = `700 ${fontSize}px "DM Mono", monospace`;
      ctx.textAlign   = 'center';
      ctx.textBaseline = 'alphabetic';
    }

    function initCanvas(): boolean {
      dpr      = Math.min(window.devicePixelRatio || 1, 2);
      fontSize = Math.round(cellSize * 0.42);
      const c  = document.createElement('canvas');
      gridEl.after(c);
      canvas = c;
      const cx = c.getContext('2d');
      if (!cx) { c.remove(); canvas = null; return false; }
      ctx = cx;
      measureCanvas();
      const m = cx.measureText('0');
      const asc  = m.fontBoundingBoxAscent  ?? m.actualBoundingBoxAscent;
      const desc = m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent;
      baselineOffset = (asc - desc) / 2;
      sampleColors();

      const ro = new ResizeObserver(() => {
        if (aborted || sweepActive) return;
        const oldC = cols, oldR = rows;
        if (!calcDims()) return;
        if (cols !== oldC || rows !== oldR) { measureCanvas(); generateGrid(); renderGrid(); }
        else { measureCanvas(); renderGrid(); }
      });
      ro.observe(container);
      return true;
    }

    // ── Draw helpers ───────────────────────────────────────────────────────
    function palFor(col: number, row: number): Palette {
      const c = grid[row][col];
      if (c.isRevealed) {
        if (c.isMine) return palette.get('mine')!;
        return palette.get(`revealed:${c.neighborMines}`)!;
      }
      return palette.get('unrevealed')!;
    }

    function textFor(col: number, row: number): string {
      const c = grid[row][col];
      if (!c.isRevealed) return '';
      if (c.isMine) return '*';
      return c.neighborMines > 0 ? c.neighborMines.toString() : '';
    }

    function drawCell(col: number, row: number, pal: Palette, text: string, scaleX = 1) {
      if (!ctx) return;
      const cs = cellSize;
      const px = col * cs;
      const py = row * cs;
      const cx = px + cs / 2;
      const cw = cs * scaleX;
      const ox = cx - cw / 2;

      ctx.fillStyle = pal.bg;
      ctx.fillRect(ox, py, cw, cs);

      if (pal.borderWidth > 0 && cw > 4) {
        ctx.strokeStyle = pal.borderColor;
        ctx.lineWidth   = pal.borderWidth;
        ctx.strokeRect(ox + 0.5, py + 0.5, cw - 1, cs - 1);
      }

      if (text && cw > cs * 0.3) {
        ctx.fillStyle = pal.text;
        ctx.save();
        ctx.translate(cx, py + cs / 2 + baselineOffset);
        ctx.scale(scaleX, 1);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    }

    function clearCell(col: number, row: number) {
      ctx?.clearRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }

    // ── Grid logic ─────────────────────────────────────────────────────────
    function generateGrid() {
      const total = cols * rows;
      const mines = Math.max(1, Math.floor(total * (mineDensity / 100)));
      grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({ isMine: false, isRevealed: false, neighborMines: 0 })));

      let placed = 0;
      while (placed < mines) {
        const c = Math.floor(Math.random() * cols);
        const r = Math.floor(Math.random() * rows);
        if (!grid[r][c].isMine) { grid[r][c].isMine = true; placed++; }
      }

      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (!grid[r][c].isMine) grid[r][c].neighborMines = countNeighbors(c, r);
    }

    function countNeighbors(col: number, row: number) {
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const nr = row + dr, nc = col + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isMine) n++;
        }
      return n;
    }

    function floodFill(col: number, row: number) {
      const queue = [[col, row]];
      const seen  = new Set<number>();
      let i = 0;
      while (i < queue.length) {
        const [c, r] = queue[i++];
        if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
        const key = r * cols + c;
        if (seen.has(key)) continue;
        seen.add(key);
        const cell = grid[r][c];
        if (cell.isRevealed || cell.isMine) continue;
        cell.isRevealed = true;
        if (cell.neighborMines === 0)
          for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++)
              if (dr || dc) queue.push([c + dc, r + dr]);
      }
    }

    function findSafeEmpty(): { x: number; y: number } {
      const empties: { x: number; y: number }[] = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (!grid[r][c].isMine && grid[r][c].neighborMines === 0)
            empties.push({ x: c, y: r });
      if (empties.length) return empties[Math.floor(Math.random() * empties.length)];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (!grid[r][c].isMine) return { x: c, y: r };
      return { x: 0, y: 0 };
    }

    function pickUnrevealed(): { x: number; y: number } | null {
      const list: { x: number; y: number }[] = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (!grid[r][c].isRevealed) list.push({ x: c, y: r });
      return list.length ? list[Math.floor(Math.random() * list.length)] : null;
    }

    function renderGrid() {
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          clearCell(c, r);
          drawCell(c, r, palFor(c, r), textFor(c, r));
        }
    }

    // ── Mine hit sequence ──────────────────────────────────────────────────
    async function mineHitSequence(col: number, row: number) {
      const mine    = palette.get('mine')!;
      const hit     = palette.get('mine-hit')!;
      const blink   = palette.get('blinking')!;

      grid[row][col].isRevealed = true;
      clearCell(col, row); drawCell(col, row, hit, '*');

      for (let i = 0; i < T.hitBlinkCount; i++) {
        clearCell(col, row); drawCell(col, row, blink, '*');
        await sleep(T.blinkDuration);
        clearCell(col, row); drawCell(col, row, hit, '*');
        await sleep(T.blinkDuration);
      }

      const allMines: { x: number; y: number }[] = [{ x: col, y: row }];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (grid[r][c].isMine && !(c === col && r === row)) {
            grid[r][c].isRevealed = true;
            clearCell(c, r); drawCell(c, r, mine, '*');
            allMines.push({ x: c, y: r });
          }

      await sleep(T.blinkDuration * 2);
      for (let i = 0; i < T.allMinesBlinkCount; i++) {
        for (const { x, y } of allMines) { clearCell(x, y); drawCell(x, y, blink, '*'); }
        await sleep(T.blinkDuration);
        for (const { x, y } of allMines) {
          clearCell(x, y);
          drawCell(x, y, x === col && y === row ? hit : mine, '*');
        }
        await sleep(T.blinkDuration);
      }
    }

    // ── Diagonal sweep reset ───────────────────────────────────────────────
    async function diagonalSweepReset() {
      sweepActive = true;
      const diagCount = (cols - 1) + (rows - 1);
      const unrevealed = palette.get('unrevealed')!;

      // snapshot current state
      const snap: { pal: Palette; text: string }[][] =
        Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => ({
            pal:  palFor(c, r),
            text: textFor(c, r),
          })));

      // gather revealed cells per diagonal
      const byDiag: { x: number; y: number }[][] = Array.from({ length: diagCount + 1 }, () => []);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (grid[r][c].isRevealed)
            byDiag[(cols - 1 - c) + r].push({ x: c, y: r });

      const halfMs = (T.sweepFlipDuration / 2) / speed;
      const staggerMs = T.sweepFlipStagger / speed;
      const done = new Array(diagCount + 1).fill(false);

      await new Promise<void>(resolve => {
        let start = -1, pauseOffset = 0, pauseStart = -1;

        const frame = (now: number) => {
          if (aborted) { sweepActive = false; resolve(); return; }

          if (paused) {
            if (pauseStart < 0) pauseStart = now;
            rafId = requestAnimationFrame(frame);
            return;
          }
          if (pauseStart >= 0) { pauseOffset += now - pauseStart; pauseStart = -1; }
          if (start < 0) start = now;

          const elapsed = now - start - pauseOffset;
          let allDone = true;

          for (let d = 0; d <= diagCount; d++) {
            if (byDiag[d].length === 0) continue;
            const t0  = d * staggerMs;
            const rel = elapsed - t0;
            if (rel < 0)       { allDone = false; continue; }
            if (rel >= halfMs * 2) {
              if (!done[d]) {
                done[d] = true;
                for (const { x, y } of byDiag[d]) { clearCell(x, y); drawCell(x, y, unrevealed, '', 1); }
              }
              continue;
            }
            allDone = false;
            for (const { x, y } of byDiag[d]) {
              clearCell(x, y);
              if (rel < halfMs) {
                const u = rel / halfMs;
                drawCell(x, y, snap[y][x].pal, snap[y][x].text, 1 - u * u);
              } else {
                const u = (rel - halfMs) / halfMs;
                drawCell(x, y, unrevealed, '', 1 - (1 - u) * (1 - u));
              }
            }
          }

          if (allDone) { sweepActive = false; resolve(); }
          else rafId = requestAnimationFrame(frame);
        };

        rafId = requestAnimationFrame(frame);
      });
    }

    // ── Main loop ──────────────────────────────────────────────────────────
    async function run() {
      if (!calcDims() || !initCanvas()) return;
      try {
        while (!aborted) {
          generateGrid();
          renderGrid();
          await sleep(T.initialDelay);

          const start = findSafeEmpty();
          floodFill(start.x, start.y);
          renderGrid();

          let hitMine = false;
          while (!hitMine && !aborted) {
            const delay = T.betweenClicksMin + Math.random() * (T.betweenClicksMax - T.betweenClicksMin);
            await sleep(delay);
            const cell = pickUnrevealed();
            if (!cell) break;
            if (grid[cell.y][cell.x].isMine) {
              await mineHitSequence(cell.x, cell.y);
              hitMine = true;
            } else {
              if (grid[cell.y][cell.x].neighborMines === 0)
                floodFill(cell.x, cell.y);
              else
                grid[cell.y][cell.x].isRevealed = true;
              renderGrid();
            }
          }

          await sleep(T.resetDelay);
          await diagonalSweepReset();
        }
      } catch (e) {
        if (e !== 'aborted') throw e;
      }
    }

    run();

    return () => {
      aborted = true;
      if (timerId) clearTimeout(timerId);
      if (rafId)   cancelAnimationFrame(rafId);
      pauseResolve?.();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas?.remove();
    };
  }, [cellSize, mineDensity, speed]);

  return (
    <div
      ref={containerRef}
      className={s.container}
      style={{ '--msw-opacity': opacity } as React.CSSProperties}
    >
      <div ref={gridRef} className={s.grid} />
    </div>
  );
}
