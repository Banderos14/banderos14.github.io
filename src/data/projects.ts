import type { Project } from '@/types';

export const projects: Project[] = [
  {
    year: 2026,
    role: 'Design & Developer',
    name: "Tête-à-Tête Theatre",
    tags: ["React", "TypeScript", "Firebase", "SCSS", "i18n"],
    desc: "Full web platform for a theatre company in France. Booking system, admin dashboard, multi-language support, Firebase auth and Firestore.",
    live: "https://tete-a-tete-theatre.vercel.app/",
    github: "https://github.com/Banderos14/tete-a-tete-theatre",
  },
  {
    year: 2026,
    role: 'Design & Developer',
    name: "Nice Café Landing",
    tags: ["HTML", "SCSS", "JavaScript", "Three.js", "Blender"],
    desc: "The highlight: an interactive 3D coffee bean model (built in Blender, rendered via Three.js) that rotates and animates on scroll. Responsive layout with smooth scroll interactions.",
    live: "https://banderos14.github.io/nice-cafe-landing/",
    github: "https://github.com/Banderos14/nice-cafe-landing",
  },
  {
    year: 2025,
    role: 'Developer',
    name: "MiBike — E-Bike Store",
    tags: ["HTML", "SCSS", "JavaScript"],
    desc: "E-commerce landing for an electric bike brand. Pixel-perfect Figma-to-code implementation with responsive layout and Cypress end-to-end tests.",
    live: "https://banderos14.github.io/layout_landing-page/",
    github: "https://github.com/Banderos14/layout_landing-page/tree/develop",
  },
  {
    year: 2026,
    role: 'Developer',
    name: "2048 — Browser Game",
    tags: ["HTML", "SCSS", "JavaScript"],
    desc: "Classic 2048 puzzle game built from scratch. Smooth tile animations, keyboard and swipe controls, local high-score persistence.",
    live: "https://banderos14.github.io/js_2048_game/",
    github: "https://github.com/Banderos14/js_2048_game/tree/develop",
  },
  {
    year: 2026,
    role: 'Developer',
    name: "Nice Gadgets — Phone Catalog",
    tags: ["React", "TypeScript", "REST API", "SCSS"],
    desc: "Full-featured e-commerce catalog for phones, tablets and accessories. Product filtering, favourites, cart, and dynamic routing with a real REST API.",
    live: "https://banderos14.github.io/react_phone-catalog/",
    github: "https://github.com/Banderos14/react_phone-catalog",
  },
];
