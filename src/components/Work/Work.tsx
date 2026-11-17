import { useLocale } from '@/i18n';
import { projects } from '@/data/projects';
import Squares from '@/components/Squares/Squares';
import ProjectCard from './ProjectCard';
import s from './Work.module.scss';

export default function Work() {
  const { t } = useLocale();

  return (
    <section className={s.work} id="work" aria-labelledby="work-title">
      <header className={s.head}>
        <h2 className={s.title} id="work-title">
          {t.work.title[0]} <em>{t.work.title[1]}</em>
        </h2>
        <div className={s.divider}>
          <Squares />
        </div>
      </header>

      <div className={s.grid}>
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} featured={p.featured ?? i === 0} />
        ))}
      </div>
    </section>
  );
}
