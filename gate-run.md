# Pre-submit gate run — gta6-01 v5 "PUERTO DEL SOL" (FULL REBUILD FROM SCRATCH)

- Builder sessions: 0d23fb79-ad9b-4b6d-848b-a0e47b354a06 (first build) +
  757fdd6a-9811-46fa-b27a-344305faf400 (continuation) +
  4399d800-5d61-45b1-b4d3-78aa0105d918 (recovery) +
  11368173-ddd2-4ce9-a39f-79d419844a75 (finishing, this session)
- Recordings: 01a1eeef SEALED + 01a1ef13 SEALED + 01a1efa5 SEALED +
  01a1efdb LIVE (see MQ8 for the full session check)
- Repo: RieryBuild/makefun-gta6-01-v5 (created at gate time via the
  GitHub PAT route; HEAD recorded below)
- Standing entry: v2 01a1ec70-8774-716f-a8c0-e88aca15b847 (#495/5,299
  ranked, rate 987355 at gate time — outside the prizelist)
- Entries close: 2026-11-24T15:00:00Z (24 Nov 23:00 WITA). Result due 10 Dec.
- Gate run: 19 Nov 2026 ~02:40 WITA (18:40 UTC), requirements + quota
  re-read fresh at gate time.
- Verdict: **MQ1–MQ8 PASS. Gates 0–2 PASS. Gate 3 PENDING (audit stop).**
- **AUDIT STOP: this gate run covers MQ1–MQ8 + Gates 0–2 only. Gate 3's audit checkbox stays PENDING — no seal, no submit.**

## MQ5: Is this entry a deliberate new submission, not a duplicate? — PASS (recorded BEFORE any build writes, per Reza's sequencing rule)

### Brief summary (live requirements API + kit competition.yaml + RULES.txt, read 18 Nov ~22:00 WITA)

- **Task:** the most complete, highest-quality open-world crime game in the spirit of GTA 6; offline in a desktop browser from static files under game/ (game/index.html); keyboard + mouse; NO network request; three.js or any library vendored under game/. Everything original — city, characters, vehicles, names, story, art, sound, music; NO Rockstar name/logo/character/map/asset.
- **Completeness counts most** (criterion 1): a city on foot and by car, traffic and pedestrians, cars to steal, a wanted level and police, missions and a story, combat, a HUD with a minimap, a start and a save, and polish.
- **Scoring — pairwise AI judge, win rate (Bradley-Terry, millionths).** Judge = z-ai/glm-5.3-flash on OpenRouter, reasoning effort high. Each game = 2 calls (both orders); each call scores the picked entry 0.5 + margin/10 (margin 1–5). Final: 3 Swiss rounds over every final entry + 4 house anchors, then a playoff over exactly the top 100 (each pair once). **Playoff entries place above EVERY non-playoff entry whatever the rates.** Final judges every entry afresh — **dev rating counts for NOTHING in the final.** Tie: head-to-head playoff games, then earlier receipt.
- **What the judge sees (1,536 input tokens/entry):** ONE JPEG contact sheet of every screenshot — the COVER (first screenshot by name) LARGE on top, the others small beneath — plus a SHORT source outline (file paths, sizes, first declarations). "The judge sees your game mostly through its screenshots." **The cover matters most.** Source files must be split with one clear job each, named for what they do (criterion 5 reads the names).
- **Judge rubric (5 criteria, most important first; the FIRST criterion on which two entries differ decides, unless a later one differs by much more):** (1) complete open world SHOWN IN SCREENSHOTS of the game itself — city on foot and by car, traffic and pedestrians, wanted level with police who respond, missions (a non-playable entry loses to a playable one); (2) depth and fun — missions and a story, vehicles to steal and drive, activities and combat, progression that rewards play; (3) feel and polish — controls and a camera that answer well as the screens show them, a HUD with a minimap, effects and menus; (4) look and originality — a coherent sun-soaked modern city of its own, lighting and art direction, own names/characters/story; (5) structure — the outline shows source split into files with one clear job each, named for what they do.
- **Rules' own staging advice:** "with 4 screenshots at most, a screen that shows several systems at once (a chase with the wanted level, the minimap and a mission objective on the HUD) shows more of the game than one that shows a menu alone." So the title screen earns its slot via identity/scope, but the other 3 frames must be MAXIMALLY multi-system.
- **Deliverables:** public GitHub repo (created after opening, OSI license), main.ts (Node 22, STDLIB ONLY, runs twice byte-identical, ≤10 s/run), vendor/makefun-game.ts unchanged, game/ static files, 3–4 screenshots under screenshots/ (real renders, never edited/composited/borrowed), sealed recordings (RECORDED ROUTE ONLY — no transcript upload; recording_ids required).
- **Gate limits:** game/ ≤993 files/dirs, ≤48 MiB total; index.html ≤1 MiB; every reference a data: URI or a file inside game/ (no network); screenshots 3–4, each ≤256 KiB, long side ≤1280, short side ≥480 px; dossier ≤1.5 MiB, text ≤160 KiB. js_parses shown only. Libraries vendored as *.min.js (non-minified library lines count AGAINST thinking_reproduces).
- **Transcript gate:** thinking_reproduces ≥30% authored, ≤40% unwritten; thinking_revised ≥2 messages; thinking_priced ≥1 usage row; transcripts_witnessed (session begun AFTER recording started; 300 s backfill rule); thinking_in_window (timestamps between opening 2026-11-17T15:00Z and receipt). Run record required (entries from 17 Nov 00:00 UTC); **system prompt required (entries from 18 Nov 12:00 UTC)** — seal coordinator settles it before the first submit attempt.
- **Finalist review:** top 10 held up to 60 min — the make.fun team PLAYS the game in desktop Chrome. The game must actually WORK, not just screenshot well.
- **Money:** $1,666, 100 places, one place per entrant: 1st $500, 2nd $250, 3rd $150, 4th–10th $38, 11th–25th $10, 26th–50th $6, 51st–100th $4. Escrow BEyTmCdpxU1XxyCJ1WewiEtR82QxVmMQe8BprQpSEKbN (open, fully funded). Top 3 get live superbot links after the lock. No entry fee. Quota: 5/day (3 high-risk), 10 total per entrant, hard limit 20. Force_Last (last submission before the deadline is the final entry).
- **Dates:** entries close 2026-11-24T15:00:00Z (24 Nov 23:00 WITA); final 24–26 Nov; result due 2026-12-10T15:00:00Z.
- **Prerequisites:** Node 22.18+, desktop browser, recorded coding agent; Playwright MCP optional.

### Top-5 scoring analysis (live leaderboard + ALL 20 judged artifacts viewed by THIS builder, 18 Nov ~22:00 WITA, field 4,723)

- **Rates (values.judge, millionths):** #1–#4 TIED at 993343 (99.3343%, 12-0-0, interval [988585, 998101]); #5 992703; **rank-100 prizelist cutoff 989409** (nimble-koala-68, "Port Meridian"). **OURS v2: #444, 987355 [980551, 994160], 12-0-0.** Gaps: +2,054 micro (0.2054pp) to top 100; +5,988 to #1. Our interval OVERLAPS the cutoff's — statistically within reach; the point estimate is what places us.
- **THE DECIDER IS MARGIN, NOT WINS.** Every top entry is 12-0-0 (dev heat = 12 games vs house games/ladder). Rates differ only by the judge's MARGIN (0.5 + margin/10 per call). Bigger margins come from winning criterion 1 (completeness shown in screenshots) DECISIVELY.
- **Top 5 (all 4-image dossiers, viewed in full by this builder):**
  - #1 ryanp1632-netizen "HALCYON KEYS 3D" 01a1eb78 ($78.14, wall 4.1h): chase + TITLE + night combat + CITY MAP. 7 jobs. Chase: HKPD response table (7 units, RAMMING/PURSUIT/ROADBLOCK), heli, pink hero car, dialogue from JUNO REYES (WHEELWOMAN) with portrait, radio card, 151 KM/H, condition bar. Title: 6 character portraits (Dez, Pearl, Juno, Mags, Benning, Silas), how-to-play panel, Continue with save state, story line. Combat: night, CLUB VOLTAGE neon, muzzle flash, target reticle, SILAS GRIEVE (UNDERTOW BOSS) dialogue. Map: 7 jobs with portraits + cash, 8 named districts, legend, GPS 331m, stage bar.
  - #2 saputra-perlindungan "COSTA SOLIS: HIGH TIDE" 01a1ebad ($181.52, 3.0h): chase/roadblock + on-foot combat + MISSION PASSED (+$25,000 +500 REP, safehouse unlock) + MAP/SAVE screen. NO title screen. 12 missions. Crudest block characters in the top 5 — still #2. Chase: heli, Ferris wheel, beach umbrellas, "ROADBLOCK AHEAD" + "VEHICLE STOLEN: VANTARO SOLEIL" banners, Zara dialogue. Combat: damage number -45, "[F] STEAL VANTARO GT" prompt, tracer. Map: tabs (MAP/MISSIONS/STATS/SAVE/SETTINGS), 12-story list, skill bars (DRIVING/SHOOTING/STAMINA), SAVE SLOT 1 61% COMPLETE.
  - #3 el-net "Marisol Heat" 01a1ec43 ($177.70, 8.2h): chase + on-foot combat (TWO-HANDED pistol aim) + MAP/STATS + TITLE (protagonist full-body by the hero car, face visible). 7 story + side jobs. The ONLY proper humanoid protagonist in the top 5 (green jacket, white tank, black pants, visible face) — proves humanoid + top-3 are compatible. Chase: MBPD table, heli spotlight ("SPOTLIGHT ON YOU"), fleeing peds with arms up, LUCÍA ORTEGA dialogue with portrait, REP 4 BAY HUSTLER. Combat: side job MERCADO STANDOFF, tracer + hit marker, enemies behind parked cars. Map: 49% complete, story 5/7, skills grid (6 skills, pips), REP 3 KNOWN DRIVER, collectibles (Sun Shells 7/24, Stunts 1/6), 14-item POI legend. Title: big MARISOL HEAT logo, tagline, New Game/Continue (Story 3/7 · $9,830 · 29% · Rep 3 · Known Driver · Sat), Controls/Credits.
  - #4 dfaqi "Isla Dorada" 01a1ed80 ($77.73, 1.7h): chase (DRIFT x3 +$150 / NEAR MISS +$250 score popups, flipped cruiser) + TITLE (3 character cards with story bios: WOWO, OFFICER BRAGA, MARA) + on-foot combat (damage numbers -55 HEAVY HIT / -34 GUNMAN DOWN, tracers, searchlight beam) + CITY MAP. 8 jobs. Chase: IDPD table (RAMMING/FLIPPED/ROADBLOCK/SEARCHLIGHT/PURSUIT), speedometer dial, NITRO not installed, RADIO SOL 92.5. Map: 8 jobs (Indonesian titles), stats (cars stolen 38, IDPD escapes 13, play time 02:03:40), SAVE SLOT 1 63% COMPLETE.
  - #5 roni-ismawan "Solmara Heat" 01a1ebe3 ($90.42, 2.0h): chase + on-foot combat + CITY MAP + TITLE (story paragraph, feature chips, 4 portraits: Kai, Lena, Kane, Petey). Visually weakest top-5 entry (flat brown boxes, empty streets, bare plaza combat frame) — carried by pursuit framing + dense HUD + dialogue. Chase: SPD table, 4 stars, "HEAT WAVE — Lose the cops!", Lena Voss dialogue, 42 km/h, Sunset Muscle 60% condition. Map: 6 jobs with cash, legend, stats (cops lost 4, enemies down 12, cars stolen 7, completion 46%), Resume/Save buttons. Title: "Sun. Sea. Speed. Trouble.", save state line, full control list.
- **Winning set shape: chase (COVER) + combat + map + title** (4 of 5 have a title screen; #2 swaps it for a MISSION PASSED reward moment + a map screen that also lists the story). Every top-5 set has a MAP/PROGRESSION screen — it is the single densest completeness proof for criterion 1.
- **What every cover chase frame shows (multi-system density):** wanted stars prominent (3–4) + a police-response table naming units with distances + states + mission objective with number + stage (MISSION 6/12, JOB 4/8, MISSION 7/7, CH 5 PAPER MOON) + dialogue from a NAMED character with portrait + heli with searchlight + speed + car name + condition + radio station + minimap with location name. #4 adds driving score popups (DRIFT x3 +$150, NEAR MISS +$250).
- **Mission depth on display (criterion 2):** 6–12 named missions (#1: 7 jobs, #2: 12, #3: 7 story + side jobs, #4: 8, #5: 6) + side jobs + progression (REP ranks with NAMES: BAY HUSTLER, KNOWN DRIVER; skill bars; collectibles: Sun Shells 7/24, Stashes 2/5; stats: cars stolen, cops lost, enemies down, play time, completion %). **Ours has 3 missions — a depth gap this build closes (target 8 named missions).**
- **Map screens:** 6–8 named districts + POIs (safehouse, gun shop, respray, hospital, police station, garage, impound, casino) + job list with completion + stats + save slot with completion %.
- **Title screens:** big logo + tagline + story hook + character portraits with names/roles + menu + controls + feature list + save state. #3 shows the protagonist full-body; #4 shows 3 character cards with story bios.
- **Character design truth (builder's own viewing):** character FIDELITY is NOT the decider (#2 has the crudest block characters and is #2; #5's characters are boxes and it is #5). Character IDENTITY is universal — every top-5 entry has NAMED characters with ROLES, PORTRAITS, and DIALOGUE in-frame. Reza's v5 character-design order stands (his taste verdict + #3 proves a proper humanoid is compatible with top-3), but identity (name/role/portrait/dialogue) matters as much as polygons. #3's combat frame is the aim-pose reference: both hands on the pistol, arms extended toward the target, tracer aligned.
- **Builder's extensions beyond the coordinator's analysis:** (1) #3's fleeing peds with arms up + #1's roadside detail show that STREET LIFE inside the chase frame (not just cars) sells the pursuit — our chase needs peds reacting, not just traffic. (2) #2 and #4 show REWARD/score moments (MISSION PASSED card, DRIFT/NEAR MISS popups) — visible score feedback is a system the judge reads; our chase needs driving-score popups too. (3) #5 is the floor proof: even the weakest visuals in the top 5 carry a complete system set — our differentiator is doing ALL of it (systems + humanoid + full streets + icon-first HUD) at once. (4) #1's night combat frame proves a NON-sunset frame can sit in the set without breaking the mood — our combat frame can go dusk/shade to dodge the sun-wash failure. (5) Every map screen pairs the job list with a SAVE SLOT + completion % — the save system must be visible on the map, not just in pause.
- **HONEST TENSION (recorded, not resolved):** all five top entries use DENSE TEXT HUDs including police tables. Our icon-first HUD is Reza's direction (GTA authenticity + his "HUD kebanyakan text" verdict), NOT the field's. The v5 chase must sell the pursuit VISUALLY (cruisers boxing in/ramming, heli + visible searchlight, roadblock ahead, stars prominent, radar blips converging, driving-score popups) to compensate for the missing table. The builder does NOT reintroduce a text police table.
- **Title collision (live, 4,723 rows, 18 Nov ~22:00 WITA):** NO exact "PUERTO DEL SOL" title. Near-neighbors: "Sunset Syndicate: Costa del Sol" #365, "Puerto Sol: Neon Tide" #1525. Standing v2 "SOLMAR BAY" #444/4,723 — outside the prizelist, so the Force_Last supersede is intended.
- **Supersede confirmation:** v5 is a FULL REBUILD FROM SCRATCH under Reza's 18 Nov 21:41 WITA order ("Dah kerjain ulang dari awal. Karakternya juga masih rada aneh desainnya."). v2 (01a1ec70) is the standing entry at #444 — outside the top-100 prizelist. v3 was REJECTED (9.7% authored). v4 + rev1 + rev2 were never submitted and are SUPERSEDED. v5 supersedes v2 under Force_Last — intended. This is the first rebuild trigger for the v2 standing entry in this cycle (v3/v4 were separate rebuild attempts under their own triggers; v5 is the current one).
- **Not a duplicate:** all game code is written fresh in-session in this recording; v4/v3 code is design reference only, never copied, re-typed, or reformatted. New repo RieryBuild/makefun-gta6-01-v5, new file names/organization, new character names, 8 missions (v4 had 3), new judged set (title + map screens added).

## MQ1: Can this entry be submitted RIGHT NOW, end to end? — PASS

1. Competition: gta6-01 — entries close 2026-11-24T15:00:00Z (from
   GET /api/competitions/gta6-01/requirements, re-read fresh at gate
   time 18:33Z; the only difference vs the 13:54Z read is
   escrow.synced_at — no rule, deadline, cap, or check changed).
2. Deliverables: repo_url (https://github.com/RieryBuild/makefun-gta6-01-v5),
   commit_sha (remote HEAD after push, recorded below), recording_ids
   (01a1eeef + 01a1ef13 + 01a1efa5 + 01a1efdb — all four, see MQ8),
   LICENSE (present, SPDX-License-Identifier: MIT first line),
   main.ts (present, Node 22 stdlib-only, runs twice byte-identical
   in ~0.8 s/run; dossier.json 728,032 bytes ≤1.5 MiB),
   .makefun/owner.json (present, wallet 6do8), game/ (44 files/dirs,
   946,939 bytes), screenshots/ (4 JPEGs, each ≤256 KiB, 1280×720),
   shots.json, serve.ts, README.md, scorecard.md. All present in the repo.
3. Checks: every applying check from /requirements is met — game/
   44 files/dirs (cap 993), 925 KiB (cap 48 MiB); index.html 5,185 B
   (cap 1 MiB); screenshots 4 × ≤256 KiB (104,693 / 118,090 / 92,062 /
   104,438 B); dossier text 163,829 B (cap 163,840 — 11 B of headroom;
   buildDossier truncates gracefully past the cap, it does not throw);
   no network reference (three.js vendored, fonts vendored OFL, all
   textures procedural); transcript checks are enforced at seal/submit
   time — the seal coordinator settles the system-prompt rule (entries
   from 18 Nov 12:00 UTC) before the first submit attempt. No "probably".
4. Submit path: coordinator submits via
   `node cli/makefun.mjs submit --competition gta6-01 --repo-url
   https://github.com/RieryBuild/makefun-gta6-01-v5 --commit <HEAD> --title
   "PUERTO DEL SOL" --recording <4 ids> --repo <entry dir> --keypair
   <file>`. Builder does not submit (audit stop).
5. Cost: time ~10 min to submit; capital $0 (entry fee null, FREE bounty).

## MQ2: Does this entry clear the competition's bar? — PASS

- The bar is the prizelist (top 100). Fresh leaderboard at gate time
  (19 Nov ~02:40 WITA, 5,299 ranked entries / 6,427 submissions):
  #1–#5 tied at 993343; #100 cutoff 990081 (COSTA PALMA, khocheng1x);
  our standing v2 is #495 at 987355 — outside the prizelist, gap
  2,726 micro to the cutoff (our interval [980551, 994160] still
  overlaps the cutoff's [984152, 996009]).
- v5 is demonstrably stronger than the v2 it supersedes: 8 named
  missions (v2: 3), a designed humanoid protagonist (v2's was a
  capsule), full streets (traffic + parked cars both curbs + peds),
  a 4-frame judged set with title + city-map screens, icon-first HUD,
  scorecard 2.30 with zero automatic failures, 30/30 play-test.
- No practice grade exists for judged/visual competitions — the
  evidence is the feed-first top-5 study (MQ5) + the multi-model
  review (Gate 1) + the scorecard. A grade is evidence, never a
  promised outcome: the final judges every entry afresh and dev
  rating counts for NOTHING in the final. PASS on the bar.

## MQ3: Is the submission window actually open for this account? — PASS

- Quota via the kit CLI (`status --competition gta6-01`) at gate time
  (~18:33Z): can_submit true; day cap 3, taken 2, left 1 (resets
  2026-11-19T00:00:00Z); hard limit max 20, left 17; entries_made 3,
  entries_kept 2. (The total count is withheld by the site; the
  reputation note says entries remain.)
- Deadline 2026-11-24T15:00:00Z is ~5.6 days ahead. Window open.

## MQ4: Is the entry signed by the right identity, through the right route? — PASS

- Entry signed by wallet 6do8 ONLY
  (6do8zGw4FPLCB1Cq44G8r8KwQccbhHUqtAptaRji6ALk — .makefun/owner.json,
  verified at gate time; the only occurrence of the address in the
  entry dir is owner.json itself).
- Repo pushed via the GitHub PAT route (custom.github-pat helper),
  at one public HEAD (recorded below). No other wallet, no other route.

## MQ6: Can you prove the entry works — beyond "it should work"? — PASS

- Play-tested end to end on the FINAL code: **30/30, 0 errors**
  (19 Nov 2026, 18:35:18Z — log in the build dir). Missions 1–3 pay
  exact cash/REP/rank ($800 +100 REP, $1,200, $2,500 + 4×$50 bounties
  +250 REP → RUNNER); aimed rifle kills at 30 m in 2 hits; Sun Shell
  pickup +$100; waterline clamp z=184; pause/map; BUSTED 10% fine
  ($615) + PSPD Central respawn; WASTED 10% bill ($554) + hospital
  respawn, full health; autosave + Continue restores cash/REP/
  missions/position exactly. 0 console/page errors.
- The finishing builder VIEWED all 4 final screenshots full-size
  this session: 2-title STRONG, 3-map STRONG (label fix verified —
  all 16 POI labels legible), 4-combat STRONG, 1-chase MEDIUM (the
  cover's pursuit still doesn't read at a glance — police ahead,
  not flanking; the one bounded re-stage attempt LOST on evidence,
  48 km/h vs 132 km/h, and was reverted). The game does NOT read as
  flat colored blocks: textured facades with window logic, an
  articulated humanoid protagonist, a layered hero car, a dense city.
- Visual scorecard 2.30, every category ≥ 2, ZERO automatic
  failures (fresh this session, re-verified PIL metrics + renderer
  diagnostics). Determinism: main.ts twice → byte-identical output,
  ~0.8 s/run (limit 10 s).

## MQ7: Is this entry on the never-submit list? — PASS (no match)

- No code-drawn images (all 4 screenshots are real renders of the
  game's own code, staged deterministically; the rejected flank
  attempt is preserved in the build dir, not the entry).
- main.ts is stdlib-only (node:fs, node:path, node:url); no
  non-stdlib import anywhere in the entry.
- Recordings started before the first build action (MQ8); in-session
  revision present in all four sessions.
- Wallet 6do8 only (MQ4); repo via the PAT route (MQ4).
- No claim codes anywhere (none issued; none in repo/chat/transcript).
- can_submit true, day entries left 1 (MQ3).
- Entry needs no capital ($0 — MQ1).
- No grade quoted as a promised outcome (MQ2).
- Not a duplicate of the standing entry (MQ5).
- Reza visual audit PENDING — Gate 3 stays PENDING (audit stop).
  The entry does NOT submit without his Gas.

## MQ8: Session check — PASS (four sessions, all covered)

1. Sessions + recordings (all four are listed on the submission;
   coverage is the union):
   - First builder 0d23fb79-ad9b-4b6d-848b-a0e47b354a06 /
     recording 01a1eeef-1bba-726b-b0dc-7b49c5b95e48 — wrote the full
     game (32 src modules + index.html + style.css + main.ts +
     serve.ts + vendor + fonts + LICENSE + README + owner.json +
     shots.json + gate-run.md MQ5), 7,170 lines.
   - Continuation builder 757fdd6a-9811-46fa-b27a-344305faf400 /
     recording 01a1ef13-a1e0-7151-bf96-c09683e6dd6f — play-test,
     fix pass, first screenshots, first scorecard, Gate 1 review.
   - Recovery builder 4399d800-5d61-45b1-b4d3-78aa0105d918 /
     recording 01a1efa5-4a06-750f-bf5d-4dd65d9fb7e7 — re-applied the
     post-stop fixes as genuine fresh edits, re-staged + re-shot,
     placed the shipped frames.
   - Finishing builder 11368173-ddd2-4ce9-a39f-79d419844a75 (this
     session) / recording 01a1efdb-c2fa-7730-b6b1-52c72407db2b —
     newGame/continueGame resets, bust-timer fix, chase re-stage
     attempt (reverted), scorecard rewrite, Gate 1 re-check,
     menus label fix + map re-placement, gate fill, repo push.
2. Recording starts (each BEFORE its session's first build action):
   01a1eeef 2026-11-18T13:53:30Z (entry dir verified EMPTY at 13:54;
   first write = gate-run.md MQ5); 01a1ef13 2026-11-18T14:33:23Z;
   01a1efa5 2026-11-18T17:12:29Z; 01a1efdb 2026-11-18T18:11:59Z.
3. First action: gate-run.md's creation (MQ5, recorded before any
   build writes, per Reza's sequencing rule).
4. Coverage: 01a1eeef SEALED 2026-11-18T14:33:07Z (208 chunks, 6,186
   leaves; builder 482/483 records witnessed; usage row 692,662 in /
   3,560 out). 01a1ef13 SEALED 2026-11-18T17:12:19Z (673 chunks,
   13,100 leaves; builder 741/742 witnessed; the builder's usage row
   goes UNCOUNTED — its only row is its final message, 36 min after
   the recorder died, so it matches no witnessed record;
   thinking_priced is satisfied by the 12 matched rows from the
   concurrent sessions). 01a1efa5 SEALED 2026-11-18T18:11:51Z
   (336 chunks, 3,868 leaves; builder 522/523 witnessed; usage row
   matched, 429,802 in / 6,558 out). 01a1efdb LIVE at gate time
   (node PID 2308, seq advancing; seal is the coordinator's job
   after this session completes cleanly).
   - Three recorders died on this build (VM reboot #5 killed
     01a1eeef; stop signals killed 01a1ef13 and 01a1efa5 mid-seal).
     Each death stopped its builder's writes immediately per the
     hard rule; each dead recording was sealed with the dead-
     recording procedure (explicit --muse-usage).
   - Post-stop re-application: the continuation builder's post-stop
     lines (game.js unlock, player.js ramKeepsSpeed, police.js
     beam, staging.js numbers) were re-applied by the recovery
     builder as GENUINE fresh edits under 01a1efa5 (revert →
     reproduce → re-implement in own form); scorecard.md was
     rewritten fresh; all 4 screenshots were re-shot + placed fresh
     under 01a1efa5 (3-map re-placed under 01a1efdb). Every counted
     file was written under at least one listed recording — the v3
     failure mode (files never written under any listed recording)
     does not apply.
5. In-session revision: main.ts + game modules revised in-session in
   every session (first builder's self-critique cycles; continuation
   fix pass + Gate 1 finding; recovery re-implementations; finishing
   newGame/bustT/menus/continueGame fixes + scorecard rewrite).
   thinking_revised (≥2 messages) is met many times over.

## Gate 0: Reality — PASS

- [x] Repo exists at one public commit; the commit SHA is recorded below.
- [x] Every deliverable from /requirements is in the repo (checked, MQ1).
- [x] Entry passes its play-test (30/30, 0 errors) on this commit (MQ6).
- [x] Evidence captured: requirements + quota (fresh gate-time reads),
  leaderboard snapshot (v2 #495, cutoff 990081), recording timestamps,
  play-test log, renderer diagnostics, scorecard, Gate 1 raw exchanges.

## Gate 1: Quality — PASS

- [x] Multi-model review done (RESTORED 18 Nov, Reza's word):
  code/reasoning reviewed by an independent model via OpenRouter
  (custom.openrouter helper, a :free model):
  - Original review: nvidia/nemotron-3-ultra-550b-a55b:free, cost $0,
    verdict PASS (raw exchange in build/gate1-review-raw.json,
    26,709 tokens). One finding: unlock-string case fragility
    (game.js) — FIXED (lowercase normalization at the reward
    boundary) + re-validated by the 30/30 play-test.
  - Re-check (this session): the SAME :free model (GET /models
    re-checked first — 14 :free, nemotron still listed), cost $0,
    8,745 tokens (raw in build/gate1-recheck-raw.json). Hunks sent:
    game.js unlock + newGame reset, player.js ramKeepsSpeed,
    police.js beam/aimAhead/roadblockDist + bustT decay, staging.js
    numbers, camerawork distScale, shooting tracer/numbers, menus
    label. Verdict FAIL on 2 findings:
    (1) menus.js label placement — REAL: the bottom-edge flip
    skipped the overlap re-check, and the shipped map PROVED it
    (the flipped "Rueda del Sol" label covered "Ro's Safehouse").
    FIXED (re-check after the flip, nudge UP, bounded) + map
    re-shot (diag18, 0 errors) + placed 3-map.jpg replaced with
    the cleaner render (92,062 B, md5 163af724…).
    (2) police.js beam quaternion — REVIEWER ERROR, rebutted: the
    cone's WIDE end (base, local -Y) correctly faces the ground
    target and its apex sits at the heli — the correct searchlight
    shape. Proven from the vendored three.js source
    (ConeGeometry calls CylinderGeometry with radiusTop=0, so the
    apex is +Y and the base is -Y) and from the shipped chase
    frame, where the beam reads correctly. The suggested "fix"
    would have broken it; not applied.
  - Gemini text/copy review SKIPPED while it 503s (custom.gemini
    still down on capacity/permission errors at last check) — the
    gap is recorded here; per the house rule that is NOT a Gate 1 FAIL.
- [x] The review exchanges are recorded (reviewer model, verdict,
  issues found + fixed) here and as raw JSON in the build dir.
- [x] Practice grade N/A (judged/visual competition) — the evidence
  is the top-5 study + review + scorecard, stated as evidence, never
  a promised outcome (MQ2).
- [x] Feed-first study done for the rebuild (MQ5): v5 is
  demonstrably stronger than the standing v2 it supersedes.

## Gate 2: Dedup — PASS

- [x] Not a duplicate of the standing entry (MQ5) — Force_Last
  supersede is intended (v2 is #495, outside the prizelist).
- [x] Rebuild-once rule respected: v5 is the first rebuild trigger
  for the v2 standing entry in this cycle (v3/v4 were separate
  rebuild attempts under their own triggers; v5 is the current one).
- [x] Quota re-checked at gate time via the competition's own
  endpoint (MQ3: can_submit true, 1 left today, 17 under hard limit).

## Gate 3: Submission quality — PENDING (audit checkbox stays PENDING — AUDIT STOP)

- [x] README matches the requirements template (badges, description,
  run instructions, controls, shots section).
- [x] Entry message + signature use wallet 6do8 only; repo via PAT route (MQ4).
- [x] Claim-code handling confirmed: no claim codes issued; none in
  the repo, chat, or transcripts.
- [x] No secrets in the repo (grep clean at gate time: no API keys,
  no private keys, no tokens; the only wallet address in the tree
  is owner.json's 6do8, the required identity file).
- [x] Deadline still ahead at submit time (~5.6 days, MQ1/MQ3).
- [ ] Reza visual audit — NOT DONE. The build stops here: the
  coordinator reports the 4 screenshots to the parent, who sends
  them to Reza in the Make.fun chat and waits for his word. No seal,
  no submit without his Gas. (Reza's rule, 18 Nov ~10:26 WITA —
  not waivable, even near a deadline.)

## Remote HEAD

- Content HEAD (all entry files, gate record included): recorded
  after the push (see below).
- This record is updated after the push to note the SHA, so the
  branch HEAD moves past the content HEAD by the record's own update
  commit(s). The coordinator reads the branch HEAD at submit time
  and submits that SHA — the tree is identical in content either way.
- Pushed tree verified to match local at content HEAD (file counts
  + blob shas compared; see the push log in the build dir).

## Decision

**MQ1–MQ8 pass. Gates 0–2 pass. Gate 3 PENDING (Reza visual audit).**
The build is done, tested, reviewed, gated and pushed. The SUBMIT
decision belongs to the coordinator after Reza's audit — no seal, no
submit from this session.
