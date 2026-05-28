import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CodeBlock from './CodeBlock';
import s from './About.module.scss';

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className={s.section} id="about" ref={ref}>
      <div className="container">
        <div className={s.header}>
          <span className={s.num}>01</span>
          <span className={s.title}>about</span>
          <span className={s.line} />
        </div>

        <div className={s.grid}>
          <motion.div
            className={s.text}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p>
              I&apos;m a <strong>frontend developer</strong> based in{' '}
              <strong>Lyon, France</strong>, focused on building elegant,
              performant web experiences.
            </p>
            <p>
              I work with <strong>React</strong>, <strong>TypeScript</strong>, and{' '}
              <strong>SCSS</strong>, with a strong eye for design systems,
              animation, and attention to detail.
            </p>
            <p>
              Before moving into tech, I spent years working in hospitality —
              an experience that shaped my approach to{' '}
              <strong>user-centered thinking</strong> and empathy in product design.
            </p>
            <p>
              Currently <strong>open to opportunities</strong> — full-time roles,
              freelance projects, or interesting collaborations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <CodeBlock />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
