# Anton Shyshenko — Portfolio

**Live:** https://banderos14.github.io

Frontend developer portfolio built with React, TypeScript and SCSS.

Features custom animations, project showcases, responsive design and accessibility-focused interactions.

---

## Tech stack

| Tool | Purpose |
|---|---|
| React 18 + TypeScript | UI and type safety |
| Vite | Build tool |
| SCSS Modules | Component-scoped styles |
| GSAP + Framer Motion | Animations and scroll triggers |
| Lenis | Smooth scroll |
| GitHub Pages | Deployment via `gh-pages` |

---

## Features

- Dark / light theme toggle (persisted to `localStorage`)
- Smooth scroll via Lenis, driven by GSAP's ticker (single animation loop)
- Magnetic button effect on desktop (pointer:fine devices)
- Custom cursor with hover state (pointer:fine only)
- Browser mockup cards with lazy iframe previews — loads only when the card enters the viewport
- Dot-grid parallax background (canvas)
- Conway's Game of Life animation in the About section
- Scroll progress indicator in the status bar
- `prefers-reduced-motion` support — animations disabled when the user has it set

---

## Project structure

```
src/
├── components/
│   ├── About/           Who I am section + Conway bg + stats
│   ├── BgCanvas/        Animated dot-grid background (canvas)
│   ├── Contact/         Email + socials
│   ├── ConwayBg/        Conway's Game of Life canvas
│   ├── Cursor/          Custom cursor (desktop only)
│   ├── Footer/          Copyright + TronGrid animation
│   ├── Hero/            Name, headline, skills ticker
│   ├── Nav/             Navigation + theme toggle + mobile menu
│   ├── StatusBar/       Scroll progress %
│   ├── TronGrid/        Footer decorative grid
│   └── Work/            Project carousel with browser mockups
├── data/
│   └── projects.ts      Edit this to update the project list
├── hooks/
│   ├── useGsapReveal.ts
│   ├── useLenisScroll.ts
│   ├── useMagneticButtons.ts
│   ├── useScrollProgress.ts
│   └── useTheme.ts
├── styles/
│   ├── global.scss      CSS tokens, reset, global utilities, buttons
│   └── _variables.scss  SCSS tokens (auto-injected via Vite additionalData)
└── types/
    └── index.ts
```

---

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

```bash
npm run build    # production build
npm run preview  # preview the build locally
```

---

## Deployment

```bash
npm run deploy
```

Runs `tsc && vite build`, then pushes `dist/` to the `gh-pages` branch. Make sure you've tested the build locally first.

**Don't:**
- Rename or delete this repository — the GitHub Pages URL is tied to it
- Change the GitHub username `banderos14`
- Disable GitHub Pages in repo settings

---

## Design / UX notes

- **Fonts:** Halfre (display/headings), Plus Jakarta Sans (body), JetBrains Mono (code/labels)
- **Dark theme (default):** blue accent `#1b5def`
- **Light theme:** gold accent `#D4AF37` — a small nod to the Ukrainian flag
- **Buttons:** custom corner-bracket style on hover, no library needed. Brackets live outside the `<a>` element so they're not clipped by `overflow: hidden`
- **Motion philosophy:** animations should feel earned. Scroll-triggered reveals, not autoplay. Nothing that distracts from reading

---

## Performance & accessibility

- [x] `prefers-reduced-motion` — disables Lenis, GSAP scroll animations, dot parallax
- [x] Custom cursor + magnetic buttons disabled on touch/coarse-pointer devices
- [x] Iframe previews load lazily — only when the card enters the viewport
- [x] Semantic HTML — `<section>`, `<article>`, `<nav>`, `<main>`, `<footer>`
- [x] `aria-hidden` on decorative elements
- [ ] Full screen reader audit — not done yet
- [ ] Lighthouse score — not measured in the current version

---

## Screenshots

<!-- TODO: add screenshots -->

---

## What I learned building this

- Building reusable React components and custom hooks
- Working with TypeScript in a real project
- Creating smooth animations with GSAP and Framer Motion
- Improving responsive layouts for desktop and mobile devices
- Organizing a larger project structure and keeping the code maintainable
- Optimizing performance by lazy-loading heavy content
- Deploying and maintaining a project with GitHub Pages

---

## What's next

- [ ] Add a writing / notes section
- [ ] Improve accessibility: ARIA roles, focus trapping in the mobile menu
- [ ] Add OG meta tags and a proper favicon set
- [ ] Replace iframe previews with static screenshots for better performance
- [ ] Run a proper Lighthouse audit and fix whatever's red
