// The player — Ro Delgado, on foot and behind the wheel. One controller
// for both: on foot she walks/runs/aims with the camera-relative WASD;
// in a car she drives arcade physics (accel, brake, handbrake drift,
// steering that tightens with speed). F enters/exits cars (stealing a
// parked or traffic car counts as a steal); Q or right-mouse aims the
// current weapon two-handed; click fires from the muzzle along the
// camera's aim. Driving stunts pay: DRIFT chains and NEAR MISS bonuses
// pop up with cash, the way #4's chase frame shows them.

import { buildHumanoid, setPose, showWeapon, muzzleWorld } from './humanoid.js';
import { CAST } from './cast.js';
import { buildCar, driveWheels, CAR_CLASSES } from './vehicles.js';
import { WEAPONS } from './shooting.js';
import { clamp, damp, turnToward } from './rng.js';
import { poiById } from './cityplan.js';

const WALK_SPEED = 4.6;
const SPRINT_SPEED = 7.6;

export class Player {
  constructor(world, controls, sound, growth, police, shooting) {
    this.world = world;
    this.controls = controls;
    this.sound = sound;
    this.growth = growth;
    this.police = police;
    this.shooting = shooting;
    this.mesh = buildHumanoid(CAST.ro);
    this.mesh.position.set(-60, 0, 148);
    this.mesh.rotation.y = Math.PI;
    world.scene.add(this.mesh);
    this.heading = Math.PI;
    this.velocity = { x: 0, z: 0 };
    this.health = 100;
    this.armor = 0;
    this.weapon = 'pistol';
    this.ammo = {};
    for (const [k, w] of Object.entries(WEAPONS)) {
      this.ammo[k] = { mag: isFinite(w.mag) ? w.mag : Infinity, reserve: w.reserve };
    }
    this.fireT = 0;
    this.reloadT = 0;
    this.phase = 0;
    this.driving = null;      // {mesh, spec, speed, heading, steer, condition, stolen, own}
    this.heroCar = null;
    this.driftT = 0;
    this.driftChain = 0;
    this.driftCooldown = 0;
    this.nearMissCooldown = 0;
    this.aiming = false;
    // Staging overrides (shot setups only): forceAim holds the aim pose
    // without input, forceFire fires one shot per set (consumed on
    // fire), forceThrottle holds full throttle while driving.
    // ramKeepsSpeed: rams still shove + damage, but never bleed speed —
    // the chase screenshot stages four cruisers ramming at once, and
    // without it the cover's speedo drops from ~94 to ~63 km/h.
    this.forceAim = false;
    this.forceFire = false;
    this.forceThrottle = false;
    this.ramKeepsSpeed = false;
    this.onWasted = null;
    this.onStolen = null;
    this.onPopup = null;
    this.onDamage = null;
    this._target = null;      // shooting target entry for the player
    this.spawnHeroCar();
  }

  get position() {
    return this.driving ? this.driving.mesh.position : this.mesh.position;
  }

  get speed() {
    if (this.driving) return Math.abs(this.driving.speed);
    return Math.hypot(this.velocity.x, this.velocity.z);
  }

  spawnHeroCar() {
    const car = buildCar('hero');
    car.position.set(-56, 0, 150);
    car.rotation.y = Math.PI / 2;
    this.world.scene.add(car);
    this.heroCar = { mesh: car, spec: CAR_CLASSES.hero, speed: 0, heading: Math.PI / 2, steer: 0, condition: 100, stolen: false, own: true };
  }

  registerTarget() {
    this._target = this.shooting.addTarget({
      mesh: this.mesh, hp: 100, maxHp: 100, alive: true, isPlayer: true,
      onHit: (dmg) => this.takeDamage(dmg),
      onKill: () => {},
    });
    return this._target;
  }

  takeDamage(n) {
    if (this.health <= 0) return;
    let rest = n;
    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, rest * 0.6);
      this.armor -= absorbed;
      rest -= absorbed;
    }
    this.health = Math.max(0, this.health - rest);
    if (this.onDamage) this.onDamage();
    if (this.health <= 0 && this.onWasted) this.onWasted();
  }

  heal(n) { this.health = Math.min(100, this.health + n); }

  switchWeapon(kind) {
    if (!WEAPONS[kind] || !this.growth.unlocked.has(kind)) return;
    this.weapon = kind;
    showWeapon(this.mesh, kind === 'fists' ? 'none' : kind);
    this.reloadT = 0;
  }

  // --- Cars -------------------------------------------------------------
  tryEnterCar() {
    const p = this.mesh.position;
    // The hero car first, then parked, then stopped traffic.
    const candidates = [];
    if (this.heroCar && !this.heroCar.stolen) {
      candidates.push({ car: this.heroCar, d: this.heroCar.mesh.position.distanceTo(p) });
    }
    const parked = this.world.traffic.nearestParked(p.x, p.z, 4.5);
    if (parked) candidates.push({ parked, d: Math.hypot(parked.x - p.x, parked.z - p.z) });
    const moving = this.world.traffic.nearestMoving(p.x, p.z, 4.5);
    if (moving && moving.speed < 1) candidates.push({ traffic: moving, d: moving.mesh.position.distanceTo(p) });
    candidates.sort((a, b) => a.d - b.d);
    const best = candidates[0];
    if (!best || best.d > 4.5) return false;
    let car;
    if (best.car) {
      car = best.car;
    } else if (best.parked) {
      const pk = best.parked;
      pk.stolen = true;
      car = {
        mesh: pk.mesh, spec: CAR_CLASSES[pk.cls] || CAR_CLASSES.sedan,
        speed: 0, heading: pk.mesh.rotation.y, steer: 0, condition: 100, stolen: true, own: false,
      };
      this.world.traffic.parked.splice(this.world.traffic.parked.indexOf(pk), 1);
      this.stealCar(car);
    } else {
      const t = best.traffic;
      this.world.traffic.removeCar(t);
      car = {
        mesh: t.mesh, spec: CAR_CLASSES[t.mesh.userData.class] || CAR_CLASSES.sedan,
        speed: 0, heading: t.heading, steer: 0, condition: 100, stolen: true, own: false,
      };
      this.stealCar(car);
    }
    this.enterCar(car);
    return true;
  }

  stealCar(car) {
    this.growth.stats.carsStolen++;
    // Stealing in sight of the law: +1 wanted if a cruiser is close.
    let seen = false;
    for (const c of this.police.cruisers) {
      if (c.mesh.position.distanceTo(this.mesh.position) < 40) { seen = true; break; }
    }
    if (seen) this.police.addWanted(1);
    if (this.onStolen) this.onStolen(car);
  }

  enterCar(car) {
    this.driving = car;
    this.mesh.visible = false;
    this.heading = car.heading;
    if (this.onPopup) this.onPopup('car', car.spec.name);
  }

  exitCar() {
    if (!this.driving) return;
    const car = this.driving;
    car.speed = 0;
    const side = 2.2;
    const x = car.mesh.position.x + Math.cos(car.heading) * side;
    const z = car.mesh.position.z - Math.sin(car.heading) * side;
    this.mesh.position.set(x, 0, z);
    this.mesh.rotation.y = car.heading;
    this.heading = car.heading;
    this.mesh.visible = true;
    this.driving = null;
    setPose(this.mesh, 'idle');
  }

  onRam(nx, nz, speed) {
    // A cruiser ram: shove the car sideways + damage + shake.
    if (this.driving) {
      const c = this.driving;
      c.mesh.position.x += nx * 1.2;
      c.mesh.position.z += nz * 1.2;
      // A ram costs 18% of speed in live play; a staged shot keeps it.
      c.speed *= this.ramKeepsSpeed ? 1 : 0.82;
      c.condition = Math.max(0, c.condition - 3);
      if (this.onDamage) this.onDamage();
    } else {
      // On foot, a ram knocks Ro down hard — 6 damage, so four cruisers
      // ramming on cooldown still can't waste a full-health player
      // before the 2.5 s bust timer fires (see police.js ramT).
      this.takeDamage(6);
      const p = this.mesh.position;
      p.x += nx * 1.5;
      p.z += nz * 1.5;
    }
  }

  // --- Per-frame ----------------------------------------------------------
  update(dt, cam) {
    this.fireT -= dt;
    if (this.reloadT > 0) {
      this.reloadT -= dt;
      if (this.reloadT <= 0) {
        const w = WEAPONS[this.weapon];
        const a = this.ammo[this.weapon];
        const need = w.mag - a.mag;
        const take = Math.min(need, a.reserve);
        a.mag += take;
        a.reserve -= take;
      }
    }
    if (this.controls.pressed('KeyR')) this.reload();
    for (const [i, kind] of [['Digit1', 'fists'], ['Digit2', 'pistol'], ['Digit3', 'smg'], ['Digit4', 'rifle']]) {
      if (this.controls.pressed(i)) this.switchWeapon(kind);
    }
    if (this.controls.pressed('KeyF')) {
      if (this.driving) this.exitCar();
      else this.tryEnterCar();
    }
    if (this.driving) this.updateDriving(dt);
    else this.updateOnFoot(dt, cam);
    // Engine + siren audio follow the state.
    const nearestCop = this.police.cruisers.length
      ? Math.min(...this.police.cruisers.map((c) => c.mesh.position.distanceTo(this.position)))
      : null;
    this.sound.setSiren(this.police.wanted > 0 ? nearestCop : null);
    this.sound.setEngine(this.driving ? Math.abs(this.driving.speed) : 0, !!this.driving);
  }

  reload() {
    const w = WEAPONS[this.weapon];
    const a = this.ammo[this.weapon];
    if (!isFinite(w.mag) || a.mag >= w.mag || a.reserve <= 0 || this.reloadT > 0) return;
    this.reloadT = 0.9;
  }

  updateOnFoot(dt, cam) {
    const axes = this.controls.moveAxes();
    this.aiming = this.controls.aiming || this.forceAim;
    const camYaw = cam.forwardYaw;
    // Movement relative to the camera.
    const fwd = { x: Math.sin(camYaw), z: Math.cos(camYaw) };
    const right = { x: Math.cos(camYaw), z: -Math.sin(camYaw) };
    let mx = fwd.x * axes.y + right.x * axes.x;
    let mz = fwd.z * axes.y + right.z * axes.x;
    const len = Math.hypot(mx, mz);
    const sprint = this.controls.sprint;
    const speed = sprint ? SPRINT_SPEED : WALK_SPEED;
    if (len > 0.01) {
      mx /= len; mz /= len;
      this.phase += dt * (sprint ? 11 : 7.5);
      const targetHeading = Math.atan2(mx, mz);
      this.heading = turnToward(this.heading, targetHeading, 10 * dt);
      const p = this.mesh.position;
      p.x += mx * speed * dt;
      p.z += mz * speed * dt;
      this.velocity.x = mx * speed;
      this.velocity.z = mz * speed;
      if (sprint) this.growth.noteSprint(dt);
      setPose(this.mesh, sprint ? 'run' : 'walk', this.phase);
    } else {
      this.velocity.x = 0;
      this.velocity.z = 0;
      this.phase += dt;
      if (!this.aiming) setPose(this.mesh, 'idle', this.phase);
    }
    // Bounds apply every frame, even standing still: a knockback, a
    // respawn, or a teleport can otherwise leave Ro past the waterline
    // or inside a wall until she next moves.
    this.world.collideCircle(this.mesh.position, 0.5);
    this.world.clampToLand(this.mesh.position);
    if (this.aiming) {
      // Face the camera's aim; two-handed pose; pitch from the camera.
      this.heading = turnToward(this.heading, camYaw, 12 * dt);
      this.mesh.rotation.y = this.heading;
      const pitch = clamp(-cam.pitch * 0.6, -0.5, 0.5);
      showWeapon(this.mesh, this.weapon === 'fists' ? 'none' : this.weapon);
      setPose(this.mesh, 'aim', this.phase, pitch);
      this.tryFire(cam);
    } else {
      this.mesh.rotation.y = this.heading;
      if (this.weapon === 'rifle') {
        // Rifle slung on the back when not aiming.
        showWeapon(this.mesh, 'rifle');
        setPose(this.mesh, len > 0.01 ? (sprint ? 'run' : 'walk') : 'carry', this.phase);
      } else {
        // Pistol / SMG holstered when not aiming.
        showWeapon(this.mesh, 'none');
      }
    }
    // Fists can swing without aiming.
    if (this.weapon === 'fists' && this.controls.mouseDownEdge) this.melee();
  }

  tryFire(cam) {
    if (this.fireT > 0 || this.reloadT > 0) return;
    const w = WEAPONS[this.weapon];
    const a = this.ammo[this.weapon];
    const wantFire = this.forceFire || (w.auto ? this.controls.mouseDown : this.controls.mouseDownEdge);
    if (!wantFire) return;
    if (isFinite(w.mag) && a.mag <= 0) { this.reload(); return; }
    this.fireT = 1 / w.rate;
    this.forceFire = false; // one forced shot per set
    if (isFinite(w.mag)) a.mag--;
    this.growth.stats.shotsFired++;
    const muzzle = muzzleWorld(this.mesh, this.weapon);
    const dir = new THREE.Vector3();
    this.world.camera.getWorldDirection(dir);
    const res = this.shooting.fire(muzzle, dir, w, this._target);
    if (res.hit) {
      this.growth.stats.shotsHit++;
      this.growth.noteHit();
    }
    this.sound.shot();
    this.world.crowd.raiseAlarm(this.mesh.position.x, this.mesh.position.z);
    if (this.police.wanted === 0) this.police.addWanted(1);
  }

  melee() {
    // A fist swing: anything within 2.2 m in front takes damage.
    const p = this.mesh.position;
    const fx = Math.sin(this.heading), fz = Math.cos(this.heading);
    for (const t of this.shooting.targets) {
      if (!t.alive || t === this._target) continue;
      const tp = t.mesh.position;
      const dx = tp.x - p.x, dz = tp.z - p.z;
      const d = Math.hypot(dx, dz);
      if (d < 2.2 && (dx * fx + dz * fz) / (d || 1) > 0.5) {
        t.hp -= WEAPONS.fists.damage;
        if (t.onHit) t.onHit(WEAPONS.fists.damage, tp);
        if (t.hp <= 0 && t.alive) {
          t.alive = false;
          if (t.onKill) t.onKill();
        }
      }
    }
    this.sound.blip(180, 0.08, 0.3);
  }

  updateDriving(dt) {
    const c = this.driving;
    const spec = c.spec;
    const axes = this.controls.moveAxes();
    if (this.forceThrottle) axes.y = 1;
    const handbrake = this.controls.handbrake;
    // Throttle / brake.
    if (axes.y > 0) c.speed += spec.accel * dt;
    else if (axes.y < 0) {
      if (c.speed > 0.5) c.speed -= spec.accel * 1.6 * dt;
      else c.speed -= spec.accel * 0.5 * dt; // reverse
    } else {
      c.speed = damp(c.speed, 0, 0.6, dt);
    }
    if (handbrake) c.speed = damp(c.speed, 0, 2.2, dt);
    c.speed = clamp(c.speed, -12, spec.topSpeed * (c.condition <= 0 ? 0 : 1));
    if (c.condition <= 0) c.speed = damp(c.speed, 0, 3, dt);
    // Steering: tighter at low speed, looser at high speed; handbrake loosens the rear.
    const speedK = clamp(Math.abs(c.speed) / spec.topSpeed, 0, 1);
    const steerRate = (handbrake ? 2.6 : 1.7) * (1 - speedK * 0.55);
    c.steer = damp(c.steer, axes.x, 8, dt);
    c.heading -= c.steer * steerRate * dt * Math.sign(c.speed || 1) * clamp(Math.abs(c.speed) / 6, 0, 1);
    c.mesh.rotation.y = c.heading;
    // Drift: handbrake + speed + steering.
    const drifting = handbrake && Math.abs(c.speed) > 14 && Math.abs(c.steer) > 0.4;
    if (drifting) {
      this.driftT += dt;
      this.driftCooldown = 2;
      // The rear steps out: slide sideways a touch.
      const slide = c.steer * 2.2 * dt;
      c.mesh.position.x += Math.cos(c.heading) * slide;
      c.mesh.position.z -= Math.sin(c.heading) * slide;
      if (this.driftT > 1) {
        this.driftT = 0;
        this.driftChain++;
        const bonus = 150 * this.driftChain;
        this.growth.addCash(bonus);
        if (this.onPopup) this.onPopup('drift', `DRIFT x${this.driftChain}  +$${bonus}`);
      }
    } else {
      this.driftT = 0;
      this.driftCooldown -= dt;
      if (this.driftCooldown <= 0) this.driftChain = 0;
    }
    // Advance.
    const fx = Math.sin(c.heading), fz = Math.cos(c.heading);
    c.mesh.position.x += fx * c.speed * dt;
    c.mesh.position.z += fz * c.speed * dt;
    this.velocity.x = fx * c.speed;
    this.velocity.z = fz * c.speed;
    this.heading = c.heading;
    // Collisions: buildings, traffic, parked cars.
    if (this.world.collideCircle(c.mesh.position, 1.7)) {
      if (Math.abs(c.speed) > 4) {
        c.condition = Math.max(0, c.condition - 4);
        if (this.onDamage) this.onDamage();
        this.sound.blip(90, 0.15, 0.4);
      }
      c.speed *= 0.35;
    }
    this.world.clampToLand(c.mesh.position);
    this.carVsTraffic(dt);
    driveWheels(c.mesh, c.speed, c.steer * 0.45, dt);
    if (Math.abs(c.speed) > 20) this.growth.noteDriving(dt, Math.abs(c.speed));
    // Near miss: a traffic car passes close and fast without contact.
    this.nearMissCooldown -= dt;
    if (this.nearMissCooldown <= 0 && Math.abs(c.speed) > 18) {
      for (const t of this.world.traffic.cars) {
        const d = t.mesh.position.distanceTo(c.mesh.position);
        if (d > 2.8 && d < 4.2) {
          this.nearMissCooldown = 3;
          this.growth.addCash(250);
          if (this.onPopup) this.onPopup('nearmiss', 'NEAR MISS  +$250');
          break;
        }
      }
    }
  }

  carVsTraffic(dt) {
    const c = this.driving;
    const p = c.mesh.position;
    const hit = (other, radius) => {
      const dx = p.x - other.x, dz = p.z - other.z;
      const d = Math.hypot(dx, dz);
      if (d < radius && d > 0.01) {
        const push = (radius - d) / 2;
        p.x += (dx / d) * push;
        p.z += (dz / d) * push;
        if (Math.abs(c.speed) > 5) {
          c.condition = Math.max(0, c.condition - 2);
          if (this.onDamage) this.onDamage();
        }
        c.speed *= 0.75;
      }
    };
    for (const t of this.world.traffic.cars) hit(t.mesh.position, 3.2);
    for (const pk of this.world.traffic.parked) hit(pk.mesh.position, 3.2);
    for (const pc of this.police.cruisers) hit(pc.mesh.position, 3.2);
    for (const rb of this.police.roadblock) hit(rb.mesh.position, 3.2);
  }

  respawnAt(poiId) {
    const poi = poiById(poiId);
    if (this.driving) {
      const car = this.driving;
      car.speed = 0;
      this.driving = null;
      this.mesh.visible = true;
    }
    this.mesh.position.set(poi.x + 4, 0, poi.z + 4);
    this.heading = 0;
    this.mesh.rotation.y = 0;
    this.health = 100;
    this.armor = 0;
    setPose(this.mesh, 'idle');
  }

  get speedKmh() { return this.speed * 3.6; }
}
