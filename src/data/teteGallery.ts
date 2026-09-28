import type { GalleryShot } from '@/types';

/**
 * Tête-à-Tête product gallery. Captions/alt live in t.work.gallery.shots[id].
 *
 * PRIVACY: only sanitized derivatives go in public/img/tete/. Raw screenshots with
 * third-party customer data (names, emails, phones, booking codes, comments) stay
 * outside the repo. The ticket view is Anton's own account, published at his request.
 * Entries without `src` render as placeholders in `npm run dev` only, never in the build.
 */
export const teteGallery: GalleryShot[] = [
  {
    id: 'public',
    lang: 'fr',
    strip: true,
    src: '/img/tete/home-fr.webp',
    thumb: '/img/tete/home-fr-thumb.webp',
    width: 1280,
    height: 1000,
  },
  // Anton's own account and ticket, shown as supplied (at his request).
  {
    id: 'tickets',
    lang: 'fr',
    strip: true,
    src: '/img/tete/tickets.webp',
    thumb: '/img/tete/tickets-thumb.webp',
    width: 1084,
    height: 742,
    focus: '60% 40%',
  },
  // Full bookings/payments table; customer names, phones, emails, booking codes
  // and the personal comment are covered by solid baked-in blocks.
  {
    id: 'bookings',
    lang: 'ru',
    strip: true,
    src: '/img/tete/bookings.webp',
    thumb: '/img/tete/bookings-thumb.webp',
    width: 1600,
    height: 829,
  },
  // Scanner screen before a scan; no ticket data.
  {
    id: 'checkin',
    lang: 'ru',
    strip: true,
    src: '/img/tete/checkin.webp',
    thumb: '/img/tete/checkin-thumb.webp',
    width: 1600,
    height: 811,
  },
  // Aggregate stats + show list only; no customer data.
  {
    id: 'admin',
    lang: 'ru',
    strip: false,
    src: '/img/tete/admin.webp',
    thumb: '/img/tete/admin-thumb.webp',
    width: 1600,
    height: 811,
  },
  // Recipient count only; no addresses.
  {
    id: 'mailing',
    lang: 'ru',
    strip: false,
    src: '/img/tete/mailing.webp',
    thumb: '/img/tete/mailing-thumb.webp',
    width: 1300,
    height: 895,
  },
];
