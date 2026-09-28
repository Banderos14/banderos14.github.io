import s from './Squares.module.scss';

// The page's one ornament: three squares in the palette's warm-to-cool order.
export default function Squares({ className = '' }: { className?: string }) {
  return (
    <span className={`${s.squares} ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
