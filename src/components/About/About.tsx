import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { useLocale } from '@/i18n';
import { aboutVisuals } from '@/data/profile';
import s from './About.module.scss';

const TONES = ['yellow', 'ink', 'orange'] as const;

// Devices that can't hover get the hover state from scroll position instead.
const TOUCH = '(hover: none), (pointer: coarse)';
// Centre band of the viewport (middle 30%) that counts as "being read".
const BAND = '-35% 0px -35% 0px';

/** Index of the slab crossing the centre band, on touch devices only; null otherwise. */
function useActiveSlab(slabs: MutableRefObject<(HTMLElement | null)[]>) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(TOUCH);
    let io: IntersectionObserver | null = null;

    const start = () => {
      io?.disconnect();
      io = null;
      setActive(null);
      if (!mq.matches || !('IntersectionObserver' in window)) return;

      const inBand = new Set<Element>();
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) inBand.add(e.target);
            else inBand.delete(e.target);
          }
          // One active slab at a time: the one whose centre is nearest the viewport's.
          const mid = window.innerHeight / 2;
          let best: number | null = null;
          let bestDist = Infinity;
          slabs.current.forEach((el, i) => {
            if (!el || !inBand.has(el)) return;
            const r = el.getBoundingClientRect();
            const d = Math.abs(r.top + r.height / 2 - mid);
            if (d < bestDist) {
              bestDist = d;
              best = i;
            }
          });
          setActive(best);
        },
        { rootMargin: BAND },
      );
      slabs.current.forEach((el) => el && io!.observe(el));
    };

    start();
    mq.addEventListener('change', start);
    return () => {
      mq.removeEventListener('change', start);
      io?.disconnect();
    };
  }, [slabs]);

  return active;
}

export default function About() {
  const { t } = useLocale();
  const slabs = useRef<(HTMLElement | null)[]>([]);
  const active = useActiveSlab(slabs);

  return (
    <section className={s.about} id="about" aria-labelledby="about-title">
      <h2 className="sr-only" id="about-title">
        {t.about.title}
      </h2>

      {t.about.blocks.map((b, i) => (
        <article
          key={b.id}
          ref={(el) => {
            slabs.current[i] = el;
          }}
          className={`${s.slab} ${s[TONES[i % TONES.length]]}${active === i ? ` ${s.active}` : ''}`}
        >
          <div className={`${s.art} ${s[`art_${b.art}`]}`}>
            {/* Print layer: grayscale multiplied into the slab colour, shadows lifted to navy */}
            <img
              className={s.print}
              src={aboutVisuals[b.art as keyof typeof aboutVisuals].src}
              alt={b.alt}
              width={aboutVisuals[b.art as keyof typeof aboutVisuals].width}
              height={aboutVisuals[b.art as keyof typeof aboutVisuals].height}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: aboutVisuals[b.art as keyof typeof aboutVisuals].focus }}
            />
            <span className={s.shade} aria-hidden="true" />
            {/* Clean original, faded in on hover (or while centred, on touch) */}
            <img
              className={s.photo}
              src={aboutVisuals[b.art as keyof typeof aboutVisuals].src}
              alt=""
              aria-hidden="true"
              width={aboutVisuals[b.art as keyof typeof aboutVisuals].width}
              height={aboutVisuals[b.art as keyof typeof aboutVisuals].height}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: aboutVisuals[b.art as keyof typeof aboutVisuals].focus }}
            />
            <span className={s.dots} aria-hidden="true" />
            {b.caption && (
              <span className={s.caption} aria-hidden="true">
                <span>{b.caption}</span>
                <strong>{b.captionTitle}</strong>
              </span>
            )}
          </div>

          <div className={s.text}>
            <p className={s.num} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}.
            </p>
            <h3 className={s.title}>{b.title}</h3>
            <ul className={s.meta}>
              {b.meta.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            {b.body.split('\n\n').map((para) => (
              <p key={para.slice(0, 24)} className={s.body}>
                {para}
              </p>
            ))}
          </div>

          {/* Information stamp: metadata, deliberately not interactive */}
          <aside className={s.stamp}>
            <span className={s.stampIndex} aria-hidden="true">
              No. {String(i + 1).padStart(2, '0')}
            </span>
            <span className={s.stampLabel}>{b.side.label}</span>
            <span className={s.stampTitle}>{b.side.title}</span>
            <span className={s.stampNote}>{b.side.note}</span>
          </aside>
        </article>
      ))}
    </section>
  );
}
