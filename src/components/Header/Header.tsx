import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/i18n';
import LangSwitch from '@/components/LangSwitch/LangSwitch';
import s from './Header.module.scss';

const SECTIONS = ['about', 'systems', 'work'] as const;

export default function Header() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Compact once the top ~72px have scrolled away. Observer, not a scroll listener.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('is-locked');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    // Close if the viewport grows past the mobile layout while open.
    const mq = window.matchMedia('(min-width: 768px)');
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.body.classList.remove('is-locked');
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className={s.slot}>
      <div ref={sentinelRef} className={s.sentinel} aria-hidden="true" />
      <header className={s.header} data-compact={compact}>
        <div className={s.inner}>
          <a href="#top" className={s.brand} onClick={close}>
            <img src="/logo.svg" alt="" width={155} height={146} className={s.logo} />
            <span className={s.name}>Anton Shyshenko</span>
          </a>

          <nav aria-label={t.a11y.nav} className={s.nav}>
            <ul className={s.links}>
              {SECTIONS.map((id) => (
                <li key={id}>
                  <a href={`#${id}`}>{t.nav[id]}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={s.end}>
            <LangSwitch className={s.lang} />
            <a href="#contact" className={s.cta}>
              {t.nav.contact}
            </a>
            <button
              ref={toggleRef}
              type="button"
              className={s.toggle}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.a11y.menu_close : t.a11y.menu_open}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true">{open ? t.nav.close : t.nav.menu}</span>
            </button>
          </div>
        </div>

        <div id="mobile-menu" className={s.menu} data-open={open} hidden={!open}>
          <nav aria-label={t.a11y.nav}>
            <ol className={s.menuList}>
              {[...SECTIONS, 'contact' as const].map((id, i) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={close}>
                    <span className={s.menuNum} aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {t.nav[id]}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <LangSwitch className={s.menuLang} />
        </div>
      </header>
    </div>
  );
}
