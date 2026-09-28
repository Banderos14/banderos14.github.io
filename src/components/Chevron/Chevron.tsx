// Hard-edged "go to" mark: short stem + heavy angular head. Points right;
// pass `flip` for a left-pointing version (lightbox "previous").
export default function Chevron({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 14"
      width="1.15em"
      height="0.67em"
      aria-hidden="true"
      focusable="false"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M0 5h12V0l12 7-12 7V9H0z" fill="currentColor" />
    </svg>
  );
}
