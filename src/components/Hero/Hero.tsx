import React, { useState, useEffect } from 'react';
import { useLocale } from '@/i18n';
import HeroPhoto from './HeroPhoto';
import s from './Hero.module.scss';

export default function Hero() {
  const { t } = useLocale();
  const [on, setOn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const fade = (delay: number): React.CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: on ? 'none' : 'translateY(14px)',
    transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
  });

  // Text line slides up from below its own clip container
  const slide = (delay: number): React.CSSProperties => ({
    display: 'block',
    transform: on ? 'none' : 'translateY(112%)',
    transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(`#${id}`, {
        duration: 2.2,
        easing: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Duplicate 4× so the ticker never shows a gap
  const tickerItems = [...Array(4)].flatMap(() =>
    ['React', 'TypeScript', 'SCSS', 'Vite', 'Next.js', 'Firebase',
     'Framer Motion', 'GSAP', 'i18n', 'Git', 'Figma', 'REST API']
  );

  return (
    <section className={s.hero} id="hero">

      <div className={s.console} style={fade(1.2)}>
        <div>
          <span className={s.consoleGreen}>const</span>{' '}
          <span className={s.consoleAccent}>dev</span>
          {" = 'banderos14'"}
        </div>
        <div>
          <span className={s.consoleGreen}>stack</span>
          {": ['React', 'TS', 'SCSS']"}
        </div>
        <div>
          <span className={s.consoleGreen}>status</span>
          {": 'Open to opportunities'"}
        </div>
      </div>

      <div className={s.content}>
        <div className={s.left}>
          <p className={s.label} style={fade(0.2)}>
            {t.hero.label}
          </p>

          <h1 className={s.name}>
            <span className={s.lineClip}>
              <span style={slide(0)}>Anton</span>
            </span>
            <span className={s.lineClip}>
              <span style={slide(0.07)}><em>Shyshenko</em></span>
            </span>
          </h1>

          <div className={s.sub} style={fade(0.5)}>
            <span className={s.subFr}>{t.hero.sub}</span>
            <span className={s.subMono}>{t.hero.sub_mono}</span>
          </div>

          <p className={s.desc} style={fade(0.65)}>
            {t.hero.desc}
          </p>

          <div className={s.cta} style={fade(0.8)}>
            <div className="btn-wrap">
              <a href="#work" className="btn btn-p" onClick={scrollTo('work')}>
                {t.hero.cta_work} <span className="btn-arr">↗</span>
              </a>
              <span className="btn-c btn-c--tl" aria-hidden="true" />
              <span className="btn-c btn-c--tr" aria-hidden="true" />
              <span className="btn-c btn-c--bl" aria-hidden="true" />
              <span className="btn-c btn-c--br" aria-hidden="true" />
            </div>
            <div className="btn-wrap">
              <a href="#contact" className="btn btn-s" onClick={scrollTo('contact')}>
                {t.hero.cta_contact}
              </a>
              <span className="btn-c btn-c--tl" aria-hidden="true" />
              <span className="btn-c btn-c--tr" aria-hidden="true" />
              <span className="btn-c btn-c--bl" aria-hidden="true" />
              <span className="btn-c btn-c--br" aria-hidden="true" />
            </div>
          </div>
        </div>

        <HeroPhoto visible={on} />
      </div>

      <div className={s.ticker}>
        <div className={s.tickerTrack}>
          {tickerItems.map((skill, i) => (
            <span key={i} className={s.tickerItem}>
              <span>{skill}</span>
              <span className={s.tickerSep} aria-hidden="true">·</span>
            </span>
          ))}
        </div>
      </div>

      <div className={s.scrollHint} style={fade(1.6)}>
        <span className={s.scrollLabel}>{t.hero.scroll}</span>
        <span className={s.scrollArrow}>↓</span>
      </div>

    </section>
  );
}
