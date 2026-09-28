import { useLocale } from '@/i18n';
import { EMAIL, socials } from '@/data/links';
import Marquee from '@/components/Marquee/Marquee';
import s from './Footer.module.scss';

const SITE = ['about', 'systems', 'work', 'contact'] as const;

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className={s.footer}>
      <Marquee />

      <div className={s.body}>
        <div className={s.brand}>
          <p className={s.mark}>
            <img src="/logo.svg" alt="" width={155} height={146} loading="lazy" />
            Anton Shyshenko
          </p>
          <p className={s.blurb}>{t.footer.blurb}</p>
        </div>

        <nav className={s.col} aria-labelledby="footer-site">
          <h2 id="footer-site">{t.footer.site}</h2>
          <ul>
            {SITE.map((id) => (
              <li key={id}>
                <a href={`#${id}`}>{t.nav[id]}</a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={s.col} aria-labelledby="footer-elsewhere">
          <h2 id="footer-elsewhere">{t.footer.elsewhere}</h2>
          <ul>
            {socials.map((l) => (
              <li key={l.id}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                  <span className="sr-only"> {t.a11y.new_tab}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${EMAIL}`}>{t.contact.email}</a>
            </li>
          </ul>
        </nav>

        <div className={s.colophon}>
          <p>
            <strong>© {year} Anton Shyshenko</strong>
          </p>
          <a href="#top" className={s.top}>
            {t.footer.top} <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
