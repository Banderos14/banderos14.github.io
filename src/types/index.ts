export interface Project {
  year: number;
  role: string;
  name: string;
  tags: string[];
  desc: string;
  live: string;
  github: string;
  screenshot?: string; // path relative to public/, e.g. '/img/theatre.png'
}

export type Theme = 'dark' | 'light';
