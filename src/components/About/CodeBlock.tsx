import s from './CodeBlock.module.scss';

interface Token {
  type: 'kw' | 'vr' | 'st' | 'nu' | 'cm' | 'fn' | 'br' | 'pl';
  text: string;
}

type LineTokens = Token[];

const lines: LineTokens[] = [
  [{ type: 'kw', text: 'const' }, { type: 'pl', text: ' ' }, { type: 'vr', text: 'about' }, { type: 'pl', text: ' = {' }],
  [{ type: 'pl', text: '  ' }, { type: 'vr', text: 'name' }, { type: 'pl', text: ': ' }, { type: 'st', text: "'Anton Shyshenko'" }, { type: 'pl', text: ',' }],
  [{ type: 'pl', text: '  ' }, { type: 'vr', text: 'role' }, { type: 'pl', text: ': ' }, { type: 'st', text: "'Frontend Developer'" }, { type: 'pl', text: ',' }],
  [{ type: 'pl', text: '  ' }, { type: 'vr', text: 'location' }, { type: 'pl', text: ': ' }, { type: 'st', text: "'Lyon, France 🇫🇷'" }, { type: 'pl', text: ',' }],
  [{ type: 'pl', text: '  ' }, { type: 'vr', text: 'focus' }, { type: 'pl', text: ': [' }],
  [{ type: 'pl', text: '    ' }, { type: 'st', text: "'React'" }, { type: 'pl', text: ', ' }, { type: 'st', text: "'TypeScript'" }, { type: 'pl', text: ',' }],
  [{ type: 'pl', text: '    ' }, { type: 'st', text: "'SCSS'" }, { type: 'pl', text: ', ' }, { type: 'st', text: "'Motion'" }],
  [{ type: 'pl', text: '  ],' }],
  [{ type: 'pl', text: '  ' }, { type: 'vr', text: 'available' }, { type: 'pl', text: ': ' }, { type: 'kw', text: 'true' }, { type: 'pl', text: ',' }],
  [{ type: 'cm', text: '  // open to opportunities' }],
  [{ type: 'pl', text: '}' }],
];

const tokenClass: Record<Token['type'], string> = {
  kw: s.kw,
  vr: s.vr,
  st: s.st,
  nu: s.nu,
  cm: s.cm,
  fn: s.fn,
  br: s.br,
  pl: s.plain,
};

export default function CodeBlock() {
  return (
    <div className={s.block}>
      <div className={s.top}>
        <span className={`${s.dot} ${s.red}`} />
        <span className={`${s.dot} ${s.yellow}`} />
        <span className={`${s.dot} ${s.green}`} />
        <span className={s.filename}>about.js</span>
      </div>
      <div className={s.body}>
        {lines.map((line, i) => (
          <div key={i} className={s.codeLine}>
            <span className={s.ln}>{i + 1}</span>
            <span>
              {line.map((tok, j) => (
                <span key={j} className={tokenClass[tok.type]}>{tok.text}</span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
