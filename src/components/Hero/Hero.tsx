import React, { useState, useEffect } from 'react';
import HeroPhoto from './HeroPhoto';
import HeroMarquee from './HeroMarquee';
import s from './Hero.module.scss';

// Список скиллов для бегущей строки внизу Hero
const SKILLS = [
  'React', 'TypeScript', 'SCSS', 'Vite', 'Next.js', 'Firebase',
  'Framer Motion', 'GSAP', 'i18n', 'Git', 'Figma', 'REST API',
];

export default function Hero() {
  // on = true как только страница загрузилась → запускает CSS-переходы
  const [on, setOn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Плавное появление снизу-вверх с задержкой (delay в секундах)
  const fade = (delay: number): React.CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: on ? 'none' : 'translateY(14px)',
    transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
  });

  // Выезд строки текста снизу (для имени Anton / Shyshenko)
  const slide = (delay: number): React.CSSProperties => ({
    display: 'block',
    transform: on ? 'none' : 'translateY(112%)',
    transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={s.hero} id="hero">

      {/* Декоративный блок кода в правом верхнем углу */}
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
          <span className={s.consoleGreen}>location</span>
          {": 'France 🇫🇷'"}
        </div>
      </div>

      {/* Основной контент: текст слева + фото справа */}
      <div className={s.content}>
        <div className={s.left}>
          <p className={s.label} style={fade(0.2)}>
            frontend developer
          </p>

          {/* Имя с анимацией выезда строк снизу */}
          <h1 className={s.name}>
            <span className={s.lineClip}>
              <span style={slide(0)}>Anton</span>
            </span>
            <span className={s.lineClip}>
              <span style={slide(0.07)}><em>Shyshenko</em></span>
            </span>
          </h1>

          <div className={s.sub} style={fade(0.5)}>
            <span className={s.subFr}>Based in France — building digital experiences</span>
            <span className={s.subMono}>// react · typescript · scss · motion</span>
          </div>

          <p className={s.desc} style={fade(0.65)}>
            I craft clean, performant interfaces with attention to detail,
            smooth interactions, and thoughtful UX. Passionate about design
            systems and the craft of frontend engineering.
          </p>

          <div className={s.cta} style={fade(0.8)}>
            <a href="#work" className="btn btn-p" onClick={scrollTo('work')}>
              view work <span className="btn-arr">↗</span>
            </a>
            <a href="#contact" className="btn btn-s" onClick={scrollTo('contact')}>
              get in touch
            </a>
          </div>
        </div>

        <HeroPhoto visible={on} />
      </div>

      {/* ── TICKER ─────────────────────────────────────────────
          Бесконечная бегущая строка со скиллами.
          Дублируем массив ×2 чтобы при зацикливании не было пустоты.
      ────────────────────────────────────────────────────────── */}
      <div className={s.ticker}>
        <div className={s.tickerTrack}>
          {[...SKILLS, ...SKILLS].map((skill, i) => (
            <span key={i} className={s.tickerItem}>
              <span>{skill}</span>
              <span className={s.tickerSep}>✦</span>
            </span>
          ))}
        </div>
      </div>

      <HeroMarquee />

      {/* Scroll-индикатор справа */}
      <div className={s.scrollHint} style={fade(1.6)}>
        <div className={s.scrollLine}>
          <span className={s.scrollLineAccent} />
        </div>
        <span className={s.scrollText}>Scroll</span>
      </div>

    </section>
  );
}
