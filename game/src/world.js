// The world — assembly. Builds the renderer, the scene, and every
// layer of PUERTO DEL SOL in order: sky + lights, terrain, city,
// street props, landmarks, traffic, crowd, police, collectibles.
// Owns the collider list (building AABBs) and the shared helpers
// (push-out collision, the waterline clamp) every moving thing uses.

import { Rng, clamp } from './rng.js';
import { buildSky, buildLights } from './skyline.js';
import { buildTerrain } from './terrain.js';
import { buildCity, buildingColliders } from './structures.js';
import { buildStreetProps } from './streetkit.js';
import { buildLandmarks } from './landmarks.js';
import { Traffic } from './traffic.js';
import { Crowd } from './crowd.js';
import { Police } from './police.js';
import { Shooting } from './shooting.js';
import { Collectibles } from './collectibles.js';
import { WORLD } from './cityplan.js';

export function createWorld(seed = 1) {
  const rng = new Rng(seed);
  const canvas = document.getElementById('game');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 1500);
  camera.position.set(0, 6, 12);

  const sky = buildSky(scene, rng);
  buildLights(scene);
  buildTerrain(scene);
  buildCity(scene, rng);
  buildStreetProps(scene, rng);
  const landmarks = buildLandmarks(scene);

  const colliders = buildingColliders();
  const traffic = new Traffic(scene, rng);
  traffic.spawn(16);
  traffic.buildParked();
  const crowd = new Crowd(scene, rng);
  crowd.spawn(30);
  const police = new Police(scene, rng, colliders);
  const shooting = new Shooting(scene, colliders);
  const collectibles = new Collectibles(scene, rng);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return {
    rng, renderer, scene, camera, sky, landmarks,
    colliders, traffic, crowd, police, shooting, collectibles,
    // Push a circle (x, z, radius) out of every building AABB.
    collideCircle(p, radius) {
      for (const c of colliders) {
        if (p.x > c.minX - radius && p.x < c.maxX + radius && p.z > c.minZ - radius && p.z < c.maxZ + radius) {
          const dxl = p.x - (c.minX - radius), dxr = (c.maxX + radius) - p.x;
          const dzl = p.z - (c.minZ - radius), dzr = (c.maxZ + radius) - p.z;
          const m = Math.min(dxl, dxr, dzl, dzr);
          if (m === dxl) p.x = c.minX - radius;
          else if (m === dxr) p.x = c.maxX + radius;
          else if (m === dzl) p.z = c.minZ - radius;
          else p.z = c.maxZ + radius;
          return true;
        }
      }
      return false;
    },
    clampToLand(p, margin = 2) {
      p.x = clamp(p.x, WORLD.minX + margin, WORLD.maxX - margin);
      p.z = clamp(p.z, WORLD.minZ + margin, WORLD.waterZ - margin);
    },
    update(dt, t, playerPos) {
      sky.clouds.children.forEach((c) => {
        c.position.x += c.userData.drift * dt;
        if (c.position.x > 560) c.position.x = -560;
      });
      landmarks.update(dt, t);
      traffic.update(dt, playerPos, null);
      crowd.update(dt, playerPos);
    },
    render() { renderer.render(scene, camera); },
    diagnostics() {
      const info = renderer.info;
      return {
        calls: info.render.calls, triangles: info.render.triangles,
        geometries: info.memory.geometries, textures: info.memory.textures,
      };
    },
  };
}
