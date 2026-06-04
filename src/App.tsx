import { useGsapReveal } from '@/hooks/useGsapReveal';
import { useTheme } from '@/hooks/useTheme';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { useMagneticButtons } from '@/hooks/useMagneticButtons';
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

  useGsapReveal();
  useLenisScroll();
  useMagneticButtons();

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
