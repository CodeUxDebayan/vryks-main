// ─── VRYKS Project Data ───────────────────────────────────────────────────────

export interface Project {
  id: string;
  index: string;
  name: string;
  category: string;
  tags: string[];
  year: string;
  description: string;
  accent: string;
}

export const projects: Project[] = [
  {
    id: 'nova',
    index: '01',
    name: 'NOVA',
    category: 'CULTURE',
    tags: ['Brand Identity', 'Digital Experience', 'Motion'],
    year: '2026',
    description:
      'A cultural platform built around the mathematics of memory. Every interaction is a deliberate choreography.',
    accent: '#eaff00',
  },
  {
    id: 'arc',
    index: '02',
    name: 'ARC',
    category: 'COMMERCE',
    tags: ['Strategy', 'UX Architecture', 'Technology'],
    year: '2025',
    description:
      'Commerce infrastructure that moves at the speed of human attention. Friction eliminated. Conversion elevated.',
    accent: '#6d35ff',
  },
  {
    id: 'noir',
    index: '03',
    name: 'NOIR',
    category: 'TECHNOLOGY',
    tags: ['Product Design', 'Systems Thinking', 'Dev'],
    year: '2025',
    description:
      'A product for the dark side of productivity. Engineered for focus in a world optimized for distraction.',
    accent: '#9b5cff',
  },
  {
    id: 'velo',
    index: '04',
    name: 'VELO',
    category: 'MOBILITY',
    tags: ['Brand', 'App Design', 'Content'],
    year: '2024',
    description:
      'Urban mobility reimagined as a sensory ritual. Speed as aesthetic. Movement as identity.',
    accent: '#ff6b1a',
  },
];

