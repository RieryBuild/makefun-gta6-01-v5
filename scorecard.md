# Visual Scorecard — PUERTO DEL SOL (gta6-01 round 8)

Threejs-game 10-category visual scorecard, scored by the round-8
builder on the FINAL judged frames, all four viewed full-size
21 Nov 2026: 1-chase (cover), 2-title, 3-map, 4-combat. "Before"
is the r7 score on its set (2.45, with 3-passed in the third slot);
"after" is this round's re-verified score. The third slot changed:
3-passed is out, 3-map is in — the map frame is REQUIRED in the
judged set (round-8 scope + gate: title + map must both be in the
set), and the passed frame is the spare. Scale 0–3 (0 placeholder ·
1 basic styled · 2 premium stylized · 3 showcase). Premium bar:
every category ≥ 2, average ≥ 2.3.

Genre equivalents: Hero = Ro on foot + the Solstice GT hero car;
Obstacles/enemies = PSPD cruisers/heli/roadblock + Venn's crew;
Rewards/interactables = Sun Shells, stashes, mission pickups,
stealable cars, weapons.

## Scores

| # | Category | Before | After | Evidence (after) |
|---|----------|--------|-------|------------------|
| 1 | Art direction | 2.5 | 2.5 | Unchanged this round: the palette is committed, not just warm: fog 0xe87a45, sun 0xffc27a, rim 0xff7a3d, CENTRO facades warm dusk mauve, COLINAS warmer sand — sky, fog, buildings, characters and HUD all sit in one orange sunset note; varied building silhouettes (taller Deco crowns, setback upper floors). Not 3: still a single warm note everywhere; peds/traffic stay generic. |
| 2 | Hero/player | 2.5 | 2.5 | Unchanged: Ro, articulated humanoid (bun, pink jacket, two-handed rifle aim, drive/walk/run poses, face texture); Solstice GT, salmon, spoiler, gold rims, distinct silhouette, large in the cover. Not 3: the 3D face is a static texture patch; Ro is inside the car (invisible) in the chase frame — the title crew portraits carry the readable face. |
| 3 | Obstacles/enemies | 2.5 | 2.5 | The r7 claim is now TRUE in the judged frame: the escort hold keeps two PSPD cruisers visibly flanking the hero at the front quarters (±5 m lateral / 8 m ahead, PSPD legible on both, light bars strobing) — diag v3 frozen, final frame confirms; two more hold the road ahead, the heli sits in the frame with its beam slanting onto the road and the ground pool ahead of the hero, and the radar blips converge with leader lines. Not 3: the crew is one archetype, no varied family. |
| 4 | Rewards/interactables | 2.5 | 2.5 | Evidence class changed (the passed card left the set — stated plainly): the reward ECONOMY is now in-frame instead of one big moment. The map carries it whole — STORY 2/8, 8 jobs with payouts $800–$15,000, STATS (Sun Shells 5/24, Stashes 1/5, Cars stolen 12), SAVE SLOT 1 21% COMPLETE — and the chase carries the live moment: NEAR MISS +$250 popup, $12,450 cash, weapon slots (2 unlocked, 2 padlocked), ammo 12/48. Not 3: no big in-frame reward moment now; the passed card is the spare. |
| 5 | World/environment | 3 | 3 | 6 districts, 9 avenues + 8 streets, lit windows/awnings/signs, palms, streetlights, Ferris wheel, water tower, marina, beach; foreground/midground/background in every frame; landmarks aid navigation. The map's return FIXES the r7 note: district NAMES + 16 POIs are back in the screenshots (PUERTO VIEJO, COLINAS, CENTRO, MERCADO, VISTA MAR, PLAYA DORADA). |
| 6 | Materials/textures | 2 | 2 | Canvas textures with shared roles: facades (lit windows, mullions, floor slabs), asphalt (grain + double centre line), paver sidewalks, sand, water, face patches; PSPD livery decals. Not 3: no wear/grunge layering; buildings read flat at distance. Unchanged this round. |
| 7 | Lighting/render | 2.5 | 2.5 | ACES tone mapping (exposure 1.05), sun key + violet hemi + sunset rim + ambient, shadows from the key, fog as warm haze (120–520 m) not a wall; the warmer sun/rim/fog deepen the sunset. Not 3: clouds are blobby, sun is a flat disc, no bloom/DOF post. Unchanged this round. |
| 8 | VFX/motion | 2.5 | 2.5 | The tracer is still a tapered thin streak (verified in the FINAL combat frame, not the r7 frame — thin vertical streak, -50 damage numbers, no fat white beam); muzzle flash + point light, light-bar strobe, heli beam + ground pool, beacon pulse, drift/near-miss popups, REP floats. Not 3: no large-scale impact effects. |
| 9 | UI/HUD | 2.5 | 2.5 | The density push landed, icon-first, no text police table (Reza's direction): weapon slots (4, gold-bordered current, padlocked locked), money 42 px / stars 32 px, REP number on the rank label (RUNNER · 500 REP), location pill + day/time (MERCADO · DAY 1 · 18:24), radar with bigger blips + leader lines toward the player + bigger objective diamond, NEAR MISS +$250 popup re-shown; mission card, radio pill, vehicle name + condition bar kept. Not 3: transitions are fades only. Note: the race timer is a REAL mechanic (mission 6, "2:29" verified in the probe) but hidden in the chase frame — mission 1 has no race; the cover carries the DAY/TIME clock + popup instead. |
| 10 | Performance evidence | 2 | 2 | Per-shot renderer diagnostics (below, fresh this round), 34/34 play-test with 0 errors on the final code, 1280×720 target-viewport shots, budgets (game/ ~925 KiB, dossier text 163,808 / 163,840 B). Not 3: no real-hardware baseline (SwiftShader 0.3 fps is a harness artifact). |

**Average: 2.45** (24.5 / 10). Every category ≥ 2. **Premium bar met
(≥ 2.3) and the r7 2.45 held** — the map's return costs the passed
card's reward moment, but the HUD density push, the escort fix (the
r7 pursuit claim now true in-frame), and the map's full economy
evidence hold the average. The remaining gap to 2.5+ is Materials
(wear/grunge), a varied enemy family, and a real-hardware
performance baseline.

## Placement — the 4 best, on evidence

All four final frames were viewed full-size this round. The set is
1-chase / 2-title / 3-map / 4-combat; 3-passed is the spare (not
placed, kept in the build dir as shots-raw/5-passed.jpg).

- **1-chase — STRONG (cover).** Hero center, 132 km/h, escort PSPD
  flankers at the front quarters (PSPD legible on both), heli
  upper-left with diagonal beam + road pool ahead of the hero, corner
  mission card + radio + Solstice GT + RUNNER · 500 REP + 3 stars +
  $12,450 + NEAR MISS +$250 popup + weapon slots + MERCADO · DAY 1 ·
  18:24 + radar with converging blips + Teo subtitle. The r7 MEDIUM
  (flank pair collapsing behind the hero, invisible) is fixed — diag
  v3 frozen, final frame confirms.
- **2-title — STRONG.** PUERTO DEL SOL title, tagline, menu buttons,
  THE CREW portraits (Rosa Delgado, Teo, Inés, Captain Reyes, Venn),
  Ro by the Solstice, warm orange palette, sun.
- **3-map — STRONG (restored, required slot).** City map with 6
  districts named, 16 POIs, STORY 2/8 with 8 jobs + payouts, STATS
  block, SAVE SLOT 1 21% COMPLETE, RESUME/SAVE/CLOSE. It wins the
  slot on scope: the judged set MUST include the map screen; its
  evidence class (open world + mission economy + progression) is now
  fully in-set.
- **4-combat — STRONG.** Ro in aim pose, thin tapered tracer streak,
  -50 damage numbers legible, crosshair, Inés subtitle, $1,250,
  1 star, WHEELWOMAN · 800 REP, rifle 22/96, weapon slots. The r7
  tracer fix verified in the FINAL frame.
- **3-passed — STRONG (spare).** Huge gold MISSION PASSED + "+$800 ·
  +100 REP · Pistol" + Teo's win line + $2,000 + Ro on the avenue
  with the Solstice. It loses the slot only because the map is
  required; the passed moment still exists in-game (mission 1
  completion, verified in the play-test: m1 pays $800 +100 REP).

## Automatic failures: NONE standing

- No placeholder-dominated or empty active frame (all four judged
  frames are dense authored composition).
- Hero is not a primitive + glow (articulated Ro + layered
  Solstice GT).
- HUD is not stat/debug cards (icon-first + full title/map screens).
- Fog/bloom do not stand in for geometry (dense world underneath;
  fog near 120 m, far 520 m).
- No UI overlap of the play path, no clipped text (map labels
  deconflicted in v5; the corner mission card sits top-left, clear
  of the pursuit; the location pill sits bottom-left above the
  radar, clear of the road).
- Playable through real input (34/34 Puppeteer play-test drives
  keyboard + mouse); chase/combat/map are active-play frames.

## Renderer diagnostics (final code, per shot)

| Shot | Draw calls | Triangles | Size | Source |
|------|-----------|-----------|------|--------|
| 1-chase (placed) | 2,201 | 101,294 | 116,743 B @q82 | Round-8 play-test (final-play-r8.log) |
| 2-title (placed) | 8,075 | 274,514 | 118,493 B @q82 | Round-8 play-test |
| 3-map (placed) | 3,306 | 104,560 | 92,133 B @q82 | Round-8 play-test |
| 4-combat (placed) | 8,587 | 279,820 | 103,987 B @q82 | Round-8 play-test |
| 3-passed (spare) | — | — | 123,645 B @q82 | Round-7 single-shot run (not re-shot this round) |

Full probe (18 Nov 2026): 2,537 calls / 97,916 tris / 6,053
geometries / 52 textures (title panorama). SwiftShader renders at
~0.3 fps with rendering on (~5 fps logic-only) — a harness artifact,
not a ship metric; the shipped game targets 60 fps on real hardware
(dt clamped to 0.05 s/frame).

## Measured image evidence (advisory signals, PIL)

Re-run this round on the FINAL placed frames with
scorecard-metrics.py (build dir, 3-passed → 3-map slot fix).

| Shot | Color entropy | Dominant share | Luminance contrast | Edge density |
|------|--------------|----------------|-------------------|--------------|
| 1-chase | 6.37 bits | 0.107 | 67.8 | 0.153 |
| 2-title | 7.18 bits | 0.038 | 53.9 | 0.147 |
| 3-map | 4.86 bits | 0.128 | 39.6 | 0.072 |
| 4-combat | 5.89 bits | 0.167 | 60.4 | 0.131 |

Thresholds (skill): entropy < 3.0, dominant > 0.6, edge < 0.04,
contrast < 60 are evidence against a score above 2. All four frames
pass entropy, dominant share, and edge density. Two pass the
luminance-contrast advisory outright (chase 67.8, combat 60.4).
Title (53.9) sits below it — explained, not excused: the deliberate
sunset palette (warm gradient sky + dark asphalt) has a narrow
luminance range by design, and readability comes from hue contrast
(warm sky vs dark road vs salmon car), not luminance. The map (39.6,
edge 0.072) is the set's lowest — explained: it is a flat UI screen
by design (dark panels + flat district blocks over a dimmed world),
not a 3D scene; the advisory thresholds are for 3D frames. No frame
shows fog/darkness compression standing in for geometry (edge
density 0.072–0.153 throughout; the map's low edge density is the
flat UI, not missing geometry).

## Self-critique verification cycle (this round)

Four weaknesses were found on the viewed frames and dispositioned:

1. **The flank cruisers read dark against the asphalt** (PSPD only
   partly legible at a glance). Accepted: the light bars strobe,
   PSPD reads on both flankers in the final frame, and their
   positions flank the hero — a brighter livery would break the
   PSPD black/white identity. No code change.
2. **The combat enemy is largely hidden behind Ro** (the target sits
   at the crosshair behind her; the -50 floats above her head).
   Considered re-staging the combat shot — REJECTED: the aim pose +
   crosshair + tracer + damage number already read the hit, and the
   shot is the verified r7 staging; re-staging risks the tracer
   frame for no score gain. Accepted as a limitation, no code
   change.
3. **The race timer does not appear in the judged set** (the chase is
   mission 1; the timer is mission 6 only). Flagged as the
   follow-up option for the coordinator (beachfront race re-stage),
   NOT fixed here: staging a race timer into a frame that is not
   running a race would be dishonest staging. The cover carries the
   DAY/TIME clock + NEAR MISS popup instead.
4. **The map frame's metrics are the set's lowest** (entropy 4.86,
   contrast 39.6, edge 0.072). Explained as UI-screen design (see
   above), no code change.

No code fixes came out of the cycle — the four findings are accepted
limitations / a follow-up flag with reasons, verified against the
viewed frames. The cycle's real fixes were earlier in the round: the
parked-car slide (staging.js) and the escort hold (police.js), both
verified by diag v3 + the final frame.

## Round-8 changes behind this scorecard

1. Map frame restored (shots.json 3-passed → 3-map;
   screenshots/3-passed.jpg deleted from the entry dir and from the
   repo at push; re-shot in-session in the final play-test).
2. Chase re-stage (staging.js + police.js): escort hold
   (staging-only formation, slots ±5 m lateral / 8 m ahead, speed
   match +2), parked-car slide, heli aimAhead 15 → 8 m. Three diag
   iterations, v3 frozen (see gate-run.md).
3. HUD density (hud.js + game.js + index.html + style.css): weapon
   slots, bigger money/stars, REP number, location pill + day/time,
   radar leader lines + bigger blips + objective diamond, NEAR MISS
   popup re-show, race timer element (mission 6) — icon-first, no
   text police table (Reza's direction).
4. Timer probe: mission 6 race stage via the real story machine —
   raceT 149.2, timer "2:29" visible, 0 errors (probe-timer.cjs).
5. Dossier: text 163,808 B (cap 163,840 — 32 B headroom); cut still
   inside facekit.js (standing r7 state).
6. P3 audit: no renames; shots.json slot renamed 3-passed → 3-map,
   screenshots/3-passed.jpg deleted (see gate-run.md).

Play-test on the final code: **34/34, 0 errors** (21 Nov 2026,
final-play-r8.log in the build dir; the harness grew from r7's 30
checks — m3 bounty breakdown, Sun Shell pickup, waterline clamp,
parked-car steal). Gate 1 review: NOT OBTAINED — OpenRouter :free
daily quota exhausted (429 on nvidia/nemotron-3-ultra-550b-a55b:free
and google/gemma-4-26b-a4b-it:free; reset 2026-11-22 00:00 UTC) and
Gemini gemini-3.8-flash 503 on retry (first attempt read-timed-out).
Recorded gap in gate-run.md; the coordinator re-runs the OpenRouter
review after the reset, before sealing. Gemini text/copy: SKIPPED
(503) — recorded gap, not a FAIL, per the gate rules.
