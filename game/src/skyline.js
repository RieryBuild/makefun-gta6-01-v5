// The sky of PUERTO DEL SOL: a gradient dome, a low sun with a feathered
// halo, drifting cloud cards, and the warm haze that fakes the city's
// scale. One committed sunset — the sun sits low in the WEST (over the
// docks) for the whole game, so every frame shares one light direction
// and the shadows always fall east.
//
// Rectangle-rule compliance: the sun halo and every cloud use
// makeGlowTexture / makeCloudTexture (radial gradients, alpha 0 at all
// edges) with depthWrite:false. Glows use AdditiveBlending, so a hard
// edge would be invisible by construction even if one survived.

import { SKY, LIGHT } from './palette.js';
import { makeGlowTexture, makeCloudTexture } from './surface.js';
import { Rng } from './rng.js';

export function buildSky(scene, rng) {
  const group = new THREE.Group();
  group.name = 'sky';

  // Gradient dome: a big sphere, back-side, vertex-coloured by height.
  // Three bands (violet -> magenta -> orange) baked into the vertices.
  const domeGeo = new THREE.SphereGeometry(700, 24, 16);
  const pos = domeGeo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const cTop = new THREE.Color(SKY.zenith);
  const cMid = new THREE.Color(SKY.mid);
  const cHor = new THREE.Color(SKY.horizon);
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i) / 700; // -1..1
    if (y > 0.35) tmp.copy(cMid).lerp(cTop, (y - 0.35) / 0.65);
    else if (y > 0.02) tmp.copy(cHor).lerp(cMid, (y - 0.02) / 0.33);
    else tmp.copy(cHor);
    colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
  }
  domeGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const dome = new THREE.Mesh(domeGeo, new THREE.MeshBasicMaterial({
    vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false,
  }));
  dome.renderOrder = -10;
  group.add(dome);

  // The sun: a flat disc (mesh, not a billboard — a disc has no quad
  // edges at all) plus a feathered additive halo sprite.
  const sunDir = new THREE.Vector3(-0.62, 0.24, -0.35).normalize();
  const sunPos = sunDir.clone().multiplyScalar(640);
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(34, 48),
    new THREE.MeshBasicMaterial({ color: SKY.sunCore, fog: false, transparent: true, opacity: 0.98, depthWrite: false }),
  );
  disc.position.copy(sunPos);
  disc.lookAt(0, 0, 0);
  disc.renderOrder = -9;
  group.add(disc);
  const haloTex = makeGlowTexture([[0, SKY.sunGlow, 0.85], [0.35, SKY.sunGlow, 0.4], [0.7, 0xff7a2e, 0.12]]);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: haloTex, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, fog: false,
  }));
  halo.position.copy(sunPos);
  halo.scale.set(340, 340, 1);
  halo.renderOrder = -8;
  group.add(halo);

  // Clouds: flat cards high up, each a feathered puff texture. They
  // drift slowly east; the material never writes depth.
  const clouds = new THREE.Group();
  clouds.name = 'clouds';
  const cloudRng = rng.fork('clouds');
  for (let i = 0; i < 14; i++) {
    const tex = makeCloudTexture(100 + i * 7, SKY.cloudLit, SKY.cloudShade);
    const mat = new THREE.MeshBasicMaterial({
      map: tex, transparent: true, depthWrite: false, fog: false,
      opacity: cloudRng.range(0.55, 0.9), side: THREE.DoubleSide,
    });
    const w = cloudRng.range(90, 190);
    const card = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.42), mat);
    const a = cloudRng.range(0, Math.PI * 2);
    const r = cloudRng.range(180, 520);
    card.position.set(Math.cos(a) * r, cloudRng.range(120, 220), Math.sin(a) * r);
    card.lookAt(0, card.position.y * 0.4, 0);
    card.userData.drift = cloudRng.range(0.4, 1.1);
    clouds.add(card);
  }
  group.add(clouds);

  // Distant haze wall: a low cylinder ring at the map edge, warm fog
  // colour, so no vista ever ends in the void (the bowl trick).
  const haze = new THREE.Mesh(
    new THREE.CylinderGeometry(560, 560, 60, 48, 1, true),
    new THREE.MeshBasicMaterial({
      color: SKY.fog, transparent: true, opacity: 0.55,
      side: THREE.BackSide, fog: false, depthWrite: false,
    }),
  );
  haze.position.y = 18;
  group.add(haze);

  // Distant mountain silhouette: a dark ridge ring, broken into peaks
  // by a canvas alpha texture — the bowl's far wall.
  const ridge = buildRidgeRing();
  ridge.position.y = 0;
  group.add(ridge);

  scene.add(group);
  scene.fog = new THREE.Fog(SKY.fog, SKY.fogNear, SKY.fogFar);
  return { group, clouds, sunDir };
}

function buildRidgeRing() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 128;
  const g = c.getContext('2d');
  const rng = new Rng(42);
  g.clearRect(0, 0, 1024, 128);
  g.fillStyle = '#4a2e4e';
  g.beginPath();
  g.moveTo(0, 128);
  let y = 70;
  for (let x = 0; x <= 1024; x += 16) {
    y += rng.range(-14, 14);
    y = Math.max(34, Math.min(96, y));
    g.lineTo(x, y);
  }
  g.lineTo(1024, 128);
  g.closePath();
  g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  const mat = new THREE.MeshBasicMaterial({
    map: tex, transparent: true, side: THREE.BackSide,
    fog: false, depthWrite: false, opacity: 0.9,
  });
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(600, 600, 90, 48, 1, true), mat);
  mesh.position.y = 22;
  return mesh;
}

// The three-light rig: warm key (the low sun), violet hemisphere fill,
// and a warm rim from the east so the hero and the cars always carry a
// sunset edge. Shadows come from the key only.
export function buildLights(scene) {
  const sun = new THREE.DirectionalLight(LIGHT.sunColor, LIGHT.sunIntensity);
  sun.position.set(-180, 90, -100);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -260; sun.shadow.camera.right = 260;
  sun.shadow.camera.top = 260; sun.shadow.camera.bottom = -260;
  sun.shadow.camera.near = 10; sun.shadow.camera.far = 600;
  sun.shadow.bias = -0.0006;
  scene.add(sun);
  const hemi = new THREE.HemisphereLight(LIGHT.hemiSky, LIGHT.hemiGround, LIGHT.hemiIntensity);
  scene.add(hemi);
  const rim = new THREE.DirectionalLight(LIGHT.rimColor, LIGHT.rimIntensity);
  rim.position.set(160, 60, 120);
  scene.add(rim);
  const amb = new THREE.AmbientLight(LIGHT.ambient, LIGHT.ambientIntensity);
  scene.add(amb);
  return { sun, hemi, rim, amb };
}
