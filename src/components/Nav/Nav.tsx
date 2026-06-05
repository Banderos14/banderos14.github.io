import React, { useState } from 'react';
import type { Theme } from '@/types';
import { useLocale } from '@/i18n';
import LangSwitcher from '@/components/LangSwitcher/LangSwitcher';
import s from './Nav.module.scss';

interface NavProps {
  scrollY: number;
  theme: Theme;
  onToggleTheme: () => void;
}

const ContrastIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7 1 A6 6 0 1 0 7 13 Z" fill="currentColor" />
  </svg>
);

export default function Nav({ scrollY, theme, onToggleTheme }: NavProps) {
  const { t } = useLocale();
  const scrolled = scrollY > 60;
  const [open, setOpen] = useState(false);

  const sections = [
    { id: 'work',    label: t.nav.work },
    { id: 'about',   label: t.nav.about },
    { id: 'contact', label: t.nav.contact },
  ];

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(`#${id}`, {
        duration: 2.2,
        offset: (window.innerWidth <= 640 && id === 'work') ? -96 : 0,
        easing: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`${s.nav} ${scrolled ? s.scrolled : ''} ${open ? s.menuOpen : ''}`}>
        <div className={s.inner}>
          <a href="#" className={s.logo} onClick={scrollTo('hero')} aria-label="Home">
            <img src="/logo.svg" alt="AS" className={s.logoImg} />
          </a>

          <div className={s.right}>
            <ul className={s.links}>
              {sections.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={scrollTo(id)}>
                    <span className={s.linkText}>{label}</span>
                    <span className={s.linkLine} />
                  </a>
                </li>
              ))}
            </ul>

            <div className={s.langBar}>
              <LangSwitcher />
            </div>

            <button className={s.themeBtn} onClick={onToggleTheme} aria-label="Toggle theme">
              <ContrastIcon />
              <span>{theme === 'dark' ? t.nav.theme_dark : t.nav.theme_light}</span>
            </button>

            <button
              className={`${s.burger} ${open ? s.burgerOpen : ''}`}
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span className={s.bLine} />
              <span className={s.bLine} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`${s.overlay} ${open ? s.overlayOpen : ''}`} aria-hidden={!open}>
        <ul className={s.overlayLinks}>
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} onClick={scrollTo(id)} className={s.overlayLink}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <LangSwitcher large onSelect={() => setOpen(false)} />
        <button className={s.overlayTheme} onClick={onToggleTheme}>
          <ContrastIcon />
          <span>{theme === 'dark' ? t.nav.theme_dark : t.nav.theme_light}</span>
        </button>
      </div>
    </>
  );
}
