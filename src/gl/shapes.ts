/**
 * Formes du nuage de particules : une par page.
 * Chaque générateur renvoie N positions (x, y, z) dans un volume d'environ ±1,7.
 */
export type ShapeId = 'noise' | 'globe' | 'orbits' | 'vinyl' | 'bars' | 'line' | 'network' | 'pulse';

/** Générateur pseudo-aléatoire déterministe : la même forme à chaque visite. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;

type Gen = (i: number, r: () => number, out: Float32Array, o: number) => void;

const gauss = (r: () => number): number => (r() + r() + r() + r() - 2) / 2;

const generators: Record<ShapeId, Gen> = {
  // Le bruit : état de départ, avant le signal.
  noise: (_i, r, out, o) => {
    out[o] = (r() - 0.5) * 6;
    out[o + 1] = (r() - 0.5) * 4;
    out[o + 2] = (r() - 0.5) * 4;
  },

  // Accueil : globe filaire, méridiens et parallèles.
  globe: (_i, r, out, o) => {
    const R = 1.55;
    let lat: number;
    let lon: number;
    if (r() < 0.5) {
      lat = ((Math.floor(r() * 13) + 1) / 14) * Math.PI - Math.PI / 2;
      lon = r() * TAU;
    } else {
      lon = (Math.floor(r() * 22) / 22) * TAU;
      lat = r() * Math.PI - Math.PI / 2;
    }
    out[o] = R * Math.cos(lat) * Math.cos(lon);
    out[o + 1] = R * Math.sin(lat);
    out[o + 2] = R * Math.cos(lat) * Math.sin(lon);
  },

  // À propos : des orbites autour d'un noyau.
  orbits: (_i, r, out, o) => {
    if (r() < 0.14) {
      const rad = Math.cbrt(r()) * 0.3;
      const th = r() * TAU;
      const ph = Math.acos(2 * r() - 1);
      out[o] = rad * Math.sin(ph) * Math.cos(th);
      out[o + 1] = rad * Math.sin(ph) * Math.sin(th);
      out[o + 2] = rad * Math.cos(ph);
      return;
    }
    const k = Math.floor(r() * 5);
    const rad = 0.7 + k * 0.24;
    const a = r() * TAU;
    const tiltX = [0.3, 1.1, -0.7, 1.9, -1.4][k];
    const tiltZ = [0.2, -0.5, 0.9, 0.4, -1.0][k];
    const x = Math.cos(a) * rad;
    const y = Math.sin(a) * rad * 0.82;
    const z = (r() - 0.5) * 0.015;
    const y1 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
    const z1 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
    out[o] = x * Math.cos(tiltZ) - y1 * Math.sin(tiltZ);
    out[o + 1] = x * Math.sin(tiltZ) + y1 * Math.cos(tiltZ);
    out[o + 2] = z1;
  },

  // Projets : un disque vinyle, sillons et étiquette centrale.
  vinyl: (_i, r, out, o) => {
    let rad: number;
    const u = r();
    if (u < 0.16) rad = 0.1 + r() * 0.36;
    else rad = 0.58 + (Math.floor(r() * 34) / 34) * 1.1 + (r() - 0.5) * 0.004;
    const a = r() * TAU;
    const x = Math.cos(a) * rad;
    const y = Math.sin(a) * rad;
    const tilt = -1.02;
    out[o] = x;
    out[o + 1] = y * Math.cos(tilt);
    out[o + 2] = y * Math.sin(tilt);
  },

  // Playlists : un égaliseur en volume.
  bars: (_i, r, out, o) => {
    const cols = 11;
    const rows = 5;
    const c = Math.floor(r() * cols);
    const d = Math.floor(r() * rows);
    const h = 0.35 + 1.9 * Math.abs(Math.sin(c * 1.7 + d * 2.3) * Math.cos(c * 0.6 - d * 1.1));
    const y = Math.floor(r() * h * 16) / 16;
    out[o] = (c - (cols - 1) / 2) * 0.3 + (r() < 0.5 ? -0.06 : 0.06);
    out[o + 1] = y - 0.95;
    out[o + 2] = (d - (rows - 1) / 2) * 0.34 + (r() < 0.5 ? -0.06 : 0.06);
  },

  // No Line : une ligne nette qui se défait.
  line: (_i, r, out, o) => {
    const x = (r() - 0.5) * 4.2;
    const s = Math.pow(Math.max(0, (x + 0.6) / 2.7), 2.2);
    out[o] = x + gauss(r) * s * 0.3;
    out[o + 1] = gauss(r) * (0.006 + s * 1.5);
    out[o + 2] = gauss(r) * (0.006 + s * 1.5);
  },

  // Événements : des points de rencontre reliés entre eux.
  network: (() => {
    const nr = rng(77);
    const nodes: number[][] = [];
    for (let n = 0; n < 8; n++) {
      const th = nr() * TAU;
      const ph = Math.acos(2 * nr() - 1);
      const rad = 0.9 + nr() * 0.75;
      nodes.push([rad * Math.sin(ph) * Math.cos(th), rad * Math.cos(ph) * 0.8, rad * Math.sin(ph) * Math.sin(th)]);
    }
    const edges: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [0, 3], [1, 5], [2, 6], [4, 7]];
    return (_i: number, r: () => number, out: Float32Array, o: number) => {
      if (r() < 0.38) {
        const n = nodes[Math.floor(r() * nodes.length)];
        const rad = Math.cbrt(r()) * 0.13;
        const th = r() * TAU;
        const ph = Math.acos(2 * r() - 1);
        out[o] = n[0] + rad * Math.sin(ph) * Math.cos(th);
        out[o + 1] = n[1] + rad * Math.cos(ph);
        out[o + 2] = n[2] + rad * Math.sin(ph) * Math.sin(th);
      } else {
        const [a, b] = edges[Math.floor(r() * edges.length)];
        const k = r();
        out[o] = nodes[a][0] + (nodes[b][0] - nodes[a][0]) * k;
        out[o + 1] = nodes[a][1] + (nodes[b][1] - nodes[a][1]) * k;
        out[o + 2] = nodes[a][2] + (nodes[b][2] - nodes[a][2]) * k;
      }
    };
  })(),

  // Contact : une onde qui part d'un point.
  pulse: (_i, r, out, o) => {
    const ring = Math.floor(r() * 7);
    const a = r() * TAU;
    const rad = 0.22 + ring * 0.23 + 0.05 * Math.sin(a * (3 + ring)) * (ring / 6);
    const tilt = -0.5;
    const x = Math.cos(a) * rad;
    const y = Math.sin(a) * rad;
    out[o] = x;
    out[o + 1] = y * Math.cos(tilt);
    out[o + 2] = y * Math.sin(tilt);
  },
};

export function buildShape(id: ShapeId, count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const r = rng(id.length * 9973 + id.charCodeAt(0) * 131 + count);
  const gen = generators[id];
  for (let i = 0; i < count; i++) gen(i, r, out, i * 3);
  return out;
}
