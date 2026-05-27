import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
      </div>

      <div className="hero-content">
        <div className="hero-tag">
          <span className="hero-tag-dot" />
          <span>Available for work</span>
        </div>

        <h1 className="hero-name">
          <span className="hero-name-first">Anton</span>
          <span className="hero-name-last">Shyshenko</span>
        </h1>

        <p className="hero-role">
          <span className="hero-role-bracket">&lt;</span>
          Frontend Developer
          <span className="hero-role-bracket"> /&gt;</span>
        </p>

        <p className="hero-desc">
          Building modern web experiences with React & TypeScript.
          <br />
          Based in France 🇫🇷 — open to remote & on-site opportunities.
        </p>

        <div className="hero-actions">
          <a href="#projects" className="btn btn--primary">
            View Projects
          </a>
          <a href="#contact" className="btn btn--outline">
            Get in Touch
          </a>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <div className="hero-scroll-line" />
        </div>
      </div>

      <div className="hero-mono" aria-hidden="true">
        <span>const dev = 'banderos14'</span>
        <span>console.log('hello world')</span>
      </div>
    </section>
  )
}
