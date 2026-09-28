# Cold Snap — design DNA

Source studied: <https://www.usehallmark.com/examples/carnival-01/> (Hallmark example,
theme *Carnival*, macrostructure *Marquee Hero*). Inspected in a live browser at 1024 px
and 375 px, with computed styles and the published token sheet. Nothing below is copied
code; it is a description of the mechanics we re-author.

## Macrostructure

| # | Block | Surface | Density | Job |
|---|---|---|---|---|
| 1 | Nav — "brutal slab" | ink, full bleed, 48 px | low | wordmark · 4 mono links · one slab CTA |
| 2 | Hero — marquee word | paper | very low | two-line poster word, second line accent-filled with ink stroke; 4-col `dl` under a 2 px rule |
| 3 | Marquee strip | mustard, 2 px rules top/bottom | — | moving uppercase display line |
| 4 | Artists | paper, 3 stacked slabs | high | numbered slabs, alternating mustard / oxblood / mustard, 6 px hard shadow |
| 5 | Tracklist | paper-2, 2 px rules top/bottom | medium | 2-col: giant head + ornaments / ruled numbered list |
| 6 | Formats | paper | medium | head + ornament divider, 3 bordered cards, edge tag, price, ink button |
| 7 | Manifesto | ink | very low | centred, huge two-tone statement |
| 8 | Footer | oxblood marquee + paper colophon | low | wordmark + blurb, two link columns, address meta |

Rhythm alternates **paper → accent band → dense slabs → tinted band → cards → ink → accent band → paper**.
Every transition is marked by a surface change *and* a 2 px ink rule — never by whitespace alone.

## Type

- **Display:** Big Shoulders Display 800, uppercase, tracked `+0.02–0.04em`.
  Hero word `clamp(5rem, 16vw + 1rem, 16rem)`, line-height 0.82.
  Section heads `clamp(3rem, 7vw + 1rem, 7rem)`, line-height 0.86.
  Slab names 3.5 rem / 0.92. Card titles 2.5 rem / 0.9.
- **Body:** DM Sans 400, 16–18 px, line-height 1.4, measure 30–38 ch in slabs.
- **Labels:** JetBrains Mono, 12 px, uppercase, tracking 0.18em. Used for eyebrow, `dt`, sub-lines, tags, nav links, prices' small print.
- Hierarchy is carried almost entirely by **size jumps** (16 → 56 → 112 → 256 px), not by weight — display is always 800.

## Colour

Four roles, no greys:

- `paper` warm pink-cream (bg), `paper-2` a step darker (tracklist band)
- `ink` deep aubergine-oxblood — all text, all borders, all shadows, nav, manifesto
- `accent` mustard — marquee, hero word fill, CTA, slabs 1 & 3, tags
- `accent-2` oxblood red — numerals, ornaments, the one coloured word in a head, hover shadow, slab 2

## Surfaces

- Corners: square. (Token sheet defines `--radius-card: 8px` but it is never applied.)
- Borders: **2 px solid ink** on everything — slabs, cards, tags, art boxes, buttons, section rules.
- Shadows: **hard offset, zero blur.** 6 px on slabs and cards, 3 px on the nav CTA (in accent-2, not ink).
- Hover: translate `-2/-3 px` and grow the shadow to 5/9 px, shadow switches to accent-2. One effect, 240 ms, expo-out.
- Image placeholders: CSS halftone (`radial-gradient` dots, 7–10 px pitch) inside a bordered square.

## Motion

- Two marquees, linear, 32 s loop, `translateX(-50%)` on a duplicated track.
- Hover lifts on CTA and cards; colour swap on buttons and links.
- No scroll reveals, no parallax, no JS animation. `prefers-reduced-motion` stops marquees and zeroes transitions.

## Layout

- Page max 78 rem, gutter `clamp(1rem, 3.5vw, 2.5rem)`. Section padding 6 rem block.
- Slab grid `12rem | 1fr | auto` (art | text | side ticket). Tracklist `1fr | 1.5fr`.
- Formats `repeat(3, minmax(0,1fr))` from 720 px.

## Weak spots we do **not** inherit

- Mobile nav overflows horizontally at 375 px (links are cut off). → we design a real mobile menu.
- Two marquees. → brief allows one.
- Middle-dot separators in every eyebrow and sub-line. → we use spacing and structure instead.
- Line-height 0.82–0.86 on uppercase heads collides when a head wraps. → we keep tight leading only on
  explicitly broken lines (hero), and ≥ 0.95 on heads that may wrap.
- Mono labels read as "record catalogue" there; on an engineering portfolio a code-mono reads as
  "developer UI". → we keep the tracked uppercase label register but set it in **DM Mono**, a quieter
  typewriter mono, used only for metadata.

## Why it works (taste notes)

1. **One weight, many sizes.** Display is always 800; hierarchy is pure scale. It keeps the page loud
   without becoming noisy.
2. **Borders are the grid.** Every box is outlined in ink, so the composition reads like a printed
   poster rather than floating UI. Shadows are offsets of the same ink — objects, not glows.
3. **Colour is assigned per section, not per element.** Each band owns a surface; accents inside a
   band are rare (a numeral, one word).
4. **Density swings.** A near-empty hero, then three heavy slabs, then a ruled list, then cards, then an
   almost-empty manifesto. The swing is the rhythm.
