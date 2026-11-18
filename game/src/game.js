// The game — the state machine and the main loop. States: title,
// playing, paused, map, wasted, busted. The loop updates the player,
// the world (traffic, crowd), the police, the enemies, the story, the
// collectibles, and the HUD, in that order. Missions auto-start in
// sequence (GTA-style: the next job comes to you after the last one
// pays out); BUSTED/WASTED cost 10% of cash (min $100) and respawn at
// the police station / hospital. Autosave runs every 30 s and on every
// mission pass. Everything the play-test asserts goes through the
// `window.__pds` hooks at the bottom.

import { createWorld } from './world.js';
import { Controls } from './controls.js';
import { Sound } from './sound.js';
import { Growth, SHELL_SPOTS, STASH_SPOTS } from './growth.js';
import { Story, buildBeacon, MISSIONS } from './story.js';
import { Player } from './player.js';
import { Enemies } from './enemies.js';
import { Hud } from './hud.js';
import { Menus } from './menus.js';
import { Camerawork } from './camerawork.js';
import { loadSave, writeSave, clearSave } from './persistence.js';
import { districtAt, poiById } from './cityplan.js';
import { DISTRICTS } from './palette.js';
import { CAST } from './cast.js';
import { setPose } from './humanoid.js';
import { WEAPONS } from './shooting.js';
import { clamp } from './rng.js';

export class Game {
  constructor() {
    this.world = createWorld(1);
    this.controls = new Controls(document.getElementById('game'));
    this.sound = new Sound();
    this.growth = new Growth();
    this.story = new Story();
    this.hud = new Hud();
    this.player = new Player(this.world, this.controls, this.sound, this.growth, this.world.police, this.world.shooting);
    this.enemies = new Enemies(this.world, this.world.shooting, this.player);
    this.cam = new Camerawork(this.world.camera, this.world.colliders);
    this.menus = new Menus({
      onNewGame: () => this.newGame(),
      onContinue: () => this.continueGame(),
      onResume: () => this.resume(),
      onQuit: () => this.quitToTitle(),
      onSave: () => this.save(true),
      onOpenMap: () => this.openMap(),
      onCloseMap: () => this.closeMap(),
    });
    this.state = 'title';
    this.t = 0;
    this.autosaveT = 0;
    this.nextMissionT = 0;
    this.district = null;
    this.beacon = buildBeacon();
    this.beacon.visible = false;
    this.world.scene.add(this.beacon);
    this.player.registerTarget();
    this.wire();
    this.controls.onPauseKey = () => {
      if (this.state === 'playing') this.pause();
      else if (this.state === 'paused') this.resume();
      else if (this.state === 'map') this.closeMap();
    };
    this.controls.onMapKey = () => {
      if (this.state === 'playing') this.openMap();
      else if (this.state === 'map') this.closeMap();
    };
    this.controls.onAnyKey = () => {
      this.sound.unlock();
      if (this.state === 'playing' && !this.radioStarted) {
        this.radioStarted = true;
        this.sound.startRadio();
      }
    };
    this.menus.setContinue(this.saveSummary());
    this.menus.show('title');
    this.cam.mode = 'title';
    this.stageTitleScene();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  saveSummary() {
    const s = loadSave();
    if (!s) return null;
    return {
      missionsDone: (s.storyDone || []).length,
      cash: s.growth?.cash ?? 0,
      completion: s.completion ?? 0,
      rank: s.rank ?? 'OUTSIDER',
    };
  }

  wire() {
    // Story hooks.
    this.story.hooks.onMissionStart = (m) => {
      this.hud.showMissionCard(m.name, CAST[m.giver].call + ' · ' + m.brief);
      this.hud.showSubtitle(m.giver, CAST[m.giver].lines.start);
      this.hud.showObjective(this.story.currentStage.text, '#ffd700');
      this.sound.jingle();
    };
    this.story.hooks.onStage = (m, s) => {
      this.hud.showObjective(s.text, '#ffd700');
      this.moveBeacon();
    };
    this.story.hooks.spawnEnemies = (s) => {
      const poi = poiById(s.poi);
      this.enemies.spawnAt(poi.x, poi.z, { count: s.count, boss: !!s.boss, lieutenant: !!s.lieutenant });
    };
    this.story.hooks.setWanted = (n) => this.world.police.setWanted(n);
    this.story.hooks.onCheckpoint = (cp, total) => {
      this.hud.showPopup(`CHECKPOINT ${cp}/${total}`, '#2ecc71');
      this.sound.blip(880, 0.12, 0.25);
    };
    this.story.hooks.onKillProgress = (left) => {
      if (left > 0) this.hud.showObjective(`${this.story.currentStage.text} (${left} left)`, '#ff6a3d');
    };
    this.story.hooks.onMissionPassed = (m) => {
      this.growth.addCash(m.cash);
      this.growth.addRep(m.rep);
      this.growth.stats.missionsDone++;
      // Mission rewards name their unlock in display case ('Pistol',
      // 'SMG', 'Rifle', 'Armour'); the unlocked set only ever holds
      // lowercase weapon keys. Fold the case at this boundary, so a
      // future mission written as 'RIFLE' or 'ARMOUR' still pays its
      // reward instead of silently skipping it.
      const rewardKey = String(m.unlock || '').toLowerCase();
      if (rewardKey === 'armour') this.player.armor = 100;
      else if (rewardKey !== 'fists' && Object.hasOwn(WEAPONS, rewardKey)) this.growth.unlocked.add(rewardKey);
      this.hud.showBigCard(
        `<div class="big-title gold">MISSION PASSED</div>
         <div class="big-sub">+$${m.cash.toLocaleString()} &nbsp;·&nbsp; +${m.rep} REP &nbsp;·&nbsp; ${m.unlock}</div>`,
        4000,
      );
      this.sound.jingle();
      this.save();
      this.nextMissionT = 4;
      this.beacon.visible = false;
    };
    this.story.hooks.onMissionFailed = (m, reason) => {
      this.hud.showBigCard(
        `<div class="big-title">MISSION FAILED</div><div class="big-sub">${reason === 'time' ? 'Out of time' : 'Try again — the job waits.'}</div>`,
        3500,
      );
      this.enemies.clear();
      this.nextMissionT = 4;
      this.beacon.visible = false;
    };
    // Police hooks.
    this.world.police.onBusted = () => this.busted();
    this.world.police.onEscape = () => {
      this.growth.stats.copsLost++;
      this.hud.showPopup('HEAT LOST', '#2ecc71');
    };
    this.world.police.onWantedChange = (n) => {
      if (n >= 3) this.hud.showSubtitle('reyes', CAST.reyes.lines.chase);
    };
    // Player hooks.
    this.player.onWasted = () => this.wasted();
    this.player.onStolen = () => {
      this.story.onCarStolen();
      this.hud.showPopup('CAR STOLEN', '#ff6a3d');
    };
    this.player.onPopup = (kind, text) => {
      if (kind === 'car') {
        this.hud.showNameCard(text, this.player.driving.spec.name);
      } else {
        this.hud.showPopup(text, kind === 'drift' ? '#f5c518' : '#2ecc71');
      }
    };
    this.player.onDamage = () => {
      this.hud.flashDamage();
      this.cam.addShake(0.25);
    };
    // Collectibles.
    this.world.collectibles.onShell = (s) => {
      this.growth.shells.add(s.key);
      this.growth.addCash(100);
      this.growth.addRep(25);
      this.hud.showPopup(`SUN SHELL ${this.growth.shells.size}/${SHELL_SPOTS.length} · +$100`, '#ffd700');
    };
    this.world.collectibles.onStash = (s) => {
      this.growth.stashes.add(s.name);
      this.growth.addCash(500);
      this.growth.addRep(50);
      this.hud.showPopup(`STASH FOUND · +$500`, '#2ecc71');
    };
    // Growth.
    this.growth.onRepGain = (n) => this.hud.showRepFloat(n);
    this.growth.onRankUp = (rank) => {
      this.hud.showPopup(`RANK UP · ${rank.name}`, '#f5c518');
      this.sound.jingle();
    };
    // Enemies.
    this.enemies.onEnemyDown = (e) => {
      this.growth.stats.enemiesDown++;
      this.growth.addCash(e.boss ? 1000 : 50);
      this.hud.showPopup(e.boss ? 'KING DOWN · +$1,000' : 'ENEMY DOWN · +$50', '#f5c518');
      this.story.onEnemyKilled();
      if (e.boss) this.hud.showSubtitle('venn', CAST.venn.lines.win);
    };
  }

  moveBeacon() {
    const t = this.story.stageTarget();
    if (!t) { this.beacon.visible = false; return; }
    this.beacon.visible = true;
    this.beacon.position.set(t.x, 0, t.z);
  }

  // The title panorama: Ro beside the hero car on the beachfront, the
  // Ferris wheel behind — the camera orbits slowly.
  stageTitleScene() {
    this.player.mesh.position.set(-52, 0, 152);
    // Face the camera: the title orbit starts south of the car looking
    // north, so rotation 0 (facing +z, south) shows her face. PI*0.75
    // faced her north-east — away from the camera, back turned.
    this.player.mesh.rotation.y = 0;
    this.player.mesh.visible = true;
    this.heroCarAt(-56, 150, Math.PI / 2);
  }

  heroCarAt(x, z, heading) {
    const car = this.player.heroCar;
    car.mesh.position.set(x, 0, z);
    car.mesh.rotation.y = heading;
    car.heading = heading;
  }

  newGame() {
    clearSave();
    this.growth = new Growth();
    this.player.growth = this.growth;
    this.story = new Story();
    this.wire(); // re-wire the hooks onto the fresh Story + Growth
    this.enemies.clear();
    this.world.police.setWanted(0);
    this.player.health = 100;
    this.player.armor = 0;
    this.player.weapon = 'pistol';
    for (const [k, w] of Object.entries(WEAPONS)) {
      this.player.ammo[k] = { mag: isFinite(w.mag) ? w.mag : Infinity, reserve: w.reserve };
    }
    this.player.switchWeapon('pistol');
    this.player.mesh.position.set(-60, 0, 148);
    this.player.mesh.visible = true;
    this.player.driving = null;
    // Reset staging knobs to play defaults: staging sets them AFTER
    // calling newGame(), so a fresh game never inherits a staged value.
    this.cam.distScale = 1;
    this.player.ramKeepsSpeed = false;
    this.world.police.roadblockDist = 60;
    this.heroCarAt(-56, 150, Math.PI / 2);
    this.state = 'playing';
    this.menus.hideAll();
    this.cam.mode = 'foot';
    this.cam.yaw = Math.PI;
    const m = this.story.nextMission;
    if (m) this.story.start(m);
    this.hud.showHelp('WASD move · Mouse aim · F enter car · M map');
    this.save();
  }

  continueGame() {
    const s = loadSave();
    if (!s) { this.newGame(); return; }
    this.growth.restore(s.growth);
    this.story.done = new Set(s.storyDone || []);
    this.player.health = s.health ?? 100;
    this.player.armor = s.armor ?? 0;
    if (s.pos) this.player.mesh.position.set(s.pos.x, 0, s.pos.z);
    this.world.collectibles.restore(new Set(s.growth?.shells || []), new Set(s.growth?.stashes || []));
    // Same staging-knob reset as newGame: a continued game must not
    // inherit a staged value either (e.g. Continue pressed after a
    // ?shot= staging URL set them).
    this.cam.distScale = 1;
    this.player.ramKeepsSpeed = false;
    this.world.police.roadblockDist = 60;
    this.state = 'playing';
    this.menus.hideAll();
    this.cam.mode = 'foot';
    this.nextMissionT = 1.5;
    this.hud.showHelp('Welcome back — the next job is coming.');
  }

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.menus.show('pause');
    if (document.pointerLockElement) document.exitPointerLock();
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'playing';
    this.menus.hideAll();
  }

  openMap() {
    if (this.state !== 'playing') return;
    this.state = 'map';
    this.menus.openMap(this);
    if (document.pointerLockElement) document.exitPointerLock();
  }

  closeMap() {
    if (this.state !== 'map') return;
    this.state = 'playing';
    this.menus.hideAll();
  }

  quitToTitle() {
    this.save();
    this.state = 'title';
    this.menus.show('title');
    this.menus.setContinue(this.saveSummary());
    this.cam.mode = 'title';
    this.stageTitleScene();
    this.enemies.clear();
    this.world.police.setWanted(0);
  }

  busted() {
    if (this.state !== 'playing') return;
    this.state = 'busted';
    const fine = Math.max(100, Math.round(this.growth.cash * 0.1));
    this.growth.addCash(-fine);
    this.world.police.setWanted(0);
    this.hud.showBigCard(`<div class="big-title red">BUSTED</div><div class="big-sub">Fine $${fine.toLocaleString()} · The job failed</div>`, 3600);
    this.sound.sting();
    if (this.story.current) this.story.fail('busted');
    this.enemies.clear();
    setTimeout(() => {
      if (this.state !== 'busted') return; // quit to title meanwhile
      this.player.respawnAt('police');
      this.state = 'playing';
      this.hud.hideBigCard();
      this.nextMissionT = 2;
    }, 3600);
  }

  wasted() {
    if (this.state !== 'playing') return;
    this.state = 'wasted';
    const bill = Math.max(100, Math.round(this.growth.cash * 0.1));
    this.growth.addCash(-bill);
    this.world.police.setWanted(0);
    this.hud.showBigCard(`<div class="big-title">WASTED</div><div class="big-sub">Hospital bill $${bill.toLocaleString()} · The job failed</div>`, 3600);
    this.sound.sting();
    if (this.story.current) this.story.fail('wasted');
    this.enemies.clear();
    setTimeout(() => {
      if (this.state !== 'wasted') return; // quit to title meanwhile
      this.player.respawnAt('hospital');
      this.state = 'playing';
      this.hud.hideBigCard();
      this.nextMissionT = 2;
    }, 3600);
  }

  save(manual = false) {
    const data = {
      growth: this.growth.serialize(),
      storyDone: [...this.story.done],
      completion: this.growth.completion(this.story.done.size),
      rank: this.growth.rank.name,
      health: this.player.health,
      armor: this.player.armor,
      pos: { x: this.player.position.x, z: this.player.position.z },
    };
    const ok = writeSave(data);
    if (manual) this.hud.showPopup(ok ? 'GAME SAVED' : 'SAVE FAILED', ok ? '#2ecc71' : '#ff4444');
    return ok;
  }

  loop() {
    requestAnimationFrame(this.loop);
    const dt = Math.min(0.05, this.clockDelta());
    this.t += dt;
    if (this.state === 'playing') this.updatePlaying(dt);
    else if (this.state === 'title') this.updateTitle(dt);
    // Debug hook for the logic play-test: SwiftShader renders this scene
    // at ~0.3 fps, so the harness sets noRender to run game time at full
    // speed while it drives the systems. Default off; the shipped game
    // always renders.
    if (!this.noRender) this.world.render();
    this.controls.endFrame();
  }

  clockDelta() {
    const now = performance.now();
    const dt = this._last ? (now - this._last) / 1000 : 0.016;
    this._last = now;
    return dt;
  }

  updateTitle(dt) {
    const focus = { pos: this.player.heroCar.mesh.position, heading: 0, speed: 0 };
    this.cam.update(dt, focus);
    this.world.update(dt, this.t, focus.pos);
    // Ro idles beside the car on the title screen.
    this.player.phase += dt;
    setPose(this.player.mesh, 'idle', this.player.phase);
  }

  updatePlaying(dt) {
    const look = this.controls.consumeLook();
    // Camera mode follows the state.
    if (this.player.driving) this.cam.mode = 'drive';
    else if (this.player.aiming) this.cam.mode = 'aim';
    else this.cam.mode = 'foot';

    this.player.update(dt, this.cam);
    this.world.update(dt, this.t, this.player.position);
    this.world.police.update(dt, this.player, this.t);
    this.enemies.update(dt);
    this.world.shooting.update(dt);
    this.world.collectibles.update(dt, this.t, this.player.position);
    this.story.update(dt, {
      playerPos: this.player.position,
      wanted: this.world.police.wanted,
      driving: !!this.player.driving,
    });
    // Beacon pulse.
    if (this.beacon.visible) {
      this.beacon.userData.ring.rotation.z += dt;
      this.beacon.userData.ring.scale.setScalar(1 + Math.sin(this.t * 3) * 0.08);
    }
    // Next mission auto-start.
    if (this.nextMissionT > 0) {
      this.nextMissionT -= dt;
      if (this.nextMissionT <= 0) {
        const m = this.story.nextMission;
        if (m) this.story.start(m);
        else this.hud.showPopup('ALL JOBS DONE · FREE ROAM', '#f5c518');
      }
    }
    // District name card on entry.
    const d = districtAt(this.player.position.x, this.player.position.z);
    if (d !== this.district) {
      this.district = d;
      const pal = DISTRICTS[d];
      this.hud.showNameCard(pal.name, pal.sub);
    }
    // Radio station switch.
    if (this.controls.pressed('KeyN')) {
      const st = this.sound.nextStation();
      this.hud.showRadio(st, st.show);
    }
    // Crosshair visibility.
    const cross = document.getElementById('crosshair');
    if (cross) cross.style.visibility = this.player.aiming ? 'visible' : 'hidden';
    // Camera.
    const focus = {
      pos: this.player.position, heading: this.player.heading,
      speed: this.player.speed, look,
    };
    this.cam.update(dt, focus);
    // HUD.
    const repFrac = (() => {
      const ranks = [0, 300, 800, 1600, 3000, 5000];
      const rep = this.growth.rep;
      for (let i = 0; i < ranks.length - 1; i++) {
        if (rep < ranks[i + 1]) return (rep - ranks[i]) / (ranks[i + 1] - ranks[i]);
      }
      return 1;
    })();
    this.hud.update({
      x: this.player.position.x, z: this.player.position.z,
      heading: this.player.heading,
      cash: this.growth.cash, wanted: this.world.police.wanted,
      health: this.player.health, armor: this.player.armor, repFrac,
      weapon: this.player.weapon,
      mag: this.player.ammo[this.player.weapon].mag,
      reserve: this.player.ammo[this.player.weapon].reserve,
      speedKmh: this.player.speedKmh, driving: !!this.player.driving,
      missionTarget: this.story.stageTarget(),
      policeBlips: this.world.police.blips(),
      enemyBlips: this.enemies.blips(),
      searchActive: this.world.police.searchActive,
    });
    // Play time + autosave.
    this.growth.stats.playTime += dt;
    this.autosaveT += dt;
    if (this.autosaveT > 30) {
      this.autosaveT = 0;
      this.save();
    }
  }
}
