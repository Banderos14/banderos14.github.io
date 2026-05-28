import HeroPhoto from './HeroPhoto';
import HeroMarquee from './HeroMarquee';
import HeroTicker from './HeroTicker';
import s from './Hero.module.scss';

export default function Hero() {
  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={s.hero} id="hero">
      {/* console decoration */}
      <div className={s.console}>
        <div>
          <span className={s.consoleGreen}>const</span>{' '}
          <span className={s.consoleAccent}>dev</span> = &apos;banderos14&apos;
        </div>
        <div>
          <span className={s.consoleGreen}>stack</span>:
          [&apos;React&apos;, &apos;TS&apos;, &apos;SCSS&apos;]
        </div>
        <div>
          <span className={s.consoleGreen}>location</span>:
          &apos;France 🇫🇷&apos;
        </div>
      </div>

      <div className={s.content}>
        <div className={s.left}>
          <p className={s.label}>frontend developer</p>

          <h1 className={s.name}>
            <span className={s.nameLine}>Anton</span>
            <span className={s.nameLine}><em>Shyshenko</em></span>
          </h1>

          <div className={s.sub}>
            <span className={s.subFr}>Based in France — building digital experiences</span>
            <span className={s.subMono}>// react · typescript · scss · motion</span>
          </div>

          <p className={s.desc}>
            I craft clean, performant interfaces with attention to detail,
            smooth interactions, and thoughtful UX. Passionate about design systems
            and the craft of frontend engineering.
          </p>

          <div className={s.cta}>
            <a href="#work" className="btn btn-p" onClick={scrollToWork}>
              view work <span className="btn-arr">↗</span>
            </a>
            <a href="#contact" className="btn btn-s" onClick={scrollToContact}>
              get in touch
            </a>
          </div>
        </div>

        <HeroPhoto />
      </div>

      <HeroTicker />
      <HeroMarquee />

      <span className={s.scrollHint}>scroll</span>
    </section>
  );
}
