import { useEffect, useRef, useState } from 'react';
import s from './Cursor.module.scss';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let rx = 0, ry = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;

      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      const animate = () => {
        rx = lerp(rx, e.clientX, 0.12);
        ry = lerp(ry, e.clientY, 0.12);
        ring.style.left = `${rx}px`;
        ring.style.top = `${ry}px`;
        rafId = requestAnimationFrame(animate);
      };

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(animate);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovered(!!el.closest('a, button, [data-hover]'));
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={`${s.dot} ${hovered ? s.dotExpanded : ''}`} />
      <div ref={ringRef} className={`${s.ring} ${hovered ? s.ringExpanded : ''}`} />
    </>
  );
}
