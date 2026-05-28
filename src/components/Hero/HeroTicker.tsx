import s from './HeroTicker.module.scss';

const SKILLS = [
  'React', 'TypeScript', 'SCSS', 'Vite', 'Next.js', 'Firebase',
  'Framer Motion', 'GSAP', 'i18n', 'Git', 'Figma', 'REST API',
];

export default function HeroTicker() {
  const items = [...SKILLS, ...SKILLS];

  return (
    <div className={s.ticker}>
      <div className={s.track}>
        {items.map((skill, i) => (
          <span key={i} className={s.item}>
            <span>{skill}</span>
            <span className={s.sep}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
