import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Sets up GSAP ScrollTrigger reveal animations:
 *
 * [data-reveal="up"]    — fade + translateY (default)
 * [data-reveal="left"]  — fade + translateX from left
 * [data-reveal="clip"]  — clip-path reveal (left → right)
 * [data-reveal="scale"] — fade + scale from 0.94
 *
 * [data-stagger="N"]    — stagger delay in seconds for children (default 0.1)
 * [data-reveal-start]   — custom ScrollTrigger start (default "top 88%")
 */
export function useGsapReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const triggers: ScrollTrigger[] = [];

    // ── Individual reveal elements
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
      const type  = el.dataset.reveal || 'up';
      const start = el.dataset.revealStart || 'top 88%';

      const from: gsap.TweenVars = { opacity: 0 };
      const to:   gsap.TweenVars = { opacity: 1, duration: 0.65, ease: 'power3.out' };

      if (type === 'up')   { from.y = 28;                    to.y = 0; }
      if (type === 'left') { from.x = -32;                   to.x = 0; }
      if (type === 'clip') { from.clipPath = 'inset(0 100% 0 0)'; to.clipPath = 'inset(0 0% 0 0)'; }
      if (type === 'scale'){ from.scale = 0.94;               to.scale = 1; }

      const tween = gsap.fromTo(el, from, {
        ...to,
        scrollTrigger: { trigger: el, start, once: true },
      });

      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    // ── Stagger groups: [data-stagger-group] wrapper → children animate with stagger
    document.querySelectorAll<HTMLElement>('[data-stagger-group]').forEach(group => {
      const children = Array.from(group.children) as HTMLElement[];
      const stagger  = parseFloat(group.dataset.staggerGroup || '0.1');
      const start    = group.dataset.revealStart || 'top 85%';

      gsap.set(children, { opacity: 0, y: 20 });
      const tween = gsap.to(children, {
        opacity:  1,
        y:        0,
        duration: 0.55,
        ease:     'power3.out',
        stagger,
        scrollTrigger: { trigger: group, start, once: true },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);
}
