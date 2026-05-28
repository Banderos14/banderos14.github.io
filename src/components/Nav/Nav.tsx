import type { Theme } from '@/types';
import s from './Nav.module.scss';

interface NavProps {
  scrollY: number;
  theme: Theme;
  onToggleTheme: () => void;
}

const sections = [
  { id: 'about', label: '_about' },
  { id: 'work', label: '_work' },
  { id: 'contact', label: '_contact' },
];

export default function Nav({ scrollY, theme, onToggleTheme }: NavProps) {
  const scrolled = scrollY > 60;

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`${s.nav} ${scrolled ? s.scrolled : ''}`}>
      <div className={s.inner}>
        <a href="#" className={s.logo} onClick={scrollTo('root')} aria-label="Home">
          <img src="/logo.svg" alt="AS" className={s.logoImg} />
        </a>

        <ul className={s.links}>
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} onClick={scrollTo(id)}>{label}</a>
            </li>
          ))}
        </ul>

        <div className={s.right}>
          <span className={s.avail}>
            <span className={s.dot} />
            available
          </span>
          <button
            className={s.themeBtn}
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            <span className={`${s.knob} ${theme === 'light' ? s.knobLight : ''}`} />
          </button>
        </div>
      </div>
    </nav>
  );
}
