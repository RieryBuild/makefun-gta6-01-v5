// Humanoids — the character builder. PRIMARY GOAL 1 of the v5 rebuild:
// the protagonist must read as DESIGNED, not a capsule with a ponytail.
//
// Proportions (total ~1.75 m, head 0.23 m — a 1:7.6 ratio, properly
// humanoid): hip at 0.92, shoulder at 1.42, head centre at 1.60.
// Limbs are tapered CAPSULES with sphere joints — rounded primitives,
// never boxes. The face is a canvas texture on a curved patch hugging
// the head sphere (facekit.js), so the eyes and expression read at
// screenshot distance. Outfits are colour-separated: jacket / shirt /
// pants / shoes are distinct parts, not one painted box.
//
// Poses are joint rotations: idle, walk, run, drive (seated, hands to
// the wheel), aim (TWO-HANDED — rifle shouldered, both hands on the
// weapon, barrel pointed AT the target, muzzle exposed for the tracer),
// carry (rifle slung on the back), flee (arms up), phone, dead.
// The aim pose is the one Reza flagged in v4 (one-handed, vertical,
// muzzle at the sky while the tracer fired diagonally) — here the
// rifle is horizontal, shouldered, and the tracer starts at the muzzle
// by construction, so the two can never disagree.

import { makeFaceTexture } from './facekit.js';
import { TAU } from './rng.js';

function std(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.02, ...extra });
}

// A tapered limb segment: capsule with sphere joints at both ends.
function limb(rTop, rBottom, len, mat) {
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry((rTop + rBottom) / 2, len, 4, 10), mat);
  mesh.position.y = -len / 2;
  mesh.castShadow = true;
  const joint = new THREE.Mesh(new THREE.SphereGeometry(rTop, 10, 8), mat);
  joint.castShadow = true;
  g.add(mesh, joint);
  return g;
}

// --- Weapons: multi-part, readable silhouettes ------------------------
export function buildRifle() {
  const g = new THREE.Group();
  const metal = std(0x2a2c30, { metalness: 0.6, roughness: 0.4 });
  const wood = std(0x6a4a2e, { roughness: 0.7 });
  const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.11, 0.34), metal);
  receiver.castShadow = true;
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.42, 8), metal);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.02, 0.36);
  const muzzleBrake = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 8), metal);
  muzzleBrake.rotation.x = Math.PI / 2;
  muzzleBrake.position.set(0, 0.02, 0.58);
  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.2), wood);
  stock.position.set(0, -0.01, -0.26);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.13, 0.07), wood);
  grip.position.set(0, -0.1, -0.06);
  grip.rotation.x = 0.35;
  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.14, 0.08), metal);
  mag.position.set(0, -0.11, 0.08);
  mag.rotation.x = 0.18;
  const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.22, 8), wood);
  fore.rotation.x = Math.PI / 2;
  fore.position.set(0, -0.01, 0.22);
  const sight = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.09), metal);
  sight.position.set(0, 0.09, 0.02);
  const sightPost = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.05, 0.012), metal);
  sightPost.position.set(0, 0.08, 0.48);
  g.add(receiver, barrel, muzzleBrake, stock, grip, mag, fore, sight, sightPost);
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, 0.02, 0.62);
  g.add(muzzle);
  g.userData.muzzle = muzzle;
  return g;
}

export function buildPistol() {
  const g = new THREE.Group();
  const metal = std(0x2a2c30, { metalness: 0.6, roughness: 0.4 });
  const slide = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.22), metal);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.12, 0.06), std(0x4a2e1c));
  grip.position.set(0, -0.07, -0.06);
  grip.rotation.x = 0.25;
  const sight = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.03, 0.012), metal);
  sight.position.set(0, 0.045, 0.08);
  g.add(slide, grip, sight);
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, 0, 0.14);
  g.add(muzzle);
  g.userData.muzzle = muzzle;
  return g;
}

// --- Hair: geometry caps, one per style --------------------------------
function buildHair(style, color, headR) {
  const g = new THREE.Group();
  const mat = std(color, { roughness: 0.9 });
  if (style === 'bun') {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.07, 14, 10, 0, TAU, 0, Math.PI * 0.58), mat);
    cap.position.y = 0.012;
    cap.castShadow = true;
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), mat);
    bun.position.set(0, 0.03, -headR * 0.95);
    bun.castShadow = true;
    g.add(cap, bun);
  } else if (style === 'bob') {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.07, 14, 10, 0, TAU, 0, Math.PI * 0.62), mat);
    cap.position.y = 0.012;
    const back = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.05, 12, 8), mat);
    back.position.set(0, -0.05, -0.03);
    back.scale.set(1, 1.25, 1);
    g.add(cap, back);
  } else if (style === 'slick') {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.05, 14, 10, 0, TAU, 0, Math.PI * 0.5), mat);
    cap.scale.y = 0.82;
    cap.position.y = 0.02;
    g.add(cap);
  } else if (style === 'cap') {
    const dome = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.06, 14, 8, 0, TAU, 0, Math.PI * 0.5),
      std(0x2a4a6a, { roughness: 0.8 }));
    dome.position.y = 0.015;
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(headR * 1.25, headR * 1.25, 0.015, 14, 1, false, -0.7, 1.4),
      std(0x1e3550, { roughness: 0.8 }));
    brim.position.set(0, 0.055, 0.02);
    brim.rotation.x = 0.08;
    g.add(dome, brim);
  } else if (style === 'afro') {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.35, 12, 10), mat);
    puff.position.y = 0.05;
    puff.scale.y = 0.85;
    g.add(puff);
  } else if (style !== 'bald') { // short
    const cap = new THREE.Mesh(new THREE.SphereGeometry(headR * 1.06, 14, 10, 0, TAU, 0, Math.PI * 0.55), mat);
    cap.position.y = 0.012;
    g.add(cap);
  }
  return g;
}

// --- The builder --------------------------------------------------------
// spec: { skin, hairColor, hairStyle, jacket, shirt, pants, shoes,
//         face (facekit spec), scale, earrings, sunglasses, mustache }
export function buildHumanoid(spec) {
  const s = spec.scale || 1;
  const root = new THREE.Group();
  root.scale.setScalar(s);
  const skin = std(spec.skin);
  const jacket = std(spec.jacket);
  const shirt = std(spec.shirt);
  const pants = std(spec.pants);
  const shoeMat = std(spec.shoes, { roughness: 0.6 });

  const headR = 0.115;
  const P = {}; // parts registry for posing

  // Hips at 0.92.
  const hips = new THREE.Group();
  hips.position.y = 0.92;
  root.add(hips);
  P.hips = hips;
  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), pants);
  pelvis.scale.set(1.15, 0.8, 0.9);
  pelvis.position.y = 0.02;
  pelvis.castShadow = true;
  hips.add(pelvis);
  // Belt line.
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.132, 0.05, 12), std(0x2a2018));
  belt.position.y = 0.07;
  hips.add(belt);

  // Legs: hip joints at (±0.10, 0, 0) relative to hips.
  function buildLeg(side) {
    const hip = new THREE.Group();
    hip.position.set(0.10 * side, -0.02, 0);
    const thigh = limb(0.062, 0.05, 0.42, pants);
    hip.add(thigh);
    const knee = new THREE.Group();
    knee.position.y = -0.44;
    hip.add(knee);
    const shin = limb(0.05, 0.04, 0.4, pants);
    knee.add(shin);
    const ankle = new THREE.Group();
    ankle.position.y = -0.42;
    knee.add(ankle);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.26), shoeMat);
    foot.position.set(0, -0.035, 0.05);
    foot.castShadow = true;
    ankle.add(foot);
    hips.add(hip);
    return { hip, knee, ankle };
  }
  P.legL = buildLeg(-1);
  P.legR = buildLeg(1);

  // Spine + torso: jacket cylinder, shirt plate on the chest, collar.
  const spine = new THREE.Group();
  spine.position.y = 0.08;
  hips.add(spine);
  P.spine = spine;
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.118, 0.46, 14), jacket);
  torso.position.y = 0.27;
  torso.castShadow = true;
  spine.add(torso);
  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.03), shirt);
  chestPlate.position.set(0, 0.3, 0.125);
  spine.add(chestPlate);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.022, 8, 14), jacket);
  collar.position.y = 0.5;
  collar.rotation.x = Math.PI / 2;
  spine.add(collar);

  // Neck + head.
  const neck = new THREE.Group();
  neck.position.y = 0.52;
  spine.add(neck);
  P.neck = neck;
  const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.09, 10), skin);
  neckMesh.position.y = 0.03;
  neck.add(neckMesh);
  const head = new THREE.Group();
  head.position.y = 0.1;
  neck.add(head);
  P.head = head;
  const skull = new THREE.Mesh(new THREE.SphereGeometry(headR, 18, 14), skin);
  skull.scale.set(0.92, 1.05, 0.98);
  skull.castShadow = true;
  head.add(skull);
  // Face patch: a curved segment hugging the front (+Z) of the skull.
  const faceTex = makeFaceTexture(spec.face || {});
  const patch = new THREE.Mesh(
    new THREE.SphereGeometry(headR * 1.02, 16, 12, Math.PI / 2 - 0.62, 1.24, Math.PI * 0.26, Math.PI * 0.48),
    new THREE.MeshBasicMaterial({ map: faceTex, transparent: true }),
  );
  head.add(patch);
  // Ears.
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), skin);
    ear.position.set(side * headR * 0.95, 0, 0);
    ear.scale.x = 0.5;
    head.add(ear);
    if (spec.earrings) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.006, 6, 12),
        std(0xf5c518, { metalness: 0.8, roughness: 0.3 }));
      ring.position.set(side * headR * 1.02, -0.035, 0);
      head.add(ring);
    }
  }
  head.add(buildHair(spec.hairStyle || 'short', spec.hairColor || 0x1c1410, headR));
  if (spec.sunglasses) {
    const glassMat = std(0x0c0c12, { roughness: 0.2, metalness: 0.4 });
    for (const side of [-1, 1]) {
      const lens = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.04, 0.015), glassMat);
      lens.position.set(side * 0.045, 0.015, headR * 0.92);
      head.add(lens);
    }
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.008, 0.012), glassMat);
    bridge.position.set(0, 0.015, headR * 0.92);
    head.add(bridge);
  }
  if (spec.mustache) {
    const mMat = std(spec.hairColor || 0x1c1410);
    for (const side of [-1, 1]) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), mMat);
      m.position.set(side * 0.022, -0.045, headR * 0.92);
      m.scale.set(1.4, 0.6, 0.6);
      head.add(m);
    }
  }

  // Arms: shoulder joints at (±0.21, 0.44, 0) relative to spine.
  function buildArm(side) {
    const shoulder = new THREE.Group();
    shoulder.position.set(0.21 * side, 0.44, 0);
    const pad = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), jacket);
    pad.castShadow = true;
    shoulder.add(pad);
    const upper = limb(0.052, 0.044, 0.28, jacket);
    shoulder.add(upper);
    const elbow = new THREE.Group();
    elbow.position.y = -0.3;
    shoulder.add(elbow);
    const fore = limb(0.044, 0.038, 0.26, spec.sleeves === 'short' ? skin : jacket);
    elbow.add(fore);
    const wrist = new THREE.Group();
    wrist.position.y = -0.28;
    elbow.add(wrist);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8), skin);
    hand.scale.set(0.85, 1.15, 0.9);
    hand.castShadow = true;
    wrist.add(hand);
    spine.add(shoulder);
    return { shoulder, elbow, wrist, hand };
  }
  P.armL = buildArm(-1);
  P.armR = buildArm(1);

  // Weapon mount: parented to the spine so the rifle follows the torso.
  const weaponMount = new THREE.Group();
  weaponMount.position.set(0.1, 0.32, 0.16);
  spine.add(weaponMount);
  P.weaponMount = weaponMount;
  P.rifle = buildRifle();
  P.pistol = buildPistol();
  P.smg = buildRifle();
  P.smg.scale.setScalar(0.68);
  P.rifle.visible = false;
  P.pistol.visible = false;
  P.smg.visible = false;
  weaponMount.add(P.rifle, P.pistol, P.smg);

  root.userData.parts = P;
  root.userData.spec = spec;
  root.userData.pose = 'idle';
  root.userData.phase = 0;
  return root;
}

// --- Poses --------------------------------------------------------------
// Every pose writes the joint rotations directly; the walk/run poses
// take a phase so the loop can drive them per frame.
export function setPose(human, pose, phase = 0, aimPitch = 0) {
  const P = human.userData.parts;
  const L = P.armL, R = P.armR;
  const reset = () => {
    for (const a of [L, R]) {
      a.shoulder.rotation.set(0, 0, 0);
      a.elbow.rotation.set(0, 0, 0);
      a.wrist.rotation.set(0, 0, 0);
    }
    for (const l of [P.legL, P.legR]) {
      l.hip.rotation.set(0, 0, 0);
      l.knee.rotation.set(0, 0, 0);
      l.ankle.rotation.set(0, 0, 0);
    }
    P.spine.rotation.set(0, 0, 0);
    P.hips.rotation.set(0, 0, 0);
    P.hips.position.y = 0.92;
    P.neck.rotation.set(0, 0, 0);
  };
  reset();
  human.userData.pose = pose;
  if (pose === 'idle') {
    const b = Math.sin(phase * 1.4) * 0.02;
    P.spine.rotation.x = b;
    L.shoulder.rotation.z = 0.08; R.shoulder.rotation.z = -0.08;
    L.elbow.rotation.x = -0.15; R.elbow.rotation.x = -0.15;
  } else if (pose === 'walk') {
    const s = Math.sin(phase), c = Math.sin(phase + Math.PI);
    P.legL.hip.rotation.x = s * 0.55;
    P.legR.hip.rotation.x = c * 0.55;
    P.legL.knee.rotation.x = Math.max(0, -s) * 0.7;
    P.legR.knee.rotation.x = Math.max(0, -c) * 0.7;
    L.shoulder.rotation.x = c * 0.4;
    R.shoulder.rotation.x = s * 0.4;
    L.elbow.rotation.x = -0.25; R.elbow.rotation.x = -0.25;
    P.hips.position.y = 0.92 + Math.abs(Math.cos(phase)) * 0.025;
    P.spine.rotation.y = s * 0.06;
  } else if (pose === 'run') {
    const s = Math.sin(phase), c = Math.sin(phase + Math.PI);
    P.legL.hip.rotation.x = s * 0.95;
    P.legR.hip.rotation.x = c * 0.95;
    P.legL.knee.rotation.x = Math.max(0, -s) * 1.3 + 0.25;
    P.legR.knee.rotation.x = Math.max(0, -c) * 1.3 + 0.25;
    L.shoulder.rotation.x = c * 0.75;
    R.shoulder.rotation.x = s * 0.75;
    L.elbow.rotation.x = -0.9; R.elbow.rotation.x = -0.9;
    P.spine.rotation.x = 0.14;
    P.hips.position.y = 0.92 + Math.abs(Math.cos(phase)) * 0.05;
  } else if (pose === 'drive') {
    // Seated: thighs forward, shins down, arms forward to the wheel.
    P.legL.hip.rotation.x = -1.35; P.legR.hip.rotation.x = -1.35;
    P.legL.knee.rotation.x = 1.3; P.legR.knee.rotation.x = 1.3;
    P.legL.ankle.rotation.x = 0.25; P.legR.ankle.rotation.x = 0.25;
    L.shoulder.rotation.x = -0.95; R.shoulder.rotation.x = -0.95;
    L.shoulder.rotation.z = 0.18; R.shoulder.rotation.z = -0.18;
    L.elbow.rotation.x = -0.45; R.elbow.rotation.x = -0.45;
    P.spine.rotation.x = 0.06;
  } else if (pose === 'aim') {
    // TWO-HANDED, rifle shouldered, barrel at the target. The rifle
    // sits against the right shoulder, horizontal; the right hand is
    // on the grip, the left hand on the foregrip. aimPitch tilts the
    // whole upper body + rifle toward the target's height.
    P.spine.rotation.x = aimPitch * 0.4;
    P.spine.rotation.y = 0.12;
    // Right arm: forward, elbow tucked — hand lands on the grip.
    R.shoulder.rotation.x = -1.28;
    R.shoulder.rotation.z = -0.12;
    R.elbow.rotation.x = -0.5;
    // Left arm: forward and across — hand lands on the foregrip.
    L.shoulder.rotation.x = -1.42;
    L.shoulder.rotation.z = 0.42;
    L.elbow.rotation.x = -0.35;
    // Rifle: shouldered at the chest, barrel forward, pitched at target.
    P.weaponMount.position.set(0.13, 0.36, 0.22);
    P.weaponMount.rotation.set(aimPitch, -0.06, 0);
    P.neck.rotation.x = aimPitch * 0.5;
    // A shooter's stance: left foot forward, knees soft.
    P.legL.hip.rotation.x = -0.28;
    P.legR.hip.rotation.x = 0.18;
    P.legL.knee.rotation.x = 0.3;
    P.legR.knee.rotation.x = 0.22;
    P.hips.position.y = 0.88;
  } else if (pose === 'carry') {
    // Rifle slung across the back, muzzle up — the patrol read.
    P.weaponMount.position.set(-0.05, 0.34, -0.2);
    P.weaponMount.rotation.set(0.5, 0, 0.5);
    L.shoulder.rotation.z = 0.08; R.shoulder.rotation.z = -0.08;
  } else if (pose === 'flee') {
    const s = Math.sin(phase);
    P.legL.hip.rotation.x = s * 0.9;
    P.legR.hip.rotation.x = -s * 0.9;
    P.legL.knee.rotation.x = 0.5; P.legR.knee.rotation.x = 0.5;
    L.shoulder.rotation.x = -2.6; R.shoulder.rotation.x = -2.6;
    L.shoulder.rotation.z = 0.5; R.shoulder.rotation.z = -0.5;
    P.spine.rotation.x = 0.12;
  } else if (pose === 'phone') {
    R.shoulder.rotation.x = -0.7;
    R.shoulder.rotation.z = -0.5;
    R.elbow.rotation.x = -1.9; // hand to the ear
    L.shoulder.rotation.z = 0.08;
    P.neck.rotation.y = 0.2;
  } else if (pose === 'cheer') {
    L.shoulder.rotation.x = -2.9; R.shoulder.rotation.x = -2.9;
    L.shoulder.rotation.z = 0.4; R.shoulder.rotation.z = -0.4;
  } else if (pose === 'dead') {
    // Falls are done by rotating the ROOT in the caller; the pose just
    // sprawls the limbs.
    L.shoulder.rotation.z = 1.2; R.shoulder.rotation.z = -1.2;
    L.shoulder.rotation.x = -0.4; R.shoulder.rotation.x = -0.4;
    P.legL.hip.rotation.x = 0.3; P.legR.hip.rotation.x = -0.2;
  }
}

export function showWeapon(human, kind) {
  const P = human.userData.parts;
  P.rifle.visible = kind === 'rifle';
  P.pistol.visible = kind === 'pistol';
  P.smg.visible = kind === 'smg';
  // Default mount (carry position); the aim pose repositions it.
  if (kind === 'rifle' || kind === 'pistol' || kind === 'smg') {
    P.weaponMount.position.set(0.1, 0.32, 0.16);
    P.weaponMount.rotation.set(0, 0, 0);
  }
}

export function muzzleWorld(human, kind = 'rifle') {
  const P = human.userData.parts;
  const w = kind === 'pistol' ? P.pistol : kind === 'smg' ? P.smg : P.rifle;
  const v = new THREE.Vector3();
  w.userData.muzzle.getWorldPosition(v);
  return v;
}
