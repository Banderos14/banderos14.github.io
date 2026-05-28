export interface Project {
  year: number;
  name: string;
  tags: string[];
  desc: string;
  live: string;
  github: string;
}

export type Theme = 'dark' | 'light';
