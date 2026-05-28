import s from './HeroPhoto.module.scss';

export default function HeroPhoto() {
  return (
    <div className={s.wrap}>
      <div className={s.photo}>
        <img
          src="/img/photo_2024-09-17_09-50-42.jpg"
          alt="Anton Shyshenko"
          onError={e => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <span className={`${s.corner} ${s.tl}`} />
        <span className={`${s.corner} ${s.tr}`} />
        <span className={`${s.corner} ${s.bl}`} />
        <span className={`${s.corner} ${s.br}`} />
      </div>
    </div>
  );
}
