// Traffic — the moving city. Cars follow the road grid: each one picks
// an avenue or a street, drives its length, and at an intersection
// either continues or turns onto the crossing road. Right-hand traffic
// (a US-style city): the lane offset follows the direction of travel.
// Cars ahead slow the one behind; nothing pathfinds around the player
// — the player is just another obstacle, and a hit shoves the car.
//
// Parked cars line BOTH curbs in the parking lane (on the road's edge,
// never in the driving lanes) — the cheapest street density there is.

import { AVENUES, STREETS, WORLD } from './cityplan.js';
import { buildCar, driveWheels } from './vehicles.js';
import { Rng, clamp, turnToward } from './rng.js';

const TRAFFIC_COLORS = [0x4a6a8a, 0x8a4a4a, 0x5a7a5a, 0xc8c8c8, 0x2a2a2e, 0x7a6a9a, 0xd8a84e, 0x3a8a7a];
const TRAFFIC_CLASSES = ['sedan', 'sedan', 'coupe', 'van', 'taxi', 'sedan', 'coupe'];

function randomRoute(rng) {
  const alongAvenue = rng.chance(0.5);
  if (alongAvenue) {
    const x = rng.pick(AVENUES);
    const dir = rng.chance(0.5) ? 1 : -1;
    return { axis: 'z', fixed: x, dir, pos: rng.range(WORLD.minZ, WORLD.maxZ) };
  }
  const z = rng.pick(STREETS);
  const dir = rng.chance(0.5) ? 1 : -1;
  return { axis: 'x', fixed: z, dir, pos: rng.range(WORLD.minX, WORLD.maxX) };
}

// Lane offset for right-hand traffic: driving +z keeps right (x+),
// driving -z keeps right (x-); same for the x axis.
function laneOffset(route) {
  const off = 2.3;
  if (route.axis === 'z') return { x: route.dir * off, z: 0 };
  return { x: 0, z: -route.dir * off };
}

export class Traffic {
  constructor(scene, rng) {
    this.scene = scene;
    this.rng = rng.fork('traffic');
    this.cars = [];
    this.parked = [];
    this.group = new THREE.Group();
    this.group.name = 'traffic';
    scene.add(this.group);
  }

  spawn(count) {
    for (let i = 0; i < count; i++) this.addCar();
  }

  addCar(route) {
    const rng = this.rng;
    const cls = rng.pick(TRAFFIC_CLASSES);
    const mesh = buildCar(cls, rng.pick(TRAFFIC_COLORS));
    const r = route || randomRoute(rng);
    const car = {
      mesh, route: r, speed: rng.range(7, 11.5), targetSpeed: rng.range(8, 12),
      heading: r.axis === 'z' ? (r.dir > 0 ? 0 : Math.PI) : (r.dir > 0 ? Math.PI / 2 : -Math.PI / 2),
      steer: 0, honkT: 0,
    };
    this.placeOnRoute(car);
    this.group.add(mesh);
    this.cars.push(car);
    return car;
  }

  placeOnRoute(car) {
    const r = car.route;
    const off = laneOffset(r);
    if (r.axis === 'z') car.mesh.position.set(r.fixed + off.x, 0, r.pos);
    else car.mesh.position.set(r.pos, 0, r.fixed + off.z);
    car.mesh.rotation.y = car.heading;
  }

  // At an intersection, maybe turn onto the crossing road. The decision
  // rolls ONCE per intersection (tracked by line key) — rolling every
  // frame would turn at nearly every crossing.
  maybeTurn(car) {
    if (car.turning) return;
    const r = car.route;
    const rng = this.rng;
    const lines = r.axis === 'z' ? STREETS : AVENUES;
    for (const line of lines) {
      if (Math.abs(r.pos - line) < 1.2) {
        const key = r.axis + ':' + line;
        if (car.lastDecision === key) return;
        car.lastDecision = key;
        if (!rng.chance(0.3)) return;
        const newDir = rng.chance(0.5) ? 1 : -1;
        const targetHeading = r.axis === 'z'
          ? (newDir > 0 ? Math.PI / 2 : -Math.PI / 2)
          : (newDir > 0 ? 0 : Math.PI);
        car.turning = { line, newAxis: r.axis === 'z' ? 'x' : 'z', newDir, targetHeading };
        return;
      }
    }
  }

  update(dt, playerPos, obstacles) {
    const rng = this.rng;
    for (const car of this.cars) {
      const r = car.route;
      // Look ahead: slow for the car in front or the player.
      let blocked = false;
      const ahead = 7;
      const fx = Math.sin(car.heading), fz = Math.cos(car.heading);
      const px = car.mesh.position.x + fx * ahead;
      const pz = car.mesh.position.z + fz * ahead;
      for (const other of this.cars) {
        if (other === car) continue;
        const dx = other.mesh.position.x - px, dz = other.mesh.position.z - pz;
        if (dx * dx + dz * dz < 9) { blocked = true; break; }
      }
      if (!blocked && playerPos) {
        const dx = playerPos.x - px, dz = playerPos.z - pz;
        if (dx * dx + dz * dz < 9) blocked = true;
      }
      if (obstacles) {
        for (const o of obstacles) {
          const dx = o.x - px, dz = o.z - pz;
          if (dx * dx + dz * dz < 9) { blocked = true; break; }
        }
      }
      car.speed += ((blocked ? 0 : car.targetSpeed) - car.speed) * Math.min(1, dt * 2.5);
      if (car.turning) {
        // Arc through the turn: advance along the current heading while
        // curving toward the target heading, then adopt the new route.
        const t = car.turning;
        car.heading = turnToward(car.heading, t.targetHeading, 2.0 * dt);
        car.mesh.position.x += Math.sin(car.heading) * car.speed * dt;
        car.mesh.position.z += Math.cos(car.heading) * car.speed * dt;
        car.mesh.rotation.y = car.heading;
        if (Math.abs(((car.heading - t.targetHeading + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < 0.05) {
          const p = car.mesh.position;
          if (t.newAxis === 'x') car.route = { axis: 'x', fixed: t.line, dir: t.newDir, pos: p.x };
          else car.route = { axis: 'z', fixed: t.line, dir: t.newDir, pos: p.z };
          car.turning = null;
        }
      } else {
        r.pos += r.dir * car.speed * dt;
        this.maybeTurn(car);
        // End of the road: respawn on a fresh route near the player.
        const limit = r.axis === 'z' ? WORLD.maxZ : WORLD.maxX;
        const minL = r.axis === 'z' ? WORLD.minZ : WORLD.minX;
        if (r.pos > limit || r.pos < minL) {
          car.route = randomRoute(rng);
          if (playerPos && rng.chance(0.6)) {
            if (car.route.axis === 'z') car.route.pos = clamp(playerPos.z + rng.range(-90, 90), WORLD.minZ + 5, WORLD.maxZ - 5);
            else car.route.pos = clamp(playerPos.x + rng.range(-90, 90), WORLD.minX + 5, WORLD.maxX - 5);
          }
          car.heading = car.route.axis === 'z' ? (car.route.dir > 0 ? 0 : Math.PI) : (car.route.dir > 0 ? Math.PI / 2 : -Math.PI / 2);
        }
        this.placeOnRoute(car);
      }
      driveWheels(car.mesh, car.speed, 0, dt);
    }
  }

  // Parked cars along both curbs of every avenue + street, in the
  // parking lane (road edge + 0.5 m), parallel to the road.
  buildParked() {
    const rng = this.rng.fork('parked');
    const spots = [];
    for (const ax of AVENUES) {
      for (let z = -150; z <= 150; z += 14) {
        if (rng.chance(0.55)) spots.push({ x: ax - 4.1, z: z + rng.range(-2, 2), ry: 0 });
        if (rng.chance(0.55)) spots.push({ x: ax + 4.1, z: z + 7 + rng.range(-2, 2), ry: Math.PI });
      }
    }
    for (const sz of STREETS) {
      for (let x = -150; x <= 150; x += 14) {
        if (rng.chance(0.45)) spots.push({ x: x + rng.range(-2, 2), z: sz - 4.1, ry: Math.PI / 2 });
        if (rng.chance(0.45)) spots.push({ x: x + 7 + rng.range(-2, 2), z: sz + 4.1, ry: -Math.PI / 2 });
      }
    }
    for (const s of spots) {
      const cls = rng.pick(TRAFFIC_CLASSES);
      const mesh = buildCar(cls, rng.pick(TRAFFIC_COLORS));
      mesh.position.set(s.x, 0, s.z);
      mesh.rotation.y = s.ry + rng.range(-0.03, 0.03);
      this.group.add(mesh);
      this.parked.push({ mesh, x: s.x, z: s.z, cls, stolen: false });
    }
    return this.parked;
  }

  // The nearest parked car to a point (for stealing).
  // Re-place the first `count` moving cars onto the road nearest (x, z)
  // so the frame has traffic in it. Routes stay valid — the cars keep
  // driving normally afterwards. Used by shot staging.
  ensureNear(x, z, count) {
    const avenue = AVENUES.reduce((a, b) => Math.abs(a - x) < Math.abs(b - x) ? a : b);
    const street = STREETS.reduce((a, b) => Math.abs(a - z) < Math.abs(b - z) ? a : b);
    const useAvenue = Math.abs(avenue - x) <= Math.abs(street - z);
    for (let i = 0; i < Math.min(count, this.cars.length); i++) {
      const car = this.cars[i];
      const dir = i % 2 === 0 ? 1 : -1;
      if (useAvenue) {
        car.route = { axis: 'z', fixed: avenue, dir, pos: z + (i - count / 2) * 14 };
        car.heading = dir > 0 ? 0 : Math.PI;
      } else {
        car.route = { axis: 'x', fixed: street, dir, pos: x + (i - count / 2) * 14 };
        car.heading = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
      }
      car.turning = null;
      this.placeOnRoute(car);
    }
  }

  nearestParked(x, z, maxD = 4) {
    let best = null, bestD = maxD;
    for (const p of this.parked) {
      if (p.stolen) continue;
      const d = Math.hypot(p.x - x, p.z - z);
      if (d < bestD) { bestD = d; best = p; }
    }
    return best;
  }

  // The nearest moving traffic car (for stealing at a stop).
  nearestMoving(x, z, maxD = 4) {
    let best = null, bestD = maxD;
    for (const c of this.cars) {
      const d = Math.hypot(c.mesh.position.x - x, c.mesh.position.z - z);
      if (d < bestD) { bestD = d; best = c; }
    }
    return best;
  }

  removeCar(car) {
    const i = this.cars.indexOf(car);
    if (i >= 0) this.cars.splice(i, 1);
    this.group.remove(car.mesh);
  }
}
