import './Skills.css'

const skillGroups = [
  {
    category: 'Languages',
    skills: [
      { name: 'JavaScript', level: 85 },
      { name: 'TypeScript', level: 75 },
      { name: 'HTML5', level: 95 },
      { name: 'CSS / SCSS', level: 90 },
    ],
  },
  {
    category: 'Frameworks & Libraries',
    skills: [
      { name: 'React', level: 80 },
      { name: 'Vite', level: 80 },
      { name: 'React Router', level: 75 },
    ],
  },
  {
    category: 'Tools & Services',
    skills: [
      { name: 'Git / GitHub', level: 85 },
      { name: 'Firebase', level: 70 },
      { name: 'GitHub Actions', level: 65 },
      { name: 'Figma', level: 60 },
    ],
  },
]

export default function Skills() {
  return (
    <section className="skills section" id="skills">
      <div className="container">
        <div className="section-label">
          <span className="section-label-line" />
          <span className="section-label-text">Skills</span>
        </div>

        <h2 className="skills-title">Tech Stack</h2>

        <div className="skills-groups">
          {skillGroups.map(group => (
            <div key={group.category} className="skills-group">
              <h3 className="skills-group-title">{group.category}</h3>
              <div className="skills-list">
                {group.skills.map(skill => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-pct">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-bar-fill"
                        style={{ '--width': `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
