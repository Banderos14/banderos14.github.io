import React, { useState } from 'react';
import type { Theme } from '@/types';
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

const sections = [
  { id: 'work',    label: 'Work' },
  { id: 'about',   label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav({ scrollY, theme, onToggleTheme }: NavProps) {
  const scrolled = scrollY > 60;
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
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

            <button className={s.themeBtn} onClick={onToggleTheme} aria-label="Toggle theme">
              <ContrastIcon />
              <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>

            {/* Hamburger — visible only on mobile */}
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
        <button className={s.overlayTheme} onClick={onToggleTheme}>
          <ContrastIcon />
          <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </>
  );
}
