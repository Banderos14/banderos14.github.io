import { useRef } from 'react';
import { useMarquee } from '@/hooks/useMarquee';
import s from './HeroMarquee.module.scss';

const TEXT = 'Anton Shyshenko';
const REPEATS = 6;

export default function HeroMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  useMarquee(containerRef);

  return (
    <div className={s.marquee} ref={containerRef}>
      <div className={`${s.track} marquee-track`}>
        {Array.from({ length: REPEATS * 2 }, (_, i) => (
          <span key={i} className={s.item}>
            <span>{TEXT}</span>
            <em className={s.sep}>✦</em>
          </span>
        ))}
      </div>
    </div>
  );
}
