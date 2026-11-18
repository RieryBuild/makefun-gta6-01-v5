# Visual Scorecard — PUERTO DEL SOL (gta6-01 v5)

Threejs-game 10-category visual scorecard, scored by the finishing
builder on the FINAL judged frames, all four viewed full-size
19 Nov 2026: 1-chase (cover), 2-title, 3-map, 4-combat, plus the
spare 5-city re-shoot. "Before" is the inherited state — the
continuation builder's final scores on these same frames (2.30);
"after" is this session's re-verified score. Three of the four
shipped frames are unchanged from the recovery placement (18:04Z);
3-map was re-placed this session with a fixed render (the Gate 1
re-check found a real label-overlap bug, the fix separated the
"Ro's Safehouse" / "Rueda del Sol" pair, and the new frame is
strictly cleaner). The finishing pass also fixed a gameplay bug (the
bust timer) and attempted one cover re-stage that LOST on evidence
(48 km/h vs 132 km/h) and was reverted — neither moves the visual
score. Scale 0–3 (0 placeholder · 1 basic styled · 2 premium
stylized · 3 showcase). Premium bar: every category ≥ 2,
average ≥ 2.3.

Genre equivalents: Hero = Ro on foot + the Solstice GT hero car;
Obstacles/enemies = PSPD cruisers/heli/roadblock + Venn's crew;
Rewards/interactables = Sun Shells, stashes, mission pickups,
stealable cars, weapons.

## Scores

| # | Category | Before | After | Evidence (after) |
|---|----------|--------|-------|------------------|
| 1 | Art direction | 2 | 2 | One committed sunset palette drives sky, fog, buildings, characters, HUD; six districts read as six places (map + city frames). Not 3: the palette is a single warm note everywhere; peds/traffic stay generic. |
| 2 | Hero/player | 2.5 | 2.5 | Ro: articulated humanoid (bun, pink jacket, two-handed rifle aim, drive/walk/run poses, face texture); Solstice GT: salmon, spoiler, gold rims, distinct silhouette, large in the cover. Not 3: the 3D face is a static texture patch; Ro is inside the car (invisible) in the chase frame. |
| 3 | Obstacles/enemies | 2 | 2 | PSPD cruisers read as police at distance (black/white + light bar + door decals); Venn crew distinct; roadblock + heli + wanted stars telegraph threat; radar blips converge. Not 3: the crew is one archetype, no varied family; the cover's pursuit still doesn't read at a glance (all police ahead — the one flank re-stage attempt lost on speed, see below). |
| 4 | Rewards/interactables | 2 | 2 | Sun Shells glow gold, stashes green, mission beacon pillar, stealable cars; popups (+$100/+$500, REP floats, shell counter) confirm every pickup. Not 3: shell/stash forms are simple glows; the judged set shows no reward moment (no MISSION PASSED frame). |
| 5 | World/environment | 3 | 3 | 6 districts, 9 avenues + 8 streets, lit windows/awnings/signs, palms, streetlights, Ferris wheel, water tower, marina, beach; foreground/midground/background in every frame; landmarks aid navigation. |
| 6 | Materials/textures | 2 | 2 | Canvas textures with shared roles: facades (lit windows, mullions, floor slabs), asphalt (grain + double centre line), paver sidewalks, sand, water, face patches; PSPD livery decals. Not 3: no wear/grunge layering; buildings read flat at distance. |
| 7 | Lighting/render | 2.5 | 2.5 | ACES tone mapping (exposure 1.05), sun key + violet hemi + sunset rim + ambient, shadows from the key, fog as warm haze (120–520 m) not a wall. Not 3: clouds are blobby, sun is a flat disc, no bloom/DOF post; the combat tracer is a fat white beam (slightly overcooked). |
| 8 | VFX/motion | 2.5 | 2.5 | Tracers muzzle-aligned (the v4 fault fixed — visible in combat), muzzle flash + point light, -34/-50 damage numbers, light-bar strobe, heli beam + ground spot, beacon pulse, drift/near-miss popups, REP floats. Not 3: no large-scale impact effects. |
| 9 | UI/HUD | 2.5 | 2.5 | Icon-first HUD (stars, radar, bars, weapon/ammo, speed, objective + portrait subtitle), full map (districts, 8 jobs, stats, save slot; all 16 POI labels legible after the Gate 1 label-flip fix), title (logo, menu, 5 crew portraits). Not 3: transitions are fades only. |
| 10 | Performance evidence | 2 | 2 | Per-shot renderer diagnostics (below, fresh this session), 30/30 play-test with 0 errors on the final code, 1280×720 target-viewport shots, budgets (game/ 925 KiB / 44 files, dossier 728 KB, text 163,636 / 163,840 B). Not 3: no real-hardware baseline (SwiftShader 0.3 fps is a harness artifact). |

**Average: 2.30** (23.0 / 10). Every category ≥ 2. **Premium bar met**
(≥ 2.3). Honest note: this ties the prior 2.30 and does NOT beat v4
(2.35) or rev1 (2.40) — the gap is Materials / Obstacles / Rewards /
Performance at 2, and the cover is still the weakest frame (MEDIUM:
police ahead, not flanking). The finishing pass spent its one cover
attempt on the flank re-stage and the evidence said no; the next
passes that would lift the score are wear + grunge on materials, a
varied enemy family, a reward moment in the judged set, and a
real-hardware performance baseline.

## Automatic failures: NONE standing

- No placeholder-dominated or empty active frame (all four judged
  frames are dense authored composition).
- Hero is not a primitive + glow (articulated Ro + layered
  Solstice GT).
- HUD is not stat/debug cards (icon-first + full map/title screens).
- Fog/bloom do not stand in for geometry (dense world underneath;
  fog near 120 m, far 520 m).
- No UI overlap of the play path, no clipped text (map labels
  deconflicted + edge-flipped; the Gate 1 re-check caught the one
  real overlap — the flipped "Rueda del Sol" label covering
  "Ro's Safehouse" — and the fix separated them; all 16 POI labels
  legible in the shipped map frame).
- Playable through real input (30/30 Puppeteer play-test drives
  keyboard + mouse); chase/combat/city are active-play frames.
- Renderer diagnostics reported below (after graphics changes).

## Renderer diagnostics (final code, per shot)

| Shot | Draw calls | Triangles | Source |
|------|-----------|-----------|--------|
| 1-chase (shipped) | 2,346 | 99,510 | Recovery re-shoot of the shipped frame |
| 1-chase (rejected flank attempt) | 2,118 | 104,546 | This session's re-shoot |
| 2-title | 8,053 | 276,388 | This session's re-shoot (matches recovery exactly) |
| 3-map | 3,300 | 104,488 | This session's re-shoot (matches recovery exactly) |
| 4-combat | 8,554 | 279,168 | This session's re-shoot (dynamic elements vary slightly) |
| 5-city (spare) | 3,309 | 120,380 | This session's re-shoot |

Full probe (18 Nov 2026): 2,537 calls / 97,916 tris / 6,053
geometries / 52 textures (title panorama). SwiftShader renders at
~0.3 fps with rendering on (~5 fps logic-only) — a harness artifact,
not a ship metric; the shipped game targets 60 fps on real hardware
(dt clamped to 0.05 s/frame).

## Measured image evidence (advisory signals, PIL)

Re-run this session on the FINAL placed frames with
scorecard-metrics.py (log: scorecard-metrics-final.log in the build
dir). The 5-city row is the fresh re-shoot (same staging).

| Shot | Color entropy | Dominant share | Luminance contrast | Edge density |
|------|--------------|----------------|-------------------|--------------|
| 1-chase | 6.29 bits | 0.125 | 68.5 | 0.144 |
| 2-title | 7.13 bits | 0.047 | 54.2 | 0.146 |
| 3-map | 4.76 bits | 0.141 | 39.8 | 0.073 |
| 4-combat | 5.91 bits | 0.168 | 57.6 | 0.139 |
| 5-city | 5.72 bits | 0.160 | 52.1 | 0.126 |

Thresholds (skill): entropy < 3.0, dominant > 0.6, edge < 0.04,
contrast < 60 are evidence against a score above 2. All five frames
pass entropy, dominant share, and edge density. Four frames sit below
the luminance-contrast advisory (54.2 / 39.8 / 57.6 / 52.1) —
explained, not excused: the deliberate sunset palette (warm gradient
sky + dark asphalt) has a narrow luminance range by design, and
readability comes from hue contrast (warm sky vs dark road vs salmon
car), not luminance; the map is a flat 2D screen by nature. The chase
frame passes outright (68.5). No frame shows fog/darkness compression
standing in for geometry (edge density 0.073–0.146 throughout). The
rejected flank attempt measured 6.12 / 0.163 / 71.1 / 0.146 —
marginally better on contrast, which the metrics cannot see past:
the speedo (48 vs 132 km/h) is what the chase read turns on, and no
pixel metric captures it.

## Finishing pass behind this scorecard

1. `newGame()` now resets the staging knobs to play defaults
   (`cam.distScale = 1`, `player.ramKeepsSpeed = false`,
   `police.roadblockDist = 60`) — staging sets them AFTER calling
   `newGame()`, so a fresh game never inherits a staged value
   (game.js).
2. Bust timer fix (police.js): `bustT` DECAYS at half rate when no
   cruiser is within 8 m instead of snapping to 0. diag17 proved the
   defect — the four cruisers orbit at ~18 m/s and all swing past
   8 m together for ~1 s of each ~2.6 s orbit, so the hard reset
   kept the timer under 2.5 s for 20+ game-s (peak 2.23) while the
   player stood still surrounded; the first final play-test run
   timed out on the busted step at 24/24. After the fix the bust
   fires at ~6 game-s (diag17 re-run) and the full play-test passes
   30/30 with 0 errors. Speeding away still sheds the timer
   instantly (outer branch unchanged).
3. ONE bounded chase re-stage attempt (staging.js, reverted): the
   flankers moved from 15–16 m ahead to 5 m ahead at the asphalt
   edge (±5), so they would sit level with the hero's doors at the
   t=0.4–0.6 capture. The re-shoot put ONE PSPD cruiser legibly at
   the left flank — but the speedo bled to 48 km/h (vs 132 in the
   shipped frame), the right flanker never appeared (converged into
   the hero's path, occluded ahead), and the frame read as boxed-in
   at low speed instead of fleeing. NOT a clear win, so the shipped
   1-chase.jpg (md5 6c93c820…) stands and the staging was reverted
   to the recovery slots. The rejected frame is preserved at
   build/shots-raw/1-chase-REJECTED-flank-attempt.jpg.
4. Determinism re-verified after the edits: main.ts twice →
   byte-identical output, ~0.8 s/run (limit 10 s).
5. Gate 1 re-check fix (menus.js): after the bottom-edge label
   flip, re-check overlap and nudge UP (never down — down would
   re-cross the bottom edge). The finding was REAL, not latent:
   the shipped map's flipped "Rueda del Sol" label was covering
   "Ro's Safehouse" ("Ro's Safehou" in the old frame). The fix
   separated them; the map was re-shot (diag18, 0 errors) and the
   placed 3-map.jpg replaced with the cleaner render (92,062 B,
   md5 163af724…). The re-check's second finding (beam quaternion)
   was a reviewer error, rebutted: the cone's WIDE end (base, local
   -Y) correctly faces the ground target and its apex sits at the
   heli — flipping it would break the searchlight. PIL metrics on
   the new map are unchanged (4.76 / 0.141 / 39.8 / 0.073).

Play-test on the final code: 30/30, 0 errors (19 Nov 2026, log in the
build dir). Gate 1 review: PASS (nvidia/nemotron-3-ultra-550b-a55b:free,
cost $0) + re-check of the re-implemented and new hunks recorded in
gate-run.md.
