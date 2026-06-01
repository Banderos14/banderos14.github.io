import { useRef, useCallback } from 'react';
import s from './HeroPhoto.module.scss';

const TARGET_RADIUS = 60;  // max pixel-circle radius
const BLOCK_SIZE    = 10;  // pixel block size in px
const ANIM_IN_MS    = 280;
const ANIM_OUT_MS   = 200;

interface HeroPhotoProps { visible: boolean }

export default function HeroPhoto({ visible }: HeroPhotoProps) {
  const imgRef    = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelSrc  = useRef<HTMLCanvasElement | null>(null); // pre-computed pixelated
  const rafId     = useRef(0);
  const radius    = useRef(0);
  const cursorPos = useRef({ x: 0, y: 0 });

  // Pre-compute small-resolution version for efficient reuse each frame
  const buildPixelSrc = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const W = img.clientWidth, H = img.clientHeight;
    const pw = Math.ceil(W / BLOCK_SIZE);
    const ph = Math.ceil(H / BLOCK_SIZE);
    const tmp = document.createElement('canvas');
    tmp.width = pw; tmp.height = ph;
    const tc = tmp.getContext('2d')!;
    tc.imageSmoothingEnabled = false;
    tc.drawImage(img, 0, 0, pw, ph);
    pixelSrc.current = tmp;
    const canvas = canvasRef.current!;
    canvas.width  = W;
    canvas.height = H;
  }, []);

  // Draw one frame: pixelated circle at current cursor pos + current radius
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const pSrc   = pixelSrc.current;
    if (!canvas || !pSrc || radius.current < 0.5) {
      canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const { x, y } = cursorPos.current;
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius.current, 0, Math.PI * 2);
    ctx.clip();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(pSrc, 0, 0, pSrc.width, pSrc.height, 0, 0, W, H);
    ctx.restore();
  }, []);

  // Animate radius in
  const animateIn = useCallback((startR: number, startTime: number, now: number) => {
    const t    = Math.min((now - startTime) / ANIM_IN_MS, 1);
    const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
    radius.current = startR + (TARGET_RADIUS - startR) * ease;
    drawFrame();
    if (t < 1) rafId.current = requestAnimationFrame(n => animateIn(startR, startTime, n));
  }, [drawFrame]);

  // Animate radius out
  const animateOut = useCallback((startR: number, startTime: number, now: number) => {
    const t    = Math.min((now - startTime) / ANIM_OUT_MS, 1);
    const ease = t * t;
    radius.current = startR * (1 - ease);
    drawFrame();
    if (t < 1) rafId.current = requestAnimationFrame(n => animateOut(startR, startTime, n));
    else { radius.current = 0; drawFrame(); }
  }, [drawFrame]);

  const onEnter = useCallback(() => {
    buildPixelSrc();
    cancelAnimationFrame(rafId.current);
    const startR = radius.current;
    const t0 = performance.now();
    animateIn(startR, t0, t0);
  }, [buildPixelSrc, animateIn]);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    drawFrame();
  }, [drawFrame]);

  const onLeave = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    const startR = radius.current;
    const t0 = performance.now();
    animateOut(startR, t0, t0);
  }, [animateOut]);

  return (
    <div
      className={s.wrap}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'none' : 'translateY(14px)',
        transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
      }}
    >
      <div
        className={s.photo}
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <img
          ref={imgRef}
          src="/img/photo_2024-09-17_09-50-42.jpg"
          alt="Anton Shyshenko"
          className={s.img}
        />

        {/* Pixel overlay — transparent until cursor enters */}
        <canvas
          ref={canvasRef}
          className={s.pixelCanvas}
          aria-hidden="true"
        />

        <span className={`${s.corner} ${s.tl}`} />
        <span className={`${s.corner} ${s.tr}`} />
        <span className={`${s.corner} ${s.bl}`} />
        <span className={`${s.corner} ${s.br}`} />
      </div>
    </div>
  );
}
