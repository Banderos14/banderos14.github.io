import { useEffect } from 'react';
import gsap from 'gsap';
import Lenis from '@studio-freight/lenis';
import { useGsapReveal } from '@/hooks/useGsapReveal';
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

const MAGNETIC_STRENGTH = 0.30;
const MAGNETIC_MAX_DIST = 0.80; // fraction of largest btn dimension

export default function App() {
  const { theme, toggle } = useTheme();
  const { progress, scrollY } = useScrollProgress();
  useGsapReveal();

  // ── Lenis smooth scroll — driven by GSAP ticker (exact codedgar setup) ─
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration:    0.8,
      easing:      (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    } as ConstructorParameters<typeof Lenis>[0]);

    // Expose so Hero / Nav anchor links can call lenis.scrollTo()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__lenis = lenis;

    // Drive Lenis via GSAP ticker — one shared animation loop, no extra RAF
    const tickFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickFn);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(tickFn);
      lenis.destroy();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__lenis = undefined;
    };
  }, []);

  // ── Magnetic button effect — via gsap.to() (exact codedgar approach) ───
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    const attachMagnetic = (btn: HTMLElement) => {
      if (btn.dataset.magnetic) return;
      btn.dataset.magnetic = '1';

      let rect: DOMRect | null = null;
      let pending: MouseEvent | null = null;
      let rafId: number | null = null;

      const onEnter = () => { rect = btn.getBoundingClientRect(); };

      const applyForce = () => {
        rafId = null;
        if (!pending || !rect) return;
        const ev = pending; pending = null;
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = ev.clientX - cx;
        const dy   = ev.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const max  = Math.max(rect.width, rect.height) * MAGNETIC_MAX_DIST;
        if (dist < max) {
          const s = 1 - dist / max;
          gsap.to(btn, { x: dx * s * MAGNETIC_STRENGTH, y: dy * s * MAGNETIC_STRENGTH,
                          duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        }
      };

      const onMove = (e: MouseEvent) => {
        pending = e;
        if (rafId === null) rafId = requestAnimationFrame(applyForce);
      };

      const onLeave = () => {
        rect = null; pending = null;
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
      };

      btn.addEventListener('mouseenter', onEnter);
      btn.addEventListener('mousemove',  onMove);
      btn.addEventListener('mouseleave', onLeave);

      cleanups.push(() => {
        btn.removeEventListener('mouseenter', onEnter);
        btn.removeEventListener('mousemove',  onMove);
        btn.removeEventListener('mouseleave', onLeave);
        if (rafId !== null) cancelAnimationFrame(rafId);
        gsap.set(btn, { clearProps: 'x,y' });
        delete btn.dataset.magnetic;
      });
    };

    // Attach to all existing .btn-wrap elements (so corners move with button)
    document.querySelectorAll<HTMLElement>('.btn-wrap').forEach(attachMagnetic);

    const mo = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>('.btn-wrap').forEach(attachMagnetic);
    });
    mo.observe(document.body, { childList: true, subtree: false });

    return () => {
      mo.disconnect();
      cleanups.forEach(fn => fn());
    };
  }, []);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const keys: string[] = [];
    let timer: ReturnType<typeof setTimeout>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenisTo = (target: string | number) => (window as any).__lenis?.scrollTo(target)
      ?? (() => {
           if (typeof target === 'number') window.scrollTo({ top: target });
           else document.querySelector(target)?.scrollIntoView();
         })();

    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      keys.push(e.key);
      clearTimeout(timer);
      timer = setTimeout(() => keys.splice(0), 800);
      const seq = keys.join('');

      if (seq.endsWith('gg'))      lenisTo(0);
      else if (seq.endsWith('ga')) lenisTo('#about');
      else if (seq.endsWith('gw')) lenisTo('#work');
      else if (seq.endsWith('gc')) lenisTo('#contact');
      else if (e.key === 't' && !e.ctrlKey && !e.metaKey) toggle();
      else if (e.key === '?') showShortcuts();
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
