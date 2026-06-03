import s from './StatusBar.module.scss';

interface StatusBarProps {
  progress: number;
}

export default function StatusBar({ progress }: StatusBarProps) {
  return (
    <div className={s.bar}>
      <span className={s.pct}>{progress}%</span>
    </div>
  );
}
