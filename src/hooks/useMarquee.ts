import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useMarquee(containerRef: React.RefObject<HTMLElement | null>) {
  const directionRef = useRef(1);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const track = el.querySelector<HTMLElement>('.marquee-track');
    if (!track) return;

    tweenRef.current = gsap.to(track, {
      xPercent: -50,
      duration: 20,
      ease: 'none',
      repeat: -1,
    });

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        const dir = self.direction;
        if (dir !== directionRef.current) {
          directionRef.current = dir;
          if (tweenRef.current) {
            gsap.to(tweenRef.current, {
              timeScale: dir,
              duration: 0.4,
              overwrite: true,
            });
          }
        }
      },
    });

    return () => {
      tweenRef.current?.kill();
      st.kill();
    };
  }, [containerRef]);
}
