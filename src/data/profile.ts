/**
 * About panel visuals. Each renders as a print/duotone layer with the clean
 * image fading in on hover. focus = object-position for the 16:10 (phone)
 * and 4:5 (tablet up) crops.
 */
export interface AboutVisual {
  src: string;
  width: number;
  height: number;
  focus: string;
}

export const aboutVisuals: Record<'portrait' | 'product' | 'tooling', AboutVisual> = {
  // 01 Profile — supplied portrait (2026-09).
  portrait: { src: '/img/portrait.webp', width: 1280, height: 853, focus: '48% 32%' },
  // 02 Product work — Anton's own ticket in the Tête-à-Tête customer account
  // (ticket stub + QR card), set on the modal's dark background at 4:5.
  product: { src: '/img/about/product-ticket.webp', width: 676, height: 845, focus: '50% 50%' },
  // 03 Direction — editor view of a practice exercise prepared by my skill:
  // task, types, starter data and tests written; the function body left to me.
  tooling: { src: '/img/about/direction-editor.webp', width: 1000, height: 1250, focus: '35% 20%' },
};
