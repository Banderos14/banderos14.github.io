import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/types';
import s from './ProjectItem.module.scss';

const IFRAME_W = 1280;
const IFRAME_H = 720;

interface Props {
  project:  Project;
  index:    number;
  revealed: boolean;
}

function displayUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname + u.pathname.replace(/\/$/, '');
  } catch { return url; }
}

export default function ProjectItem({ project, index, revealed }: Props) {
  const [hovered,   setHovered]   = useState(false);
  const [scale,     setScale]     = useState(0.24);
  const [ifrSrc,    setIfrSrc]    = useState('');
  const [ifrLoaded, setIfrLoaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const screenRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Placeholder fades when either the local screenshot or live iframe is ready
  const showContent = ifrLoaded || imgLoaded;

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  // Scale iframe to fit the card width
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const calc = () => setScale(el.offsetWidth / IFRAME_W);
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // STEP 1 — Load iframe only after the Work section has been revealed by scroll
  // AND the card itself enters the viewport. Gating on `revealed` prevents iframes
  // from loading on page load (opacity:0 cards still register in IntersectionObserver).
  useEffect(() => {
    if (!revealed) return;
    const el = screenRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIfrSrc(project.live);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [project.live, revealed]);

  // STEP 2 — Modern browsers return null (not throw) for cross-origin contentDocument
  // once the navigation commits — page is rendering but JS hasn't run yet,
  // so entry-point animations play from the very beginning.
  useEffect(() => {
    if (!ifrSrc) return;

    let tick: ReturnType<typeof setInterval>;
    let giveUp: ReturnType<typeof setTimeout>;

    tick = setInterval(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      // about:blank → contentDocument accessible; cross-origin committed → null
      if (iframe.contentDocument === null) {
        setIfrLoaded(true);
        clearInterval(tick);
        clearTimeout(giveUp);
      }
    }, 80);

    // Fallback: reveal after 2 s regardless (covers slow connections)
    giveUp = setTimeout(() => {
      clearInterval(tick);
      setIfrLoaded(true);
    }, 2_000);

    return () => { clearInterval(tick); clearTimeout(giveUp); };
  }, [ifrSrc]);

  return (
    <article
      className={s.card}
      data-hovered={hovered}
      data-index={index}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={project.live}
        target="_blank"
        rel="noopener noreferrer"
        className={s.mockup}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className={s.chrome}>
          <div className={s.dots}><span /><span /><span /></div>
          <div className={s.urlBar}>{displayUrl(project.live)}</div>
        </div>

        <div className={s.screen} ref={screenRef}>
          <div className={s.screenInner}>

            {/* Layer 1: Local screenshot — instant, no external API */}
            {project.screenshot && (
              <img
                src={project.screenshot}
                alt=""
                className={s.fallbackImg}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
              />
            )}

            {/* Layer 2: Live iframe — loads when card enters viewport */}
            {ifrSrc && (
              <iframe
                ref={iframeRef}
                src={ifrSrc}
                className={s.iframe}
                data-loaded={ifrLoaded}
                style={{ transform: `scale(${scale})`, height: `${IFRAME_H}px` }}
                scrolling="no"
                title={project.name}
                allow="autoplay"
              />
            )}

            <div className={s.screenGlow} />
          </div>

          <div className={s.placeholder} data-loaded={showContent}>
            <span className={s.phName}>{project.name}</span>
            {!showContent && <span className={s.phLoading}>loading preview…</span>}
          </div>
        </div>
      </a>

      <div className={s.body}>
        <div className={s.meta}>
          <span className={s.year}>{project.year}</span>
          <span className={s.role}>{project.role}</span>
        </div>

        <a href={project.live} target="_blank" rel="noopener noreferrer" className={s.nameLink}>
          <h3 className={s.name}>{project.name}</h3>
        </a>

        <p className={s.desc}>{project.desc}</p>

        <div className={s.tags}>
          {project.tags.map(tag => (
            <span key={tag} className={s.tag}>{tag}</span>
          ))}
        </div>

        <div className={s.links}>
          <a href={project.live} target="_blank" rel="noopener noreferrer" className={s.cta}>
            View project <span className={s.arr}>→</span>
          </a>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={s.ghLink}>
            ↗ GitHub
          </a>
        </div>
      </div>
    </article>
  );
}
