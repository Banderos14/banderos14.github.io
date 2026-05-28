import { useState, useEffect } from 'react';
import s from './StatusBar.module.scss';

interface StatusBarProps {
  progress: number;
}

const MODES = ['VISITOR', 'EXPLORER', 'INSPECTOR', 'HACKER'];

export default function StatusBar({ progress }: StatusBarProps) {
  const [time, setTime] = useState('');
  const [modeIdx, setModeIdx] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const sec = String(now.getSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${sec}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const cycleMode = () => {
    setModeIdx(i => (i + 1) % MODES.length);
  };

  return (
    <div className={s.bar}>
      <span className={s.time}>{time}</span>
      <span className={s.pct}>{progress}%</span>
      <button className={s.mode} onClick={cycleMode}>
        [ MODE: {MODES[modeIdx]} ]
      </button>
    </div>
  );
}
