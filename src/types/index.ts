export type ProjectStatus = 'production' | 'live' | 'concept';

export interface Project {
  /** Key into translation files — t.projects[slug] holds name/role/desc */
  slug: string;
  year: number;
  status: ProjectStatus;
  tags: string[];
  live?: string;
  github?: string;
  screenshot?: string;
  /** Intrinsic screenshot size, reserves space before load. Default 1600×900. */
  shotSize?: [number, number];
  /** object-position for the screenshot crop, e.g. '50% 0%' */
  focus?: string;
  /** Product screenshots shown under the featured card and in the lightbox */
  gallery?: GalleryShot[];
  /** Not rendered anywhere. Keeps future entries in data until they are ready. */
  hidden?: boolean;
  /** What is still missing for a hidden entry */
  todo?: string[];
}

/** One row of the capabilities index. Copy lives in t.capabilities.items[id]. */
export interface Capability {
  id: string;
  /** Project that demonstrates it — must exist in projects.ts. Omit for personal tooling. */
  proof?: string;
}

export interface GalleryShot {
  /** Key into t.work.gallery.shots */
  id: string;
  /** Language of the UI captured in the screenshot */
  lang: 'fr' | 'ru' | 'en';
  /** Shown in the compact strip (max 4); the rest only in the lightbox */
  strip: boolean;
  /** Sanitized image. Missing = waiting for a screenshot (dev placeholder only). */
  src?: string;
  thumb?: string;
  width?: number;
  height?: number;
  /** object-position for the 16:10 thumbnail crop */
  focus?: string;
}
