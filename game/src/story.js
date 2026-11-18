// The story — 8 named missions with stages, plus side jobs. This is
// criterion 2 (depth and fun): v4 had 3 missions, the top 5 show 6–12.
// Each mission pays exact cash + REP and unlocks something; stages are
// typed (goto / steal / kill / escape / race / defend) and the stage
// machine drives the mission marker, the objective line, and the
// MISSION PASSED card. Side jobs (taxi, races, stunts) and collectibles
// (Sun Shells, stashes) live in growth.js.

import { poiById } from './cityplan.js';

export const MISSIONS = [
  {
    id: 'first-light', num: 1, name: 'FIRST LIGHT', giver: 'teo',
    brief: 'Teo needs his driver back. Meet him at the garage, then bring the Solstice home.',
    cash: 800, rep: 100, unlock: 'Pistol',
    stages: [
      { type: 'goto', text: 'Meet Teo at the garage', poi: 'garage' },
      { type: 'goto', text: 'Drive the Solstice to the safehouse', poi: 'safehouse' },
    ],
  },
  {
    id: 'borrowed-wheels', num: 2, name: 'BORROWED WHEELS', giver: 'teo',
    brief: 'The garage needs stock. Steal any car off the street and bring it to Teo.',
    cash: 1200, rep: 150, unlock: 'SMG',
    stages: [
      { type: 'steal', text: 'Steal a car' },
      { type: 'deliver', text: 'Deliver it to Teo\u2019s garage', poi: 'garage' },
    ],
  },
  {
    id: 'dockside', num: 3, name: 'DOCKSIDE', giver: 'ines',
    brief: 'Venn\u2019s crew is leaning on the dockworkers. Clear them out of the warehouse.',
    cash: 2500, rep: 250, unlock: 'Rifle',
    stages: [
      { type: 'goto', text: 'Reach the Venn warehouse', poi: 'warehouse' },
      { type: 'kill', text: 'Clear Venn\u2019s crew', poi: 'warehouse', count: 4 },
    ],
  },
  {
    id: 'long-way-home', num: 4, name: 'THE LONG WAY HOME', giver: 'ines',
    brief: 'The PSPD is all over the docks job. Lose the heat, then get home.',
    cash: 3000, rep: 300, unlock: 'Respray discount',
    stages: [
      { type: 'escape', text: 'Lose the cops', wanted: 3 },
      { type: 'goto', text: 'Reach the safehouse', poi: 'safehouse' },
    ],
  },
  {
    id: 'night-market', num: 5, name: 'NIGHT MARKET', giver: 'teo',
    brief: 'Venn\u2019s boys are shaking down the market stalls. Drive them out.',
    cash: 4000, rep: 400, unlock: 'Armour',
    stages: [
      { type: 'goto', text: 'Reach Mercado Central', poi: 'market' },
      { type: 'kill', text: 'Drive the crew out of the market', poi: 'market', count: 5 },
    ],
  },
  {
    id: 'sunset-strip', num: 6, name: 'SUNSET STRIP', giver: 'ines',
    brief: 'A buyer waits at the marina with Venn\u2019s ledger. Run the beachfront — the PSPD will run you.',
    cash: 5000, rep: 500, unlock: 'Solstice GT tune',
    stages: [
      { type: 'race', text: 'Run the beachfront checkpoints', time: 150, checkpoints: [
        { x: -120, z: 152 }, { x: -40, z: 152 }, { x: 40, z: 152 }, { x: 120, z: 140 },
      ] },
      { type: 'goto', text: 'Reach the marina', poi: 'marina' },
    ],
  },
  {
    id: 'kings-gambit', num: 7, name: 'KING\u2019S GAMBIT', giver: 'ines',
    brief: 'Venn\u2019s lieutenants run the docks from the warehouse. Take the building.',
    cash: 8000, rep: 700, unlock: 'Safehouse garage',
    stages: [
      { type: 'goto', text: 'Reach the Venn warehouse', poi: 'warehouse' },
      { type: 'kill', text: 'Take down the lieutenants', poi: 'warehouse', count: 6, lieutenant: true },
    ],
  },
  {
    id: 'solstice', num: 8, name: 'SOLSTICE', giver: 'venn',
    brief: 'Venn himself, at the warehouse. End the debt — then outrun the whole department.',
    cash: 15000, rep: 1000, unlock: 'SOL LEGEND',
    stages: [
      { type: 'goto', text: 'Reach the Venn warehouse', poi: 'warehouse' },
      { type: 'kill', text: 'Take down Venn\u2019s guards', poi: 'warehouse', count: 4 },
      { type: 'kill', text: 'Confront Dario Venn', poi: 'warehouse', count: 1, boss: true },
      { type: 'escape', text: 'Outrun the dragnet', wanted: 4 },
      { type: 'goto', text: 'Reach the safehouse', poi: 'safehouse' },
    ],
  },
];

export const SIDE_JOBS = [
  { id: 'taxi', name: 'Taxi Fares', desc: 'Pick up riders, drop them fast.', pay: 150 },
  { id: 'races', name: 'Street Races', desc: 'Three routes. Beat the clock.', pay: 600 },
  { id: 'stunts', name: 'Stunt Jumps', desc: 'Six ramps across the city.', pay: 250 },
  { id: 'vigilante', name: 'Vigilante', desc: 'Take a cruiser. Chase Venn\u2019s cars.', pay: 400 },
];

// Mission marker beacon: a vertical light pillar (a cylinder with a
// vertical-gradient alpha texture — it fades at the top, so it has no
// hard edge and no rectangle). Plus a ground ring.
export function buildBeacon(color = 0xffd27a) {
  const g = new THREE.Group();
  const c = document.createElement('canvas');
  c.width = 64; c.height = 256;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 256, 0, 0);
  grad.addColorStop(0, 'rgba(255,210,122,0.55)');
  grad.addColorStop(0.6, 'rgba(255,210,122,0.18)');
  grad.addColorStop(1, 'rgba(255,210,122,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 256);
  const tex = new THREE.CanvasTexture(c);
  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.1, 26, 12, 1, true),
    new THREE.MeshBasicMaterial({
      map: tex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
    }),
  );
  pillar.position.y = 13;
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.6, 2.2, 24),
    new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.8, depthWrite: false,
      side: THREE.DoubleSide, fog: false,
    }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.12;
  g.add(pillar, ring);
  g.userData.ring = ring;
  return g;
}

export class Story {
  constructor() {
    this.done = new Set();       // completed mission ids
    this.current = null;         // active mission object
    this.stageIdx = 0;
    this.stageState = null;      // per-stage runtime state
    this.raceT = 0;
    this.killsLeft = 0;
    this.hooks = {};             // wired by game.js
  }

  get nextMission() {
    return MISSIONS.find((m) => !this.done.has(m.id)) || null;
  }

  get currentStage() {
    if (!this.current) return null;
    return this.current.stages[this.stageIdx] || null;
  }

  // The stage's target point (for the marker + radar + GPS).
  stageTarget() {
    const s = this.currentStage;
    if (!s) return null;
    if (s.poi) {
      const p = poiById(s.poi);
      return { x: p.x, z: p.z, name: p.name };
    }
    if (s.checkpoints) {
      const cp = s.checkpoints[this.stageState?.cp || 0];
      return cp ? { x: cp.x, z: cp.z, name: 'Checkpoint' } : null;
    }
    return null;
  }

  start(mission) {
    this.current = mission;
    this.stageIdx = 0;
    this.beginStage();
    if (this.hooks.onMissionStart) this.hooks.onMissionStart(mission);
  }

  beginStage() {
    const s = this.currentStage;
    this.stageState = { cp: 0 };
    if (!s) return;
    if (s.type === 'kill') {
      this.killsLeft = s.count;
      if (this.hooks.spawnEnemies) this.hooks.spawnEnemies(s);
    }
    if (s.type === 'escape') {
      if (this.hooks.setWanted) this.hooks.setWanted(s.wanted);
    }
    if (s.type === 'race') {
      this.raceT = s.time;
    }
    if (this.hooks.onStage) this.hooks.onStage(this.current, s, this.stageIdx);
  }

  completeStage() {
    this.stageIdx++;
    if (this.stageIdx >= this.current.stages.length) {
      this.completeMission();
    } else {
      this.beginStage();
    }
  }

  completeMission() {
    const m = this.current;
    this.done.add(m.id);
    this.current = null;
    this.stageIdx = 0;
    if (this.hooks.onMissionPassed) this.hooks.onMissionPassed(m);
  }

  fail(reason) {
    const m = this.current;
    this.current = null;
    this.stageIdx = 0;
    if (this.hooks.onMissionFailed) this.hooks.onMissionFailed(m, reason);
  }

  onEnemyKilled() {
    const s = this.currentStage;
    if (!s || s.type !== 'kill') return;
    this.killsLeft--;
    if (this.hooks.onKillProgress) this.hooks.onKillProgress(this.killsLeft);
    if (this.killsLeft <= 0) this.completeStage();
  }

  onCarStolen() {
    const s = this.currentStage;
    if (s && s.type === 'steal') this.completeStage();
  }

  // Per-frame stage checks: goto/deliver arrival, escape, race timer.
  update(dt, ctx) {
    const s = this.currentStage;
    if (!s) return;
    const { playerPos, wanted, driving } = ctx;
    if (s.type === 'goto' || s.type === 'deliver') {
      const t = this.stageTarget();
      if (t && Math.hypot(playerPos.x - t.x, playerPos.z - t.z) < 7) {
        if (s.type === 'deliver' && !driving) return; // must arrive IN the car
        this.completeStage();
      }
    } else if (s.type === 'escape') {
      if (wanted === 0) this.completeStage();
    } else if (s.type === 'race') {
      this.raceT -= dt;
      if (this.raceT <= 0) { this.fail('time'); return; }
      const t = this.stageTarget();
      if (t && Math.hypot(playerPos.x - t.x, playerPos.z - t.z) < 10) {
        this.stageState.cp++;
        if (this.hooks.onCheckpoint) this.hooks.onCheckpoint(this.stageState.cp, s.checkpoints.length);
        if (this.stageState.cp >= s.checkpoints.length) this.completeStage();
      }
    }
  }
}
