import { useLocale } from '@/i18n';
import { aboutVisuals } from '@/data/profile';
import s from './About.module.scss';

const TONES = ['yellow', 'ink', 'orange'] as const;

export default function About() {
  const { t } = useLocale();

  return (
    <section className={s.about} id="about" aria-labelledby="about-title">
      <h2 className="sr-only" id="about-title">
        {t.about.title}
      </h2>

      {t.about.blocks.map((b, i) => (
        <article key={b.id} className={`${s.slab} ${s[TONES[i % TONES.length]]}`}>
          <div className={`${s.art} ${s[`art_${b.art}`]}`}>
            {/* Print layer: grayscale multiplied into the slab colour, shadows lifted to navy */}
            <img
              className={s.print}
              src={aboutVisuals[b.art as keyof typeof aboutVisuals].src}
              alt={b.alt}
              width={aboutVisuals[b.art as keyof typeof aboutVisuals].width}
              height={aboutVisuals[b.art as keyof typeof aboutVisuals].height}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: aboutVisuals[b.art as keyof typeof aboutVisuals].focus }}
            />
            <span className={s.shade} aria-hidden="true" />
            {/* Clean original, faded in on hover */}
            <img
              className={s.photo}
              src={aboutVisuals[b.art as keyof typeof aboutVisuals].src}
              alt=""
              aria-hidden="true"
              width={aboutVisuals[b.art as keyof typeof aboutVisuals].width}
              height={aboutVisuals[b.art as keyof typeof aboutVisuals].height}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: aboutVisuals[b.art as keyof typeof aboutVisuals].focus }}
            />
            <span className={s.dots} aria-hidden="true" />
            {b.caption && (
              <span className={s.caption} aria-hidden="true">
                <span>{b.caption}</span>
                <strong>{b.captionTitle}</strong>
              </span>
            )}
          </div>

          <div className={s.text}>
            <p className={s.num} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}.
            </p>
            <h3 className={s.title}>{b.title}</h3>
            <ul className={s.meta}>
              {b.meta.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            {b.body.split('\n\n').map((para) => (
              <p key={para.slice(0, 24)} className={s.body}>
                {para}
              </p>
            ))}
          </div>

          {/* Information stamp: metadata, deliberately not interactive */}
          <aside className={s.stamp}>
            <span className={s.stampIndex} aria-hidden="true">
              No. {String(i + 1).padStart(2, '0')}
            </span>
            <span className={s.stampLabel}>{b.side.label}</span>
            <span className={s.stampTitle}>{b.side.title}</span>
            <span className={s.stampNote}>{b.side.note}</span>
          </aside>
        </article>
      ))}
    </section>
  );
}
