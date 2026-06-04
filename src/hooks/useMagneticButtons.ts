import { useEffect } from 'react';
import gsap from 'gsap';

const STRENGTH = 0.30;
const MAX_DIST = 0.80; // fraction of largest btn dimension

export function useMagneticButtons() {
  useEffect(() => {
    // No hover events on touch devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cleanups: (() => void)[] = [];

    const attach = (btn: HTMLElement) => {
      if (btn.dataset.magnetic) return;
      btn.dataset.magnetic = '1';

      let rect: DOMRect | null = null;
      let pending: MouseEvent | null = null;
      let rafId: number | null = null;

      const onEnter = () => { rect = btn.getBoundingClientRect(); };

      const applyForce = () => {
        rafId = null;
        if (!pending || !rect) return;
        const ev = pending; pending = null;
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = ev.clientX - cx;
        const dy   = ev.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const max  = Math.max(rect.width, rect.height) * MAX_DIST;
        if (dist < max) {
          const s = 1 - dist / max;
          gsap.to(btn, { x: dx * s * STRENGTH, y: dy * s * STRENGTH,
                          duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        }
      };

      const onMove = (e: MouseEvent) => {
        pending = e;
        if (rafId === null) rafId = requestAnimationFrame(applyForce);
      };

      const onLeave = () => {
        rect = null; pending = null;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      };

      btn.addEventListener('mouseenter', onEnter);
      btn.addEventListener('mousemove',  onMove);
      btn.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        btn.removeEventListener('mouseenter', onEnter);
        btn.removeEventListener('mousemove',  onMove);
        btn.removeEventListener('mouseleave', onLeave);
        if (rafId !== null) cancelAnimationFrame(rafId);
        gsap.set(btn, { clearProps: 'x,y' });
        delete btn.dataset.magnetic;
      });
    };

    document.querySelectorAll<HTMLElement>('.btn-wrap').forEach(attach);

    // Watch for dynamically mounted buttons (e.g. after scroll-triggered reveals)
    const mo = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>('.btn-wrap').forEach(attach);
    });
    mo.observe(document.body, { childList: true, subtree: false });

    return () => {
      mo.disconnect();
      cleanups.forEach(fn => fn());
    };
  }, []);
}
