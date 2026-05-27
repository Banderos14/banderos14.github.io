import './App.css'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import Contact from './components/Contact.jsx'
import Nav from './components/Nav.jsx'

export default function App() {
  return (
    <div className="app">
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <footer className="footer">
        <span className="footer-mono">banderos14.github.io</span>
        <span className="footer-copy">© 2025 Anton Shyshenko</span>
      </footer>
    </div>
  )
}
