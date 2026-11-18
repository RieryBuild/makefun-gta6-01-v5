// Buildings — five archetypes with distinct silhouettes, never endless
// extruded boxes with window grids (house rule §5). Facades come from
// surface.js with aligned window grids and lit floors that have a
// reason (penthouse lit, ground-floor shops lit, middle floors in
// bands). The height gradient runs tall in CENTRO down to villas in
// COLINAS, and every building is aligned to its block.
//
// Archetypes: tower (glass curtain wall + setbacks), deco (pastel Art
// Deco + stepped parapet + awning), warehouse (corrugated + big door +
// sawtooth roof), marketRow (shopfront + balconies), villa (pitched roof
// + garden wall). Each build returns its collision AABB.

import { DISTRICTS } from './palette.js';
import { AVENUES, STREETS, ROAD_W, WALK_W, districtAt } from './cityplan.js';
import { makeFacadeTexture, makeTowerTexture, makeContainerTexture, makeAwningTexture, makeSignTexture } from './surface.js';
import { makeBrandTexture, makeVerticalSignTexture } from './brands.js';
import { Rng } from './rng.js';

const colliders = [];

export function buildingColliders() { return colliders; }

function box(w, h, d, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function std(mapOrColor, extra = {}) {
  if (typeof mapOrColor === 'number') {
    return new THREE.MeshStandardMaterial({ color: mapOrColor, roughness: 0.85, metalness: 0.05, ...extra });
  }
  return new THREE.MeshStandardMaterial({ map: mapOrColor, roughness: 0.85, metalness: 0.05, ...extra });
}

// A pitched roof prism, built from a rotated box pair (no custom BufferGeometry needed).
function pitchedRoof(w, d, h, mat) {
  const g = new THREE.Group();
  const slope = Math.sqrt((w / 2) ** 2 + h ** 2);
  const angle = Math.atan2(h, w / 2);
  const left = box(slope + 0.6, 0.3, d + 0.6, mat, -w / 4, h / 2, 0);
  left.rotation.z = angle;
  const right = box(slope + 0.6, 0.3, d + 0.6, mat, w / 4, h / 2, 0);
  right.rotation.z = -angle;
  g.add(left, right);
  return g;
}

function addCollider(x, z, w, d, h) {
  colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, h });
}

function rooftopDressing(g, w, d, h, rng, pal) {
  // AC units + a water tower or antenna — the skyline's small print.
  const n = rng.int(1, 3);
  for (let i = 0; i < n; i++) {
    const ac = box(rng.range(1, 2), rng.range(0.6, 1), rng.range(1, 2), std(0x8a8a86),
      rng.range(-w / 2 + 1.5, w / 2 - 1.5), h + 0.4, rng.range(-d / 2 + 1.5, d / 2 - 1.5));
    g.add(ac);
  }
  if (rng.chance(0.4)) { // water tower: cylinder tank + cone roof + legs
    const tw = new THREE.Group();
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.8, 10), std(0x7a5a3a));
    tank.position.y = 2.6; tank.castShadow = true;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.9, 10), std(0x5a3a26));
    cone.position.y = 3.9; cone.castShadow = true;
    tw.add(tank, cone);
    for (const [lx, lz] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2, 6), std(0x4a4a46));
      leg.position.set(lx, 1, lz);
      tw.add(leg);
    }
    tw.position.set(rng.range(-w / 2 + 2, w / 2 - 2), h, rng.range(-d / 2 + 2, d / 2 - 2));
    g.add(tw);
  }
  if (rng.chance(0.5)) { // antenna: ONE tapered cylinder, never segments
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.09, rng.range(3, 6), 6), std(0x3a3a3a));
    ant.position.set(rng.range(-w / 3, w / 3), h + 2, rng.range(-d / 3, d / 3));
    g.add(ant);
  }
}

function buildTower(x, z, w, d, h, pal, rng, seed) {
  const g = new THREE.Group();
  const tex = makeTowerTexture({ glass: pal.glass, glassLit: pal.glassLit, trim: pal.trim, seed, floors: Math.max(6, Math.round(h / 3.2)) });
  // Setbacks: the tower steps in twice as it rises — a skyline, not a slab.
  const tiers = h > 40 ? 3 : 2;
  let y = 0, cw = w, cd = d;
  for (let t = 0; t < tiers; t++) {
    const th = t === tiers - 1 ? h - y : (h / tiers) * (t === 0 ? 1.15 : 1);
    const tier = box(cw, th, cd, std(tex), 0, y + th / 2, 0);
    g.add(tier);
    y += th;
    cw *= 0.78; cd *= 0.78;
  }
  // Crown: a lit beacon ring at the very top.
  const crown = box(cw * 0.9, 1.2, cd * 0.9, std(0x2a2a3a), 0, h + 0.6, 0);
  g.add(crown);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff4444 }));
  beacon.position.y = h + 1.8;
  g.add(beacon);
  // Ground-floor lobby: glass + canopy.
  const lobby = box(w * 0.7, 3.4, 2.4, std(pal.glass, { metalness: 0.4, roughness: 0.3 }), 0, 1.7, d / 2 + 0.6);
  g.add(lobby);
  rooftopDressing(g, cw, cd, h, rng, pal);
  g.position.set(x, 0, z);
  addCollider(x, z, w, d, h);
  return g;
}

function buildDeco(x, z, w, d, h, pal, rng, seed, brand) {
  const g = new THREE.Group();
  const base = pal.facades[seed % pal.facades.length];
  const tex = makeFacadeTexture({
    base, trim: pal.trim, glass: pal.glass, glassLit: pal.glassLit,
    cols: Math.max(3, Math.round(w / 3)), rows: Math.max(2, Math.round(h / 3.4)),
    seed, shopfront: true,
  });
  const body = box(w, h, d, std(tex), 0, h / 2, 0);
  g.add(body);
  // Stepped parapet — the Art Deco crown.
  g.add(box(w * 0.7, 1.1, d * 0.7, std(pal.trim), 0, h + 0.55, 0));
  g.add(box(w * 0.45, 1.0, d * 0.45, std(base), 0, h + 1.6, 0));
  // Rounded corner: a half-cylinder column at the street corner.
  const corner = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, h, 12, 1, false, 0, Math.PI / 2), std(base));
  corner.position.set(w / 2, h / 2, d / 2);
  corner.rotation.y = Math.PI;
  corner.castShadow = true;
  g.add(corner);
  // Awning over the shopfront.
  const awnTex = makeAwningTexture(pal.accent, 0xf2ead8);
  const awn = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.86, 2.2),
    new THREE.MeshStandardMaterial({ map: awnTex, side: THREE.DoubleSide, roughness: 0.9 }));
  awn.position.set(0, 3.6, d / 2 + 1.1);
  awn.rotation.x = -Math.PI / 2 + 0.5;
  g.add(awn);
  // Brand sign band above the awning.
  if (brand) {
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.8, 1.4),
      new THREE.MeshStandardMaterial({ map: makeBrandTexture(brand), roughness: 0.7 }));
    sign.position.set(0, 5.2, d / 2 + 0.15);
    g.add(sign);
  }
  g.position.set(x, 0, z);
  addCollider(x, z, w, d, h);
  return g;
}

function buildWarehouse(x, z, w, d, h, pal, rng, seed) {
  const g = new THREE.Group();
  const base = pal.facades[seed % pal.facades.length];
  const tex = makeContainerTexture(base, pal.accent);
  const body = box(w, h, d, std(tex), 0, h / 2, 0);
  g.add(body);
  // Sawtooth roof: three prisms across the top.
  for (let i = 0; i < 3; i++) {
    const tooth = pitchedRoof(w / 3 - 0.4, d, 1.6, std(0x4a4a4e));
    tooth.position.set(-w / 3 + i * (w / 3), h, 0);
    g.add(tooth);
  }
  // Big roller door on the street face.
  const door = box(w * 0.4, h * 0.62, 0.3, std(0x3a4a4c, { metalness: 0.5, roughness: 0.5 }), -w * 0.18, h * 0.31, d / 2 + 0.1);
  g.add(door);
  for (let i = 0; i < 5; i++) {
    g.add(box(w * 0.4, 0.12, 0.06, std(0x2a3436), -w * 0.18, 0.8 + i * (h * 0.62 / 5), d / 2 + 0.28));
  }
  // DEL SOL LINE containers stacked at the lot's front corners — on the
  // verge strip, never on the road.
  const contCols = [0xd97a2e, 0x2e6e8a, 0x8a2e3e];
  for (let i = 0; i < 3; i++) {
    const ct = makeContainerTexture(contCols[i % 3], 0xf2ead8);
    const cont = box(4.4, 2.2, 2.2, std(ct), (i % 2 ? 1 : -1) * (w / 2 - 2.4), 1.1 + Math.floor(i / 2) * 2.2, d / 2 + 1.2);
    g.add(cont);
  }
  g.position.set(x, 0, z);
  addCollider(x, z, w, d, h);
  return g;
}

function buildMarketRow(x, z, w, d, h, pal, rng, seed, brand) {
  const g = new THREE.Group();
  const base = pal.facades[seed % pal.facades.length];
  const tex = makeFacadeTexture({
    base, trim: pal.trim, glass: pal.glass, glassLit: pal.glassLit,
    cols: Math.max(3, Math.round(w / 3)), rows: Math.max(2, Math.round(h / 3.2)),
    seed, shopfront: true,
  });
  const body = box(w, h, d, std(tex), 0, h / 2, 0);
  g.add(body);
  // Balconies on the upper floor: slab + railing, aligned with windows.
  const floors = Math.max(1, Math.floor(h / 3.2) - 1);
  for (let f = 0; f < floors; f++) {
    const by = 4.2 + f * 3.2;
    const slab = box(w * 0.8, 0.18, 1.1, std(pal.trim), 0, by, d / 2 + 0.55);
    g.add(slab);
    for (let rx = -w * 0.38; rx <= w * 0.38; rx += 1.1) {
      g.add(box(0.06, 0.9, 0.06, std(0x2a2a2a), rx, by + 0.5, d / 2 + 1.05));
    }
    g.add(box(w * 0.8, 0.08, 0.08, std(0x2a2a2a), 0, by + 0.95, d / 2 + 1.05));
  }
  // Striped awning + sign band.
  const awnTex = makeAwningTexture(pal.accent, 0xf2ead8);
  const awn = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.86, 2), new THREE.MeshStandardMaterial({ map: awnTex, side: THREE.DoubleSide, roughness: 0.9 }));
  awn.position.set(0, 3.4, d / 2 + 1);
  awn.rotation.x = -Math.PI / 2 + 0.5;
  g.add(awn);
  const signTex = brand ? makeBrandTexture(brand) : makeSignTexture('MERCADO', { bg: pal.trim, fg: pal.glassLit });
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.8, 1.3), new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.7 }));
  sign.position.set(0, 5, d / 2 + 0.15);
  g.add(sign);
  rooftopDressing(g, w, d, h, rng, pal);
  g.position.set(x, 0, z);
  addCollider(x, z, w, d, h);
  return g;
}

function buildVilla(x, z, w, d, h, pal, rng, seed) {
  const g = new THREE.Group();
  const base = pal.facades[seed % pal.facades.length];
  const tex = makeFacadeTexture({
    base, trim: pal.trim, glass: pal.glass, glassLit: pal.glassLit,
    cols: Math.max(2, Math.round(w / 4)), rows: 2, seed,
  });
  const body = box(w, h, d, std(tex), 0, h / 2, 0);
  g.add(body);
  const roof = pitchedRoof(w + 0.8, d + 0.8, 2.2, std(0xa85a3a));
  roof.position.y = h;
  g.add(roof);
  // Garden wall + gate: the villa sits behind its own wall.
  const wallH = 1.6;
  g.add(box(w + 6, wallH, 0.3, std(base), 0, wallH / 2, d / 2 + 3));
  g.add(box(0.3, wallH, d + 6, std(base), -w / 2 - 3, wallH / 2, 0));
  g.add(box(0.3, wallH, d + 6, std(base), w / 2 + 3, wallH / 2, 0));
  // A tree in the garden (trunk + layered foliage — real geometry).
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 3.2, 8), std(0x6a4a2e));
  trunk.position.set(w / 2 - 1, 1.6, -d / 2 + 1.5);
  trunk.castShadow = true;
  g.add(trunk);
  for (let i = 0; i < 3; i++) {
    const fol = new THREE.Mesh(new THREE.SphereGeometry(1.5 - i * 0.3, 8, 6), std(0x4a7a3a));
    fol.position.set(w / 2 - 1 + (i - 1) * 0.5, 3.6 + i * 0.8, -d / 2 + 1.5);
    fol.scale.y = 0.75;
    fol.castShadow = true;
    g.add(fol);
  }
  g.position.set(x, 0, z);
  addCollider(x, z, w + 6, d + 6, h);
  return g;
}

// The city fill: walk every block between the roads and place one
// building per block, archetype by district, height by the gradient.
export function buildCity(scene, rng) {
  const group = new THREE.Group();
  group.name = 'city';
  const marketBrands = ['burgerSol', 'coralCola', 'playaWear', 'solBrau'];
  const beachBrands = ['solaire', 'coralCola', 'playaWear', 'radioSol'];
  let seed = 1;
  const blockCentersX = [];
  for (let i = 0; i < AVENUES.length - 1; i++) blockCentersX.push((AVENUES[i] + AVENUES[i + 1]) / 2);
  const blockCentersZ = [];
  for (let i = 0; i < STREETS.length - 1; i++) blockCentersZ.push((STREETS[i] + STREETS[i + 1]) / 2);

  for (const bx of blockCentersX) {
    for (const bz of blockCentersZ) {
      const distId = districtAt(bx, bz);
      const pal = DISTRICTS[distId];
      const brng = rng.fork(`block-${bx}-${bz}`);
      seed++;
      // Some blocks stay open (plazas, parking, the market square).
      if (brng.chance(0.14)) continue;
      // Blocks are 22 m wide (40 m spacing minus road + sidewalks), so
      // footprints cap at 19 m — a building must never reach the road.
      const w = brng.range(14, 19), d = brng.range(13, 19);
      if (distId === 'CENTRO') {
        // Height gradient: tallest near the district heart (100,-140).
        const distHeart = Math.hypot(bx - 100, bz + 140);
        const h = Math.max(18, 62 - distHeart * 0.28 + brng.range(-4, 8));
        group.add(buildTower(bx, bz, w, d, h, pal, brng, seed));
      } else if (distId === 'PLAYA_DORADA') {
        const h = brng.range(9, 16);
        group.add(buildDeco(bx, bz, w, d, h, pal, brng, seed, brng.pick(beachBrands)));
      } else if (distId === 'PUERTO_VIEJO') {
        const h = brng.range(7, 11);
        group.add(buildWarehouse(bx, bz, w, d, h, pal, brng, seed));
      } else if (distId === 'COLINAS') {
        const h = brng.range(6, 8);
        group.add(buildVilla(bx, bz, w * 0.8, d * 0.8, h, pal, brng, seed));
      } else { // MERCADO + VISTA_MAR rows
        const h = brng.range(9, 15);
        group.add(buildMarketRow(bx, bz, w, d, h, pal, brng, seed, brng.pick(marketBrands)));
      }
    }
  }

  // The market square: open plaza with stalls (kept clear of buildings).
  buildMarketSquare(group, rng);

  // Billboards on tall poles along the main boulevard (x=0) — the
  // poles are single tapered cylinders with a cross-arm, never stacked boxes.
  const bbBrands = ['delSolLine', 'marlinMotors', 'lunaAir', 'radioSol', 'solBrau'];
  for (let i = 0; i < 5; i++) {
    const z = -120 + i * 60;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.5, 11, 10), std(0x4a4a4e));
    pole.position.set(7.5, 5.5, z);
    pole.castShadow = true;
    const board = new THREE.Mesh(new THREE.PlaneGeometry(12, 5),
      new THREE.MeshStandardMaterial({ map: makeBrandTexture(bbBrands[i], true), roughness: 0.7, side: THREE.DoubleSide }));
    board.position.set(7.5, 12.5, z);
    board.rotation.y = Math.PI / 2;
    group.add(pole, board);
  }

  // TORRE SOL vertical sign on the tallest tower.
  const vsign = new THREE.Mesh(new THREE.PlaneGeometry(6, 14),
    new THREE.MeshStandardMaterial({ map: makeVerticalSignTexture('solaire'), roughness: 0.7 }));
  vsign.position.set(100, 46, -140 + 13);
  group.add(vsign);

  scene.add(group);
  return group;
}

function buildMarketSquare(group, rng) {
  // Mercado Central plaza at (-40, 20): stalls with striped canopies,
  // crates, and a fountain basin — the market's heart.
  const px = -40, pz = 20;
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(16, 24),
    new THREE.MeshStandardMaterial({ color: 0xa89a80, roughness: 0.95 }));
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(px, 0.08, pz);
  plaza.receiveShadow = true;
  group.add(plaza);
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.8, 0.9, 20), std(0x8a8a86));
  basin.position.set(px, 0.45, pz);
  group.add(basin);
  const waterDisc = new THREE.Mesh(new THREE.CircleGeometry(3, 20),
    new THREE.MeshStandardMaterial({ color: 0x4a7a8c, roughness: 0.2, metalness: 0.3 }));
  waterDisc.rotation.x = -Math.PI / 2;
  waterDisc.position.set(px, 0.92, pz);
  group.add(waterDisc);
  const stallRng = rng.fork('stalls');
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const sx = px + Math.cos(a) * 11, sz = pz + Math.sin(a) * 11;
    const stall = new THREE.Group();
    const awnTex = makeAwningTexture(stallRng.pick([0xd94f3d, 0x2ec4b6, 0xf2a93b]), 0xf2ead8);
    const canopy = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 3.4),
      new THREE.MeshStandardMaterial({ map: awnTex, side: THREE.DoubleSide, roughness: 0.9 }));
    canopy.rotation.x = -Math.PI / 2 + 0.25;
    canopy.position.y = 2.6;
    stall.add(canopy);
    for (const [lx, lz] of [[-2, -1.5], [2, -1.5], [-2, 1.5], [2, 1.5]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 6), std(0x5a4a3a));
      leg.position.set(lx, 1.3, lz);
      stall.add(leg);
    }
    const counter = box(4, 1, 2.4, std(0x8a6a4a), 0, 0.5, 0);
    stall.add(counter);
    const goods = box(3.4, 0.5, 1.8, std(stallRng.pick([0xd94f3d, 0xf2a93b, 0x6a9a5a, 0xe87a8a])), 0, 1.25, 0);
    stall.add(goods);
    stall.position.set(sx, 0, sz);
    stall.rotation.y = -a + Math.PI / 2;
    group.add(stall);
  }
}
