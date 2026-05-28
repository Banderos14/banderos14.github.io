import { motion } from 'framer-motion';
import type { Project } from '@/types';
import s from './ProjectItem.module.scss';

interface ProjectItemProps {
  project: Project;
  index: number;
}

export default function ProjectItem({ project, index }: ProjectItemProps) {
  return (
    <motion.div
      className={s.item}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <span className={s.year}>{project.year}</span>

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
    </motion.div>
  );
}
