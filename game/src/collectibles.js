// Collectibles — Sun Shells (24, glowing gold shells on the beach and
// around the city) and hidden stashes (5, green-glowing caches). Each
// is a small emissive mesh + a feathered glow sprite; walking within
// 2 m collects it with a popup and a REP tick. The map screen shows
// the uncollected ones as dots.

import { SHELL_SPOTS, STASH_SPOTS } from './growth.js';
import { makeGlowTexture } from './surface.js';

export class Collectibles {
  constructor(scene, rng) {
    this.scene = scene;
    this.shells = [];
    this.stashes = [];
    this.onShell = null;
    this.onStash = null;
    const glowTex = makeGlowTexture([[0, 0xffd700, 0.9], [0.5, 0xffd700, 0.35]]);
    const stashTex = makeGlowTexture([[0, 0x2ecc71, 0.9], [0.5, 0x2ecc71, 0.35]]);
    for (const [x, z] of SHELL_SPOTS) {
      const g = new THREE.Group();
      const shell = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8),
        new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xaa8800, emissiveIntensity: 0.8, roughness: 0.3 }));
      shell.scale.set(1, 0.55, 1.25);
      shell.position.y = 0.3;
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, fog: false, opacity: 0.8,
      }));
      glow.scale.set(2.2, 2.2, 1);
      glow.position.y = 0.5;
      g.add(shell, glow);
      g.position.set(x, 0, z);
      g.userData.spin = shell;
      scene.add(g);
      this.shells.push({ mesh: g, x, z, key: x + ',' + z, taken: false });
    }
    for (const s of STASH_SPOTS) {
      const g = new THREE.Group();
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x2ecc71, emissive: 0x1a7a44, emissiveIntensity: 0.7, roughness: 0.4 }));
      box.position.y = 0.3;
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({
        map: stashTex, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, fog: false, opacity: 0.8,
      }));
      glow.scale.set(2.6, 2.6, 1);
      glow.position.y = 0.6;
      g.add(box, glow);
      g.position.set(s.x, 0, s.z);
      scene.add(g);
      this.stashes.push({ mesh: g, x: s.x, z: s.z, name: s.name, taken: false });
    }
  }

  restore(takenShells, takenStashes) {
    for (const s of this.shells) if (takenShells.has(s.key)) this.takeShell(s, true);
    for (const s of this.stashes) if (takenStashes.has(s.name)) this.takeStash(s, true);
  }

  takeShell(s, silent) {
    s.taken = true;
    this.scene.remove(s.mesh);
    if (!silent && this.onShell) this.onShell(s);
  }

  takeStash(s, silent) {
    s.taken = true;
    this.scene.remove(s.mesh);
    if (!silent && this.onStash) this.onStash(s);
  }

  update(dt, t, playerPos) {
    for (const s of this.shells) {
      if (s.taken) continue;
      s.mesh.userData.spin.rotation.y = t * 1.5;
      s.mesh.position.y = Math.sin(t * 2 + s.x) * 0.08;
      if (Math.hypot(playerPos.x - s.x, playerPos.z - s.z) < 2) this.takeShell(s);
    }
    for (const s of this.stashes) {
      if (s.taken) continue;
      s.mesh.position.y = Math.sin(t * 1.6 + s.x) * 0.06;
      if (Math.hypot(playerPos.x - s.x, playerPos.z - s.z) < 2.2) this.takeStash(s);
    }
  }
}
