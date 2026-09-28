import { useLocale } from '@/i18n';
import s from './Marquee.module.scss';

// The page's single moving strip. Pure CSS; the track is rendered twice
// so a -50% translate loops seamlessly.
export default function Marquee() {
  const { t } = useLocale();
  const run = (
    <>
      {t.marquee.map((item) => (
        <span key={item} className={s.item}>
          {item}
          <i className={s.sep} />
        </span>
      ))}
    </>
  );

  return (
    <div className={s.marquee} role="img" aria-label={t.a11y.marquee}>
      <div className={s.track} aria-hidden="true">
        <div className={s.run}>{run}</div>
        <div className={s.run}>{run}</div>
      </div>
    </div>
  );
}
