// Vehicles — multi-part models with distinct silhouettes per class.
// A car is: lower body + hood + cabin with glass + trunk + 4 wheels
// (cylinder + hub disc) + headlights + taillights + bumpers. The hero
// car (SOLSTICE GT) is low and wide with a spoiler and gold rims; the
// PSPD cruiser reads as police at 200 m (black/white + light bar +
// door decals); the van and the truck are their own shapes. Never a
// single rounded box with a windshield stripe.

import { makePoliceDecalTexture } from './brands.js';

function std(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.35, ...extra });
}
const glassMat = new THREE.MeshStandardMaterial({ color: 0x1c2e3e, roughness: 0.15, metalness: 0.6 });
const tyreMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.95 });
const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.25, metalness: 0.9 });

export const CAR_CLASSES = {
  hero: { name: 'Solstice GT', body: 0xd95a4a, len: 4.4, wid: 1.95, h: 0.62, topSpeed: 62, accel: 26, grip: 1.15, spoiler: true, rims: 0xf5c518 },
  sedan: { name: 'Marlin Sedan', body: 0x4a6a8a, len: 4.3, wid: 1.85, h: 0.72, topSpeed: 42, accel: 18, grip: 1.0 },
  coupe: { name: 'Viento Coupe', body: 0x2ec4b6, len: 4.1, wid: 1.85, h: 0.66, topSpeed: 50, accel: 22, grip: 1.05 },
  van: { name: 'Sol Hauler', body: 0xe8e0d0, len: 4.8, wid: 2.0, h: 1.15, topSpeed: 34, accel: 13, grip: 0.9 },
  truck: { name: 'Del Sol Rig', body: 0xd97a2e, len: 5.6, wid: 2.1, h: 1.0, topSpeed: 30, accel: 11, grip: 0.85 },
  taxi: { name: 'Sol Cab', body: 0xf2c230, len: 4.3, wid: 1.85, h: 0.72, topSpeed: 44, accel: 19, grip: 1.0 },
  cruiser: { name: 'PSPD Interceptor', body: 0x14161c, len: 4.5, wid: 1.9, h: 0.7, topSpeed: 55, accel: 24, grip: 1.1, police: true },
};

function buildWheel(radius, width, rimColor) {
  const g = new THREE.Group();
  const tyre = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 14), tyreMat);
  tyre.rotation.z = Math.PI / 2;
  tyre.castShadow = true;
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, width + 0.02, 10),
    new THREE.MeshStandardMaterial({ color: rimColor || 0xb8b8b8, roughness: 0.3, metalness: 0.8 }));
  hub.rotation.z = Math.PI / 2;
  g.add(tyre, hub);
  return g;
}

export function buildCar(cls, colorOverride) {
  const spec = CAR_CLASSES[cls] || CAR_CLASSES.sedan;
  const bodyColor = colorOverride ?? spec.body;
  const g = new THREE.Group();
  const L = spec.len, W = spec.wid, H = spec.h;
  const bodyMat = std(bodyColor);
  const isVan = cls === 'van' || cls === 'truck';

  // Lower body: the main mass, with a shaped nose (hood wedge).
  const lower = new THREE.Mesh(new THREE.BoxGeometry(W, H, L), bodyMat);
  lower.position.y = H / 2 + 0.28;
  lower.castShadow = true;
  g.add(lower);
  // Hood: a sloped wedge at the front (a rotated thin box reads as a slope).
  const hood = new THREE.Mesh(new THREE.BoxGeometry(W * 0.94, 0.1, L * 0.22), bodyMat);
  hood.position.set(0, H + 0.24, L * 0.36);
  hood.rotation.x = -0.12;
  g.add(hood);
  // Cabin: glasshouse with a roof panel.
  const cabLen = isVan ? L * 0.62 : L * 0.42;
  const cabZ = isVan ? -L * 0.05 : -L * 0.06;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(W * 0.86, isVan ? 0.85 : 0.55, cabLen), glassMat);
  cabin.position.set(0, H + 0.28 + (isVan ? 0.35 : 0.22), cabZ);
  cabin.castShadow = true;
  g.add(cabin);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(W * 0.88, 0.07, cabLen + 0.1), bodyMat);
  roof.position.set(0, H + 0.28 + (isVan ? 0.8 : 0.52), cabZ);
  g.add(roof);
  // Bumpers.
  for (const bz of [L / 2 - 0.05, -L / 2 + 0.05]) {
    const bump = new THREE.Mesh(new THREE.BoxGeometry(W + 0.06, 0.22, 0.18), chromeMat);
    bump.position.set(0, 0.34, bz);
    g.add(bump);
  }
  // Headlights (emissive white) + taillights (emissive red).
  const headMat = new THREE.MeshBasicMaterial({ color: 0xfff2c8 });
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xff2a2a });
  for (const side of [-1, 1]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.13, 0.06), headMat);
    hl.position.set(side * (W / 2 - 0.3), H + 0.08, L / 2 + 0.01);
    g.add(hl);
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.06), tailMat);
    tl.position.set(side * (W / 2 - 0.3), H + 0.1, -L / 2 - 0.01);
    g.add(tl);
    // Side mirrors.
    const mir = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.18), chromeMat);
    mir.position.set(side * (W / 2 + 0.04), H + 0.42, L * 0.14);
    g.add(mir);
  }
  // Grille + plate.
  const grille = new THREE.Mesh(new THREE.BoxGeometry(W * 0.5, 0.16, 0.05), std(0x1c1e22));
  grille.position.set(0, H * 0.55, L / 2 + 0.01);
  g.add(grille);

  // Wheels: front pair steers, all four spin. Exposed for the driver.
  const wheels = [];
  const wr = isVan ? 0.38 : 0.34;
  const wy = wr;
  for (const [wx, wz, front] of [[-W / 2 + 0.08, L * 0.32, true], [W / 2 - 0.08, L * 0.32, true], [-W / 2 + 0.08, -L * 0.32, false], [W / 2 - 0.08, -L * 0.32, false]]) {
    const steer = new THREE.Group();
    steer.position.set(wx, wy, wz);
    const wheel = buildWheel(wr, 0.24, spec.rims);
    steer.add(wheel);
    g.add(steer);
    wheels.push({ steer, wheel, front });
  }

  // Spoiler (hero + coupe).
  if (spec.spoiler) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(W * 0.9, 0.06, 0.5), std(0x1c1c22, { metalness: 0.5 }));
    wing.position.set(0, H + 0.62, -L / 2 + 0.3);
    wing.rotation.x = -0.12;
    g.add(wing);
    for (const side of [-1, 1]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.3, 0.06), std(0x1c1c22));
      strut.position.set(side * (W / 2 - 0.4), H + 0.45, -L / 2 + 0.3);
      g.add(strut);
    }
  }
  // Taxi sign.
  if (cls === 'taxi') {
    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.3),
      new THREE.MeshBasicMaterial({ color: 0xffe9a8 }));
    sign.position.set(0, H + 0.68, cabZ);
    g.add(sign);
  }
  // Police: white doors + roof, light bar, decals.
  if (spec.police) {
    const whiteMat = std(0xf2f2f2, { roughness: 0.5 });
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.04, H * 0.8, L * 0.4), whiteMat);
    doorL.position.set(-W / 2 - 0.01, H / 2 + 0.3, 0);
    const doorR = doorL.clone();
    doorR.position.x = W / 2 + 0.01;
    const roofW = new THREE.Mesh(new THREE.BoxGeometry(W * 0.86, 0.06, cabLen), whiteMat);
    roofW.position.set(0, H + 0.6, cabZ);
    g.add(doorL, doorR, roofW);
    const decalTex = makePoliceDecalTexture();
    for (const side of [-1, 1]) {
      const decal = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.75),
        new THREE.MeshBasicMaterial({ map: decalTex, transparent: true }));
      decal.position.set(side * (W / 2 + 0.035), H / 2 + 0.32, 0);
      decal.rotation.y = side * Math.PI / 2;
      g.add(decal);
    }
    // Light bar: red + blue blocks, flashing via emissive swap in police.js.
    const bar = new THREE.Group();
    const baseBar = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.09, 0.28), std(0x1c1e22));
    const red = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.26),
      new THREE.MeshBasicMaterial({ color: 0xff2222 }));
    red.position.x = -0.34;
    const blue = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.26),
      new THREE.MeshBasicMaterial({ color: 0x2266ff }));
    blue.position.x = 0.34;
    bar.add(baseBar, red, blue);
    bar.position.set(0, H + 0.72, cabZ);
    g.add(bar);
    g.userData.lightBar = { red, blue };
    // Push bar on the nose.
    const push = new THREE.Mesh(new THREE.BoxGeometry(W * 0.7, 0.3, 0.08), std(0x1c1e22));
    push.position.set(0, 0.5, L / 2 + 0.1);
    g.add(push);
  }

  g.userData.spec = spec;
  g.userData.wheels = wheels;
  g.userData.class = cls;
  return g;
}

// Spin + steer the wheels for a moving car.
export function driveWheels(car, speed, steerAngle, dt) {
  const wheels = car.userData.wheels || [];
  const wr = 0.34;
  for (const w of wheels) {
    w.wheel.rotation.x += (speed / wr) * dt;
    if (w.front) w.steer.rotation.y = steerAngle;
  }
}
