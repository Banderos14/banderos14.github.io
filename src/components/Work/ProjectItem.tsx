import { useEffect, useState } from 'react';
import type { Project } from '@/types';
import Glyph from '@/components/Glyph/Glyph';
import s from './ProjectItem.module.scss';

const PATTERNS = [
  '111101111',
  '010111010',
  '101010101',
  '111010111',
  '110011001',
  '010010010',
];

interface ProjectItemProps {
  project: Project;
  index:   number;
  featured?: boolean;
}

export default function ProjectItem({ project, index, featured }: ProjectItemProps) {
  const [hovered, setHovered] = useState(false);
  const pattern = PATTERNS[index % PATTERNS.length];

  // When section enters view, auto-highlight first project for 2.5s
  useEffect(() => {
    if (!featured) return;
    setHovered(true);
    const t = setTimeout(() => setHovered(false), 2500);
    return () => clearTimeout(t);
  }, [featured]);

  return (
    <div
      className={s.item}
      data-hovered={hovered}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={s.yearCol}>
        <span className={s.year}>{project.year}</span>
        <div className={s.glyphWrap}>
          <Glyph
            isActive={hovered}
            idlePattern="000010000"
            hoverPattern={pattern}
            transitionStyle="radial"
            cellSize={4}
          />
        </div>
      </div>

      <div className={s.main}>
        <h3 className={s.name}>{project.name}</h3>
        <div className={s.tags}>
          {project.tags.map(tag => (
            <span key={tag} className={s.tag}>{tag}</span>
          ))}
        </div>
        <p className={s.desc}>{project.desc}</p>
      </div>

      <div className={s.links}>
        <a href={project.live} target="_blank" rel="noopener noreferrer">↗ live</a>
        <a href={project.github} target="_blank" rel="noopener noreferrer">↗ github</a>
      </div>
    </div>
  );
}
