import type { Look } from './gl/scene';

export const routeIds = ['home', 'about', 'projects', 'playlists', 'no-line', 'events', 'contact'] as const;
export type RouteId = (typeof routeIds)[number];

const VOID = '#03040a';
const BONE = '#ece8dd';

/** Forme et palette de la scène 3D pour chaque page. */
export const looks: Record<RouteId, Look> = {
  home: { shape: 'globe', bg: VOID, ink: BONE, accent: '#1a2fff', accent2: '#ff7a1f', tilt: 0.28 },
  about: { shape: 'orbits', bg: VOID, ink: BONE, accent: '#a83c08', accent2: '#ffb04a', tilt: 0.2 },
  projects: { shape: 'vinyl', bg: VOID, ink: BONE, accent: '#1a2fff', accent2: '#aab6ff', tilt: 0.1 },
  playlists: { shape: 'bars', bg: VOID, ink: BONE, accent: '#a83c08', accent2: '#ffb04a', tilt: 0.32 },
  'no-line': { shape: 'line', bg: '#12030a', ink: BONE, accent: '#6d0f1c', accent2: '#f1dcc0', tilt: 0.12 },
  events: { shape: 'network', bg: VOID, ink: BONE, accent: '#1a2fff', accent2: '#ff7a1f', tilt: 0.2 },
  contact: { shape: 'pulse', bg: VOID, ink: BONE, accent: '#1a2fff', accent2: '#ece8dd', tilt: 0.3 },
};

export function parseRoute(hash: string): RouteId {
  const id = hash.replace(/^#/, '');
  return (routeIds as readonly string[]).includes(id) ? (id as RouteId) : 'home';
}
