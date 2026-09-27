import { useEffect, useMemo, useState } from 'react';
import { useLocale } from '@/i18n';
import { projects } from '@/data/projects';
import type { Project } from '@/types';
import s from './PortfolioV2.module.scss';

type ProjectCopy = {
  name: string;
  role: string;
  desc: string;
};

const NAV_ITEMS = [
  { id: 'about', key: 'about' },
  { id: 'capabilities', key: 'capabilities' },
  { id: 'work', key: 'work' },
  { id: 'contact', key: 'contact' },
] as const;

const UI = {
  en: {
    nav: { about: 'About', capabilities: 'What I build', work: 'Work', contact: 'Contact' },
    eyebrow: 'Independent software engineer',
    heroTop: 'Portfolio / selected work',
    heroNameA: 'ANTON',
    heroNameB: 'SHYSHENKO.',
    heroMeta: [
      ['Focus', 'Frontend engineering'],
      ['Work', 'Production web products'],
      ['Based', 'France'],
      ['Status', 'Open to opportunities'],
    ],
    aboutTitle: 'Three things about me.',
    about: [
      {
        title: 'Engineer first',
        kicker: 'Profile',
        body: 'I build production-facing web products, not isolated interface exercises. The frontend is my strongest layer, but the work often reaches authentication, data, payments, admin tooling and deployment.',
        note: 'Frontend-focused',
      },
      {
        title: 'Real product work',
        kicker: 'Practice',
        body: 'The projects below are the main evidence. They include products used by real people, client work and systems that have to keep working after the demo is over.',
        note: 'Projects over claims',
      },
      {
        title: 'Built to ship',
        kicker: 'Approach',
        body: 'I care about clarity, responsive behaviour, maintainable code and the complete path from design decision to a deployed product.',
        note: 'Design to production',
      },
    ],
    capabilitiesTitleA: 'What I',
    capabilitiesTitleB: 'build.',
    capabilitiesIntro: 'A compact index of the product work that appears across my projects.',
    capabilities: [
      ['01', 'Product interfaces', 'React / TypeScript'],
      ['02', 'Booking flows', 'Seats / tickets / QR'],
      ['03', 'Authentication', 'Accounts / protected areas'],
      ['04', 'Payments', 'Checkout / payment states'],
      ['05', 'Admin tools', 'Operations / content / status'],
      ['06', 'Multilingual products', 'EN / FR / RU'],
    ],
    workTitle: 'Selected work.',
    workIntro: 'Production projects, client work and selected builds.',
    live: 'Open project',
    code: 'Source code',
    noLive: 'Case study soon',
    manifestoKicker: 'Contact',
    manifestoA: 'Build the',
    manifestoB: 'next one.',
    manifestoBody: 'For work, collaborations or a direct conversation about a project.',
    email: 'Email me',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    footerLeft: 'Anton Shyshenko',
    footerRight: 'Portfolio 2026',
    marquee: ['SELECTED WORK', 'SOFTWARE ENGINEERING', 'WEB PRODUCTS', 'REACT', 'TYPESCRIPT'],
  },
  fr: {
    nav: { about: 'À propos', capabilities: 'Ce que je construis', work: 'Projets', contact: 'Contact' },
    eyebrow: 'Ingénieur logiciel indépendant',
    heroTop: 'Portfolio / projets sélectionnés',
    heroNameA: 'ANTON',
    heroNameB: 'SHYSHENKO.',
    heroMeta: [
      ['Focus', 'Ingénierie frontend'],
      ['Travail', 'Produits web en production'],
      ['Basé', 'France'],
      ['Statut', 'Ouvert aux opportunités'],
    ],
    aboutTitle: 'Trois choses sur moi.',
    about: [
      {
        title: 'Ingénierie d’abord',
        kicker: 'Profil',
        body: 'Je construis des produits web destinés à la production, pas seulement des exercices d’interface. Le frontend est mon domaine le plus fort, mais mon travail touche aussi à l’authentification, aux données, aux paiements, aux outils admin et au déploiement.',
        note: 'Frontend-focused',
      },
      {
        title: 'Des projets réels',
        kicker: 'Pratique',
        body: 'Les projets ci-dessous sont la preuve principale de mon niveau : produits utilisés par de vraies personnes, missions client et systèmes qui doivent continuer à fonctionner après la démo.',
        note: 'Projects over claims',
      },
      {
        title: 'Pensé pour livrer',
        kicker: 'Approche',
        body: 'Je privilégie la clarté, le responsive, un code maintenable et le parcours complet entre une décision de design et un produit déployé.',
        note: 'Design to production',
      },
    ],
    capabilitiesTitleA: 'Ce que je',
    capabilitiesTitleB: 'construis.',
    capabilitiesIntro: 'Un index compact du travail produit présent dans mes projets.',
    capabilities: [
      ['01', 'Interfaces produit', 'React / TypeScript'],
      ['02', 'Parcours de réservation', 'Places / billets / QR'],
      ['03', 'Authentification', 'Comptes / espaces protégés'],
      ['04', 'Paiements', 'Checkout / états de paiement'],
      ['05', 'Outils admin', 'Opérations / contenu / statuts'],
      ['06', 'Produits multilingues', 'EN / FR / RU'],
    ],
    workTitle: 'Projets sélectionnés.',
    workIntro: 'Produits en production, missions client et projets choisis.',
    live: 'Voir le projet',
    code: 'Code source',
    noLive: 'Étude de cas bientôt',
    manifestoKicker: 'Contact',
    manifestoA: 'Construisons',
    manifestoB: 'le prochain.',
    manifestoBody: 'Pour un poste, une collaboration ou une discussion directe autour d’un projet.',
    email: 'Email',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    footerLeft: 'Anton Shyshenko',
    footerRight: 'Portfolio 2026',
    marquee: ['PROJETS', 'SOFTWARE ENGINEERING', 'PRODUITS WEB', 'REACT', 'TYPESCRIPT'],
  },
  ru: {
    nav: { about: 'Обо мне', capabilities: 'Что я делаю', work: 'Проекты', contact: 'Контакт' },
    eyebrow: 'Software engineer',
    heroTop: 'Портфолио / выбранные проекты',
    heroNameA: 'ANTON',
    heroNameB: 'SHYSHENKO.',
    heroMeta: [
      ['Фокус', 'Frontend engineering'],
      ['Работа', 'Production web products'],
      ['База', 'France'],
      ['Статус', 'Open to opportunities'],
    ],
    aboutTitle: 'Три вещи обо мне.',
    about: [
      {
        title: 'Инженерия в основе',
        kicker: 'Профиль',
        body: 'Я делаю web-продукты, которые должны работать в production, а не только отдельные интерфейсные упражнения. Frontend — моя самая сильная сторона, но работа часто затрагивает авторизацию, данные, платежи, админ-инструменты и deployment.',
        note: 'Frontend-focused',
      },
      {
        title: 'Реальные проекты',
        kicker: 'Практика',
        body: 'Главное доказательство моего уровня — проекты ниже: продукты для реальных пользователей, клиентская работа и системы, которые должны продолжать работать после демо.',
        note: 'Projects over claims',
      },
      {
        title: 'С прицелом на production',
        kicker: 'Подход',
        body: 'Для меня важны ясность, адаптивность, поддерживаемый код и полный путь от дизайнерского решения до работающего продукта.',
        note: 'Design to production',
      },
    ],
    capabilitiesTitleA: 'Что я',
    capabilitiesTitleB: 'строю.',
    capabilitiesIntro: 'Короткий индекс продуктовых задач, которые встречаются в моих проектах.',
    capabilities: [
      ['01', 'Product interfaces', 'React / TypeScript'],
      ['02', 'Booking flows', 'Seats / tickets / QR'],
      ['03', 'Authentication', 'Accounts / protected areas'],
      ['04', 'Payments', 'Checkout / payment states'],
      ['05', 'Admin tools', 'Operations / content / status'],
      ['06', 'Multilingual products', 'EN / FR / RU'],
    ],
    workTitle: 'Selected work.',
    workIntro: 'Production-проекты, клиентская работа и выбранные проекты.',
    live: 'Открыть проект',
    code: 'Исходный код',
    noLive: 'Case study скоро',
    manifestoKicker: 'Контакт',
    manifestoA: 'Сделаем',
    manifestoB: 'следующий.',
    manifestoBody: 'По работе, сотрудничеству или если хотите обсудить конкретный проект.',
    email: 'Написать',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    footerLeft: 'Anton Shyshenko',
    footerRight: 'Portfolio 2026',
    marquee: ['SELECTED WORK', 'SOFTWARE ENGINEERING', 'WEB PRODUCTS', 'REACT', 'TYPESCRIPT'],
  },
} as const;

function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!nodes.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((node) => node.dataset.visible = 'true');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = 'true';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function ScrollLink({
  id,
  children,
  className,
  onNavigate,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate?.();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <a href={`#${id}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

function ProjectCard({
  project,
  index,
  copy,
  labels,
}: {
  project: Project;
  index: number;
  copy?: ProjectCopy;
  labels: { live: string; code: string; noLive: string };
}) {
  const accentClass = [s.projectYellow, s.projectBlue, s.projectOrange][index % 3];

  return (
    <article className={`${s.projectCard} ${accentClass}`} data-reveal>
      <div className={s.projectBadge}>{String(index + 1).padStart(2, '0')}</div>

      <div className={s.projectVisual}>
        {project.screenshot ? (
          <img src={project.screenshot} alt="" loading="lazy" />
        ) : (
          <div className={s.projectVisualFallback}>{copy?.name ?? project.slug}</div>
        )}
      </div>

      <div className={s.projectContent}>
        <div className={s.projectMeta}>
          <span>{project.year}</span>
          <span>{copy?.role ?? 'Engineering'}</span>
        </div>

        <h3>{copy?.name ?? project.slug.replaceAll('_', ' ')}</h3>
        <p>{copy?.desc ?? ''}</p>

        <div className={s.projectTags}>
          {project.tags.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}
        </div>

        <div className={s.projectActions}>
          {project.live ? (
            <a href={project.live} target="_blank" rel="noreferrer">{labels.live} <span>→</span></a>
          ) : (
            <span className={s.projectDisabled}>{labels.noLive}</span>
          )}
          <a href={project.github} target="_blank" rel="noreferrer">{labels.code} <span>→</span></a>
        </div>
      </div>
    </article>
  );
}

export default function PortfolioV2() {
  const { locale, setLocale, t } = useLocale();
  const ui = UI[locale];
  const [menuOpen, setMenuOpen] = useState(false);

  useReveal();

  const projectCopy = t.projects as Record<string, ProjectCopy>;
  const featuredProjects = useMemo(() => projects, []);

  useEffect(() => {
    document.documentElement.dataset.theme = '';
    document.body.classList.add('portfolio-v2');
    return () => document.body.classList.remove('portfolio-v2');
  }, []);

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <ScrollLink id="hero" className={s.brand} onNavigate={() => setMenuOpen(false)}>
            <img src="/logo.svg" alt="AS" />
            <span>ANTON SHYSHENKO</span>
          </ScrollLink>

          <nav className={s.desktopNav} aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <ScrollLink key={item.id} id={item.id}>
                {ui.nav[item.key]}
              </ScrollLink>
            ))}
          </nav>

          <div className={s.headerRight}>
            <div className={s.langs} aria-label="Language switcher">
              {(['en', 'fr', 'ru'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={locale === lang ? s.langActive : ''}
                  onClick={() => setLocale(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <ScrollLink id="contact" className={s.headerCta}>{ui.nav.contact}</ScrollLink>
            <button
              type="button"
              className={`${s.menuButton} ${menuOpen ? s.menuButtonOpen : ''}`}
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className={`${s.mobileMenu} ${menuOpen ? s.mobileMenuOpen : ''}`}>
          {NAV_ITEMS.map((item) => (
            <ScrollLink key={item.id} id={item.id} onNavigate={() => setMenuOpen(false)}>
              {ui.nav[item.key]}
            </ScrollLink>
          ))}
        </div>
      </header>

      <main>
        <section className={s.hero} id="hero">
          <div className={s.shell}>
            <div className={s.heroTopline} data-reveal>
              <span className={s.diamond}>◆</span>
              <span>{ui.heroTop}</span>
            </div>

            <div className={s.heroTitleWrap}>
              <p className={s.eyebrow}>{ui.eyebrow}</p>
              <h1>
                <span>{ui.heroNameA}</span>
                <span className={s.heroAccent}>{ui.heroNameB}</span>
              </h1>
            </div>

            <div className={s.heroRule} aria-hidden="true">
              <span>◆</span><span>◆</span><span>◆</span><i />
            </div>

            <div className={s.heroMeta}>
              {ui.heroMeta.map(([label, value]) => (
                <div key={label} className={s.heroMetaItem} data-reveal>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.about} id="about">
          <div className={s.shell}>
            <div className={s.sectionLead} data-reveal>
              <span>01</span>
              <h2>{ui.aboutTitle}</h2>
            </div>

            <div className={s.aboutStack}>
              {ui.about.map((item, index) => (
                <article
                  key={item.title}
                  className={`${s.aboutCard} ${[s.aboutYellow, s.aboutNavy, s.aboutOrange][index]}`}
                  data-reveal
                >
                  <div className={s.patternBlock} aria-hidden="true" />
                  <div className={s.aboutContent}>
                    <span className={s.aboutNumber}>{String(index + 1).padStart(2, '0')}.</span>
                    <h3>{item.title}</h3>
                    <p className={s.aboutKicker}>{item.kicker}</p>
                    <p className={s.aboutBody}>{item.body}</p>
                  </div>
                  <div className={s.aboutNote}>
                    <span>{item.kicker}</span>
                    <strong>{item.note}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={s.capabilities} id="capabilities">
          <div className={s.shell}>
            <div className={s.capabilitiesHead} data-reveal>
              <h2>
                <span>{ui.capabilitiesTitleA}</span>
                <span>{ui.capabilitiesTitleB}</span>
              </h2>
              <p>{ui.capabilitiesIntro}</p>
            </div>

            <div className={s.trackRule} aria-hidden="true">
              <span>◆</span><span>◆</span><span>◆</span><i />
            </div>

            <div className={s.trackList}>
              {ui.capabilities.map(([number, title, detail]) => (
                <div className={s.trackRow} key={number} data-reveal>
                  <span className={s.trackNumber}>{number}</span>
                  <strong>{title}</strong>
                  <span className={s.trackDetail}>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={s.work} id="work">
          <div className={s.shell}>
            <div className={s.workHead} data-reveal>
              <div>
                <span className={s.sectionIndex}>02</span>
                <h2>{ui.workTitle}</h2>
              </div>
              <p>{ui.workIntro}</p>
            </div>

            <div className={s.workRule} aria-hidden="true">
              <span>◆</span><span>◆</span><span>◆</span><i />
            </div>

            <div className={s.projectGrid}>
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                  copy={projectCopy[project.slug]}
                  labels={{ live: ui.live, code: ui.code, noLive: ui.noLive }}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={s.manifesto} id="contact">
          <div className={s.shell}>
            <span className={s.manifestoKicker}>{ui.manifestoKicker}</span>
            <h2 data-reveal>
              <span>{ui.manifestoA}</span>
              <span>{ui.manifestoB}</span>
            </h2>
            <p data-reveal>{ui.manifestoBody}</p>

            <div className={s.contactLinks} data-reveal>
              <a href="mailto:anton.shyshenko@gmail.com">{ui.email} <span>→</span></a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">{ui.linkedin} <span>→</span></a>
              <a href="https://github.com/Banderos14" target="_blank" rel="noreferrer">{ui.github} <span>→</span></a>
            </div>
          </div>
        </section>

        <div className={s.marquee} aria-hidden="true">
          <div className={s.marqueeTrack}>
            {[0, 1].map((copyIndex) => (
              <div className={s.marqueeGroup} key={copyIndex}>
                {ui.marquee.map((item) => (
                  <span key={item + copyIndex}>{item}<b>◆</b></span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className={s.footer}>
        <div className={s.shell}>
          <div className={s.footerTop}>
            <div className={s.footerBrand}>
              <img src="/logo.svg" alt="" />
              <strong>{ui.footerLeft}</strong>
            </div>
            <div className={s.footerNav}>
              {NAV_ITEMS.map((item) => (
                <ScrollLink key={item.id} id={item.id}>{ui.nav[item.key]}</ScrollLink>
              ))}
            </div>
          </div>
          <div className={s.footerBottom}>
            <span>{ui.footerRight}</span>
            <span>React / TypeScript</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
