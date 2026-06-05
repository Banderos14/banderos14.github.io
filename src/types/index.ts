export interface Project {
  /** Key into translation files — t.projects[slug] holds name/role/desc */
  slug: string;
  year: number;
  tags: string[];
  live: string;
  github: string;
  screenshot?: string;
  activelyDeveloped?: boolean;
}

export type Theme = 'dark' | 'light';
