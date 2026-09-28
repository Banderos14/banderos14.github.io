import { useLocale } from '@/i18n';
import Header from '@/components/Header/Header';
import Hero from '@/components/Hero/Hero';
import About from '@/components/About/About';
import Capabilities from '@/components/Capabilities/Capabilities';
import Work from '@/components/Work/Work';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';

export default function App() {
  const { t } = useLocale();

  return (
    <>
      <a className="skip-link" href="#main">
        {t.a11y.skip}
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Capabilities />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
