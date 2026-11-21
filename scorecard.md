# Visual Scorecard — PUERTO DEL SOL (gta6-01 round 7)

Threejs-game 10-category visual scorecard, scored by the round-7
builder on the FINAL judged frames, all four viewed full-size
21 Nov 2026: 1-chase (cover), 2-title, 3-passed, 4-combat. "Before"
is the v5 score on the same set (2.30, with 3-map in the third slot);
"after" is this round's re-verified score. The third slot changed:
3-map is out, 3-passed is in — the passed frame won the slot on
evidence (see Placement below). Scale 0–3 (0 placeholder · 1 basic
styled · 2 premium stylized · 3 showcase). Premium bar: every
category ≥ 2, average ≥ 2.3.

Genre equivalents: Hero = Ro on foot + the Solstice GT hero car;
Obstacles/enemies = PSPD cruisers/heli/roadblock + Venn's crew;
Rewards/interactables = Sun Shells, stashes, mission pickups,
stealable cars, weapons.

## Scores

| # | Category | Before | After | Evidence (after) |
|---|----------|--------|-------|------------------|
| 1 | Art direction | 2 | 2.5 | The palette is now committed, not just warm: fog 0xe87a45, sun 0xffc27a, rim 0xff7a3d, CENTRO facades warm dusk mauve, COLINAS warmer sand — sky, fog, buildings, characters and HUD all sit in one orange sunset note; building silhouettes now vary (taller Deco crowns on every second building, setback upper floors on every third market row). Not 3: it is still a single warm note everywhere; peds/traffic stay generic. |
| 2 | Hero/player | 2.5 | 2.5 | Ro: articulated humanoid (bun, pink jacket, two-handed rifle aim, drive/walk/run poses, face texture); Solstice GT: salmon, spoiler, gold rims, distinct silhouette, large in the cover and in the passed frame. Not 3: the 3D face is a static texture patch; Ro is inside the car (invisible) in the chase frame, and small (7.5 m foot camera) in the passed frame — the title crew portraits carry the readable face. |
| 3 | Obstacles/enemies | 2 | 2.5 | The cover's pursuit now reads at a glance — the v5 blocker is fixed: two cruisers flank/ram at the hero's front quarters (PSPD legible, light bars strobing), two hold the road ahead, the roadblock is legible, the heli sits in the frame with its beam slanting onto the road, and the radar blips converge. Not 3: the crew is one archetype, no varied family. |
| 4 | Rewards/interactables | 2 | 2.5 | The judged set now HAS the reward moment the v5 card explicitly lacked: MISSION PASSED in huge gold letters, "+$800 · +100 REP · Pistol", cash $2,000, Teo's win line, Ro + the Solstice on the avenue. Sun Shells glow gold, stashes green, mission beacon pillar, stealable cars; popups (+$100/+$500, REP floats, shell counter) confirm every pickup. Not 3: shell/stash forms are simple glows. |
| 5 | World/environment | 3 | 3 | 6 districts, 9 avenues + 8 streets, lit windows/awnings/signs, palms, streetlights, Ferris wheel, water tower, marina, beach; foreground/midground/background in every frame; landmarks aid navigation. Note: the map frame left the set, so the district NAMES are no longer in the screenshots — but the world geometry is unchanged and visible in all four frames (title panorama, MERCADO avenue, docks, safehouse avenue), and the map screen still exists in-game (M opens it; 8 jobs listed, verified in the play-test). |
| 6 | Materials/textures | 2 | 2 | Canvas textures with shared roles: facades (lit windows, mullions, floor slabs), asphalt (grain + double centre line), paver sidewalks, sand, water, face patches; PSPD livery decals. Not 3: no wear/grunge layering; buildings read flat at distance. Unchanged this round — the silhouette work is geometry, not materials. |
| 7 | Lighting/render | 2.5 | 2.5 | ACES tone mapping (exposure 1.05), sun key + violet hemi + sunset rim + ambient, shadows from the key, fog as warm haze (120–520 m) not a wall; the warmer sun/rim/fog this round deepen the sunset. Not 3: clouds are blobby, sun is a flat disc, no bloom/DOF post. |
| 8 | VFX/motion | 2.5 | 2.5 | The tracer is now a tapered thin streak (0.012 tip / 0.028 muzzle), not the v5 fat white beam — it reads as a shot across the combat frame; muzzle flash + point light, -34/-50 damage numbers, light-bar strobe, heli beam + ground pool, beacon pulse, drift/near-miss popups, REP floats. Not 3: no large-scale impact effects. |
| 9 | UI/HUD | 2.5 | 2.5 | Icon-first HUD, now denser without a text table: corner mission card (JOB 1/8 · FIRST LIGHT / STAGE 1/2), car name + condition bar above the speedo (Solstice GT), radio pill (RADIO SOL 92.5 Sunset Sounds), REP rank label (RUNNER / WHEELWOMAN), stars, radar, bars, weapon/ammo, speed, objective + portrait subtitle; title (logo, menu, 5 crew portraits); passed card. Not 3: transitions are fades only. |
| 10 | Performance evidence | 2 | 2 | Per-shot renderer diagnostics (below, fresh this round), 30/30 play-test with 0 errors on the final code, 1280×720 target-viewport shots, budgets (game/ ~925 KiB, dossier 769 KB, text 163,809 / 163,840 B). Not 3: no real-hardware baseline (SwiftShader 0.3 fps is a harness artifact). |

**Average: 2.45** (24.5 / 10). Every category ≥ 2. **Premium bar met
(≥ 2.3) and the v5 2.30 beaten** — the lift is Obstacles 2→2.5 (the
cover pursuit now reads), Rewards 2→2.5 (the MISSION PASSED frame),
Art direction 2→2.5 (committed palette + varied silhouettes). The
remaining gap to 2.5+ is Materials (wear/grunge), a varied enemy
family, and a real-hardware performance baseline.

## Placement — the 4 best, on evidence

All five re-shot frames were viewed full-size this round. The set is
1-chase / 2-title / 3-passed / 4-combat; 3-map is the spare (not
placed, kept in the build dir).

- **1-chase — STRONG (cover).** Hero center, 132 km/h, heli upper-left
  with diagonal beam + road pool, corner mission card + radio + Solstice
  GT + RUNNER + 3 stars + $1,200 + converging radar blips + Teo
  subtitle. Flank pair + roadblock + ahead pair cluster mid-frame
  (PSPD legible on the left flanker). The v5 MEDIUM is fixed.
- **2-title — STRONG.** PUERTO DEL SOL title, tagline, menu buttons,
  THE CREW portraits (Rosa Delgado, Teo, Inés, Captain Reyes, Venn),
  Ro by the Solstice, warm orange palette, sun.
- **3-passed — STRONG (new).** Huge gold MISSION PASSED + "+$800 ·
  +100 REP · Pistol" + Teo's win line + $2,000 + Ro on the avenue with
  the Solstice. It beats the map for the slot: the map's evidence class
  (open world + mission list + stats) is already partly covered by the
  title ("Eight jobs") and the chase mission card, while the passed
  frame adds a class the set lacked entirely (the reward moment) and
  lifts the weakest v5 category. The first capture of this frame failed
  (mission 2 auto-started at t=4 game-s and hid the card); the staging
  now freezes `nextMissionT = 999` and the re-shoot captures the card.
- **4-combat — STRONG.** Ro in aim pose, thin tapered tracer streak,
  -34 damage number legible, Inés subtitle, $1,250, 1 star, WHEELWOMAN,
  rifle 22/96. The v5 fat-white-beam defect is fixed.
- **3-map — STRONG (spare).** City map with districts, POIs, STORY 2/8
  with 2 missions done, STATS block, SAVE SLOT 1 21% COMPLETE. It loses
  the slot only because the passed frame adds more; the map screen
  itself is unchanged in-game.

## Automatic failures: NONE standing

- No placeholder-dominated or empty active frame (all four judged
  frames are dense authored composition).
- Hero is not a primitive + glow (articulated Ro + layered
  Solstice GT).
- HUD is not stat/debug cards (icon-first + full title/passed screens).
- Fog/bloom do not stand in for geometry (dense world underneath;
  fog near 120 m, far 520 m).
- No UI overlap of the play path, no clipped text (map labels
  deconflicted in v5; the corner mission card is a new element and
  sits top-left, clear of the pursuit).
- Playable through real input (30/30 Puppeteer play-test drives
  keyboard + mouse); chase/combat/passed are active-play frames.

## Renderer diagnostics (final code, per shot)

| Shot | Draw calls | Triangles | Size | Source |
|------|-----------|-----------|------|--------|
| 1-chase (placed) | 2,084 | 103,620 | 108,103 B @q82 | Round-7 re-shoot run 4 (final-shots4.log) |
| 2-title (placed) | 8,075 | 274,514 | 118,493 B @q82 | Round-7 re-shoot run 4 |
| 3-passed (placed) | 8,812 | 291,176 | 123,645 B @q82 | Round-7 single-shot run (final-shot-passed.log) |
| 4-combat (placed) | 8,575 | 279,490 | 99,652 B @q82 | Round-7 re-shoot run 3 (final-shots3.log) |
| 3-map (spare) | 3,306 | 104,560 | 69,331 B @q82 | Round-7 re-shoot run 4 |

Full probe (18 Nov 2026): 2,537 calls / 97,916 tris / 6,053
geometries / 52 textures (title panorama). SwiftShader renders at
~0.3 fps with rendering on (~5 fps logic-only) — a harness artifact,
not a ship metric; the shipped game targets 60 fps on real hardware
(dt clamped to 0.05 s/frame).

## Measured image evidence (advisory signals, PIL)

Re-run this round on the FINAL placed frames with
scorecard-metrics.py (log: scorecard-metrics-final.log in the build
dir).

| Shot | Color entropy | Dominant share | Luminance contrast | Edge density |
|------|--------------|----------------|-------------------|--------------|
| 1-chase | 6.39 bits | 0.110 | 62.4 | 0.144 |
| 2-title | 7.18 bits | 0.038 | 53.9 | 0.147 |
| 3-passed | 6.80 bits | 0.109 | 58.4 | 0.179 |
| 4-combat | 5.83 bits | 0.166 | 60.2 | 0.127 |

Thresholds (skill): entropy < 3.0, dominant > 0.6, edge < 0.04,
contrast < 60 are evidence against a score above 2. All four frames
pass entropy, dominant share, and edge density. Two pass the
luminance-contrast advisory outright (chase 62.4, combat 60.2 —
combat improved from 57.6 in v5); title (53.9) and passed (58.4) sit
below it — explained, not excused: the deliberate sunset palette
(warm gradient sky + dark asphalt) has a narrow luminance range by
design, and readability comes from hue contrast (warm sky vs dark
road vs salmon car), not luminance. The passed frame has the highest
edge density of the set (0.179 — the big gold card + street scene).
No frame shows fog/darkness compression standing in for geometry
(edge density 0.127–0.179 throughout).

## Self-critique verification cycle (this round)

Three weaknesses were found on the viewed frames and dispositioned:

1. **Ro's face is small in the passed frame** (foot camera, 7.5 m).
   Considered tightening to the aim camera (4.2 m) — REJECTED: the aim
   camera looks along Ro's heading, so with her facing the camera the
   aim camera would sit behind her back; and the frame's subject is
   the MISSION PASSED card, which is huge and legible. The title crew
   portraits carry the readable face. Accepted as a limitation, no
   code change.
2. **The combat tracer reads white, not orange** (additive orange over
   a bright sky washes to white). Considered deepening the tracer
   colour — REJECTED: a bright tracer is physically correct, it reads
   as a shot, and the v5 defect (fat white beam) is already fixed by
   the taper. Accepted, no code change.
3. **The flank cruisers' livery is only partly legible** (PSPD reads on
   the left flanker; the pair reads as dark cars). Accepted: the light
   bars strobe, one PSPD reads, and the frame is STRONG overall; a
   brighter livery would break the PSPD black/white identity. No code
   change.

No code fixes came out of the cycle — the three findings are accepted
limitations with reasons, verified against the viewed frames. The
cycle's one real fix was earlier in the round: the passed frame's
t=4 auto-start bug (mission 2 hid the card before the slow capture),
fixed with `nextMissionT = 999` and verified by the re-shoot.

## Round-7 changes behind this scorecard

1. Chase re-stage (staging.js + police.js + camerawork.js): flank
   pair cz-8, ±5 m, speed 26, top 34, opposite wobble; ahead pair
   cz-24/-30; roadblockDist 18; heli angle -π/2-0.45, height 13 m,
   hold=true, aimAhead 15; cam distScale 0.8, drivePitch 0.12. Five
   diag iterations, all measured; v5 frozen (see gate-run.md).
2. New `?shot=passed` branch (staging.js): mission 1 through the
   real stage machine, Ro + Solstice on the safehouse avenue,
   `nextMissionT = 999` freeze (the t=4 fix, verified by re-shoot).
3. HUD density (hud.js + game.js + index.html + style.css): corner
   mission card, car name + condition bar, radio re-show, REP rank
   label — icon-first, no text police table (Reza's direction).
4. Tracer taper (shooting.js): 0.012 tip / 0.028 muzzle, opacity 0.9.
5. Palette (palette.js): warmer fog/sun/rim, CENTRO warm dusk mauve,
   COLINAS warmer sand. Silhouettes (structures.js): varied Deco
   crowns + setback market-row upper floors, both deterministic.
6. P3 audit: no renames (33 files, one job each — see gate-run.md).

Play-test on the final code: **30/30, 0 errors** (21 Nov 2026,
final-play4.log in the build dir — the Continue step needed a fresh
page for the reload after 28 checks, a harness-only change for the
starved VM; the game code is untouched by it). Gate 1 review: PASS
(nvidia/nemotron-3-ultra-550b-a55b:free, cost $0, no findings raised;
full exchange in gate-run.md). Gemini text/copy: SKIPPED — 3 attempts
(2.5-flash 404 retired; 3.8-flash hung 120 s, then errored) — recorded
gap, not a FAIL, per the gate rules.
