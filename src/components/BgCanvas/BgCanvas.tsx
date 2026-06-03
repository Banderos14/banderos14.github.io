import { useEffect, useRef } from 'react';

const SPACING     = 36;
const DOT_R       = 1.1;
const PARALLAX    = 0.07;
const SCROLL_LERP = 0.12;

interface Dot {
  x: number;
  y: number;
}

export default function BgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let dots: Dot[] = [];
    let rafId = 0;
    let W = 0, H = 0;
    let dotColor = '';
    let rawScroll = window.scrollY;
    let smoothScroll = rawScroll;

    const updateColor = () => {
      dotColor = document.documentElement.getAttribute('data-theme') === 'light'
        ? 'rgba(0,0,0,0.22)'
        : 'rgba(255,255,255,0.28)';
    };
    updateColor();

    const buildGrid = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width        = W * dpr;
      canvas.height       = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
      dots = [];
      const off = SPACING / 2;
      // Extra rows above/below — enough for full parallax range on long pages
      for (let y = -SPACING * 3 + off; y < H + SPACING * 4; y += SPACING)
        for (let x = off; x < W + SPACING; x += SPACING)
          dots.push({ x, y });
    };

    const tick = () => {
      smoothScroll += (rawScroll - smoothScroll) * SCROLL_LERP;
      const tileShift = -(smoothScroll * PARALLAX) % SPACING;

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(0, tileShift);
      ctx.beginPath();
      ctx.fillStyle = dotColor;

      const r = DOT_R * 0.5;
      for (const d of dots) {
        ctx.moveTo(d.x + r, d.y);
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      }

      ctx.fill();
      ctx.restore();

      // Stop RAF when scroll has settled
      if (Math.abs(rawScroll - smoothScroll) > 0.1) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const wake = () => { if (!rafId) rafId = requestAnimationFrame(tick); };

    const onResize = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); buildGrid(); wake(); };
    const onScroll = () => { rawScroll = window.scrollY; wake(); };

    const themeObs = new MutationObserver(() => { updateColor(); wake(); });
    themeObs.observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-theme'],
    });

    buildGrid();
    rafId = requestAnimationFrame(tick);

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      themeObs.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
