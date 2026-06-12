import type { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'tete_a_tete',
    year: 2026,
    tags: ['React', 'TypeScript', 'Firebase', 'SCSS', 'i18n'],
    live: 'https://www.theatre-teteatete.fr/',
    github: 'https://github.com/Banderos14/tete-a-tete-theatre',
    screenshot: '/img/projects/tete_a_tete.png',
    activelyDeveloped: true,
  },
  {
    slug: 'nice_cafe',
    year: 2026,
    tags: ['HTML', 'SCSS', 'JavaScript', 'Three.js', 'Blender'],
    live: 'https://banderos14.github.io/nice-cafe-landing/',
    github: 'https://github.com/Banderos14/nice-cafe-landing',
    screenshot: '/img/projects/nice_cafe.webp',
  },
  {
    slug: 'mibike',
    year: 2026,
    tags: ['HTML', 'SCSS', 'JavaScript'],
    live: 'https://banderos14.github.io/layout_landing-page/',
    github: 'https://github.com/Banderos14/layout_landing-page/tree/develop',
    screenshot: '/img/projects/mibike.webp',
  },
  {
    slug: 'game_2048',
    year: 2026,
    tags: ['HTML', 'SCSS', 'JavaScript'],
    live: 'https://banderos14.github.io/js_2048_game/',
    github: 'https://github.com/Banderos14/js_2048_game/tree/develop',
    screenshot: '/img/projects/game_2048.webp',
  },
  {
    slug: 'nice_gadgets',
    year: 2026,
    tags: ['React', 'TypeScript', 'REST API', 'SCSS'],
    live: 'https://banderos14.github.io/react_phone-catalog/',
    github: 'https://github.com/Banderos14/react_phone-catalog',
    screenshot: '/img/projects/nice_gadgets.webp',
  },
  {
    slug: 'coffee_shop',
    year: 2025,
    tags: ['React', 'JavaScript', 'React Router', 'SCSS', 'Vite', 'Mapbox'],
    live: 'https://banderos14.github.io/Coffee-shop/',
    github: 'https://github.com/Banderos14/Coffee-shop',
    screenshot: '/img/projects/coffee_shop.webp',
    archivedConcept: true,
  },
];
