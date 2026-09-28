import { useLocale } from '@/i18n';
import type { Project } from '@/types';
import ProductGallery from '@/components/Gallery/ProductGallery';
import Chevron from '@/components/Chevron/Chevron';
import s from './ProjectCard.module.scss';

interface Props {
  project: Project;
  index: number;
  featured?: boolean;
}

export default function ProjectCard({ project: p, index, featured = false }: Props) {
  const { t } = useLocale();
  const copy = t.projects[p.slug];
  const num = String(index + 1).padStart(2, '0');

  return (
    <article
      id={`project-${p.slug}`}
      className={`${s.card} ${featured ? s.featured : ''}`}
      aria-labelledby={`project-${p.slug}-title`}
    >
      <span className={`${s.tag} ${s[`tag_${p.status}`]}`}>{t.work.status[p.status]}</span>

      <figure className={s.shot}>
        {p.screenshot ? (
          <img
            src={p.screenshot}
            alt={copy.name}
            width={p.shotSize?.[0] ?? 1600}
            height={p.shotSize?.[1] ?? 900}
            loading="lazy"
            decoding="async"
            style={p.focus ? { objectPosition: p.focus } : undefined}
          />
        ) : (
          <span className={s.placeholder} aria-hidden="true" />
        )}
      </figure>

      <div className={s.body}>
        <h3 className={s.title} id={`project-${p.slug}-title`}>
          {copy.name}
        </h3>
        {copy.context && <p className={s.context}>{copy.context}</p>}
        <p className={s.desc}>{copy.desc}</p>

        {featured && copy.features && (
          <div className={s.features}>
            <h4 className={s.label}>{t.work.features}</h4>
            <ul>
              {copy.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {p.tags.length > 0 && (
          <p className={s.stack}>
            <span className="sr-only">{t.work.stack}: </span>
            {p.tags.join(' / ')}
          </p>
        )}

        <div className={s.index}>
          <span className={s.num} aria-hidden="true">
            {num}
          </span>
          <span className={s.byline}>
            <span>{p.year}</span>
            <span>{copy.role}</span>
          </span>
        </div>

        {(p.live || p.github) && (
          <div className={s.actions}>
            {p.live && (
              <a className={s.primary} href={p.live} target="_blank" rel="noopener noreferrer">
                {t.work.live}
                <Chevron className={s.chev} />
                <span className="sr-only"> {t.a11y.new_tab}</span>
              </a>
            )}
            {p.github && (
              <a className={s.secondary} href={p.github} target="_blank" rel="noopener noreferrer">
                {t.work.source}
                <Chevron className={s.chev} />
                <span className="sr-only"> {t.a11y.new_tab}</span>
              </a>
            )}
          </div>
        )}
      </div>
      {featured && p.gallery && <ProductGallery shots={p.gallery} project={copy.name} />}
    </article>
  );
}
