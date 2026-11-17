import type { GalleryShot } from '@/types';

/**
 * BearlyCopy product gallery. Captions/alt live in t.work.gallery.shots[id].
 *
 * Every screenshot uses demo data ("acme-web", a dark-mode task); no real
 * sessions, projects or prompts. Source images: the BearlyCopy repo,
 * docs/images/readme, with the baked-in captions cropped off.
 */
export const bearlyGallery: GalleryShot[] = [
  { id: 'bc_peek', lang: 'en', strip: true, src: '/img/bearlycopy/peek.webp', thumb: '/img/bearlycopy/peek-thumb.webp', width: 1200, height: 420 },
  { id: 'bc_details', lang: 'en', strip: true, src: '/img/bearlycopy/details.webp', thumb: '/img/bearlycopy/details-thumb.webp', width: 1440, height: 1060, focus: '50% 0%' },
  { id: 'bc_context', lang: 'en', strip: true, src: '/img/bearlycopy/context.webp', thumb: '/img/bearlycopy/context-thumb.webp', width: 1440, height: 880, focus: '50% 0%' },
  { id: 'bc_attach', lang: 'en', strip: true, src: '/img/bearlycopy/attach.webp', thumb: '/img/bearlycopy/attach-thumb.webp', width: 1440, height: 880, focus: '50% 0%' },
  { id: 'bc_flow', lang: 'en', strip: false, src: '/img/bearlycopy/flow.webp', thumb: '/img/bearlycopy/flow-thumb.webp', width: 1200, height: 380 },
  { id: 'bc_bear', lang: 'en', strip: false, src: '/img/bearlycopy/bear.webp', thumb: '/img/bearlycopy/bear-thumb.webp', width: 1408, height: 488 },
];
