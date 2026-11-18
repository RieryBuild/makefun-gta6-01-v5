// Seeded randomness for PUERTO DEL SOL. Every random choice in world
// generation goes through here so a fixed seed builds the same city on
// every load — the screenshots and the play-test both depend on it.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Small deterministic hash of a string, for per-position variation that
// must not depend on generation order (facade lit windows, prop choice).
export function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export class Rng {
  constructor(seed) {
    this.next = mulberry32(seed);
    this.seed = seed >>> 0;
  }
  range(a, b) { return a + (b - a) * this.next(); }
  int(a, b) { return Math.floor(this.range(a, b + 1)); }
  pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
  chance(p) { return this.next() < p; }
  // A child stream keyed by a label, so reordering callers never shifts
  // another system's draws.
  fork(label) { return new Rng(hashStr(label) ^ this.seed); }
}

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
export const TAU = Math.PI * 2;

// Angle helpers: shortest-arc difference and a damped turn toward a target.
export function angDiff(a, b) {
  let d = (b - a) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}
export function turnToward(a, b, maxStep) {
  // A non-finite target (e.g. a camera yaw read before the first
  // update) must never poison the heading: NaN spreads through every
  // rotation it touches and the mesh stops rendering entirely.
  if (!Number.isFinite(a) || !Number.isFinite(b)) return a;
  const d = angDiff(a, b);
  return a + clamp(d, -maxStep, maxStep);
}
