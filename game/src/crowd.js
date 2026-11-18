// The crowd — pedestrians with purpose. Peds walk the SIDEWALKS (never
// the road), in four palette families with varied heights, hair, and
// gaits; some stand talking in pairs, some walk on the phone. When
// gunfire or a police chase erupts nearby, they flee — some with their
// arms up. Density is the GTA street-life rule: the chase frame needs
// >=6 visible peds, the city frame >=8 on the sidewalks.

import { AVENUES, STREETS, WORLD, onRoad } from './cityplan.js';
import { PED_FAMILIES } from './cast.js';
import { buildHumanoid, setPose } from './humanoid.js';
import { Rng, clamp, turnToward } from './rng.js';

const WALK_LINES = [];
for (const ax of AVENUES) {
  WALK_LINES.push({ axis: 'z', at: ax - 7 });
  WALK_LINES.push({ axis: 'z', at: ax + 7 });
}
for (const sz of STREETS) {
  WALK_LINES.push({ axis: 'x', at: sz - 7 });
  WALK_LINES.push({ axis: 'x', at: sz + 7 });
}

export class Crowd {
  constructor(scene, rng) {
    this.scene = scene;
    this.rng = rng.fork('crowd');
    this.peds = [];
    this.group = new THREE.Group();
    this.group.name = 'crowd';
    scene.add(this.group);
    this.alarm = null; // {x, z, t} — a gunfire/chase event peds flee from
  }

  makePedSpec() {
    const rng = this.rng;
    const fam = rng.pick(PED_FAMILIES);
    const skin = rng.pick(fam.skins);
    const hairStyle = rng.pick(fam.hairStyles);
    return {
      skin, hairColor: rng.pick([0x1c1410, 0x4a2e1c, 0xd8a84e, 0x7a3a1e, 0x9a9a9a]),
      hairStyle, jacket: fam.jacket, shirt: fam.shirt, pants: fam.pants,
      shoes: fam.shoes, scale: rng.range(0.94, 1.06),
      face: {
        eyeColor: 0x2a1a10, browColor: 0x1c1410, lipColor: 0x8a5a4a,
        expression: rng.pick(['calm', 'calm', 'smile']),
      },
      sleeves: rng.chance(0.5) ? 'short' : 'long',
    };
  }

  spawn(count, near) {
    for (let i = 0; i < count; i++) this.addPed(near);
  }

  addPed(near) {
    const rng = this.rng;
    const line = rng.pick(WALK_LINES);
    let pos;
    if (near) {
      pos = line.axis === 'z'
        ? clamp(near.z + rng.range(-70, 70), WORLD.minZ + 5, WORLD.maxZ - 5)
        : clamp(near.x + rng.range(-70, 70), WORLD.minX + 5, WORLD.maxX - 5);
    } else {
      pos = line.axis === 'z' ? rng.range(WORLD.minZ, WORLD.maxZ) : rng.range(WORLD.minX, WORLD.maxX);
    }
    const mesh = buildHumanoid(this.makePedSpec());
    const mode = rng.chance(0.18) ? 'idle' : (rng.chance(0.12) ? 'phone' : 'walk');
    const ped = {
      mesh, line, pos, dir: rng.chance(0.5) ? 1 : -1,
      speed: rng.range(1.1, 1.9), phase: rng.range(0, 6.28),
      mode, idleT: rng.range(2, 9), fleeT: 0, fleeDir: 0,
    };
    this.place(ped);
    setPose(mesh, mode === 'phone' ? 'phone' : 'idle');
    this.group.add(mesh);
    this.peds.push(ped);
    return ped;
  }

  place(ped) {
    if (ped.line.axis === 'z') ped.mesh.position.set(ped.line.at, 0, ped.pos);
    else ped.mesh.position.set(ped.pos, 0, ped.line.at);
  }

  headingFor(ped) {
    if (ped.line.axis === 'z') return ped.dir > 0 ? 0 : Math.PI;
    return ped.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
  }

  // Raise an alarm peds flee from (gunfire, a chase passing by).
  raiseAlarm(x, z) {
    this.alarm = { x, z, t: 6 };
  }

  update(dt, playerPos) {
    const rng = this.rng;
    if (this.alarm) {
      this.alarm.t -= dt;
      if (this.alarm.t <= 0) this.alarm = null;
    }
    for (const ped of this.peds) {
      const p = ped.mesh.position;
      // Flee: if the alarm is close, run away from it, arms up for some.
      if (this.alarm) {
        const dx = p.x - this.alarm.x, dz = p.z - this.alarm.z;
        const d2 = dx * dx + dz * dz;
        if (d2 < 900 && ped.fleeT <= 0) {
          ped.fleeT = rng.range(2.5, 5);
          ped.fleeDir = Math.atan2(dx, dz);
          ped.armsUp = rng.chance(0.4);
        }
      }
      if (ped.fleeT > 0) {
        ped.fleeT -= dt;
        ped.phase += dt * 11;
        p.x += Math.sin(ped.fleeDir) * 4.4 * dt;
        p.z += Math.cos(ped.fleeDir) * 4.4 * dt;
        ped.mesh.rotation.y = turnToward(ped.mesh.rotation.y, ped.fleeDir, 6 * dt);
        setPose(ped.mesh, ped.armsUp ? 'flee' : 'run', ped.phase);
        // Don't run into the water or off the map.
        p.x = clamp(p.x, WORLD.minX + 2, WORLD.maxX - 2);
        p.z = clamp(p.z, WORLD.minZ + 2, WORLD.waterZ - 3);
        continue;
      }
      if (ped.mode === 'walk') {
        ped.phase += dt * (4.4 * ped.speed);
        ped.pos += ped.dir * ped.speed * dt;
        const limit = ped.line.axis === 'z' ? WORLD.maxZ - 4 : WORLD.maxX - 4;
        const minL = ped.line.axis === 'z' ? WORLD.minZ + 4 : WORLD.minX + 4;
        if (ped.pos > limit || ped.pos < minL) ped.dir *= -1;
        // At an intersection, sometimes turn onto the crossing walk.
        const lines = ped.line.axis === 'z' ? STREETS : AVENUES;
        for (const line of lines) {
          if (Math.abs(ped.pos - line) < 0.8 && rng.chance(0.008)) {
            const side = rng.chance(0.5) ? 7 : -7;
            ped.line = ped.line.axis === 'z'
              ? { axis: 'x', at: line + side }
              : { axis: 'z', at: line + side };
            ped.pos = ped.line.axis === 'z' ? p.z : p.x;
            ped.dir = rng.chance(0.5) ? 1 : -1;
            break;
          }
        }
        this.place(ped);
        ped.mesh.rotation.y = turnToward(ped.mesh.rotation.y, this.headingFor(ped), 8 * dt);
        setPose(ped.mesh, 'walk', ped.phase);
      } else if (ped.mode === 'phone') {
        ped.idleT -= dt;
        setPose(ped.mesh, 'phone', ped.phase);
        if (ped.idleT <= 0) { ped.mode = 'walk'; ped.idleT = rng.range(4, 10); }
      } else { // idle: stand, breathe, sometimes start walking
        ped.idleT -= dt;
        ped.phase += dt;
        setPose(ped.mesh, 'idle', ped.phase);
        if (ped.idleT <= 0) { ped.mode = 'walk'; }
      }
      // Recycle peds that drifted far from the player.
      if (playerPos) {
        const d = Math.hypot(p.x - playerPos.x, p.z - playerPos.z);
        if (d > 170) {
          const line = rng.pick(WALK_LINES);
          ped.line = line;
          ped.pos = line.axis === 'z'
            ? clamp(playerPos.z + rng.range(-60, 60), WORLD.minZ + 5, WORLD.maxZ - 5)
            : clamp(playerPos.x + rng.range(-60, 60), WORLD.minX + 5, WORLD.maxX - 5);
          ped.mode = 'walk';
          this.place(ped);
        }
      }
    }
  }

  // How many peds are visible within a radius (for the density check).
  countNear(x, z, r) {
    let n = 0;
    for (const ped of this.peds) {
      const p = ped.mesh.position;
      if (Math.hypot(p.x - x, p.z - z) < r) n++;
    }
    return n;
  }
}
