// Enemies — Venn's crew, the lieutenants, and Venn himself. Spawned by
// mission kill-stages at a POI, they advance on the player until in
// range, then shoot with inaccuracy; on death they fall (dead pose +
// root rotation), pay out a little cash, and fade. Distinct from peds
// by their dark-red crew jackets and caps — never clones of the crowd.

import { buildHumanoid, setPose, showWeapon, muzzleWorld } from './humanoid.js';
import { ENEMY_SPEC, CAST } from './cast.js';
import { WEAPONS } from './shooting.js';
import { clamp, turnToward } from './rng.js';

export class Enemies {
  constructor(world, shooting, player) {
    this.world = world;
    this.shooting = shooting;
    this.player = player;
    this.list = [];
    this.onEnemyDown = null;
    this.group = new THREE.Group();
    this.group.name = 'enemies';
    world.scene.add(this.group);
  }

  spawnAt(x, z, opts = {}) {
    const { count = 1, boss = false, lieutenant = false } = opts;
    const made = [];
    for (let i = 0; i < count; i++) {
      const spec = boss ? { ...CAST.venn, scale: 1.04 } : { ...ENEMY_SPEC, scale: 0.97 + Math.random() * 0.08 };
      const mesh = buildHumanoid(spec);
      const a = (i / Math.max(1, count)) * Math.PI * 2 + Math.random();
      const r = 4 + Math.random() * 7;
      mesh.position.set(x + Math.cos(a) * r, 0, z + Math.sin(a) * r);
      this.group.add(mesh);
      const hp = boss ? 220 : lieutenant ? 150 : 100;
      const e = {
        mesh, hp, maxHp: hp, alive: true, boss, lieutenant,
        phase: Math.random() * 6.28, shootT: 0.5 + Math.random(),
        moveT: 0, fallT: 0, weapon: boss ? 'rifle' : 'pistol',
      };
      showWeapon(mesh, e.weapon);
      setPose(mesh, 'idle');
      e.target = this.shooting.addTarget({
        mesh, hp, maxHp: hp, alive: true,
        onHit: (dmg) => { /* damage number already spawned by shooting */ },
        onKill: () => this.kill(e),
      });
      // Keep the target's hp in sync with the enemy's hp.
      e.target.hp = hp;
      e.target._enemy = e;
      this.list.push(e);
      made.push(e);
    }
    return made;
  }

  kill(e) {
    if (!e.alive) return;
    e.alive = false;
    e.fallT = 0;
    setPose(e.mesh, 'dead');
    this.shooting.removeTarget(e.target);
    if (this.onEnemyDown) this.onEnemyDown(e);
  }

  clear() {
    for (const e of [...this.list]) {
      this.shooting.removeTarget(e.target);
      this.group.remove(e.mesh);
    }
    this.list = [];
  }

  update(dt) {
    const pp = this.player.position;
    const playerAlive = this.player.health > 0;
    for (let i = this.list.length - 1; i >= 0; i--) {
      const e = this.list[i];
      if (!e.alive) {
        // Fall + fade: rotate the root back over 0.4 s, then sink.
        e.fallT += dt;
        const k = clamp(e.fallT / 0.4, 0, 1);
        e.mesh.rotation.x = -Math.PI / 2 * k;
        if (e.fallT > 4) {
          e.mesh.position.y -= dt * 0.5;
          if (e.fallT > 5.5) {
            this.group.remove(e.mesh);
            this.list.splice(i, 1);
          }
        }
        continue;
      }
      const p = e.mesh.position;
      const dx = pp.x - p.x, dz = pp.z - p.z;
      const d = Math.hypot(dx, dz);
      const wantHeading = Math.atan2(dx, dz);
      e.mesh.rotation.y = turnToward(e.mesh.rotation.y, wantHeading, 6 * dt);
      if (d > 26 && playerAlive) {
        // Advance on the player.
        e.phase += dt * 8;
        p.x += Math.sin(e.mesh.rotation.y) * 3.4 * dt;
        p.z += Math.cos(e.mesh.rotation.y) * 3.4 * dt;
        this.world.collideCircle(p, 0.5);
        this.world.clampToLand(p);
        setPose(e.mesh, 'walk', e.phase);
      } else if (playerAlive) {
        // In range: two-handed aim + fire with inaccuracy.
        setPose(e.mesh, 'aim', e.phase, 0);
        e.shootT -= dt;
        if (e.shootT <= 0 && d < 45) {
          e.shootT = 0.9 + Math.random() * 0.9;
          const muzzle = muzzleWorld(e.mesh, e.weapon);
          const dir = new THREE.Vector3(
            pp.x + (Math.random() - 0.5) * 3 - muzzle.x,
            1.1 - muzzle.y,
            pp.z + (Math.random() - 0.5) * 3 - muzzle.z,
          ).normalize();
          const w = WEAPONS[e.weapon];
          const res = this.shooting.fire(muzzle, dir, w, e.target);
          if (res.hit && res.target && res.target.isPlayer) {
            // The player's onHit already applied the damage.
          }
        }
      } else {
        setPose(e.mesh, 'idle', e.phase);
      }
      // Keep the shooting target's hp synced (the target object holds
      // the hp the ray test decrements).
      e.hp = e.target.hp;
    }
  }

  blips() {
    return this.list.filter((e) => e.alive).map((e) => ({ x: e.mesh.position.x, z: e.mesh.position.z }));
  }

  get aliveCount() { return this.list.filter((e) => e.alive).length; }
}
