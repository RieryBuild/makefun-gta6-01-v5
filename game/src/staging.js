// Shot staging — deterministic scene setups for the judged screenshots.
// `?shot=chase|title|map|combat|city&seed=1` picks a setup; the staging
// runs once the game is constructed, then sets window.__shotReady when
// the frame is settled (a few frames later, so the HUD and the camera
// have converged). Every shot is a real render of the game's own code —
// no screenshot-only geometry, no mock HUD. The staging only positions
// the player, the traffic, the police, and the camera; the world, the
// systems, and the HUD all run live underneath.

import { CAST } from './cast.js';
import { SHELL_SPOTS } from './growth.js';

export function stageShot(game, name, seed = 1) {
  const world = game.world;
  const player = game.player;
  const hud = game.hud;
  // The staged frame is captured ~60 s (wall) after staging, long
  // after the 5 s / 4.5 s transient timers fire. Remember the shot's
  // HUD lines and re-show them when the shot is ready, with a long
  // duration, so the captured frame still carries the objective and
  // the subtitle.
  let shotHud = null;
  const stageHud = (obj, sub) => {
    shotHud = { obj, sub };
    if (obj) hud.showObjective(obj.text, obj.color);
    if (sub) hud.showSubtitle(sub.speaker, sub.text);
  };
  const ready = () => {
    setTimeout(() => {
      if (shotHud?.obj) hud.showObjective(shotHud.obj.text, shotHud.obj.color, 120000);
      if (shotHud?.sub) hud.showSubtitle(shotHud.sub.speaker, shotHud.sub.text, 120000);
      window.__shotReady = true;
    }, 1400);
  };

  if (name === 'title') {
    // Title screen: the panorama is already staged by game.js; just
    // make sure the title menu is up and the camera orbits.
    game.state = 'title';
    game.menus.show('title');
    game.cam.mode = 'title';
    ready();
    return;
  }

  // All other shots start from a live game.
  game.newGame();
  // newGame starts mission 1 and shows its card — the shot frames want
  // the objective + subtitle, not the big card.
  hud.hideMissionCard();

  if (name === 'map') {
    // City map: a mid-game save state so the job list, the stats, and
    // the completion % all show real progress.
    game.growth.cash = 12450;
    game.growth.addRep(1240);
    for (const [hx, hz] of SHELL_SPOTS.slice(0, 5)) game.growth.shells.add(hx + ',' + hz);
    game.growth.stashes.add('Dock stash');
    game.growth.stats.carsStolen = 12;
    game.growth.stats.copsLost = 6;
    game.growth.stats.enemiesDown = 18;
    game.growth.stats.playTime = 47 * 60;
    game.story.done = new Set(['first-light', 'borrowed-wheels']);
    game.story.current = null;
    game.story.stageIdx = 0;
    game.nextMissionT = 999; // don't auto-start while mapping
    game.openMap();
    ready();
    return;
  }

  if (name === 'chase') {
    // The cover: the pursuit must sell itself at a glance — hero car
    // big in the lower frame, cruisers visibly flanking and closing,
    // the heli's beam on the road, a roadblock ahead, peds fleeing on
    // the sidewalks. The first staging read as a calm drive behind
    // traffic (distant car, one half-hidden cruiser, no heli, no
    // peds), so every element here is placed to be SEEN.
    game.growth.addRep(500);
    player.health = 100;
    player.armor = 60;
    // Avenue x=-40 (avenues run at x = -160,-120,-80,-40,0,...): the
    // car belongs on asphalt, and the capture lands at t>=0.5, when
    // the chase camera sits ~6 m behind the car. The street sidewalks
    // (raised 0.18 m boxes) cross the avenue at z=-29..-25 and
    // -15..-11; starting at z=-30 keeps the camera's capture window
    // (z=-32..-39) between the strips instead of on top of one.
    const cx = -40, cz = -30;
    player.enterCar(game.player.heroCar);
    const car = player.driving;
    car.mesh.position.set(cx, 0, cz);
    car.mesh.rotation.y = Math.PI; // heading -z (up the avenue)
    car.heading = Math.PI;
    car.speed = 22; // 79 km/h at staging: the box-in bleeds speed, and
    // the capture lands at t>=0.5 — starting slower left the speedo
    // reading like a traffic jam instead of a pursuit.
    player.forceThrottle = true;
    player.ramKeepsSpeed = true; // rams shove + damage, never bleed
    // speed for the shot — four cruisers at once would halve it.
    world.police.setWanted(3); // spawns 4 cruisers + heli + roadblock
    // Cruisers IN the frame, not behind the camera: two flanking just
    // ahead of the hero car (left/right, closing to ram), two further
    // up the avenue. They need LEAD: the hero accelerates at 26 m/s^2
    // while cruisers top out near 19.8, so flankers staged 9 m ahead
    // were rear-ended by t=0.5 and the car piled up to 15 km/h. At
    // 15–16 m with a wide lateral offset they close to a visible ram
    // inside the capture window without touching the car first.
    const slots = [
      { x: cx - 6, z: cz - 15, speed: 24 },
      { x: cx + 6, z: cz - 16, speed: 24 },
      { x: cx - 3, z: cz - 26, speed: 22 },
      { x: cx + 3.5, z: cz - 30, speed: 22 },
    ];
    world.police.cruisers.forEach((c, i) => {
      const s = slots[i % slots.length];
      c.mesh.position.set(s.x, 0, s.z);
      c.mesh.rotation.y = Math.PI;
      c.heading = Math.PI;
      c.speed = s.speed;
    });
    // Heli ahead of the player and LOW (24 m, not 42): at full height
    // the heli and its beam sat above the frame's top edge. Down here
    // the beam slants visibly onto the road and the heli body can peek
    // into the top of the frame. The beam aims 15 m AHEAD of the car,
    // not at it — a beam aimed at the player points straight down the
    // chase camera's lens and floods the frame as a white wedge.
    if (world.police.heli) {
      world.police.heli.angle = -Math.PI / 2;
      world.police.heli.height = 24;
      world.police.heli.aimAhead = 15;
    }
    // Roadblock close enough to read: 22 m ahead, just in front of the
    // nearest traffic car, angled cruisers + flashing light bars
    // across the avenue. At 26 m it still dissolved into the traffic
    // cluster ahead; at 22 m the sideways profiles read.
    world.police.roadblockDist = 22;
    // Traffic ahead of the player, not around the camera — and far
    // enough ahead that the hero doesn't rear-end it inside the
    // capture window: centred 44 m ahead, the four cars fill the road
    // at 30–72 m out (the oncoming ones meet the player after t=1.0)
    // and the camera stays clear. The roadblock sits just ahead of the
    // nearest of them, unoccluded.
    world.traffic.ensureNear(cx, cz - 44, 4);
    // Keep the foreground clear: ambient traffic spawns all over the
    // grid, and a random sedan beside the chase camera dwarfs the hero
    // car. Re-route any unstaged car in the avenue corridor near the
    // chase onto a far avenue (the first four cars are the staged line
    // above; cross-street traffic is left alone so the background
    // intersections stay alive).
    world.traffic.cars.forEach((car, i) => {
      if (i < 4) return;
      const m = car.mesh.position;
      if (Math.abs(m.x - cx) < 10 && Math.abs(m.z - cz) < 50) {
        car.route = { axis: 'z', fixed: 120, dir: 1, pos: cz - 80 - i * 6 };
        car.heading = 0;
        car.turning = null;
        world.traffic.placeOnRoute(car);
      }
    });
    // Street life: peds on both sidewalks, fleeing the chase. spawn()
    // scatters across random walk lines, so pin the fresh peds onto
    // the avenue's sidewalks by hand, then raise the alarm — in range
    // they run with their arms up.
    const ped0 = world.crowd.peds.length;
    world.crowd.spawn(8, { x: cx, z: cz - 20 });
    world.crowd.peds.slice(ped0).forEach((ped, i) => {
      ped.line = { axis: 'z', at: cx + (i % 2 === 0 ? -7 : 7) };
      ped.pos = cz - 4 - i * 5;
      ped.mode = 'walk';
      world.crowd.place(ped);
    });
    world.crowd.raiseAlarm(cx, cz - 15);
    // Closer chase cam: the hero car fills the lower frame instead of
    // sitting small and distant at the end of a 9 m boom.
    game.cam.mode = 'drive';
    game.cam.distScale = 0.62;
    game.cam.yaw = 0; // == heading + PI: converged from frame one
    stageHud(
      { text: 'Get to the garage — and lose the heat', color: '#ffd700' },
      { speaker: 'teo', text: CAST.teo.lines.chase },
    );
    ready();
    return;
  }

  if (name === 'combat') {
    // On-foot combat: Ro in two-handed aim at the docks, the crew
    // close enough to read, a tracer mid-frame, a legible damage
    // number. The first staging shot the fight from 18 m out with the
    // camera dead behind Ro — the rifle washed out, the tracer never
    // showed, the enemies were specks. This one closes the distance
    // on both ends and shoots over Ro's shoulder at a three-quarter
    // angle so the aim pose itself reads.
    game.growth.addRep(800);
    game.growth.unlocked.add('rifle');
    player.weapon = 'rifle';
    player.switchWeapon('rifle');
    player.health = 84;
    player.armor = 40;
    const px = -140, pz = 60;
    player.mesh.position.set(px, 0, pz);
    player.mesh.rotation.y = Math.PI / 2; // facing +x (into the docks)
    player.heading = Math.PI / 2;
    // Three-quarter over-the-shoulder camera: yaw -PI/2 would sit dead
    // behind Ro; +0.55 swings it well to the side so her profile, the
    // rifle, and the target share the frame — and so the tracer crosses
    // the frame diagonally instead of foreshortening to nothing behind
    // her head (at +0.35 the aim ray ran nearly down the lens and the
    // tracer vanished). The shot leaves along the camera's forward, so
    // the firing line is the yaw's opposite: aimDir = (-sin(yaw),
    // -cos(yaw)).
    const camYaw = -Math.PI / 2 + 0.55;
    const aimX = -Math.sin(camYaw), aimZ = -Math.cos(camYaw);
    game.enemies.spawnAt(px + 12, pz - 2, { count: 3 });
    for (const e of game.enemies.list) {
      e.target.hp = 400; // staged tanky — the frame needs live targets
      e.target.maxHp = 400;
      e.hp = 400;
    }
    // Pin all three crew by hand — the spawn scatter (4–11 m) would
    // otherwise leave them anywhere, including behind Ro. One dead on
    // the firing line at 12 m so the rifle actually hits (hits are
    // what put damage numbers in the frame), one flanking it, one
    // already down in the foreground.
    const onLine = game.enemies.list[1];
    if (onLine) onLine.mesh.position.set(px + 12 * aimX, 0, pz + 12 * aimZ);
    const flank = game.enemies.list[2];
    if (flank) flank.mesh.position.set(px + 10, 0, pz + 4);
    const down = game.enemies.list[0];
    if (down) {
      down.mesh.position.set(px + 8, 0, pz - 7);
      down.target.hp = 0;
      game.enemies.kill(down);
      down.fallT = 0.2;
    }
    player.forceAim = true;
    // Rifle rate is 2.6/s; the tracer lives 0.32 s, so a shot every
    // 350 ms keeps a tracer in the frame ~80% of the time.
    setInterval(() => { player.forceFire = true; }, 350);
    game.cam.mode = 'aim';
    game.cam.yaw = camYaw;
    game.cam.pitch = 0.02;
    // 3.15 m: Ro fills the frame, and the tracer + damage number sit
    // close enough to read. Pitch near level so the tracer reads as
    // aimed AT the crew (0.12 would plunge it into the ground 12 m
    // out — the aim ray drops with the camera pitch).
    game.cam.distScale = 0.75;
    // The docks street shouldn't read empty: a few cars + peds behind
    // the fight (they flee once Ro opens fire). The cars sit 19 m out
    // or further so none of them parks on the firing line in front of
    // the 12 m target.
    world.traffic.ensureNear(px + 40, pz, 3);
    const cped0 = world.crowd.peds.length;
    world.crowd.spawn(4, { x: px + 20, z: pz });
    world.crowd.peds.slice(cped0).forEach((ped, i) => {
      ped.line = { axis: 'x', at: pz + (i % 2 === 0 ? -7 : 7) };
      ped.pos = px + 16 + i * 6;
      ped.mode = 'walk';
      world.crowd.place(ped);
    });
    stageHud(
      { text: 'Clear the docks crew', color: '#ff6a3d' },
      { speaker: 'ines', text: CAST.ines.lines.combat },
    );
    ready();
    return;
  }

  if (name === 'city') {
    // A wide city establishing frame: Ro on foot at the market square,
    // peds and traffic around, the tower skyline behind.
    game.growth.addRep(300);
    player.mesh.position.set(8, 0, 8);
    player.mesh.rotation.y = Math.PI;
    player.heading = Math.PI;
    world.traffic.ensureNear(0, 0, 6);
    game.cam.mode = 'foot';
    game.cam.yaw = 0;
    stageHud({ text: 'Explore Puerto del Sol', color: '#ffd700' }, null);
    ready();
    return;
  }

  ready();
}
