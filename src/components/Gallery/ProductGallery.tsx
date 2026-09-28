import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from '@/i18n';
import type { GalleryShot } from '@/types';
import Chevron from '@/components/Chevron/Chevron';
import s from './ProductGallery.module.scss';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Compact 4-up strip under the featured project + a native <dialog> lightbox
 * (focus trap, Esc and backdrop handled by the browser). No dependencies.
 */
export default function ProductGallery({ shots, project }: { shots: GalleryShot[]; project: string }) {
  const { t } = useLocale();
  const g = t.work.gallery;
  const ready = shots.filter((x) => x.src);
  // Placeholders show only in dev so the layout can be reviewed before screenshots exist.
  const strip = shots.filter((x) => x.strip && (x.src || import.meta.env.DEV)).slice(0, 4);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (id: string, trigger: HTMLElement) => {
    const i = ready.findIndex((x) => x.id === id);
    if (i < 0) return;
    returnFocus.current = trigger;
    setIndex(i);
  };
  const close = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + ready.length) % ready.length)),
    [ready.length],
  );

  useEffect(() => {
    const dlg = dialogRef.current;
    if (index !== null && dlg && !dlg.open) dlg.showModal();
  }, [index]);

  if (strip.length < 2) return null;

  const current = index === null ? null : ready[index];

  return (
    <div className={s.gallery}>
      <div className={s.head}>
        <h4 className={s.label}>{g.label}</h4>
        {ready.length > 1 && (
          <button
            type="button"
            className={s.all}
            onClick={(e) => open(ready[0].id, e.currentTarget)}
          >
            {g.open} ({ready.length})
            <Chevron className={s.chev} />
          </button>
        )}
      </div>

      <ul className={s.strip}>
        {strip.map((shot, i) => {
          const copy = g.shots[shot.id];
          const inner = (
            <>
              <span className={s.frame}>
                {shot.src ? (
                  <img
                    src={shot.thumb ?? shot.src}
                    alt={copy.alt}
                    width={shot.width}
                    height={shot.height}
                    loading="lazy"
                    decoding="async"
                    style={shot.focus ? { objectPosition: shot.focus } : undefined}
                  />
                ) : (
                  <span className={s.pending}>{g.pending}</span>
                )}
                <span className={s.index} aria-hidden="true">
                  {pad(i + 1)}
                </span>
              </span>
              <span className={s.caption}>
                {copy.caption}
                <span className={s.lang}>{shot.lang.toUpperCase()}</span>
              </span>
            </>
          );
          return (
            <li key={shot.id}>
              {shot.src ? (
                <button
                  type="button"
                  className={s.thumb}
                  onClick={(e) => open(shot.id, e.currentTarget)}
                  aria-haspopup="dialog"
                >
                  {inner}
                </button>
              ) : (
                <div className={`${s.thumb} ${s.thumbPending}`}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        className={s.dialog}
        aria-label={`${project}: ${g.label}`}
        onClose={() => {
          setIndex(null);
          returnFocus.current?.focus();
        }}
        onClick={(e) => e.target === e.currentTarget && close()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
      >
        {current && (
          <div className={s.sheet}>
            <div className={s.bar}>
              <p className={s.count} aria-live="polite">
                {pad(index! + 1)} {g.of} {pad(ready.length)}
                <span className={s.barCaption}>{g.shots[current.id].caption}</span>
              </p>
              <button type="button" className={s.close} onClick={close} autoFocus>
                {g.close}
              </button>
            </div>

            <figure className={s.stage}>
              <img
                src={current.src}
                alt={g.shots[current.id].alt}
                width={current.width}
                height={current.height}
              />
            </figure>

            {ready.length > 1 && (
              <div className={s.nav}>
                <button type="button" className={s.navBtn} onClick={() => step(-1)}>
                  <Chevron flip /> {g.prev}
                </button>
                <button type="button" className={s.navBtn} onClick={() => step(1)}>
                  {g.next} <Chevron />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
