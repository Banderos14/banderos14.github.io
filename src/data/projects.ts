import type { Project } from '@/types';
import { teteGallery } from './teteGallery';

/**
 * Selected work, in display order. The first entry renders as the featured card.
 * Only facts that exist in this repo are listed. Entries marked `hidden` stay in
 * data but are never rendered.
 */
const allProjects: Project[] = [
  {
    slug: 'tete_a_tete',
    year: 2026,
    status: 'production',
    // Verified against the tete-a-tete-theatre repo (package.json, server/, api/).
    // Core-system labels live in i18n: t.projects.tete_a_tete.features
    // Verified in the repo: React + TS, Firebase Auth/Firestore, Stripe, Resend, SCSS Modules.
    tags: ['React', 'TypeScript', 'Firebase', 'Stripe', 'Resend'],
    live: 'https://www.theatre-teteatete.fr/',
    github: 'https://github.com/Banderos14/tete-a-tete-theatre',
    // French homepage captured at 1280×1000 (≈ the featured media box on desktop;
    // stacked layouts crop it to 16:10 around the centre). Cookie banner hidden via CSS.
    // The product gallery below the card lives in src/data/teteGallery.ts.
    screenshot: '/img/tete/home-fr.webp',
    shotSize: [1280, 1000],
    gallery: teteGallery,
  },
  {
    slug: 'portfolio',
    year: 2026,
    status: 'live',
    tags: ['React', 'TypeScript', 'SCSS Modules'],
    live: 'https://banderos14.github.io/',
    github: 'https://github.com/Banderos14/banderos14.github.io',
    // Captured from the v2 dev build at 1440×900.
    screenshot: '/img/projects/portfolio.webp',
    shotSize: [1440, 900],
    focus: '50% 0%',
  },
  {
    slug: 'nice_gadgets',
    year: 2026,
    status: 'live',
    // develop branch: 15 *.module.scss files.
    tags: ['React', 'TypeScript', 'REST API', 'SCSS Modules'],
    live: 'https://banderos14.github.io/react_phone-catalog/',
    github: 'https://github.com/Banderos14/react_phone-catalog',
    screenshot: '/img/projects/nice_gadgets.webp',
    focus: '50% 0%',
  },
  {
    slug: 'game_2048',
    year: 2026,
    status: 'live',
    tags: ['JavaScript', 'SCSS', 'HTML'],
    live: 'https://banderos14.github.io/js_2048_game/',
    github: 'https://github.com/Banderos14/js_2048_game/tree/develop',
    screenshot: '/img/projects/game_2048.webp',
    focus: '50% 40%',
  },
  {
    slug: 'nice_cafe',
    year: 2026,
    status: 'live',
    tags: ['Three.js', 'Blender', 'JavaScript', 'SCSS'],
    live: 'https://banderos14.github.io/nice-cafe-landing/',
    github: 'https://github.com/Banderos14/nice-cafe-landing',
    screenshot: '/img/projects/nice_cafe.webp',
    focus: '50% 30%',
  },
  {
    slug: 'mibike',
    year: 2026,
    status: 'live',
    // Anton's commits are Feb 2026 (brief suggested 2025; kept 2026 pending confirmation).
    tags: ['HTML', 'SCSS', 'JavaScript'],
    live: 'https://banderos14.github.io/layout_landing-page/',
    github: 'https://github.com/Banderos14/layout_landing-page/tree/develop',
    screenshot: '/img/projects/mibike.webp',
    focus: '50% 0%',
  },
  {
    slug: 'coffee_shop',
    year: 2025,
    status: 'concept',
    // Styling is Tailwind + plain CSS (frontend/src/index.css), JSX — not SCSS.
    tags: ['React', 'React Router', 'Tailwind CSS'],
    live: 'https://banderos14.github.io/Coffee-shop/',
    github: 'https://github.com/Banderos14/Coffee-shop',
    screenshot: '/img/projects/coffee_shop.webp',
    focus: '50% 0%',
  },
  {
    slug: 'mt_beauty',
    year: 2026,
    status: 'live',
    tags: [],
    hidden: true, // Taplink client site; may return later as client work
    todo: ['year', 'stack', 'live URL', 'GitHub URL (if public)', 'screenshot', 'role', 'description (EN/FR/RU)'],
  },
];

export const projects = allProjects.filter((p) => !p.hidden);
