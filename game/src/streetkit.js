// Street props — the kit that dresses the sidewalks and verges. Every
// placement runs through placeOnVerge(), which REFUSES the road surface
// (a palm on the road was one of Reza's three rev2 faults) and keeps
// props on sidewalks, medians, verges, and plazas.
//
// The pole rule: every pole and trunk is ONE tapered cylinder (or a
// capsule), never stacked offset boxes — the "Tetris pole" fault.
// Palm fronds are bent planes with a droop curve, not blob-on-stick.

import { AVENUES, STREETS, ROAD_W, WALK_W, onRoad, onSidewalk, districtAt } from './cityplan.js';
import { Rng } from './rng.js';

function std(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05, ...extra });
}

// A palm: one tapered, slightly leaning trunk + 7 drooping fronds.
// Fronds are planes bent by moving their far vertices down.
export function buildPalm(rng, height = 7) {
  const g = new THREE.Group();
  const lean = rng.range(-0.06, 0.06);
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.34, height, 8),
    std(0x6a4a2e),
  );
  trunk.position.y = height / 2;
  trunk.rotation.z = lean;
  trunk.castShadow = true;
  g.add(trunk);
  const frondCount = 7;
  for (let i = 0; i < frondCount; i++) {
    const a = (i / frondCount) * Math.PI * 2 + rng.range(-0.15, 0.15);
    const len = rng.range(2.6, 3.4);
    const geo = new THREE.PlaneGeometry(0.55, len, 1, 5);
    const pos = geo.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      const y = pos.getY(v); // -len/2 .. len/2
      const t = (y + len / 2) / len; // 0 at base, 1 at tip
      pos.setZ(v, -t * t * 1.1); // droop curve
      pos.setX(v, pos.getX(v) * (1 - t * 0.55)); // taper to a point
    }
    geo.computeVertexNormals();
    const frond = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color: rng.pick([0x2e7a3a, 0x3a8a44, 0x2a6a34]), roughness: 0.9, side: THREE.DoubleSide,
    }));
    frond.castShadow = true;
    const holder = new THREE.Group();
    holder.position.y = height;
    holder.rotation.y = a;
    holder.rotation.x = -0.5 - rng.range(0, 0.25); // outward + droop
    frond.position.y = len / 2;
    holder.add(frond);
    g.add(holder);
  }
  // Coconuts: three small spheres under the crown.
  for (let i = 0; i < 3; i++) {
    const nut = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), std(0x5a3a1e));
    const a = (i / 3) * Math.PI * 2;
    nut.position.set(Math.cos(a) * 0.3, height - 0.25, Math.sin(a) * 0.3);
    g.add(nut);
  }
  return g;
}

// A street lamp: ONE tapered pole, one curved arm, one glowing head.
export function buildLamp() {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.13, 6.4, 8), std(0x2e3438));
  pole.position.y = 3.2;
  pole.castShadow = true;
  g.add(pole);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 6), std(0x2e3438));
  arm.rotation.z = Math.PI / 2 - 0.35;
  arm.position.set(0.7, 6.3, 0);
  g.add(arm);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.3), std(0x1c1e22));
  head.position.set(1.35, 6.55, 0);
  g.add(head);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xffe9a8 }));
  bulb.position.set(1.35, 6.42, 0);
  g.add(bulb);
  return g;
}

function buildBench() {
  const g = new THREE.Group();
  const wood = std(0x8a6a4a);
  const iron = std(0x2e3438);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.5), wood);
  seat.position.y = 0.48;
  seat.castShadow = true;
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 0.08), wood);
  back.position.set(0, 0.85, -0.24);
  back.rotation.x = -0.15;
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.48, 0.5), iron);
  legL.position.set(-0.8, 0.24, 0);
  const legR = legL.clone();
  legR.position.x = 0.8;
  g.add(seat, back, legL, legR);
  return g;
}

function buildHydrant() {
  const g = new THREE.Group();
  const red = std(0xc22e2e, { roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.55, 10), red);
  body.position.y = 0.28;
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), red);
  cap.position.y = 0.58;
  const side = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.3, 8), red);
  side.rotation.z = Math.PI / 2;
  side.position.y = 0.4;
  g.add(body, cap, side);
  return g;
}

function buildTrafficLight() {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 5.2, 8), std(0x2e3438));
  pole.position.y = 2.6;
  pole.castShadow = true;
  g.add(pole);
  const housing = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.1, 0.3), std(0x1c1e22));
  housing.position.set(0, 5.4, 0);
  g.add(housing);
  const colors = [0xff4444, 0xffc42e, 0x2ecc71];
  for (let i = 0; i < 3; i++) {
    const lamp = new THREE.Mesh(new THREE.CircleGeometry(0.13, 12),
      new THREE.MeshBasicMaterial({ color: i === 0 ? colors[0] : 0x331111 }));
    lamp.position.set(0, 5.75 - i * 0.36, 0.16);
    g.add(lamp);
  }
  return g;
}

function buildBusStop() {
  const g = new THREE.Group();
  const frame = std(0x2e6e8a, { metalness: 0.4, roughness: 0.5 });
  for (const [lx, lz] of [[-1.4, -0.8], [1.4, -0.8]]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.4, 6), frame);
    post.position.set(lx, 1.2, lz);
    g.add(post);
  }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 1.6), frame);
  roof.position.y = 2.45;
  roof.castShadow = true;
  g.add(roof);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.6),
    new THREE.MeshStandardMaterial({ color: 0x9ad8e8, transparent: true, opacity: 0.35, roughness: 0.2 }));
  glass.position.set(0, 1.3, -0.8);
  g.add(glass);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xf2a93b, roughness: 0.7 }));
  sign.position.set(0, 2.2, -0.7);
  g.add(sign);
  return g;
}

function buildBeachUmbrella(rng) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), std(0xe8e8e8));
  pole.position.y = 1.1;
  g.add(pole);
  const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.7, 10),
    std(rng.pick([0xe87a8a, 0x2ec4b6, 0xf2a93b, 0xd94f3d])));
  canopy.position.y = 2.3;
  canopy.castShadow = true;
  g.add(canopy);
  return g;
}

// The placement gate: refuse the road, refuse building footprints
// (checked by the caller via colliders), accept sidewalk/verge/plaza.
export function placeOnVerge(group, mesh, x, z, ry = 0) {
  if (onRoad(x, z)) return false; // NEVER on the road surface
  mesh.position.set(x, 0, z);
  mesh.rotation.y = ry;
  group.add(mesh);
  return true;
}

export function buildStreetProps(scene, rng) {
  const group = new THREE.Group();
  group.name = 'street-props';
  const propRng = rng.fork('props');

  // Palms line the beachfront boulevard + the main avenue, on the
  // SIDEWALK edge (x offset puts them on the walk, never the asphalt).
  for (let z = -140; z <= 140; z += 20) {
    for (const side of [-1, 1]) {
      const x = side * (ROAD_W / 2 + WALK_W + 0.6);
      if (propRng.chance(0.85)) {
        placeOnVerge(group, buildPalm(propRng, propRng.range(6, 8.5)), x, z + propRng.range(-2, 2));
      }
    }
  }
  // Beachfront row: palms + umbrellas on the sand side of the boardwalk.
  for (let x = -190; x <= 190; x += 16) {
    if (propRng.chance(0.7)) {
      placeOnVerge(group, buildPalm(propRng, propRng.range(5.5, 7.5)), x + propRng.range(-3, 3), 172);
    }
    if (propRng.chance(0.5)) {
      placeOnVerge(group, buildBeachUmbrella(propRng), x + 8, 178);
    }
  }
  // Lamps on every avenue corner + street corners.
  for (const ax of AVENUES) {
    for (const sz of STREETS) {
      if (propRng.chance(0.6)) {
        placeOnVerge(group, buildLamp(), ax + ROAD_W / 2 + WALK_W + 0.4, sz + ROAD_W / 2 + WALK_W + 0.4);
      }
    }
  }
  // Benches + hydrants + bus stops along sidewalks.
  for (let i = 0; i < 26; i++) {
    const ax = propRng.pick(AVENUES);
    const z = propRng.range(-140, 140);
    const x = ax + (propRng.chance(0.5) ? 1 : -1) * (ROAD_W / 2 + WALK_W / 2);
    placeOnVerge(group, buildBench(), x, z, propRng.chance(0.5) ? 0 : Math.PI);
  }
  for (let i = 0; i < 18; i++) {
    const ax = propRng.pick(AVENUES);
    const z = propRng.range(-140, 140);
    const x = ax + (propRng.chance(0.5) ? 1 : -1) * (ROAD_W / 2 + WALK_W - 0.5);
    placeOnVerge(group, buildHydrant(), x, z);
  }
  for (const [bx, bz] of [[-40, -20], [40, 60], [0, 100], [-80, -100], [120, 20]]) {
    placeOnVerge(group, buildBusStop(), bx + ROAD_W / 2 + WALK_W + 1.2, bz);
  }
  // Traffic lights at the four busiest intersections.
  for (const [tx, tz] of [[0, -20], [0, 20], [-40, 20], [80, -60]]) {
    placeOnVerge(group, buildTrafficLight(), tx + ROAD_W / 2 + WALK_W + 0.3, tz - ROAD_W / 2 - WALK_W - 0.3);
  }

  scene.add(group);
  return group;
}
