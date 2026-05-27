import './About.css'

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="container">
        <div className="section-label">
          <span className="section-label-line" />
          <span className="section-label-text">About</span>
        </div>

        <div className="about-grid">
          <div className="about-left">
            <h2 className="about-title">
              Frontend Developer<br />
              <span className="about-title-gold">& Web Engineer</span>
            </h2>

            <p className="about-text">
              I build responsive, performant web applications with a focus on
              clean code and great user experience. Passionate about modern
              JavaScript, React ecosystem, and bringing ideas to life on the web.
            </p>

            <p className="about-text">
              Currently based in France, working on personal projects and
              looking for opportunities to grow as a developer.
            </p>

            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat-num">2+</span>
                <span className="about-stat-label">Years coding</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">5+</span>
                <span className="about-stat-label">Projects built</span>
              </div>
              <div className="about-stat">
                <span className="about-stat-num">∞</span>
                <span className="about-stat-label">Coffee consumed</span>
              </div>
            </div>
          </div>

          <div className="about-right">
            <div className="about-card">
              <div className="about-card-header">
                <span className="about-card-dot about-card-dot--red" />
                <span className="about-card-dot about-card-dot--yellow" />
                <span className="about-card-dot about-card-dot--green" />
                <span className="about-card-file">about.js</span>
              </div>
              <pre className="about-code">
{`const anton = {
  role: "Frontend Developer",
  location: "France 🇫🇷",
  focus: [
    "React",
    "TypeScript",
    "Clean code",
  ],
  languages: ["EN", "UA", "RU", "FR"],
  openTo: "New opportunities",
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
