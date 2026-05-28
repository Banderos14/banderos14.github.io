import { useEffect, useRef } from 'react';
import s from './BgCanvas.module.scss';

const CHARS = '0123456789{}[]()<>=+-*/&|!?;:.,#@$%^~_\\\'"`'.split('');
const COUNT = 75;

interface Cell {
  el: HTMLSpanElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
}

export default function BgCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cells: Cell[] = [];
    const W = window.innerWidth;
    const H = window.innerHeight;

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement('span');
      el.className = s.cell;
      el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];

      const cell: Cell = {
        el,
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.004,
      };

      el.style.left = `${cell.x}px`;
      el.style.top = `${cell.y}px`;
      container.appendChild(el);
      cells.push(cell);
    }

    let frame = 0;
    let rafId: number;

    const tick = () => {
      frame++;
      cells.forEach(cell => {
        cell.x += cell.vx;
        cell.y += cell.vy;

        if (cell.x < -20) cell.x = W + 10;
        if (cell.x > W + 20) cell.x = -10;
        if (cell.y < -20) cell.y = H + 10;
        if (cell.y > H + 20) cell.y = -10;

        const opacity = (Math.sin(frame * cell.speed + cell.phase) + 1) * 0.5;
        cell.el.style.left = `${cell.x}px`;
        cell.el.style.top = `${cell.y}px`;
        cell.el.style.opacity = String(opacity * 0.6);

        if (frame % 180 === 0) {
          cell.el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      cells.forEach(c => c.el.remove());
    };
  }, []);

  return <div ref={containerRef} className={s.canvas} />;
}
