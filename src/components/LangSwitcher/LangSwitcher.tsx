import { Fragment } from 'react';
import { useLocale } from '@/i18n';
import type { Locale } from '@/i18n';
import s from './LangSwitcher.module.scss';

const LANGS: Locale[] = ['en', 'fr', 'ru'];

interface LangSwitcherProps {
  /** Shows larger text — for the mobile overlay */
  large?: boolean;
  /** Called after locale is changed — useful for closing parent menus */
  onSelect?: () => void;
}

export default function LangSwitcher({ large, onSelect }: LangSwitcherProps) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={`${s.switcher} ${large ? s.large : ''}`}>
      {LANGS.map((lang, i) => (
        <Fragment key={lang}>
          <button
            className={`${s.btn} ${locale === lang ? s.active : ''}`}
            onClick={() => { setLocale(lang); onSelect?.(); }}
            aria-label={`Switch language to ${lang.toUpperCase()}`}
            aria-current={locale === lang ? 'true' : undefined}
          >
            {lang.toUpperCase()}
            <span className={s.indicator} aria-hidden="true" />
          </button>
          {i < LANGS.length - 1 && (
            <span className={s.sep} aria-hidden="true">·</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
