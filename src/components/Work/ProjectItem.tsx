import { useEffect, useRef, useState } from 'react';
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

const CYCLE_MS    = 10000; // matches CSS autoHighlight duration
const ACTIVE_MS   = 1800;  // how long glyph stays active per cycle
const STAGGER_MS  = 2000;  // offset between items (matches CSS animation-delay steps)
const INITIAL_MS  = 500;   // wait after mount before first fire

export default function ProjectItem({ project, index, featured }: ProjectItemProps) {
  const [hovered,     setHovered]     = useState(false);
  const [glyphActive, setGlyphActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pattern = PATTERNS[index % PATTERNS.length];

  // Auto-highlight on touch: cycles glyph in sync with CSS autoHighlight animation
  useEffect(() => {
    if (!window.matchMedia('(pointer: coarse)').matches) return;

    const fire = () => {
      setGlyphActive(true);
      setTimeout(() => setGlyphActive(false), ACTIVE_MS);
    };

    const initDelay = INITIAL_MS + index * STAGGER_MS;

    const t = setTimeout(() => {
      fire();
      intervalRef.current = setInterval(fire, CYCLE_MS);
    }, initDelay);

    return () => {
      clearTimeout(t);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [index]);

  // Featured: auto-hover theatre project when section enters viewport
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
            isActive={hovered || glyphActive}
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
