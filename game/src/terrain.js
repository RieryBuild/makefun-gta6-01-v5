// The ground of PUERTO DEL SOL: the land slab, the road grid, the
// sidewalks, the beach, and the water. Roads are built as geometry
// strips with a canvas asphalt texture; sidewalks are raised slabs so
// the curb reads in 3D; crosswalks are white bars at intersections.
// Props never sit on the road — streetkit checks onRoad() before every
// placement, and the road mesh itself carries the parking lanes where
// parked cars belong.

import { WORLD, AVENUES, STREETS, ROAD_W, WALK_W } from './cityplan.js';
import { SKY } from './palette.js';
import { makeRoadTexture, makeSidewalkTexture, makeSandTexture, makeWaterTexture, makeGrassTexture } from './surface.js';

export function buildTerrain(scene) {
  const group = new THREE.Group();
  group.name = 'terrain';

  // Land slab: the whole city sits on one big plane, concrete-grey,
  // with a grass tint in the hills quarter (a second plane on top).
  // Kept dark enough to read as concrete under the sunset lights: at
  // 0x7a7568 the ~2x total illumination washed block interiors to
  // near-white.
  const landMat = new THREE.MeshStandardMaterial({ color: 0x6b665c, roughness: 0.95 });
  const land = new THREE.Mesh(new THREE.PlaneGeometry(WORLD.groundSize, WORLD.groundSize), landMat);
  land.rotation.x = -Math.PI / 2;
  land.position.y = -0.05;
  land.receiveShadow = true;
  group.add(land);

  // Hills quarter lawn.
  const grassTex = makeGrassTexture();
  grassTex.repeat.set(24, 10);
  const lawn = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1 }),
  );
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.set(-80, 0.02, -140);
  lawn.receiveShadow = true;
  group.add(lawn);

  // Beach: a sand strip along the south edge, then the water plane.
  const sandTex = makeSandTexture();
  sandTex.repeat.set(40, 3);
  const beach = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD.groundSize, 24),
    new THREE.MeshStandardMaterial({ map: sandTex, roughness: 1 }),
  );
  beach.rotation.x = -Math.PI / 2;
  beach.position.set(0, 0.02, WORLD.beachZ + 8);
  beach.receiveShadow = true;
  group.add(beach);

  const waterTex = makeWaterTexture();
  waterTex.repeat.set(24, 12);
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD.groundSize, 320),
    new THREE.MeshStandardMaterial({ map: waterTex, roughness: 0.25, metalness: 0.35, transparent: true, opacity: 0.96 }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -0.15, WORLD.waterZ + 150);
  group.add(water);
  // Marina water on the east edge.
  const waterE = water.clone();
  waterE.rotation.z = Math.PI / 2;
  waterE.position.set(WORLD.maxX + 140, -0.15, 40);
  group.add(waterE);

  // Roads: one mesh per avenue/street, asphalt texture repeated along
  // its length. The texture carries the double centre line + edge lines.
  const roadTex = makeRoadTexture();
  const roadMat = new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.9 });
  const roadLen = WORLD.maxZ - WORLD.minZ + 40;
  const roadLenX = WORLD.maxX - WORLD.minX + 40;
  for (const ax of AVENUES) {
    const tex = roadTex.clone();
    tex.needsUpdate = true;
    tex.repeat.set(1, Math.round(roadLen / 16));
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_W, roadLen),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(ax, 0.06, (WORLD.minZ + WORLD.maxZ) / 2);
    m.receiveShadow = true;
    group.add(m);
  }
  for (const sz of STREETS) {
    const tex = roadTex.clone();
    tex.needsUpdate = true;
    tex.repeat.set(1, Math.round(roadLenX / 16));
    // Same local shape as the avenues (10 wide, long in local Y): the
    // rotation.z = PI/2 then lays the length east-west. The old
    // PlaneGeometry(roadLenX, ROAD_W) put the length north-south, so
    // all eight streets piled up as overlapping strips at x in [-5,5]
    // and every east-west street was bare land slab (which washed to
    // near-white under the sunset lights — the pale foreground in the
    // combat and chase frames).
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_W, roadLenX),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }),
    );
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = Math.PI / 2;
    m.position.set(0, 0.06, sz);
    m.receiveShadow = true;
    group.add(m);
  }

  // Sidewalks: raised slabs flanking every road, paver texture.
  const walkTex = makeSidewalkTexture();
  const walkMat = new THREE.MeshStandardMaterial({ map: walkTex, roughness: 0.95 });
  const walkGeoNS = new THREE.BoxGeometry(WALK_W, 0.18, roadLen);
  const walkGeoEW = new THREE.BoxGeometry(roadLenX, 0.18, WALK_W);
  for (const ax of AVENUES) {
    for (const side of [-1, 1]) {
      const w = new THREE.Mesh(walkGeoNS, walkMat);
      w.position.set(ax + side * (ROAD_W / 2 + WALK_W / 2), 0.09, (WORLD.minZ + WORLD.maxZ) / 2);
      w.receiveShadow = true;
      group.add(w);
    }
  }
  for (const sz of STREETS) {
    for (const side of [-1, 1]) {
      const w = new THREE.Mesh(walkGeoEW, walkMat);
      w.position.set(0, 0.09, sz + side * (ROAD_W / 2 + WALK_W / 2));
      w.receiveShadow = true;
      group.add(w);
    }
  }

  // Crosswalks: white bars across every road at every intersection.
  const barGeo = new THREE.BoxGeometry(0.9, 0.02, 3.2);
  const barMat = new THREE.MeshStandardMaterial({ color: 0xe8e8e0, roughness: 0.8 });
  const crosswalk = new THREE.Group();
  for (const ax of AVENUES) {
    for (const sz of STREETS) {
      for (let i = -4; i <= 4; i++) {
        const b1 = new THREE.Mesh(barGeo, barMat);
        b1.position.set(ax + i * 1.15, 0.1, sz - ROAD_W / 2 - 1.6);
        crosswalk.add(b1);
        const b2 = new THREE.Mesh(barGeo, barMat);
        b2.rotation.y = Math.PI / 2;
        b2.position.set(ax - ROAD_W / 2 - 1.6, 0.1, sz + i * 1.15);
        crosswalk.add(b2);
      }
    }
  }
  group.add(crosswalk);

  // Boardwalk along the beach front: planks + railing posts.
  const boardMat = new THREE.MeshStandardMaterial({ color: 0x9a7a52, roughness: 0.9 });
  const board = new THREE.Mesh(new THREE.BoxGeometry(400, 0.24, 6), boardMat);
  board.position.set(0, 0.12, WORLD.beachZ - 1);
  board.receiveShadow = true;
  group.add(board);

  scene.add(group);
  return { group, water };
}
