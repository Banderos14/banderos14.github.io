import { useRef, useState } from 'react';
import type { Project } from '@/types';
import { useLocale } from '@/i18n';
import type { Translations } from '@/i18n';
import s from './ProjectItem.module.scss';

const IS_TOUCH = !window.matchMedia('(pointer: fine)').matches;

interface Props {
  project: Project;
  index:   number;
}

function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname + u.pathname.replace(/\/$/, '');
  } catch { return url; }
}

function getProjectData(t: Translations, slug: string) {
  const data = t.projects[slug as keyof typeof t.projects];
  return data ?? { name: slug, role: '', desc: '' };
}

export default function ProjectItem({ project, index }: Props) {
  const { t } = useLocale();
  const { name, role, desc } = getProjectData(t, project.slug);
  const [hovered, setHovered] = useState(false);

  // Track pointer movement to distinguish click from carousel drag.
  // If the pointer travels more than DRAG_THRESHOLD px before release,
  // we treat it as a drag and suppress the resulting click on any child link.
  const DRAG_THRESHOLD = 6;
  const dragOrigin = useRef({ x: 0, y: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent) => {
    dragOrigin.current = { x: e.clientX, y: e.clientY, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragOrigin.current.moved) return;
    const dx = Math.abs(e.clientX - dragOrigin.current.x);
    const dy = Math.abs(e.clientY - dragOrigin.current.y);
    if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) dragOrigin.current.moved = true;
  };

  // Prevent link navigation when the user was actually dragging the carousel.
  const preventIfDrag = (e: React.MouseEvent) => {
    if (dragOrigin.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <article
      className={s.card}
      data-hovered={hovered}
      data-index={index}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onMouseEnter={IS_TOUCH ? undefined : () => setHovered(true)}
      onMouseLeave={IS_TOUCH ? undefined : () => setHovered(false)}
    >
      <a
        href={project.live}
        target="_blank"
        rel="noopener noreferrer"
        className={s.mockup}
        tabIndex={-1}
        aria-hidden="true"
        draggable={false}
        onClick={preventIfDrag}
      >
        <div className={s.chrome}>
          <div className={s.dots}><span /><span /><span /></div>
          <div className={s.urlBar}>{displayUrl(project.live)}</div>
        </div>

        <div className={s.screen}>
          <div className={s.screenInner}>
            {project.screenshot ? (
              <img
                src={project.screenshot}
                alt={name}
                className={s.screenImg}
                loading="lazy"
                decoding="async"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            ) : (
              <div className={s.placeholder}>
                <span className={s.phName}>{name}</span>
              </div>
            )}
            <div className={s.overlay} aria-hidden="true" />
            <div className={s.screenGlow} aria-hidden="true" />
          </div>
        </div>
      </a>

      <div className={s.body}>
        <div className={s.meta}>
          <span className={s.year}>{project.year}</span>
          <span className={s.role}>{role}</span>
        </div>

        {project.activelyDeveloped && (
          <div className={s.activeBadge}>
            <span className={s.activeDot} aria-hidden="true" />
            {t.work.active_dev}
          </div>
        )}

        <a href={project.live} target="_blank" rel="noopener noreferrer"
           className={s.nameLink} draggable={false} onClick={preventIfDrag}>
          <h3 className={s.name}>{name}</h3>
        </a>

        <p className={s.desc}>{desc}</p>

        <div className={s.tags}>
          {project.tags.map(tag => (
            <span key={tag} className={s.tag}>{tag}</span>
          ))}
        </div>

        <div className={s.links}>
          <a href={project.live} target="_blank" rel="noopener noreferrer"
             className={s.cta} draggable={false} onClick={preventIfDrag}>
            {t.work.view_project} <span className={s.arr}>→</span>
          </a>
          <a href={project.github} target="_blank" rel="noopener noreferrer"
             className={s.ghLink} draggable={false} onClick={preventIfDrag}>
            {t.work.github}
          </a>
        </div>
      </div>
    </article>
  );
}
