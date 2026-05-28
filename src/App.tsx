import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import Cursor from '@/components/Cursor/Cursor';
import Nav from '@/components/Nav/Nav';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Work from '@/components/Work/Work';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import BgCanvas from '@/components/BgCanvas/BgCanvas';
import StatusBar from '@/components/StatusBar/StatusBar';

export default function App() {
  const { theme, toggle } = useTheme();
  const { progress, scrollY } = useScrollProgress();

  useEffect(() => {
    const keys: string[] = [];
    let shortcutTimer: ReturnType<typeof setTimeout>;

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      keys.push(e.key);
      clearTimeout(shortcutTimer);
      shortcutTimer = setTimeout(() => keys.splice(0), 800);

      const seq = keys.join('');

      if (seq.endsWith('gg')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (seq.endsWith('ga')) {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      } else if (seq.endsWith('gw')) {
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
      } else if (seq.endsWith('gc')) {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
        toggle();
      } else if (e.key === '?') {
        showShortcuts();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  return (
    <>
      <BgCanvas />
      <Cursor />
      <Nav scrollY={scrollY} theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero />
        <About />
        <Work />
        <Contact />
      </main>
      <Footer />
      <StatusBar progress={progress} />
    </>
  );
}

function showShortcuts() {
  const existing = document.getElementById('shortcuts-modal');
  if (existing) { existing.remove(); return; }

  const modal = document.createElement('div');
  modal.id = 'shortcuts-modal';
  modal.style.cssText = `
    position:fixed;bottom:80px;right:24px;z-index:9000;
    background:var(--bg-3);border:1px solid var(--border-h);
    border-radius:6px;padding:16px 20px;
    font-family:var(--font-m);font-size:11px;color:var(--text-m);
    line-height:2;letter-spacing:.06em;
    box-shadow:0 8px 40px rgba(0,0,0,.3);
  `;
  modal.innerHTML = `
    <div style="color:var(--accent);margin-bottom:8px;letter-spacing:.1em">SHORTCUTS</div>
    <div><span style="color:var(--text)">g+g</span> &nbsp; top</div>
    <div><span style="color:var(--text)">g+a</span> &nbsp; about</div>
    <div><span style="color:var(--text)">g+w</span> &nbsp; work</div>
    <div><span style="color:var(--text)">g+c</span> &nbsp; contact</div>
    <div><span style="color:var(--text)">t</span> &nbsp;&nbsp;&nbsp; theme</div>
    <div><span style="color:var(--text)">?</span> &nbsp;&nbsp;&nbsp; this panel</div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.remove(), 4000);
}
