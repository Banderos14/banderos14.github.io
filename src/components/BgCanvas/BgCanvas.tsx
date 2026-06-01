import { useEffect, useRef } from 'react';

const SPACING    = 38;   // larger gap → sparser grid
const DOT_R      = 0.85; // smaller dot
const RADIUS     = 110;
const RADIUS2    = RADIUS * RADIUS;
const PUSH       = 16;
const MAX_SCL    = 2.2;
const LERP_HOME  = 0.055;
const LERP_PUSH  = 0.11;
const FPS_CAP    = 1000 / 30;
const PARALLAX   = 0.14;   // dots move at 14% of scroll speed (like codedgar yPercent:-15)
const SCROLL_LERP = 0.08;  // smooth scroll interpolation

interface Dot {
  homeX: number; homeY: number;
  x: number; y: number;
  size: number;
  targetX: number; targetY: number; targetSize: number;
}

export default function BgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dots: Dot[] = [];
    let mouseX = -9999, mouseY = -9999;
    let phase = 0;
    let lastT = 0;
    let rafId = 0;
    let W = 0, H = 0;
    let dotColor = '';
    let rawScroll = 0;     // actual window.scrollY
    let smoothScroll = 0;  // lerped scroll for parallax

    const updateColor = () => {
      dotColor = document.documentElement.getAttribute('data-theme') === 'light'
        ? 'rgba(0,0,0,0.22)'
        : 'rgba(255,255,255,0.28)';
    };
    updateColor();

    const buildGrid = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      dots = [];
      const off = SPACING / 2;
      // Extra rows above and below for seamless parallax tiling
      for (let y = -SPACING * 2 + off; y < H + SPACING * 3; y += SPACING)
        for (let x = off; x < W + SPACING; x += SPACING)
          dots.push({ homeX: x, homeY: y, x, y, size: DOT_R,
                      targetX: x, targetY: y, targetSize: DOT_R });
    };

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (now - lastT < FPS_CAP) return;
      lastT = now;

      // Smooth scroll lerp — drives parallax
      smoothScroll += (rawScroll - smoothScroll) * SCROLL_LERP;

      // Parallax shift: dots drift upward as page scrolls down, tiled seamlessly
      const tileShift = -(smoothScroll * PARALLAX) % SPACING;

      ctx.clearRect(0, 0, W, H);
      phase += 0.012;
      const breathe = 1 + 0.18 * Math.sin(phase);

      ctx.save();
      ctx.translate(0, tileShift);  // shift entire dot field by parallax amount

      ctx.beginPath();
      ctx.fillStyle = dotColor;

      for (const d of dots) {
        // Mouse repel uses screen coords — adjust for the canvas translate
        const adjustedMouseY = mouseY - tileShift;
        const dx = d.homeX - mouseX;
        const dy = d.homeY - adjustedMouseY;
        const d2 = dx * dx + dy * dy;

        if (d2 < RADIUS2 && d2 > 1) {
          const dist     = Math.sqrt(d2);
          const strength = (1 - dist / RADIUS) ** 2;
          const angle    = Math.atan2(dy, dx);
          d.targetX    = d.homeX + Math.cos(angle) * PUSH * strength;
          d.targetY    = d.homeY + Math.sin(angle) * PUSH * strength;
          d.targetSize = DOT_R * (1 + (MAX_SCL - 1) * strength);
        } else {
          d.targetX    = d.homeX;
          d.targetY    = d.homeY;
          d.targetSize = DOT_R;
        }

        const lr = (d.targetX === d.homeX) ? LERP_HOME : LERP_PUSH;
        d.x    += (d.targetX    - d.x)    * lr;
        d.y    += (d.targetY    - d.y)    * lr;
        d.size += (d.targetSize - d.size) * lr;

        const r = d.size * breathe * 0.5;
        ctx.moveTo(d.x + r, d.y);
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      }

      ctx.fill();
      ctx.restore();
    };

    const onMove   = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onLeave  = () => { mouseX = -9999; mouseY = -9999; };
    const onResize = () => buildGrid();
    const onScroll = () => { rawScroll = window.scrollY; };

    const themeObs = new MutationObserver(updateColor);
    themeObs.observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-theme'],
    });

    buildGrid();
    rafId = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove,   { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize',   onResize,  { passive: true });
    window.addEventListener('scroll',   onScroll,  { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      themeObs.disconnect();
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize',     onResize);
      window.removeEventListener('scroll',     onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
