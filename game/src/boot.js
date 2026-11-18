// Boot — the entry point. Parses the query string, constructs the
// game, and wires the optional shot staging. Also installs the debug
// hooks the play-test uses: window.__pds exposes the game, the player,
// the story, the growth, and the police, plus a ready flag the
// screenshot harness waits on. Errors surface on the page (a red banner
// with the message) so a broken build is never silently blank.

import { Game } from './game.js';
import { stageShot } from './staging.js';

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
const seed = parseInt(params.get('seed') || '1', 10);

window.addEventListener('error', (ev) => {
  const el = document.getElementById('boot-error');
  if (el) {
    el.style.display = 'block';
    el.textContent = 'Error: ' + (ev.message || 'unknown');
  }
  console.error(ev.error || ev.message);
});

const game = new Game();

window.__pds = {
  game,
  player: game.player,
  // Live getters: newGame() replaces game.story / game.growth with fresh
  // objects, so a snapshot here would go stale after New Game.
  get story() { return game.story; },
  get growth() { return game.growth; },
  police: game.world.police,
  world: game.world,
  hud: game.hud,
  version: '5.0.0',
  shot: shot || null,
};

if (shot) {
  stageShot(game, shot, seed);
} else {
  window.__shotReady = false;
}
