import type { Capability } from '@/types';

/** What I build, each row pointing at the project where it runs. */
export const capabilities: Capability[] = [
  { id: 'interfaces', proof: 'nice_gadgets' },
  { id: 'booking', proof: 'tete_a_tete' },
  { id: 'admin', proof: 'tete_a_tete' },
  { id: 'auth', proof: 'tete_a_tete' },
  { id: 'multilingual', proof: 'portfolio' },
  // Custom AI skills are private tooling — no public repo to link.
  { id: 'tooling' },
];
