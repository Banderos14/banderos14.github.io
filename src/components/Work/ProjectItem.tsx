import { useState } from 'react';
import type { Project } from '@/types';
import Glyph from '@/components/Glyph/Glyph';
import s from './ProjectItem.module.scss';

// Each project gets a unique glyph pattern
const PATTERNS = [
  '111101111', // frame (all except center)
  '010111010', // plus / cross
  '101010101', // checkerboard
  '111010111', // inverse-center
  '110011001', // diagonal
  '010010010', // column
];

interface ProjectItemProps {
  project: Project;
  index:   number;
}

export default function ProjectItem({ project, index }: ProjectItemProps) {
  const [hovered, setHovered] = useState(false);
  const pattern = PATTERNS[index % PATTERNS.length];

  return (
    <div
      className={s.item}
      data-hovered={hovered}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Year + Glyph column */}
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
        <a href={project.live} target="_blank" rel="noopener noreferrer">
          ↗ live
        </a>
        <a href={project.github} target="_blank" rel="noopener noreferrer">
          ↗ github
        </a>
      </div>
    </div>
  );
}
