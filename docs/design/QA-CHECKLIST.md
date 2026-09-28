# QA checklist — Portfolio 2.0

Distilled from Hallmark's slop test, Impeccable's audit/polish passes and design-review's rubric.
Run against the **rendered** page, not the source.

## Viewports
- [ ] 1440 · 1280×800 (hero fits the fold) · 1024 · 768 · 375 · 320
- [ ] No horizontal scroll anywhere between 320 and 1920 (`overflow-x: clip` on html/body)
- [ ] No clickable label wraps onto two lines

## Art direction
- [ ] Every section boundary has a surface change or a 2 px rule, never whitespace alone
- [ ] Display always Big Shoulders 800 uppercase; hierarchy by size, not weight
- [ ] Square corners, 2 px ink borders, hard zero-blur shadows only
- [ ] One marquee on the page
- [ ] No gradients, glass, glow, pills, terminals, fake browser chrome, tilt, cursor effects
- [ ] No italic headings; no middle-dot separators; eyebrows only where ordinal
- [ ] All colours and fonts come from tokens in `src/styles/tokens.scss`

## Content
- [ ] Every URL traces to existing repo data
- [ ] No invented metrics, clients or claims
- [ ] Draft/TODO projects hidden in production build

## Accessibility
- [ ] One `h1`; section `h2`s; card `h3`s
- [ ] Skip link; visible `:focus-visible` on every interactive element (instant, not faded)
- [ ] Body text ≥ 4.5:1, large text ≥ 3:1 against the *computed* background
- [ ] Touch targets ≥ 44 px on mobile
- [ ] Decorative art `aria-hidden`; meaningful images have alt text
- [ ] Mobile menu: `aria-expanded`, Esc closes, focus returns to toggle
- [ ] `prefers-reduced-motion`: marquee stopped, transitions near-zero

## Performance
- [ ] No canvas, no rAF loops, no scroll listeners for decoration
- [ ] Below-fold images `loading="lazy"` + `decoding="async"` with width/height
- [ ] Screenshots ≤ ~200 KB webp
- [ ] Unused deps removed (gsap, framer-motion, lenis)

## i18n
- [ ] EN / FR / RU switch without layout breakage (long FR words, Cyrillic fallback fonts)
- [ ] `<html lang>` follows locale

## Build
- [ ] `npm run build` (tsc + vite) passes
- [ ] No console errors
