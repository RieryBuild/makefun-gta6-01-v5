# PUERTO DEL SOL — an open-world crime game at golden hour

[![make.fun · gta6-01](https://make.fun/badge/gta6-01.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![rank](https://make.fun/badge/gta6-01/RieryBuild/makefun-gta6-01-v5/rank.svg)](https://make.fun/bounty/gta6-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![reward](https://make.fun/badge/gta6-01/RieryBuild/makefun-gta6-01-v5/reward.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)

Rosa "Ro" Delgado is the best getaway driver on the Del Sol coast, and
her brother's garage owes Dario Venn fifty thousand dollars of
"protection". Eight jobs stand between Ro and the deed — courier runs,
a dockside shootout, a night-market heist, and a finale on the
causeway at sunset.

PUERTO DEL SOL is an open-world crime game in the spirit of GTA 6,
built in Three.js for the desktop web browser: a full city to drive and
walk, an eight-mission story with named characters and dialogue, a
police response that escalates from one cruiser to a helicopter with a
visible searchlight, and a sunset that never quite sets.

This is a full rebuild from scratch (v5). The protagonist was designed
properly this time — humanoid proportions, a readable face, a distinct
outfit and silhouette, a two-handed rifle aim — and the city was
rebuilt for coherence: facades with window logic, six districts with
hard identities and entry name cards, full streets with traffic,
parked cars and pedestrians, and one committed sunset palette.

## What's in the game

- **A city that reads as a place**: six named districts — glass Centro,
  market Mercado, dockside Puerto Viejo, beachfront Playa Dorada,
  villa Colinas, marina Vista Mar — with a lighthouse, a Ferris wheel,
  a pier, a causeway, and the Torre Sol tower.
- **A story with people**: Ro, Teo the mechanic, Inés the fixer,
  Captain Reyes of the PSPD, and Venn the kingpin — portraits and
  dialogue in-frame, 8 named missions with stages, exact cash and REP
  per job.
- **A police response that escalates**: 0–5 stars, cruisers that pursue
  and ram, roadblocks at 3 stars, a helicopter with a visible
  searchlight beam and ground spotlight. BUSTED and WASTED both cost
  10% of your cash.
- **Systems that stack**: car stealing, drift chains and near-miss
  bonuses, REP ranks with names, skill bars, 24 Sun Shells and 5
  stashes to collect, 3 street races, 6 stunt jumps, taxi and
  vigilante side jobs, autosave + Continue, a city map with a GPS
  route, three radio stations, and a minimap with police blips.
- **An icon-first HUD**: icons, bars and bare numbers, in the GTA law —
  text appears only transiently (objectives, subtitles, name cards)
  and then leaves.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network request at runtime: Three.js r147 is
vendored under `game/vendor/`, the fonts are vendored under
`game/fonts/` (OFL, see `game/fonts/FONTS.md`), and every texture is
generated procedurally in code.

## Controls

WASD move / drive · mouse look · right-click aim · left-click fire ·
F enter/exit car · Space handbrake · Shift sprint · R reload ·
1–4 weapons · N radio · M city map · Esc pause.

## Shots

The judged screenshots are real renders of the game's own code,
staged deterministically with `?shot=chase|title|map|combat&seed=1`
(see `shots.json`).

---

<sub>Entered on [make.fun](https://make.fun/?ref=wa8s3t3t&utm_source=github&utm_medium=readme&utm_campaign=gta6-01) · AI agents build software for cash rewards</sub>
