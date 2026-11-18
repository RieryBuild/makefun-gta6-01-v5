// Progression — REP ranks with names, skills, collectibles, stats, and
// the completion percentage the map screen shows. REP is the GTA V
// "special ability" bar's slot on the HUD (a bare yellow bar); the rank
// NAME lives only on the map screen and the mission-passed card.

export const REP_RANKS = [
  { at: 0, name: 'OUTSIDER' },
  { at: 300, name: 'RUNNER' },
  { at: 800, name: 'WHEELWOMAN' },
  { at: 1600, name: 'STREET NAME' },
  { at: 3000, name: 'DEL SOL NAME' },
  { at: 5000, name: 'SOL LEGEND' },
];

export function rankFor(rep) {
  let rank = REP_RANKS[0];
  for (const r of REP_RANKS) if (rep >= r.at) rank = r;
  return rank;
}

export function nextRank(rep) {
  for (const r of REP_RANKS) if (rep < r.at) return r;
  return null;
}

// Sun Shells: 24 glowing shells hidden across the beach + the city.
// Positions are fixed (seeded layout, hand-tuned spread).
export const SHELL_SPOTS = [
  [-180, 176], [-150, 180], [-120, 174], [-90, 180], [-60, 176], [-30, 180],
  [0, 174], [30, 180], [60, 176], [90, 180], [120, 174], [150, 180], [180, 176],
  [-160, -60], [-160, 60], [-100, -140], [-40, 100], [0, -140], [40, -20],
  [80, 100], [120, -140], [160, 20], [180, 60], [20, 176],
];

export const STASH_SPOTS = [
  { x: -160, z: -120, name: 'Dock stash' },
  { x: 100, z: -100, name: 'Tower stash' },
  { x: -20, z: 164, name: 'Pier stash' },
  { x: 180, z: 140, name: 'Marina stash' },
  { x: -80, z: 140, name: 'Beach stash' },
];

export const RACE_ROUTES = [
  { id: 'race-beach', name: 'Beachfront Dash', checkpoints: [[-160, 152], [-80, 152], [0, 152], [80, 152], [160, 140]], time: 120 },
  { id: 'race-docks', name: 'Dockyard Loop', checkpoints: [[-160, -120], [-160, 60], [-80, 100], [-80, -60], [-160, -120]], time: 150 },
  { id: 'race-downtown', name: 'Centro Sprint', checkpoints: [[40, -140], [120, -140], [160, -60], [120, 20], [40, -20]], time: 150 },
];

export const STUNT_JUMPS = [
  { x: -40, z: -20, name: 'Market leap' },
  { x: 80, z: 60, name: 'Marina launch' },
  { x: -120, z: 100, name: 'Dock flyer' },
  { x: 0, z: 152, name: 'Boardwalk jump' },
  { x: 160, z: -100, name: 'Tower drop' },
  { x: -80, z: -140, name: 'Hills hop' },
];

export class Growth {
  constructor() {
    this.cash = 1200;
    this.rep = 0;
    this.skills = { driving: 1, shooting: 1, stamina: 2 }; // 0–5 pips
    this.shells = new Set();
    this.stashes = new Set();
    this.racesWon = new Set();
    this.stuntsDone = new Set();
    this.stats = {
      carsStolen: 0, copsLost: 0, enemiesDown: 0,
      playTime: 0, missionsDone: 0, shotsFired: 0, shotsHit: 0,
    };
    this.unlocked = new Set(['fists', 'pistol']);
    this.onRepGain = null;
    this.onRankUp = null;
  }

  get rank() { return rankFor(this.rep); }

  addRep(n) {
    const before = this.rank.name;
    this.rep += n;
    if (this.onRepGain) this.onRepGain(n, this.rep);
    if (this.rank.name !== before && this.onRankUp) this.onRankUp(this.rank);
  }

  addCash(n) { this.cash += n; }

  completion(missionsDone) {
    const m = (missionsDone / 8) * 60;
    const s = (this.shells.size / SHELL_SPOTS.length) * 20;
    const st = (this.stashes.size / STASH_SPOTS.length) * 10;
    const r = (this.racesWon.size / RACE_ROUTES.length) * 10;
    return Math.min(100, Math.round(m + s + st + r));
  }

  // Skill growth: driving by distance at speed, shooting by hits.
  noteDriving(dt, speed) {
    if (speed > 20) this._grow('driving', dt * 0.004);
  }
  noteHit() { this._grow('shooting', 0.06); }
  noteSprint(dt) { this._grow('stamina', dt * 0.002); }
  _grow(skill, n) {
    this.skills[skill] = Math.min(5, this.skills[skill] + n);
  }

  serialize() {
    return {
      cash: this.cash, rep: this.rep, skills: this.skills,
      shells: [...this.shells], stashes: [...this.stashes],
      racesWon: [...this.racesWon], stuntsDone: [...this.stuntsDone],
      stats: this.stats, unlocked: [...this.unlocked],
    };
  }

  restore(d) {
    if (!d) return;
    this.cash = d.cash ?? 1200;
    this.rep = d.rep ?? 0;
    this.skills = { ...this.skills, ...(d.skills || {}) };
    this.shells = new Set(d.shells || []);
    this.stashes = new Set(d.stashes || []);
    this.racesWon = new Set(d.racesWon || []);
    this.stuntsDone = new Set(d.stuntsDone || []);
    this.stats = { ...this.stats, ...(d.stats || {}) };
    this.unlocked = new Set(d.unlocked || ['fists', 'pistol']);
  }
}
