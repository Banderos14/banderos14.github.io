import { useLocale } from '@/i18n';
import { EMAIL, socials } from '@/data/links';
import s from './Hero.module.scss';

export default function Hero() {
  const { t } = useLocale();
  const linkedin = socials.find((l) => l.id === 'linkedin')!;

  return (
    <section className={s.hero} id="top" aria-labelledby="hero-title">
      <div className={s.inner}>
        <p className={s.role}>{t.hero.role}</p>

        <h1 className={s.word} id="hero-title">
          <span className={s.line}>Anton</span>
          <span className={`${s.line} ${s.accent}`}>Shyshenko.</span>
        </h1>

        <dl className={s.facts}>
          {t.hero.facts.map((f) => (
            <div key={f.k} className={s.fact}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
          <div className={s.fact}>
            <dt>{t.hero.contact}</dt>
            <dd className={s.links}>
              <a href={`mailto:${EMAIL}`}>{t.hero.email}</a>
              <span aria-hidden="true">/</span>
              <a href={linkedin.href} target="_blank" rel="noopener noreferrer">
                {linkedin.label}
                <span className="sr-only"> {t.a11y.new_tab}</span>
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
