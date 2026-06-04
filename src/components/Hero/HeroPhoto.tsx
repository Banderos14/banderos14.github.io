import s from './HeroPhoto.module.scss';

interface HeroPhotoProps { visible: boolean }

export default function HeroPhoto({ visible }: HeroPhotoProps) {
  return (
    <div
      className={s.wrap}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'none' : 'translateY(14px)',
        transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
      }}
    >
      <div className={s.photo}>
        <img
          src="/img/hero.webp"
          alt="Anton Shyshenko"
          className={s.img}
          width={1280}
          height={848}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <span className={`${s.corner} ${s.tl}`} />
        <span className={`${s.corner} ${s.tr}`} />
        <span className={`${s.corner} ${s.bl}`} />
        <span className={`${s.corner} ${s.br}`} />
      </div>
    </div>
  );
}
