import s from './Glyph.module.scss';

// Stagger order per transition style
const RADIAL_ORDER  = [4, 1, 3, 5, 7, 0, 2, 6, 8]; // center → corners
const CASCADE_ORDER = [0, 1, 3, 2, 4, 6, 5, 7, 8]; // top-left diagonal
const COLUMN_ORDER  = [0, 3, 6, 1, 4, 7, 2, 5, 8]; // col by col

const ORDERS: Record<string, number[]> = {
  radial:       RADIAL_ORDER,
  cascade:      CASCADE_ORDER,
  columns:      COLUMN_ORDER,
  simultaneous: [0, 0, 0, 0, 0, 0, 0, 0, 0],
};

const STAGGER = 0.04; // seconds between cells

interface GlyphProps {
  /** 9-char string of '0'/'1'. '1' = filled cell */
  idlePattern?:  string;
  hoverPattern?: string;
  isActive?:     boolean;
  color?:        string;
  cellSize?:     number;
  transitionStyle?: 'radial' | 'cascade' | 'columns' | 'simultaneous';
}

export default function Glyph({
  idlePattern    = '000000000',
  hoverPattern   = '111101111',
  isActive       = false,
  color          = 'var(--accent)',
  cellSize       = 4,
  transitionStyle = 'radial',
}: GlyphProps) {
  const pattern = isActive ? hoverPattern : idlePattern;
  const order   = ORDERS[transitionStyle] ?? RADIAL_ORDER;

  return (
    <div
      className={s.glyph}
      style={{
        '--glyph-color': color,
        '--cell': `${cellSize}px`,
      } as React.CSSProperties}
    >
      {Array.from({ length: 9 }, (_, i) => {
        // stagger delay: entering = order position, leaving = reversed
        const step = order.indexOf(i);
        const delay = isActive
          ? step * STAGGER
          : (order.length - 1 - step) * STAGGER;

        return (
          <span
            key={i}
            className={s.cell}
            data-on={pattern[i] === '1' ? 'true' : 'false'}
            style={{ transitionDelay: `${delay.toFixed(3)}s` }}
          />
        );
      })}
    </div>
  );
}
