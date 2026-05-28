import { projects } from '@/data/projects';
import ProjectItem from './ProjectItem';
import s from './Work.module.scss';

export default function Work() {
  return (
    <section className={s.section} id="work">
      <div className="container">
        <div className={s.header}>
          <span className={s.num}>02</span>
          <span className={s.title}>work</span>
          <span className={s.line} />
        </div>

        <div className={s.list}>
          {projects.map((project, i) => (
            <ProjectItem key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
