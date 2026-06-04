import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ConwayBg from '@/components/ConwayBg/ConwayBg';
import s from './About.module.scss';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { val: 3,  suffix: '+',  label: 'Years\nExperience' },
  { val: 20, suffix: '+',  label: 'Projects\nShipped'  },
  { val: 2,  suffix: '',   label: 'Countries\nLived'   },
  { val: 99, suffix: '☕', label: 'Cups of\nCoffee'    },
];

export default function About() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    document.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count || '0', 10);
      const suffix = el.dataset.suffix || '';
      const obj    = { val: 0 };
      const tw = gsap.to(obj, {
        val: target, duration: 1.8, ease: 'power3.out',
        onUpdate() { el.textContent = Math.floor(obj.val) + suffix; },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
      if (tw.scrollTrigger) triggers.push(tw.scrollTrigger);
    });
    return () => triggers.forEach(t => t.kill());
  }, []);

  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo('#work');
    else document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={s.section} id="about" ref={ref}>

      <div className={s.headerWrap}>
        <div className="container">
          <div className={s.header}>
            <span className={s.num}>01</span>
            <span className={s.title}>about</span>
            <span className={s.line} />
          </div>
        </div>
      </div>

      <div className={s.conwayBlock}>
        <ConwayBg opacity={0.9} />
        <div className={s.fadeTop}    aria-hidden="true" />
        <div className={s.fadeBottom} aria-hidden="true" />

        <div className={s.inner}>

        <div className={s.layout}>
          <div className={s.left}>
            <motion.h2
              className={s.heading}
              initial={{ opacity: 0, y: 55 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 75, damping: 18, mass: 0.9, delay: 0.05 }}
            >
              Who I Am
            </motion.h2>

            <motion.div
              className={s.text}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 75, damping: 18, mass: 0.9, delay: 0.15 }}
            >
              <p>
                I'm a <strong>frontend developer</strong> based in{' '}
                <strong>Nice, France</strong>, focused on building elegant,
                performant web interfaces that feel as good as they look.
              </p>
              <p>
                I work with <strong>React</strong>, <strong>TypeScript</strong>,
                and <strong>SCSS</strong> — with a strong eye for animation,
                design systems, and pixel-perfect detail.
              </p>
              <p>
                Before tech, I spent years in hospitality. That shaped how I
                think about <strong>user experience</strong>: empathy first,
                complexity last.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 75, damping: 18, mass: 0.9, delay: 0.25 }}
              className={s.cta}
            >
              <div className="btn-wrap">
                <a href="#work" className="btn btn-s" onClick={scrollToWork}>
                  View my work <span className="btn-arr">↗</span>
                </a>
                <span className="btn-c btn-c--tl" aria-hidden="true" />
                <span className="btn-c btn-c--tr" aria-hidden="true" />
                <span className="btn-c btn-c--bl" aria-hidden="true" />
                <span className="btn-c btn-c--br" aria-hidden="true" />
              </div>
            </motion.div>
          </div>

          <div className={s.right}>
            <motion.div
              className={s.statsCard}
              initial={{ opacity: 0, y: 55 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 75, damping: 18, mass: 0.9, delay: 0.1 }}
            >
              {STATS.map(({ val, suffix, label }, i) => (
                <div key={label} className={`${s.statCell} ${i < 2 ? s.statCellTop : ''}`}>
                  <span
                    className={s.statNum}
                    data-count={val}
                    data-suffix={suffix}
                  >
                    0{suffix}
                  </span>
                  <span className={s.statLabel}>
                    {label.split('\n').map((l, j) => (
                      <span key={j}>{l}<br /></span>
                    ))}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              className={s.codeCard}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 75, damping: 18, mass: 0.9, delay: 0.22 }}
            >
              <pre className={s.code}>
                <span className={s.ckw}>const</span>{' '}
                <span className={s.cid}>me</span>{' '}
                <span className={s.cop}>=</span>{' '}{'{'}
                {'\n'}
                {'  '}<span className={s.ckey}>stack</span><span className={s.cop}>:</span>
                {'   ['}<span className={s.cstr}>"React"</span>{', '}
                <span className={s.cstr}>"TS"</span>{', '}
                <span className={s.cstr}>"GSAP"</span>{'],'}
                {'\n'}
                {'  '}<span className={s.ckey}>location</span><span className={s.cop}>:</span>
                {' '}<span className={s.cstr}>"Nice, France 🇫🇷"</span>{','}
                {'\n'}
                {'  '}<span className={s.ckey}>openToWork</span><span className={s.cop}>:</span>
                {' '}<span className={s.cbool}>true</span>{','}
                {'\n'}
                {'}'}
              </pre>
            </motion.div>
          </div>
        </div>
      </div>{/* end .inner */}
      </div>{/* end .conwayBlock */}
      <div style={{ height: 50, background: 'var(--bg)' }} aria-hidden="true" />
    </section>
  );
}
