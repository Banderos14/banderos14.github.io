import { useEffect, useRef } from 'react';

// Параметры сетки (как у codedgar)
const SPACING  = 24;    // расстояние между точками
const DOT_SIZE = 1.2;   // базовый радиус точки
const RADIUS   = 120;   // зона влияния мыши (px)
const PUSH     = 18;    // насколько далеко точки отбегают
const MAX_SCL  = 2.5;   // максимальное увеличение точки под мышью
const LERP_HOME = 0.06; // скорость возврата домой (медленно)
const LERP_PUSH = 0.12; // скорость при отталкивании (быстро)

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
    let mouseX = -9999;
    let mouseY = -9999;
    let phase  = 0;       // для breathing-анимации
    let rafId: number;
    let W = 0, H = 0;

    // Получаем цвет точки в зависимости от темы
    const getDotColor = () =>
      document.documentElement.getAttribute('data-theme') === 'light'
        ? 'rgba(0,0,0,0.09)'
        : 'rgba(255,255,255,0.1)';

    // Строим сетку точек — вызывается при старте и ресайзе
    const buildGrid = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      dots = [];
      const off = SPACING / 2;
      for (let y = off; y < H + SPACING; y += SPACING)
        for (let x = off; x < W + SPACING; x += SPACING)
          dots.push({ homeX:x, homeY:y, x, y, size:DOT_SIZE,
                      targetX:x, targetY:y, targetSize:DOT_SIZE });
    };

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      phase += 0.015;
      // breathing: точки слегка пульсируют ±20%
      const breathe = 1 + 0.2 * Math.sin(phase);
      const color = getDotColor();

      for (const d of dots) {
        // Считаем расстояние от "дома" точки до мыши
        const dx = d.homeX - mouseX;
        const dy = d.homeY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < RADIUS && dist > 0) {
          // Точка в зоне влияния — отталкиваем её
          const strength = (1 - dist / RADIUS) ** 2;
          const angle = Math.atan2(dy, dx);
          d.targetX    = d.homeX + Math.cos(angle) * PUSH * strength;
          d.targetY    = d.homeY + Math.sin(angle) * PUSH * strength;
          d.targetSize = DOT_SIZE * (1 + (MAX_SCL - 1) * strength);
        } else {
          // Возвращаем точку домой
          d.targetX    = d.homeX;
          d.targetY    = d.homeY;
          d.targetSize = DOT_SIZE;
        }

        // Плавная интерполяция (lerp) к цели
        const lr = (d.targetX === d.homeX && d.targetY === d.homeY)
          ? LERP_HOME : LERP_PUSH;
        d.x    += (d.targetX    - d.x)    * lr;
        d.y    += (d.targetY    - d.y)    * lr;
        d.size += (d.targetSize - d.size) * lr;

        // Рисуем точку
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * breathe * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    };

    const onMove   = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onLeave  = () => { mouseX = -9999; mouseY = -9999; };
    const onResize = () => buildGrid();

    buildGrid();
    tick();
    window.addEventListener('mousemove', onMove,   { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize',   onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize',   onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}
    />
  );
}
