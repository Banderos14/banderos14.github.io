import { useLocale } from '@/i18n';
import { EMAIL, socials } from '@/data/links';
import Chevron from '@/components/Chevron/Chevron';
import s from './Contact.module.scss';

export default function Contact() {
  const { t } = useLocale();

  return (
    <section className={s.contact} id="contact" aria-labelledby="contact-title">
      <div className={s.inner}>
        <p className={s.label}>{t.contact.label}</p>

        <h2 className={s.title} id="contact-title">
          {t.contact.title[0]}
          <br />
          <span className={s.accent}>{t.contact.title[1]}</span>
        </h2>

        <a className={s.email} href={`mailto:${EMAIL}`}>
          <span className="sr-only">{t.contact.email}: </span>
          {EMAIL}
        </a>

        <p className={s.lede}>{t.contact.lede}</p>

        <ul className={s.links}>
          {socials.map((l) => (
            <li key={l.id}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
                <Chevron className={s.chev} />
                <span className="sr-only"> {t.a11y.new_tab}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
