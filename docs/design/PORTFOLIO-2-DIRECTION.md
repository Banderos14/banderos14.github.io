# Portfolio 2.0 — direction

Branch: `redesign/cold-snap-floot` (from `origin/main` @ a0ff729). `main` is production and deploys
on push via GitHub Actions — nothing here merges or deploys until Anton approves.

## Thesis

A project-first engineering portfolio built as a bold editorial page. Composition, typography and
real projects carry the confidence; the copy stays short and factual.

## Section map (Cold Snap → portfolio)

| Cold Snap | Portfolio | Notes |
|---|---|---|
| Brutal-slab nav | Header | existing logo (untouched SVG) + name · About / Systems / Work · **Contact** slab CTA · EN/FR/RU. From 768 px, after ~72 px of scroll it becomes a compact centred bar (square, 2 px border, orange offset shadow) |
| Marquee-word hero | Hero | `ANTON` / `SHYSHENKO.` poster word; descriptor "Frontend Engineer" as the only eyebrow; facts: Based in / Focus / Status / Contact |
| Hero marquee | — | dropped; the one marquee lives at the bottom |
| Artists (3 slabs) | About | 01 Profile (duotone portrait, `src/data/profile.ts`) · 02 Production work (Tête-à-Tête) · 03 Workflow (AI tooling, custom skills) |
| Tracklist | Systems | six systems, each pointing at the project where it runs (tooling is personal, no link) |
| Formats | Selected work | Tête-à-Tête as a full-width featured card, then a 3-col grid |
| Manifesto | Contact | "Build the next one." + email + LinkedIn / GitHub / Instagram |
| Footer marquee + colophon | Marquee + footer | single marquee, logo, nav, year, build line |

## Tokens

| Role | Value | Use |
|---|---|---|
| `--color-ink` | `#113046` deep navy | text, every border, every shadow, header, contact band |
| `--color-paper` | pale blue-white tinted to `#9CC9E3` | page background |
| `--color-sky` | `#9CC9E3` | capabilities band (Cold Snap's `paper-2`, pushed harder) |
| `--color-blue` | `#4D9CBA` | secondary surfaces, focus on dark |
| `--color-accent` | `#F4BA41` yellow | hero accent word, marquee, CTA, slab 01/03, tags |
| `--color-accent-2` | `#EC8C34` orange | hover shadows, slab 03, ornaments on dark |
| `--color-accent-2-deep` | orange darkened for text | numerals / one coloured word on paper (orange itself fails contrast on paper) |

Warm accents (yellow/orange) against cool ground (navy/blue) replace Cold Snap's warm-on-warm.

Type: **Big Shoulders Display** 800 (display) · **DM Sans** (body) · **DM Mono** (metadata only).
Cyrillic falls back per glyph to Sofia Sans Extra Condensed / Onest / IBM Plex Mono, loaded only
when Russian text is on screen (Google Fonts `unicode-range`).

Borders 2 px ink. Shadows hard offset: 6 px cards/slabs, 3 px CTA; hover grows to 9 px in orange.
Radius 0 everywhere.

## Motion budget

- One CSS marquee (pauses on hover/focus; stopped by `prefers-reduced-motion`).
- Hover: translate + shadow growth on cards and CTA; colour swap on buttons/links.
- Project images: slight crop shift (`object-position`) on card hover.
- No GSAP, Framer Motion, Lenis, canvas, custom cursor or scroll listeners in the rendered page.

## Content rules

- Facts only from the repo (project data, i18n copy, contact links). Missing data → `TODO` in
  `src/data/projects.ts`, never invented.
- Systems list only what Anton's projects demonstrate. Custom AI skills are private: no repo link.
- `hidden: true` projects (M.T. Beauty, a Taplink client site) stay in data and never render.
- No middle-dot separators; metadata items are separated by spacing.
