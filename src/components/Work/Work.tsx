import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { projects } from '@/data/projects';
import ProjectItem from './ProjectItem';
import s from './Work.module.scss';

export default function Work() {
  const trackRef   = useRef<HTMLDivElement>(null);
  const outerRef   = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [revealed,       setRevealed]       = useState(false);
  const [activeIndex,    setActiveIndex]    = useState(0);
  const [cardWidth,      setCardWidth]      = useState(320);
  const [containerWidth, setContainerWidth] = useState(900);

  const gap  = 20;
  const step = cardWidth + gap;

  // Total track width (no trailing gap after last card)
  const trackWidth  = projects.length * cardWidth + (projects.length - 1) * gap;
  // How far we can scroll before showing empty space
  const maxScrollPx = Math.max(0, trackWidth - containerWidth);
  // Actual x to animate to — clamped so last card sits flush at the right edge
  const scrollX     = Math.min(activeIndex * step, maxScrollPx);
  // Number of unique scroll positions (fewer than projects when last cards are flush)
  const dotCount    = maxScrollPx > 0 ? Math.floor(maxScrollPx / step) + 1 : 1;
  const activeDot   = Math.min(Math.round(scrollX / step), dotCount - 1);

  // Measure card width
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelector<HTMLElement>('[data-slide]');
    if (!slide) return;
    const ro = new ResizeObserver(() => setCardWidth(slide.offsetWidth));
    ro.observe(slide);
    setCardWidth(slide.offsetWidth);
    return () => ro.disconnect();
  }, []);

  // Measure container width (needed to know when last card is flush)
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerWidth(el.offsetWidth));
    ro.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  // Reveal on scroll into view
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); io.disconnect(); } },
      { threshold: 0.15 },
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const nextCard = useCallback(() => {
    setActiveIndex(i => Math.min(i + 1, projects.length - 1));
  }, []);

  const prevCard = useCallback(() => {
    setActiveIndex(i => Math.max(i - 1, 0));
  }, []);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 300;
    if (swipe) info.offset.x < 0 ? nextCard() : prevCard();
  };

  const atStart = activeIndex === 0;
  const atEnd   = scrollX >= maxScrollPx;

  return (
    <section className={s.section} id="work" ref={sectionRef}>
      {/* Header — standard container width */}
      <div className="container">
        <motion.div
          className={s.header}
          initial={{ opacity: 0, y: 45 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 45 }}
          transition={{ type: 'spring', stiffness: 75, damping: 18, mass: 0.9 }}
        >
          <span className={s.num}>02</span>
          <span className={s.title}>work</span>
          <span className={s.line} />
          <div className={s.navBtns}>
            <button className={s.navBtn} onClick={prevCard} disabled={atStart} aria-label="Previous">←</button>
            <button className={s.navBtn} onClick={nextCard} disabled={atEnd}   aria-label="Next">→</button>
          </div>
        </motion.div>
      </div>

      {/* Carousel */}
      <div className="container">
        <div className={s.carouselOuter} ref={outerRef}>
          <motion.div
            ref={trackRef}
            className={s.carouselTrack}
            drag="x"
            dragConstraints={{ left: -maxScrollPx, right: 0 }}
            dragElastic={0.08}
            animate={{ x: -scrollX }}
            transition={{ type: 'tween', duration: 1.3, ease: [0.45, 0, 0.55, 1] }}
            onDragEnd={handleDragEnd}
          >
            {projects.map((project, i) => (
              <motion.div
                key={project.name}
                data-slide
                className={s.cardSlide}
                initial={{ opacity: 0, y: 60 }}
                animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                transition={{ type: 'spring', stiffness: 72, damping: 17, mass: 0.9, delay: i * 0.1 }}
              >
                <ProjectItem
                  project={project}
                  index={i}
                  revealed={revealed}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Dots + footer */}
      <div className="container">
        <motion.div
          className={s.dots}
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: projects.length * 0.1 + 0.2 }}
        >
          {Array.from({ length: dotCount }).map((_, i) => (
            <span key={i} className={s.dot} data-active={i === activeDot} />
          ))}
        </motion.div>

        <motion.div
          className={s.footer}
          initial={{ opacity: 0, y: 40 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 75, damping: 18, mass: 0.9, delay: projects.length * 0.1 + 0.25 }}
        >
          <div className="btn-wrap">
            <a href="https://github.com/Banderos14" target="_blank" rel="noopener noreferrer" className="btn btn-p">
              View all projects <span className="btn-arr">↗</span>
            </a>
            <span className="btn-c btn-c--tl" aria-hidden="true" />
            <span className="btn-c btn-c--tr" aria-hidden="true" />
            <span className="btn-c btn-c--bl" aria-hidden="true" />
            <span className="btn-c btn-c--br" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
