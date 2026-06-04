import { useEffect } from 'react';
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';

export function useLenisScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration:    0.8,
      easing:      (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    } as ConstructorParameters<typeof Lenis>[0]);

    // Expose globally so Nav/Hero anchor links can call lenis.scrollTo()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__lenis = lenis;

    // Drive via GSAP ticker — shares the animation loop, no extra RAF
    const tickFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickFn);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(tickFn);
      lenis.destroy();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__lenis = undefined;
    };
  }, []);
}
