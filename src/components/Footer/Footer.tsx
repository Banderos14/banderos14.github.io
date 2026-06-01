import TronGridFooter from '@/components/TronGrid/TronGridFooter';
import s from './Footer.module.scss';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={s.footer}>
      <TronGridFooter />
      <div className={s.content}>
        <span className={s.left}>© {year} Anton Shyshenko</span>
        <span className={s.right}>
          built with <span>React</span> + <span>TypeScript</span>
        </span>
      </div>
    </footer>
  );
}
