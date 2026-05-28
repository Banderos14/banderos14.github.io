import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import s from './Contact.module.scss';

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

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
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={s.label}>// get in touch</span>

          <a
            className={s.email}
            href="mailto:anton.shyshenko@gmail.com"
          >
            anton.shyshenko@gmail.com
          </a>

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

          <p className={s.note}>usually replies within 24 hours</p>
        </motion.div>
      </div>
    </section>
  );
}
