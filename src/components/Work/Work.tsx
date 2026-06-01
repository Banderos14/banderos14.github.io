import { useEffect, useRef, useState } from 'react';
import { projects } from '@/data/projects';
import ProjectItem from './ProjectItem';
import s from './Work.module.scss';

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const [featuredActive, setFeaturedActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Delay slightly so the section scroll-in animation finishes first
          setTimeout(() => setFeaturedActive(true), 500);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className={s.section} id="work" ref={sectionRef}>
      <div className="container">
        <div className={s.header}>
          <span className={s.num}>02</span>
          <span className={s.title}>work</span>
          <span className={s.line} />
        </div>

        <div className={s.list} data-stagger-group="0.07" data-reveal-start="top 90%">
          {projects.map((project, i) => (
            <ProjectItem
              key={project.name}
              project={project}
              index={i}
              featured={i === 0 && featuredActive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
