import './Projects.css'

// ✏️ РЕДАКТИРУЙ ЭТОТ МАССИВ — добавляй свои проекты
const projects = [
  {
    id: 1,
    title: 'Tête-à-Tête Theatre',
    description:
      'A full-featured website for an independent Russian-speaking theatre in Nice, France. Includes a ticket booking system, repertoire showcase, and admin dashboard.',
    tags: ['React', 'TypeScript', 'Firebase', 'SCSS'],
    live: 'https://banderos14.github.io/tete-a-tete-theatre/',
    github: 'https://github.com/banderos14/tete-a-tete-theatre',
    featured: true,
  },
  {
    id: 2,
    title: 'Project Two',
    description:
      'Short description of your second project. What problem does it solve? What technologies did you use?',
    tags: ['React', 'JavaScript', 'CSS'],
    live: null, // null = кнопка не показывается
    github: 'https://github.com/banderos14',
    featured: false,
  },
  {
    id: 3,
    title: 'Project Three',
    description:
      'Another project description. Replace this with your real projects whenever you\'re ready.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    live: null,
    github: 'https://github.com/banderos14',
    featured: false,
  },
]

function ProjectCard({ project }) {
  return (
    <article className={`project-card ${project.featured ? 'project-card--featured' : ''}`}>
      {project.featured && (
        <div className="project-featured-badge">
          <span>★ Featured</span>
        </div>
      )}

      <div className="project-top">
        <div className="project-icon" aria-hidden="true">
          {'{ }'}
        </div>
        <div className="project-links">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              aria-label="GitHub repository"
            >
              <GitHubIcon />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
              aria-label="Live demo"
            >
              <ExternalIcon />
            </a>
          )}
        </div>
      </div>

      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">{project.description}</p>

      <div className="project-tags">
        {project.tags.map(tag => (
          <span key={tag} className="project-tag">{tag}</span>
        ))}
      </div>
    </article>
  )
}

export default function Projects() {
  return (
    <section className="projects section" id="projects">
      <div className="container">
        <div className="section-label">
          <span className="section-label-line" />
          <span className="section-label-text">Projects</span>
        </div>

        <h2 className="projects-title">Things I've built</h2>

        <div className="projects-grid">
          {projects.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>

        <div className="projects-more">
          <a
            href="https://github.com/banderos14"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline"
          >
            <GitHubIcon /> View all on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15,3 21,3 21,9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
}
