// PUERTO DEL SOL (v5) — the hand-in program for make.fun gta6-01.
// Node 22, standard library only. The game itself is plain static files
// (game/index.html + ES modules + vendored three.js, no network request
// at runtime); this program copies game/ and screenshots/ beside this
// file into the output directory and writes /output/dossier.json, the
// summary the judge reads, with the vendored make.fun library.
//
// Run it:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (inside the grader's container the output directory is /output).
// Serve the game:  node serve.ts   ->  http://localhost:8080
//
// Determinism: the output directory is wiped first, so a second run
// over the same tree produces byte-identical output — no stale file
// from an earlier run can leak into the dossier.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(from, to) {
  if (!existsSync(from)) return;
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
}

function main() {
  // Wipe first: the dossier must describe exactly this tree, nothing
  // left over from a previous run. Wipe the CONTENTS, not the
  // directory: in the grader /output is a mounted volume the process
  // cannot rmdir (EACCES) — deleting the directory itself fails the run.
  mkdirSync(out, { recursive: true });
  for (const entry of readdirSync(out)) rmSync(join(out, entry), { recursive: true, force: true });
  copyTree(join(here, 'game'), join(out, 'game'));
  copyTree(join(here, 'screenshots'), join(out, 'screenshots'));

  // The scorer's own caps (reference/gate.json). text_max_bytes shapes
  // the dossier's bytes; the others refuse an entry the scorer would
  // refuse: more than 4 screenshots or one over 256 KiB; more than 993
  // files in game/ or 48 MiB of game files in all; a path under game/
  // over 1000 bytes.
  const dossier = buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  });
  writeFileSync(join(out, 'dossier.json'), dossier);
}

main();
