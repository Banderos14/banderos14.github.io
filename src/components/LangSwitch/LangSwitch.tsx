import { LOCALE_LIST, useLocale } from '@/i18n';
import s from './LangSwitch.module.scss';

export default function LangSwitch({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div role="group" aria-label={t.a11y.language} className={`${s.switch} ${className}`}>
      {LOCALE_LIST.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={locale === l}
          className={s.btn}
          onClick={() => setLocale(l)}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
