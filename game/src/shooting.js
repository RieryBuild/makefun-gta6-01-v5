// Shooting — aimed fire, tracers, muzzle flash, and damage feedback.
// The tracer is a thin additive cylinder stretched from the MUZZLE to
// the hit point, so it can never disagree with the weapon's aim (the
// v4 fault: a tracer that left from nowhere while the rifle pointed at
// the sky). Hits are geometric ray tests against target capsules and
// building AABBs — no mesh raycasting, so it stays cheap with a crowd.
//
// Balance: the rifle kills at 30 m in two hits (damage 50, enemy HP
// 100, no falloff inside 45 m). The play-test verifies the 30 m kill.

import { makeGlowTexture, makeTextSpriteTexture } from './surface.js';
import { clamp } from './rng.js';

export const WEAPONS = {
  fists: { name: 'Fists', damage: 12, range: 2.2, rate: 2.2, mag: Infinity, reserve: Infinity, auto: false, spread: 0, tracer: false },
  pistol: { name: 'Pistol', damage: 34, range: 45, rate: 3.2, mag: 12, reserve: 48, auto: false, spread: 0.012, tracer: true },
  smg: { name: 'SMG', damage: 22, range: 38, rate: 9, mag: 30, reserve: 120, auto: true, spread: 0.03, tracer: true },
  rifle: { name: 'Rifle', damage: 50, range: 70, rate: 2.6, mag: 24, reserve: 96, auto: false, spread: 0.006, tracer: true },
};

// Ray vs AABB (slab test). Returns t or Infinity.
function rayAABB(ox, oy, oz, dx, dy, dz, b) {
  let tmin = 0, tmax = Infinity;
  const axes = [[ox, dx, b.minX, b.maxX], [oy, dy, 0, b.h], [oz, dz, b.minZ, b.maxZ]];
  for (const [o, d, mn, mx] of axes) {
    if (Math.abs(d) < 1e-8) {
      if (o < mn || o > mx) return Infinity;
    } else {
      let t1 = (mn - o) / d, t2 = (mx - o) / d;
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return Infinity;
    }
  }
  return tmin;
}

// Ray vs a vertical capsule (a person): centre (x, 1.0, z), radius 0.55,
// height 1.8. Approximated as a vertical segment test.
function rayPerson(ox, oy, oz, dx, dy, dz, tx, tz) {
  // Closest approach of the ray to the vertical line x=tx, z=tz.
  const px = tx - ox, pz = tz - oz;
  const t = px * dx + pz * dz; // t along the ray (dx,dz horizontal part)
  if (t < 0) return Infinity;
  const cx = ox + dx * t, cz = oz + dz * t;
  const d2 = (cx - tx) ** 2 + (cz - tz) ** 2;
  if (d2 > 0.55 * 0.55) return Infinity;
  const y = oy + dy * t;
  if (y < 0 || y > 1.85) return Infinity;
  return t;
}

export class Shooting {
  constructor(scene, colliders) {
    this.scene = scene;
    this.colliders = colliders;
    this.targets = []; // {mesh, hp, maxHp, radius, onHit, onKill, alive, isPlayer}
    this.tracers = [];
    this.flashes = [];
    this.numbers = [];
    this.flashLight = new THREE.PointLight(0xffc46b, 0, 18, 2);
    scene.add(this.flashLight);
    this.flashTex = makeGlowTexture([[0, 0xfff2c8, 1], [0.4, 0xffc46b, 0.6], [0.75, 0xff8c42, 0.2]]);
    this.onKill = null;
    this.onPlayerHit = null;
  }

  addTarget(t) { this.targets.push(t); return t; }
  removeTarget(t) {
    const i = this.targets.indexOf(t);
    if (i >= 0) this.targets.splice(i, 1);
  }

  // Fire one shot from `origin` along `dir` with weapon `w`.
  // Returns {hit, target, point, damage} — or {hit:false, point}.
  fire(origin, dir, w, shooter) {
    const d = dir.clone().normalize();
    // Spread.
    d.x += (Math.random() - 0.5) * w.spread * 2;
    d.y += (Math.random() - 0.5) * w.spread * 2;
    d.z += (Math.random() - 0.5) * w.spread * 2;
    d.normalize();
    let bestT = w.range;
    let bestTarget = null;
    for (const t of this.targets) {
      if (!t.alive || t === shooter) continue;
      const p = t.mesh.position;
      const tt = rayPerson(origin.x, origin.y, origin.z, d.x, d.y, d.z, p.x, p.z);
      if (tt < bestT) { bestT = tt; bestTarget = t; }
    }
    let wallT = Infinity;
    for (const b of this.colliders) {
      const tt = rayAABB(origin.x, origin.y, origin.z, d.x, d.y, d.z, b);
      if (tt < wallT) wallT = tt;
    }
    const hitPoint = origin.clone().add(d.clone().multiplyScalar(Math.min(bestT, wallT)));
    const hitTarget = bestTarget && bestT <= wallT;
    if (w.tracer) this.spawnTracer(origin, hitPoint);
    this.spawnFlash(origin);
    if (hitTarget) {
      const falloff = bestT > 45 ? clamp(1 - (bestT - 45) / 40, 0.4, 1) : 1;
      const dmg = Math.round(w.damage * falloff);
      bestTarget.hp -= dmg;
      if (bestTarget.onHit) bestTarget.onHit(dmg, hitPoint);
      this.spawnNumber(hitPoint, '-' + dmg, '#ffd700');
      if (bestTarget.hp <= 0 && bestTarget.alive) {
        bestTarget.alive = false;
        if (bestTarget.onKill) bestTarget.onKill();
        if (this.onKill) this.onKill(bestTarget, shooter);
      }
      return { hit: true, target: bestTarget, point: hitPoint, damage: dmg };
    }
    if (wallT < w.range) this.spawnImpact(hitPoint);
    return { hit: false, point: hitPoint };
  }

  spawnTracer(from, to) {
    const len = from.distanceTo(to);
    if (len < 0.5) return;
    // Radius 0.045, orange: at 0.02 the tracer was sub-pixel at combat
    // range and never read in the frame; at 0.035 in pale yellow it
    // still vanished against the bright sunset buildings. A thicker
    // orange round reads against tan and pink alike, in play and on
    // screen.
    const geo = new THREE.CylinderGeometry(0.045, 0.045, 1, 5, 1, true);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffb84d, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.copy(from).lerp(to, 0.5);
    m.scale.y = len;
    const dir = to.clone().sub(from).normalize();
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    this.scene.add(m);
    // 1.0 s: long enough to read as a tracer in play (and to catch in
    // a screenshot), short enough to stay a flash, not a laser. At
    // 0.32 s the screenshot harness kept catching faded ghosts — the
    // game runs ~1.25 fps under SwiftShader, so the wait-to-shutter
    // gap alone ate half the tracer's life.
    this.tracers.push({ mesh: m, life: 1.0, maxLife: 1.0 });
  }

  spawnFlash(at) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.flashTex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, fog: false,
    }));
    s.position.copy(at);
    s.scale.setScalar(0.7 + Math.random() * 0.4);
    this.scene.add(s);
    this.flashes.push({ sprite: s, life: 0.06 });
    this.flashLight.position.copy(at);
    this.flashLight.intensity = 2.5;
  }

  spawnImpact(at) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.flashTex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, fog: false, opacity: 0.7,
    }));
    s.position.copy(at);
    s.scale.setScalar(0.5);
    this.scene.add(s);
    this.flashes.push({ sprite: s, life: 0.12 });
  }

  spawnNumber(at, text, color) {
    const tex = makeTextSpriteTexture(text, color, 56);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, depthWrite: false, fog: false,
    }));
    s.position.set(at.x, at.y + 0.6, at.z);
    // 2.2 x 0.8 world units: the old 1.6 x 0.6 sprite shrank to an
    // unreadable smudge at 18 m; this size stays legible at combat
    // range without covering the target.
    s.scale.set(2.2, 0.8, 1);
    this.scene.add(s);
    this.numbers.push({ sprite: s, life: 0.9 });
  }

  update(dt) {
    this.flashLight.intensity = Math.max(0, this.flashLight.intensity - dt * 30);
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.life -= dt;
      t.mesh.material.opacity = 0.95 * clamp(t.life / (t.maxLife * 0.6), 0, 1);
      if (t.life <= 0) {
        this.scene.remove(t.mesh);
        t.mesh.geometry.dispose();
        t.mesh.material.dispose();
        this.tracers.splice(i, 1);
      }
    }
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i];
      f.life -= dt;
      if (f.life <= 0) {
        this.scene.remove(f.sprite);
        f.sprite.material.dispose();
        this.flashes.splice(i, 1);
      }
    }
    for (let i = this.numbers.length - 1; i >= 0; i--) {
      const n = this.numbers[i];
      n.life -= dt;
      n.sprite.position.y += dt * 1.2;
      n.sprite.material.opacity = clamp(n.life / 0.5, 0, 1);
      if (n.life <= 0) {
        this.scene.remove(n.sprite);
        n.sprite.material.map.dispose();
        n.sprite.material.dispose();
        this.numbers.splice(i, 1);
      }
    }
  }
}
