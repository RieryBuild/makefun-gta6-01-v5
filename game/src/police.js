// The PSPD — the wanted system and the police response. Wanted runs
// 0–5 stars. Cruisers pursue and RAM (they aim at an intercept point
// ahead of the player, not at the player's tail); at 3+ stars the
// response adds roadblocks across the road ahead and a helicopter with
// a VISIBLE searchlight beam + ground spotlight. Busted when slow with
// a cruiser on top of you; escape by breaking contact until the stars
// bleed off. The radar shows every unit as a blip and the search area
// as a ring — the police presence is stars + blips + a flashing rim,
// never a text table (the icon-first HUD verdict).

import { WORLD, nearestRoadPoint } from './cityplan.js';
import { buildCar, driveWheels } from './vehicles.js';
import { makeGlowTexture } from './surface.js';
import { Rng, clamp, turnToward, TAU } from './rng.js';

const CRUISERS_BY_WANTED = [0, 2, 3, 4, 5, 6];
const HELI_AT_WANTED = 3;
const ROADBLOCK_AT_WANTED = 3;

export class Police {
  constructor(scene, rng, colliders) {
    this.scene = scene;
    this.rng = rng.fork('police');
    this.colliders = colliders;
    this.wanted = 0;
    this.cruisers = [];
    this.roadblock = [];
    // How far ahead of the player the roadblock sits. 60 m in live
    // play; the chase screenshot pulls it closer so the angled cruisers
    // + light bars read in the frame instead of vanishing at the
    // horizon.
    this.roadblockDist = 60;
    this.heli = null;
    this.hiddenT = 0;      // time since any unit last had contact
    this.decayT = 0;
    this.bustT = 0;
    this.searchRadius = 60;
    this.group = new THREE.Group();
    this.group.name = 'police';
    scene.add(this.group);
    this.flashT = 0;       // light-bar flash timer
    this.onBusted = null;
    this.onEscape = null;
    this.onWantedChange = null;
  }

  setWanted(n, silent = false) {
    const next = clamp(Math.round(n), 0, 5);
    if (next === this.wanted) return;
    const prev = this.wanted;
    this.wanted = next;
    this.hiddenT = 0;
    this.decayT = 0;
    if (next > prev && this.onWantedChange) this.onWantedChange(next);
    if (next === 0 && prev > 0 && this.onEscape) this.onEscape(prev);
    this.syncUnits();
  }

  addWanted(n) { this.setWanted(this.wanted + n); }

  syncUnits() {
    const want = CRUISERS_BY_WANTED[this.wanted];
    while (this.cruisers.length < want) this.spawnCruiser();
    while (this.cruisers.length > want) this.removeCruiser(this.cruisers[this.cruisers.length - 1]);
    if (this.wanted >= HELI_AT_WANTED && !this.heli) this.spawnHeli();
    if (this.wanted < HELI_AT_WANTED && this.heli) this.removeHeli();
    if (this.wanted >= ROADBLOCK_AT_WANTED && this.roadblock.length === 0) this.spawnRoadblock();
    if (this.wanted < ROADBLOCK_AT_WANTED && this.roadblock.length > 0) this.clearRoadblock();
  }

  spawnCruiser(at) {
    const mesh = buildCar('cruiser');
    const c = { mesh, speed: 0, heading: 0, targetSpeed: 16, wobble: this.rng.range(0, TAU), ramT: 0 };
    if (at) mesh.position.set(at.x, 0, at.z);
    this.group.add(mesh);
    this.cruisers.push(c);
    return c;
  }

  removeCruiser(c) {
    const i = this.cruisers.indexOf(c);
    if (i >= 0) this.cruisers.splice(i, 1);
    this.group.remove(c.mesh);
  }

  spawnRoadblock() {
    for (let i = 0; i < 2; i++) {
      const mesh = buildCar('cruiser');
      mesh.position.set(0, -50, 0); // placed by updateRoadblock
      this.group.add(mesh);
      this.roadblock.push({ mesh, side: i === 0 ? -1 : 1 });
    }
  }

  clearRoadblock() {
    for (const r of this.roadblock) this.group.remove(r.mesh);
    this.roadblock = [];
  }

  spawnHeli() {
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5e, roughness: 0.5, metalness: 0.3 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 5.2), bodyMat);
    body.castShadow = true;
    const nose = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 8),
      new THREE.MeshStandardMaterial({ color: 0x9ad8e8, roughness: 0.15, metalness: 0.5 }));
    nose.scale.set(1, 0.8, 1);
    nose.position.set(0, -0.1, 2.4);
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.35, 4.6, 8), bodyMat);
    tail.rotation.x = Math.PI / 2;
    tail.position.set(0, 0.2, -4.6);
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.8), bodyMat);
    fin.position.set(0, 0.9, -6.6);
    const skidL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 4), bodyMat);
    skidL.position.set(-1.1, -1.1, 0);
    const skidR = skidL.clone();
    skidR.position.x = 1.1;
    const rotor = new THREE.Group();
    for (let i = 0; i < 2; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(11, 0.06, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x1c1e22, roughness: 0.6 }));
      blade.rotation.y = i * Math.PI / 2;
      rotor.add(blade);
    }
    rotor.position.y = 1.1;
    g.add(body, nose, tail, fin, skidL, skidR, rotor);
    // Searchlight: a visible cone + a ground spotlight disc. Both live
    // in the SCENE (not parented to the heli) so they can be aimed in
    // world space while the heli orbits. The cone is a NARROW shaft
    // (radius 3, front faces only): the first version was a fat
    // double-sided cone at 0.4 opacity, and from the low chase camera
    // its additive surface flooded the whole cover frame white — the
    // beam-off/beam-on diag pair proved it. A thin shaft reads as a
    // searchlight without washing the sky; the ground pool below
    // carries the "light on the road" read.
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xfff2c8, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.FrontSide, fog: false,
    });
    const beam = new THREE.Mesh(new THREE.ConeGeometry(3, 42, 20, 1, true), beamMat);
    this.scene.add(beam);
    // The ground pool is wider than the car (radius 9) so the light
    // spills onto the asphalt around the hero car instead of hiding
    // underneath it — the pool is what sells "searchlight" in the
    // chase frame.
    const spot = new THREE.Mesh(new THREE.CircleGeometry(9, 24),
      new THREE.MeshBasicMaterial({
        map: makeGlowTexture([[0, 0xfff2c8, 0.85], [0.6, 0xfff2c8, 0.3]]),
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      }));
    spot.rotation.x = -Math.PI / 2;
    spot.position.y = 0.15;
    this.scene.add(spot);
    g.userData.rotor = rotor;
    // hold freezes the orbit angle: the chase shot parks the heli at
    // the staged angle so the beam lands in the frame. Live play never
    // sets it (newGame() / continueGame() clear it when the heli lives).
    this.heli = { mesh: g, spot, beam, angle: 0, height: 42, aimAhead: 0, hold: false };
    this.group.add(g);
  }

  removeHeli() {
    if (!this.heli) return;
    this.scene.remove(this.heli.spot);
    this.scene.remove(this.heli.beam);
    this.group.remove(this.heli.mesh);
    this.heli = null;
  }

  // Push a point out of building AABBs (cruisers share the player's collision).
  collide(p, radius = 1.6) {
    for (const c of this.colliders) {
      if (p.x > c.minX - radius && p.x < c.maxX + radius && p.z > c.minZ - radius && p.z < c.maxZ + radius) {
        const dxl = p.x - (c.minX - radius), dxr = (c.maxX + radius) - p.x;
        const dzl = p.z - (c.minZ - radius), dzr = (c.maxZ + radius) - p.z;
        const m = Math.min(dxl, dxr, dzl, dzr);
        if (m === dxl) p.x = c.minX - radius;
        else if (m === dxr) p.x = c.maxX + radius;
        else if (m === dzl) p.z = c.minZ - radius;
        else p.z = c.maxZ + radius;
      }
    }
    p.x = clamp(p.x, WORLD.minX + 2, WORLD.maxX - 2);
    p.z = clamp(p.z, WORLD.minZ + 2, WORLD.waterZ - 3);
  }

  update(dt, player, t) {
    this.flashT += dt;
    const flashOn = Math.floor(this.flashT * 6) % 2 === 0;
    for (const c of this.cruisers) {
      const bar = c.mesh.userData.lightBar;
      if (bar) {
        bar.red.material.color.setHex(flashOn ? 0xff2222 : 0x550000);
        bar.blue.material.color.setHex(flashOn ? 0x002266 : 0x2266ff);
      }
    }
    if (this.wanted === 0) {
      if (this.heli) this.removeHeli();
      return;
    }
    const pp = player.position;
    const pv = player.velocity || { x: 0, z: 0 };
    const playerSpeed = Math.hypot(pv.x, pv.z);

    // Contact: any cruiser within 45 m, or the heli overhead.
    let contact = false;
    for (const c of this.cruisers) {
      if (c.mesh.position.distanceTo(pp) < 45) { contact = true; break; }
    }
    if (this.heli) contact = true;
    if (contact) {
      this.hiddenT = 0;
      this.decayT = 0;
    } else {
      this.hiddenT += dt;
      if (this.hiddenT > 6) {
        this.decayT += dt;
        if (this.decayT > 4) {
          this.decayT = 0;
          this.setWanted(this.wanted - 1, true);
        }
      }
    }

    // Busted: slow with a cruiser on top of you.
    if (playerSpeed < 1.5 && this.wanted > 0) {
      let near = false;
      for (const c of this.cruisers) {
        if (c.mesh.position.distanceTo(pp) < 8) { near = true; break; }
      }
      if (near) {
        this.bustT += dt;
        if (this.bustT > 2.5 && this.onBusted) {
          this.bustT = 0;
          this.onBusted();
        }
      } else {
        // Decay, don't snap: the cruisers orbit at ~18 m/s and all
        // four swing past 8 m together for ~1 s of each ~2.6 s orbit,
        // so a hard reset kept the timer under 2.5 s for 20+ game-s
        // while the player stood still surrounded (diag17). Pressure
        // eases at half rate when no cruiser is close — a stationary
        // player still gets busted, and a player who speeds away
        // sheds it instantly via the outer branch below.
        this.bustT = Math.max(0, this.bustT - dt * 0.5);
      }
    } else this.bustT = 0;

    // Pursuit: intercept steering + ramming speed by wanted level.
    const topSpeed = 15 + this.wanted * 1.6;
    for (const c of this.cruisers) {
      const m = c.mesh;
      const d = m.position.distanceTo(pp);
      // Far behind: respawn ahead of the player, on the road.
      if (d > 130) {
        const ahead = nearestRoadPoint(pp.x + Math.sin(player.heading || 0) * 55, pp.z + Math.cos(player.heading || 0) * 55);
        m.position.set(ahead.x, 0, ahead.z);
        c.speed = 8;
      }
      // Intercept point: where the player will be, plus a wobble so the
      // cruisers don't stack into a single file. Staging-only escort
      // (c.escort, set by the chase shot): hold a fixed formation slot
      // beside the player — lateral + ahead offsets in the player's
      // frame — and match the player's speed, so the flank pair stays
      // visibly adjacent instead of converging onto the hero's line and
      // hiding behind the hero car. Live play never sets it; the
      // cruiser is removed when wanted drops to 0, so it cannot leak.
      let tx, tz, top;
      if (c.escort) {
        const h = player.heading || 0;
        tx = pp.x + Math.sin(h) * c.escort.ahead + Math.cos(h) * c.escort.lat;
        tz = pp.z + Math.cos(h) * c.escort.ahead - Math.sin(h) * c.escort.lat;
        top = playerSpeed + 2;
      } else {
        tx = pp.x + pv.x * 0.45 + Math.sin(t * 0.7 + c.wobble) * 3;
        tz = pp.z + pv.z * 0.45 + Math.cos(t * 0.7 + c.wobble) * 3;
        // c.top is a staging-only override (the chase shot's flank pair):
        // without it a staged cruiser decays to topSpeed within ~1 s and
        // the hero rear-ends it before the capture. Live play never sets
        // it — fresh spawns get the default cap. Cleared by setWanted(0).
        top = c.top ?? topSpeed;
      }
      const wantHeading = Math.atan2(tx - m.position.x, tz - m.position.z);
      c.heading = turnToward(c.heading, wantHeading, 2.6 * dt);
      c.targetSpeed = d > 25 ? top : top * 0.92;
      c.speed += (c.targetSpeed - c.speed) * Math.min(1, dt * 1.5);
      m.position.x += Math.sin(c.heading) * c.speed * dt;
      m.position.z += Math.cos(c.heading) * c.speed * dt;
      m.rotation.y = c.heading;
      this.collide(m.position);
      driveWheels(m, c.speed, 0, dt);
      // Ram: on contact, shove the player's car — at most once per
      // second per cruiser. Without the cooldown a cruiser in contact
      // rammed EVERY frame (12 dmg × 60 fps on a real machine), so a
      // stationary on-foot player was wasted before the 2.5 s bust
      // timer could ever fire; the bust must win that race.
      c.ramT = Math.max(0, c.ramT - dt);
      if (d < 3.4 && player.onRam && c.ramT <= 0) {
        const nx = pp.x - m.position.x, nz = pp.z - m.position.z;
        const nl = Math.hypot(nx, nz) || 1;
        player.onRam(nx / nl, nz / nl, c.speed);
        c.ramT = 1.0;
      }
    }

    // Roadblock: two cruisers angled across the road ahead of the player.
    if (this.roadblock.length > 0) {
      const ahead = nearestRoadPoint(
        pp.x + Math.sin(player.heading || 0) * this.roadblockDist,
        pp.z + Math.cos(player.heading || 0) * this.roadblockDist,
      );
      const onAvenue = Math.abs(ahead.x - pp.x) < Math.abs(ahead.z - pp.z);
      for (const r of this.roadblock) {
        const off = r.side * 2.6;
        if (onAvenue) {
          r.mesh.position.set(ahead.x + off, 0, ahead.z);
          r.mesh.rotation.y = Math.PI / 2 + r.side * 0.5;
        } else {
          r.mesh.position.set(ahead.x, 0, ahead.z + off);
          r.mesh.rotation.y = r.side * 0.5;
        }
        const bar = r.mesh.userData.lightBar;
        if (bar) {
          bar.red.material.color.setHex(flashOn ? 0xff2222 : 0x550000);
          bar.blue.material.color.setHex(flashOn ? 0x002266 : 0x2266ff);
        }
      }
    }

    // Heli: orbit the player, beam + spotlight tracking them.
    if (this.heli) {
      const h = this.heli;
      if (!h.hold) h.angle += dt * 0.25;
      const hx = pp.x + Math.cos(h.angle) * 26;
      const hz = pp.z + Math.sin(h.angle) * 26;
      h.mesh.position.set(hx, h.height, hz);
      h.mesh.lookAt(pp.x, 0, pp.z);
      h.mesh.userData.rotor.rotation.y += dt * 24;
      // The beam + spot track a point ahead of the player when the
      // staging asks for it (aimAhead): in the chase frame the camera
      // sits right behind the player, so a beam aimed AT the player
      // points straight down the lens and floods the frame as a white
      // wedge. Aiming ahead puts a visible shaft across the frame and
      // the light pool on the road ahead of the car.
      const aimAhead = h.aimAhead || 0;
      const tx = pp.x + Math.sin(player.heading || 0) * aimAhead;
      const tz = pp.z + Math.cos(player.heading || 0) * aimAhead;
      h.spot.position.set(tx, 0.15, tz);
      // The beam cone hangs from the heli toward the aim point:
      // rotate its -Y axis onto the heli->target direction and centre
      // it halfway.
      const dir = new THREE.Vector3(tx - hx, -h.height, tz - hz).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);
      h.beam.quaternion.copy(q);
      h.beam.position.set(hx, h.height, hz).add(dir.clone().multiplyScalar(21));
    }
  }

  // Radar blips: every unit's position + kind.
  blips() {
    const out = [];
    for (const c of this.cruisers) out.push({ x: c.mesh.position.x, z: c.mesh.position.z, kind: 'cop' });
    for (const r of this.roadblock) out.push({ x: r.mesh.position.x, z: r.mesh.position.z, kind: 'cop' });
    if (this.heli) out.push({ x: this.heli.mesh.position.x, z: this.heli.mesh.position.z, kind: 'heli' });
    return out;
  }

  get searchActive() { return this.wanted > 0 && this.hiddenT > 0.5; }
}
