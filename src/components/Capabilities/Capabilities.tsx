import { useLocale } from '@/i18n';
import { capabilities } from '@/data/capabilities';
import Squares from '@/components/Squares/Squares';
import Chevron from '@/components/Chevron/Chevron';
import s from './Capabilities.module.scss';

export default function Capabilities() {
  const { t } = useLocale();

  return (
    <section className={s.band} id="systems" aria-labelledby="systems-title">
      <div className={s.inner}>
        <header className={s.head}>
          <h2 className={s.title} id="systems-title">
            {t.capabilities.title[0]}
            <br />
            {t.capabilities.title[1]}
          </h2>
          <Squares className={s.squares} />
          <p className={s.intro}>{t.capabilities.intro}</p>
        </header>

        <ol className={s.list}>
          {capabilities.map((c, i) => {
            const item = t.capabilities.items[c.id];
            return (
              <li key={c.id} className={s.row}>
                <span className={s.num} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={s.name}>
                  {item.title}
                  <small>{item.detail}</small>
                </span>
                {c.proof ? (
                  <a className={s.proof} href={`#project-${c.proof}`}>
                    <span className="sr-only">{t.capabilities.proof_label} </span>
                    {t.projects[c.proof].name}
                    <Chevron className={s.arrow} />
                  </a>
                ) : (
                  <span className={`${s.proof} ${s.proofPlain}`}>{t.capabilities.no_proof}</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
