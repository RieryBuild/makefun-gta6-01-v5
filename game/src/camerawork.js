// Cameras — the GTA chase cam, tight behind the bumper, low and close
// (dossier P10). On foot: a third-person orbit cam (mouse steers the
// yaw, pitch clamps). Driving: the cam drops low behind the car, pulls
// back and kicks the FOV up with speed, and eases back when you slow.
// Aim: the cam swings over the shoulder. Cinematic: a slow pivot for
// the chase screenshot — low angle, car filling the lower third.
// The camera never goes under the ground or inside a building: the
// boom shortens when the ray back hits a collider.

import { clamp, damp, turnToward } from './rng.js';

export class Camerawork {
  constructor(camera, colliders) {
    this.cam = camera;
    this.colliders = colliders;
    this.yaw = 0;        // orbit yaw (world)
    this.pitch = 0.32;   // orbit pitch (radians above horizontal)
    this.dist = 7.5;
    this.mode = 'foot';  // foot | drive | aim | cinematic | title
    // distScale is a staging-only zoom: the screenshot setups pull the
    // chase/aim cameras closer (hero car / Ro larger in frame) without
    // changing the shipped camera feel (scale stays 1 in live play).
    this.distScale = 1;
    this.fov = 62;
    this.shake = 0;
    this.cineT = 0;
    // forwardYaw is read by the player on the very first playing frame
    // (aim mode turns Ro toward it). It must be defined from birth:
    // when the combat shot stages aim before any cam.update has run,
    // an undefined forwardYaw made turnToward return NaN, which
    // poisoned the player heading and the mesh never rendered.
    this.forwardYaw = Math.atan2(-Math.sin(this.yaw), -Math.cos(this.yaw));
  }

  addShake(n) { this.shake = Math.min(0.6, this.shake + n); }

  // Shorten the boom when a building stands between the target and the cam.
  boomClear(target, dir, want) {
    let dist = want;
    for (const b of this.colliders) {
      // Sample along the boom; the first hit shortens it.
      for (let t = 1; t < want; t += 1) {
        const x = target.x + dir.x * t, z = target.z + dir.z * t;
        const y = target.y + dir.y * t;
        if (y < b.h && x > b.minX && x < b.maxX && z > b.minZ && z < b.maxZ) {
          dist = Math.min(dist, Math.max(2, t - 0.6));
          break;
        }
      }
    }
    return dist;
  }

  update(dt, focus) {
    // focus: {pos: Vector3-like, heading, speed, aiming, driving, look:{dx,dy}}
    const { pos, heading } = focus;
    if (focus.look) {
      this.yaw -= focus.look.dx * 0.0022;
      this.pitch = clamp(this.pitch + focus.look.dy * 0.0018, -0.15, 1.1);
    }
    let wantDist = 7.5, wantPitch = this.pitch, wantFov = 62;
    let target = { x: pos.x, y: pos.y + 1.6, z: pos.z };
    let yaw = this.yaw;

    if (this.mode === 'drive') {
      // Chase cam: behind the car's heading, low, FOV kick with speed.
      yaw = turnToward(this.yaw, heading + Math.PI, 2.2 * dt);
      this.yaw = yaw;
      const speedK = clamp(focus.speed / 55, 0, 1);
      wantDist = (8.2 + speedK * 2.2) * this.distScale;
      wantPitch = 0.22;
      wantFov = 62 + speedK * 10;
      target = { x: pos.x, y: pos.y + 1.4, z: pos.z };
    } else if (this.mode === 'aim') {
      yaw = this.yaw;
      wantDist = 4.2 * this.distScale;
      // The pitch floor must allow LEVEL aim: the shot leaves the muzzle
      // along the camera direction, and a 0.05 floor tilts every ray
      // down 1.5 m over 30 m — below the target's feet. At 0 the ray
      // stays at muzzle height and a 30 m torso shot lands.
      wantPitch = clamp(this.pitch, -0.1, 0.6);
      wantFov = 55;
      target = { x: pos.x, y: pos.y + 1.55, z: pos.z };
    } else if (this.mode === 'cinematic') {
      // Slow pivot around the car, low angle — the chase frame.
      this.cineT += dt;
      yaw = heading + Math.PI + Math.sin(this.cineT * 0.11) * 0.35;
      wantDist = 10.5;
      wantPitch = 0.13;
      wantFov = 58;
      target = { x: pos.x, y: pos.y + 1.1, z: pos.z };
    } else if (this.mode === 'title') {
      // Slow orbit for the title panorama (focus = the hero car).
      this.cineT += dt;
      yaw = this.cineT * 0.05;
      wantDist = 12;
      wantPitch = 0.16;
      wantFov = 55;
      target = { x: pos.x, y: pos.y + 1.2, z: pos.z };
    }

    this.dist = damp(this.dist, wantDist, 4, dt);
    this.fov = damp(this.fov, wantFov, 4, dt);
    const dir = {
      x: Math.sin(yaw) * Math.cos(wantPitch),
      y: Math.sin(wantPitch),
      z: Math.cos(yaw) * Math.cos(wantPitch),
    };
    const clear = this.boomClear(target, dir, this.dist);
    const camPos = {
      x: target.x + dir.x * clear,
      y: Math.max(0.6, target.y + dir.y * clear),
      z: target.z + dir.z * clear,
    };
    // Shake decay + application.
    this.shake = Math.max(0, this.shake - dt * 1.8);
    if (this.shake > 0) {
      camPos.x += (Math.random() - 0.5) * this.shake * 0.5;
      camPos.y += (Math.random() - 0.5) * this.shake * 0.5;
    }
    this.cam.position.set(camPos.x, camPos.y, camPos.z);
    this.cam.lookAt(target.x, target.y, target.z);
    if (Math.abs(this.cam.fov - this.fov) > 0.05) {
      this.cam.fov = this.fov;
      this.cam.updateProjectionMatrix();
    }
    // The camera's forward yaw, for movement + aim.
    this.forwardYaw = Math.atan2(-dir.x, -dir.z);
  }
}
