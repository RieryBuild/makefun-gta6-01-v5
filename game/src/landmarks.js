// Landmarks — the navigation anchors and view-breakers (GTA P2). Every
// long street vista terminates on one: the lighthouse, the Ferris wheel,
// the pier, TORRE SOL, the causeway, the marina. They are what makes
// the city feel bigger than its 400 metres.

import { LANDMARKS } from './cityplan.js';
import { makeGlowTexture } from './surface.js';
import { makeBrandTexture } from './brands.js';

function std(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05, ...extra });
}

function buildLighthouse(x, z) {
  const g = new THREE.Group();
  // Tapered tower, red/white bands — the bands are stacked rings, but
  // the SILHOUETTE is one tapered cylinder (the Tetris rule is about
  // offset boxy segments, not banding on a single taper).
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.6, 22, 14), std(0xf2ead8));
  tower.position.y = 11;
  tower.castShadow = true;
  g.add(tower);
  for (let i = 0; i < 3; i++) {
    const band = new THREE.Mesh(new THREE.CylinderGeometry(1.95 - i * 0.22, 2.15 - i * 0.22, 2.2, 14), std(0xd94f3d));
    band.position.y = 4 + i * 6;
    g.add(band);
  }
  const gallery = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 0.5, 14), std(0x2e3438));
  gallery.position.y = 22.2;
  g.add(gallery);
  const lampRoom = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 2.2, 12),
    new THREE.MeshStandardMaterial({ color: 0xffe9a8, emissive: 0xffd27a, emissiveIntensity: 1.6 }));
  lampRoom.position.y = 23.5;
  g.add(lampRoom);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(1.7, 1.4, 12), std(0x2e3438));
  cap.position.y = 25.2;
  g.add(cap);
  // Rotating beam: two opposite additive cones + a feathered glow sprite.
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffe9a8, transparent: true, opacity: 0.16,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false,
  });
  const beam = new THREE.Group();
  for (const dir of [0, Math.PI]) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(6, 60, 16, 1, true), beamMat);
    cone.rotation.z = Math.PI / 2;
    cone.rotation.y = dir;
    cone.position.x = dir === 0 ? 30 : -30;
    beam.add(cone);
  }
  beam.position.y = 23.5;
  g.add(beam);
  g.userData.beam = beam;
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture([[0, 0xffe9a8, 0.9], [0.4, 0xffd27a, 0.35]]),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
  }));
  glow.scale.set(14, 14, 1);
  glow.position.y = 23.5;
  g.add(glow);
  g.position.set(x, 0, z);
  return g;
}

function buildFerrisWheel(x, z) {
  const g = new THREE.Group();
  // A-frame legs: two tapered cylinders leaning in, not boxes.
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 20, 8), std(0xd94f3d));
    leg.position.set(side * 3.4, 9, 0);
    leg.rotation.z = side * 0.32;
    leg.castShadow = true;
    g.add(leg);
  }
  const wheel = new THREE.Group();
  wheel.position.y = 19;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(15, 0.35, 8, 48), std(0xf2a93b));
  rim.castShadow = true;
  wheel.add(rim);
  const rim2 = rim.clone();
  rim2.position.z = 1.2;
  wheel.add(rim2);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 15, 6), std(0xf2ead8));
    spoke.position.set(Math.cos(a) * 7.5, Math.sin(a) * 7.5, 0.6);
    spoke.rotation.z = a + Math.PI / 2;
    wheel.add(spoke);
    // Gondola: a small cabin hanging from the rim.
    const cab = new THREE.Group();
    const cabBody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 1.6),
      std([0xe87a8a, 0x2ec4b6, 0xf2a93b, 0x4a90d9][i % 4]));
    cabBody.castShadow = true;
    const cabRoof = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 1.8), std(0xf2ead8));
    cabRoof.position.y = 1;
    cab.add(cabBody, cabRoof);
    cab.position.set(Math.cos(a) * 15, Math.sin(a) * 15, 0.6);
    cab.userData.angle = a;
    wheel.add(cab);
    wheel.userData['cab' + i] = cab;
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.4, 12), std(0xd94f3d));
  hub.rotation.x = Math.PI / 2;
  wheel.add(hub);
  g.add(wheel);
  g.userData.wheel = wheel;
  // Ticket booth + sign at the base.
  const booth = new THREE.Mesh(new THREE.BoxGeometry(4, 2.6, 3), std(0xf2ead8));
  booth.position.set(6, 1.3, 2.5);
  booth.castShadow = true;
  g.add(booth);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(7, 2),
    new THREE.MeshStandardMaterial({ map: makeBrandTexture('solaire'), roughness: 0.7 }));
  sign.position.set(0, 5.4, 2.6);
  g.add(sign);
  g.position.set(x, 0, z);
  return g;
}

function buildPier(x, z) {
  const g = new THREE.Group();
  // Deck on piles, running south into the water.
  const deck = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 46), std(0x9a7a52));
  deck.position.set(0, 1.2, 23);
  deck.castShadow = true;
  deck.receiveShadow = true;
  g.add(deck);
  for (let dz = 2; dz < 46; dz += 6) {
    for (const dx of [-4.4, 4.4]) {
      const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 3.4, 8), std(0x5a4a3a));
      pile.position.set(dx, -0.2, dz);
      g.add(pile);
    }
  }
  for (const dx of [-4.9, 4.9]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1, 46), std(0xf2ead8));
    rail.position.set(dx, 2, 23);
    g.add(rail);
  }
  // End pavilion: a small octagonal kiosk with a pointed roof.
  const kiosk = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 3, 8), std(0xe87a8a));
  kiosk.position.set(0, 3, 44);
  kiosk.castShadow = true;
  g.add(kiosk);
  const kRoof = new THREE.Mesh(new THREE.ConeGeometry(4, 2.2, 8), std(0xd94f3d));
  kRoof.position.set(0, 5.6, 44);
  g.add(kRoof);
  // Lamp posts along the deck (single tapered poles).
  for (let dz = 6; dz < 44; dz += 12) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 3.4, 6), std(0x2e3438));
    pole.position.set(-4.4, 3.1, dz);
    g.add(pole);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xffe9a8 }));
    bulb.position.set(-4.4, 4.9, dz);
    g.add(bulb);
  }
  g.position.set(x, 0, z);
  return g;
}

function buildCauseway() {
  // Puente del Sol: a deck bridge over the marina inlet on the east,
  // with two towers and cable stays — the chase frame's backdrop.
  const g = new THREE.Group();
  const deck = new THREE.Mesh(new THREE.BoxGeometry(70, 1.2, 12), std(0x8a8a86));
  deck.position.set(0, 6, 0);
  deck.castShadow = true;
  g.add(deck);
  for (const tx of [-20, 20]) {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(2.4, 26, 2.4), std(0xd94f3d));
    tower.position.set(tx, 13, 0);
    tower.castShadow = true;
    g.add(tower);
    // Cable stays: thin lines from tower top to deck.
    for (const [dx, dy] of [[-14, 6.6], [-7, 6.6], [7, 6.6], [14, 6.6]]) {
      const from = new THREE.Vector3(tx, 25, 0);
      const to = new THREE.Vector3(tx + dx, dy, 0);
      const len = from.distanceTo(to);
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, len, 4), std(0x2e3438));
      cable.position.copy(from).lerp(to, 0.5);
      cable.lookAt(to);
      cable.rotateX(Math.PI / 2);
      g.add(cable);
    }
  }
  g.position.set(LANDMARKS.causeway.x, 0, LANDMARKS.causeway.z);
  g.rotation.y = Math.PI / 2;
  return g;
}

function buildMarina() {
  const g = new THREE.Group();
  // Docks + moored boats: hulls with cabins, masts, coloured stripes.
  for (let i = 0; i < 3; i++) {
    const dock = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 30), std(0x9a7a52));
    dock.position.set(-14 + i * 14, 0.4, 0);
    g.add(dock);
  }
  const hullCols = [0xf2ead8, 0x2ec4b6, 0xe87a8a, 0x4a90d9];
  for (let i = 0; i < 6; i++) {
    const boat = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 8), std(hullCols[i % 4]));
    hull.position.y = 0.4;
    hull.castShadow = true;
    const bow = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.4, 4), std(hullCols[i % 4]));
    bow.rotation.x = -Math.PI / 2;
    bow.rotation.y = Math.PI / 4;
    bow.position.set(0, 0.4, 5);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 3), std(0xf2ead8));
    cabin.position.set(0, 1.6, -0.5);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 7, 6), std(0x8a8a86));
    mast.position.set(0, 4.5, 1);
    boat.add(hull, bow, cabin, mast);
    boat.position.set(-14 + (i % 3) * 14 + 4.5, 0, -10 + Math.floor(i / 3) * 18);
    boat.rotation.y = (i % 2 ? 0.06 : -0.06);
    g.add(boat);
  }
  g.position.set(LANDMARKS.marina.x, 0, LANDMARKS.marina.z);
  return g;
}

export function buildLandmarks(scene) {
  const group = new THREE.Group();
  group.name = 'landmarks';
  const lighthouse = buildLighthouse(LANDMARKS.lighthouse.x, LANDMARKS.lighthouse.z);
  const ferris = buildFerrisWheel(LANDMARKS.ferris.x, LANDMARKS.ferris.z);
  const pier = buildPier(LANDMARKS.pier.x, LANDMARKS.pier.z);
  const causeway = buildCauseway();
  const marina = buildMarina();
  group.add(lighthouse, ferris, pier, causeway, marina);
  scene.add(group);
  return {
    group, lighthouse, ferris,
    update(dt, t) {
      if (lighthouse.userData.beam) lighthouse.userData.beam.rotation.y = t * 0.5;
      const wheel = ferris.userData.wheel;
      if (wheel) {
        wheel.rotation.z = t * 0.05;
        // Gondolas stay level as the wheel turns.
        for (let i = 0; i < 8; i++) {
          const cab = wheel.userData['cab' + i];
          if (cab) cab.rotation.z = -wheel.rotation.z;
        }
      }
    },
  };
}
