import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import s from './Contact.module.scss';

export default function Contact() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [blockActive, setBlockActive] = useState(false);

  const activateBlock  = () => setBlockActive(true);
  const deactivateBlock = () => setBlockActive(false);

  return (
    <section className={s.section} id="contact" ref={ref}>
      <div className="container">
        <div className={s.header}>
          <span className={s.num}>03</span>
          <span className={s.title}>contact</span>
          <span className={s.line} />
        </div>

        <motion.div
          className={s.body}
          initial={{ opacity: 0, y: 55 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 75, damping: 18, mass: 0.9, delay: 0.05 }}
        >
          <span className={s.label}>get in touch</span>

          {/* Blue pixel-block cross — animates on hover of itself or email */}
          <div
            className={s.crossBlock}
            data-anim={blockActive}
            onMouseEnter={activateBlock}
            onMouseLeave={deactivateBlock}
            aria-hidden="true"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className={s.crossCell} />
            ))}
          </div>

          {/* Original: rotating cross + email */}
          <div className={s.cta}>
            <div className={s.cross} aria-hidden="true">
              <span className={s.crossH} />
              <span className={s.crossV} />
            </div>
            <a
              className={s.email}
              href="mailto:anton.shyshenko@gmail.com"
            >
              anton.shyshenko@gmail.com
            </a>
          </div>

          <div className={s.socials}>
            <a
              href="https://github.com/Banderos14"
              target="_blank"
              rel="noopener noreferrer"
              className={s.social}
            >
              ↗ github
            </a>
            <a
              href="https://www.linkedin.com/in/anton-shyshenko"
              target="_blank"
              rel="noopener noreferrer"
              className={s.social}
            >
              ↗ linkedin
            </a>
          </div>

          <div className={s.note}>
            <span className={s.noteDot} aria-hidden="true" />
            usually replies within a few hours
          </div>
        </motion.div>
      </div>
    </section>
  );
}
