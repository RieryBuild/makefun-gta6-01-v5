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

- Content HEAD (all 53 entry files, gate record included):
  e9880434a9aa90a3205f05aede848c1a0908aefe
  (tree 8fcca1b371a73aa60efb96c85d642a5310a42319)
- This record was updated after the push to note the SHA, so the branch
  HEAD moved past the content HEAD by the record's own update commit(s).
  The coordinator reads the branch HEAD at submit time and submits that
  SHA — the tree is identical in content either way.
- Pushed tree verified to match local at content HEAD: 53 local files =
  53 remote blobs, zero mismatches, zero remote-only files.

## Decision

**MQ1–MQ8 pass. Gates 0–2 pass. Gate 3 PENDING (Reza visual audit).**
The build is done, tested, reviewed, gated and pushed. The SUBMIT
decision belongs to the coordinator after Reza's audit — no seal, no
submit from this session.

## Gate 3 — Reza visual audit: PASSED 2026-11-19 06:50 WITA

Reza tapped "Gas, submit v5" on the audit widget (widget-f6e5284a) after viewing all 4 screenshots. Approved as-is (cover medium noted, no revision requested). Seal+submit coordinator spawned by the parent the same minute.

---

# Round-6 fix — run_completes rejection repair (re-gate from MQ1)

- Fix session: ac252672-8e68-46ea-9339-b4885c591422 (this session,
  spawned by the parent under the live fifth recording).
- Recording: 01a1f136-4484-77d0-87c7-53b304ce15ba, started
  2026-11-19T00:30:27Z (node PID 5901, alive through the whole fix —
  checked before every entry-dir write). This session began AFTER
  the recording started, so every fix write is witnessed.
- Round 5: submission 01a1f11d-41f2-73a2-8c6a-8a7963b911f3, repo
  RieryBuild/makefun-gta6-01-v5 @ 5448b875, submitted 08:03 WITA
  19 Nov. All validity checks PASSED (transcripts_run_record,
  98.0% authored, 17 usage records, signature 6do8). REJECTED on
  ONE check: run_completes ("The latest grade run on the dev phase
  ended failed", HTTP 422 "Run did not complete").
- Scope (hard constraint, kept): main.ts ONLY + this gate record.
  game/ and screenshots/ NOT touched — no visual or gameplay change.
  Verified by full tree diff vs a fresh clone @ 5448b875 (below).
- Re-gate run: 19 Nov 2026 ~08:31–08:40 WITA (00:31–00:40Z).
- Verdict: **MQ1–MQ8 PASS. Gates 0–2 PASS. Gate 3: no fresh Reza
  audit needed — NO visual change was made (the parent decides
  whether the 06:50 WITA Gas covers round 6).**

## Root cause (proven by faithful reproduction, re-verified this session)

v5's new `rmSync(out, { recursive: true, force: true })` (main.ts
line 33, the "wipe first" determinism step — v2 did not have it)
tries to delete the /output directory ITSELF. In the grader /output
is a bind-mounted volume and the process runs as user 65534 on a
read-only filesystem, so rmdir fails (EACCES; `force: true` ignores
only ENOENT) → uncaught exception → exit 1. Local playtest passed
because MAKEFUN_OUTPUT_DIR=out is a plain owned dir, not a mount
point.

## Repro evidence — before (unfixed code, this session)

- Harness: /tmp/repro-run.sh (also in the build dir) — node22.21.0,
  repo bind-mounted read-only, empty /output bind-mounted chmod 777,
  run as 65534:65534, 1 CPU, timeout 10s, grader env vars.
- Pre-fix run (label v5prefixed): **EXIT=1, 366 ms**,
  `Error: EACCES: permission denied, rmdir
  '/tmp/repro-v5prefixed/mnt/output'` at main.ts:33 — matches the
  parent's repro (367 ms) exactly. Diagnosis confirmed, not re-made.

## The fix (main.ts ONLY — full diff)

```diff
-import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
+import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
@@ function main() {
   // Wipe first: the dossier must describe exactly this tree, nothing
-  // left over from a previous run.
-  rmSync(out, { recursive: true, force: true });
+  // left over from a previous run. Wipe the CONTENTS, not the
+  // directory: in the grader /output is a mounted volume the process
+  // cannot rmdir (EACCES) — deleting the directory itself fails the run.
   mkdirSync(out, { recursive: true });
+  for (const entry of readdirSync(out)) rmSync(join(out, entry), { recursive: true, force: true });
   copyTree(join(here, 'game'), join(out, 'game'));
```

Wipe the CONTENTS, not the directory: mkdir first (creates it if
missing, no-op if present), then rmSync each entry inside it. The
determinism intent is unchanged — stale files from a previous run
still cannot leak into the dossier.

## Repro evidence — after (fixed code, this session)

- Empty output (label v5fixed): **EXIT=0, 810 ms**, dossier.json
  727,978 B written; stderr only the Node UNDICI-EHPA proxy warning.
- Pre-populated output (label v5stale3, stale variant
  /tmp/repro-run-stale.sh): stale file + nested stale dirs +
  stale dossier.json, all created AS user 65534 (faithful: a
  previous grader run's leftovers are nobody-owned) — **EXIT=0,
  766 ms, every stale entry removed**, fresh dossier.json written.
  The contents-wipe preserves the determinism intent.
- First stale attempt (v5stale2) FAILED on root-owned 770 stale
  dirs (EACCES scandir) — a TEST-SETUP artifact, not a fix failure:
  root-owned non-world-readable dirs are not something a grader run
  can produce (its own leftovers are nobody-owned). Recorded so the
  failed run is not misread later.

## Pushed code is what failed (fresh clone @ 5448b875)

- Fresh clone of RieryBuild/makefun-gta6-01-v5 @ 5448b875:
  its main.ts differs from the FIXED main.ts ONLY by the fix diff
  above — the pushed code is exactly the pre-fix code.
- Full tree diff (clone vs entry dir, excluding main.ts, this gate
  record, and entry-local .makefun/): CLEAN — game/, screenshots/,
  vendor/, serve.ts, README.md, scorecard.md, shots.json, LICENSE
  are byte-identical to the pushed tree. No visual/gameplay change.

## Play-test (fixed code, full run)

- `node playtest.cjs --play` (build dir, serves the entry dir):
  **30/30 PASS, 0 errors** (log: build/playtest-round6-fix-run.log;
  the 18 Nov final log is preserved as
  build/playtest-log-2026-11-18-final-pre-fix.md). Same cash/REP/
  fine/bill figures as the 18 Nov final run. NO screenshots re-shot
  (none needed — game/ untouched).

## Determinism + dossier bytes

- main.ts (node22) twice into two fresh output dirs: **byte-identical**
  (diff -r clean over dossier.json + game/ + screenshots/).
- Pre-fix main.ts (from the clone @ 5448b875) vs FIXED main.ts on
  the SAME tree: **dossier byte-identical** (diff -r clean). The fix
  cannot and does not change the dossier — main.ts is not in the
  dossier text (buildDossier's text comes only from game/ sources).
- Dossier now: text **163,824 B** (cap 163,840 — 16 B headroom),
  dossier.json 727,978 B (cap 1.5 MiB). Both under cap.
- Note on the gate-time figures (163,829 B text / 728,032 B total):
  they were measured on a pre-final tree state — game/ was 946,939 B
  at MQ1 measurement time vs 947,613 B in the pushed tree (game/
  has been 947,613 B since commit 3a68dda, 02:40:33 WITA; the pushed
  HEAD 5448b875 is the same). The decisive comparison is pre-fix vs
  fixed on the SAME tree, which is byte-identical.

## MQ1: Can this entry be submitted RIGHT NOW, end to end? — PASS

1. Competition: gta6-01 — entries close 2026-11-24T15:00:00Z
   (unchanged; ~5 days ahead).
2. Deliverables: unchanged from the gate run except main.ts (the
   fix) + this gate record. game/ 44 files/dirs, 947,613 B;
   index.html 5,185 B; screenshots 4 × ≤256 KiB (104,693 / 118,090 /
   92,062 / 104,438 B — unchanged); LICENSE, .makefun/owner.json
   (6do8), shots.json, serve.ts, README.md, scorecard.md all present.
   The round-6 commit is a NEW commit (fix + this record) — the
   coordinator pushes it via the PAT route and records the remote
   SHA before submit; this session commits LOCALLY only, does NOT push.
3. Checks: every applying check met — same numbers as the gate run,
   plus the failing one now proven: run_completes passes in the
   grader-faithful harness (EXIT=0, 810 ms, under the 10 s limit).
   Dossier text 163,824 B ≤ 163,840; dossier.json 727,978 B ≤ 1.5 MiB.
   No "probably".
4. Submit path: coordinator submits via the level-20 CLI with the
   new commit SHA + all FIVE recordings (the four sealed ones + the
   live 01a1f136, sealed by the coordinator after this session).
   Builder does not submit (audit stop stands for the parent's call).
5. Cost: time ~10 min to submit; capital $0.

## MQ2: Does this entry clear the competition's bar? — PASS (unchanged)

- Same game, same judged set, same scorecard (2.30, zero automatic
  failures) as the gate run — the fix changes no scoring input
  (dossier byte-identical). The bar analysis from the gate run
  stands: v5 is demonstrably stronger than the v2 it supersedes
  (8 missions vs 3, designed humanoid, full streets, title + map
  screens). No grade is quoted as a promised outcome.

## MQ3: Is the submission window actually open for this account? — PASS

- Quota via the level-20 kit CLI (`status --competition gta6-01
  --json`, bring-the-humans-02 kit copy, ~00:37Z): **can_submit
  true**; day cap 3, taken 1 (round 5), left 2 (resets
  2026-11-20T00:00:00Z); hard limit max 20, left 15; entries_made 5,
  entries_kept 2; total count withheld by the site (reputation note
  says entries remain). Deadline 2026-11-24T15:00:00Z is ~5 days ahead.
- Read-only check only — NO submit was attempted by this session.

## MQ4: Is the entry signed by the right identity, through the right route? — PASS (unchanged)

- Wallet 6do8 ONLY (.makefun/owner.json, untouched). The fix commit
  is pushed via the GitHub PAT route by the coordinator (this session
  does not push). No other wallet, no other route.

## MQ5: Is this entry a deliberate new submission, not a duplicate? — PASS

- Not a duplicate: main.ts changed — the artifact that failed.
  Round 6 supersedes the REJECTED round-5 submission under
  Force_Last; the supersede is intended (round 5 has no live grade:
  it was rejected on run_completes). This is a rejection re-entry,
  not a second rebuild trigger for a standing entry.

## MQ6: Can you prove the entry works — beyond "it should work"? — PASS

- Play-test re-run on the FIXED code: 30/30, 0 errors (above).
- The actual failing check is now proven in the grader-faithful
  harness: run_completes EXIT=0 in 810 ms (was EXIT=1 in 366 ms),
  plus the stale-output variant EXIT=0 in 766 ms.
- Determinism byte-identical; dossier byte-identical pre-fix vs
  fixed; screenshots unchanged and already viewed full-size +
  audited by Reza (Gate 3, 06:50 WITA). Scorecard unchanged (2.30,
  zero automatic failures).

## MQ7: Is this entry on the never-submit list? — PASS (no match)

- No code-drawn images (screenshots untouched, real renders).
- main.ts stays stdlib-only (readdirSync is node:fs).
- Recording 01a1f136 started BEFORE this session's first write
  (00:30:27Z vs first fix write ~00:31:33Z); in-session revision
  present (the fix itself revises main.ts in-session).
- Wallet 6do8 only; repo via the PAT route (coordinator pushes).
- No claim codes anywhere (none issued for round 6; none in the
  repo/chat/transcript). No secrets in the repo (grep clean at
  re-gate time: no API keys, no private keys, no tokens; the only
  wallet address in the tree is owner.json's 6do8).
- can_submit true, 2 left today (MQ3). Entry needs no capital ($0).
- No grade quoted as a promised outcome (MQ2).
- Not a duplicate (MQ5). No visual change — no fresh audit needed
  (Gate 3, parent decides).

## MQ8: Session check — PASS (fifth session, covered)

1. Fix session ac252672-8e68-46ea-9339-b4885c591422 /
   recording 01a1f136-4484-77d0-87c7-53b304ce15ba — main.ts fix +
   this gate record. The four earlier recordings (01a1eeef,
   01a1ef13, 01a1efa5, 01a1efdb) remain sealed and listed; round 6
   lists all FIVE (coverage is the union).
2. Recording start 2026-11-19T00:30:27Z — BEFORE this session's
   first build action (first main.ts write ~00:31:33Z).
3. First action: the main.ts import edit (readdirSync).
4. Coverage: recording LIVE through the whole fix (PID 5901,
   checked alive before every entry-dir write). Seal is the
   coordinator's job after this session completes cleanly.
5. In-session revision: main.ts revised in-session (the fix);
   this gate record written in-session. thinking_revised is met.

## Gate 0: Reality — PASS

- [x] Entry passes its play-test (30/30, 0 errors) AND the
  grader-faithful repro (EXIT=0) on the fixed code (MQ6).
- [x] Every deliverable from /requirements is in the tree (MQ1).
- [x] Evidence captured: repro before/after (exit codes + wall
  times + stderr), play-test log, determinism diff, dossier
  byte-identity proof, fresh-clone tree diff, quota response,
  Gate 1 raw exchange (build/gate1-review-round6-fix-raw.json).
- [ ] Repo commit: LOCAL ONLY this session (hash in the fix
  builder's report to the parent). The coordinator pushes via the
  PAT route and records the remote SHA before submit — the remote
  HEAD check is the coordinator's, not this session's.

## Gate 1: Quality — PASS

- [x] Multi-model review done — LIGHT review of ONLY the main.ts
  diff (the only code that changed):
  code/reasoning reviewed by nvidia/nemotron-3-ultra-550b-a55b:free
  via OpenRouter (custom.openrouter helper; GET /models re-checked
  first — 445 models, 14 :free, nemotron still listed), cost $0,
  1,326 tokens (raw in build/gate1-review-round6-fix-raw.json).
  Verdict PASS, no findings: the fix never calls rmSync on `out`
  itself; the contents-wipe removes stale files/dirs recursively;
  empty dir / missing dir / symlink / undeletable entry all handled
  (fails loudly on undeletable entries — no silent staleness).
  - Gemini text/copy review SKIPPED — still 503ing (probed
    19 Nov ~00:37Z: gemini-3.8-flash generateContent → HTTP 503
    Service Unavailable). Gap recorded here; per the house rule
    that is NOT a Gate 1 FAIL. Substantively moot: the dossier
    text is byte-identical to round 5's, so there is no new
    text/copy to review.
- [x] The review exchange is recorded (model, verdict, findings)
  here and as raw JSON in the build dir.
- [x] Practice grade N/A (judged/visual competition) — the evidence
  is the top-5 study + review + scorecard, stated as evidence, never
  a promised outcome (MQ2).
- [x] Feed-first study done for the rebuild (MQ5 of the gate run):
  v5 is demonstrably stronger than the standing v2 it supersedes.

## Gate 2: Dedup — PASS

- [x] Not a duplicate of the standing entry (MQ5) — Force_Last
  supersede of the rejected round-5 submission is intended.
- [x] Rebuild-once rule respected: this is a rejection re-entry
  (round 5 was rejected, not standing), not a second rebuild
  trigger for a standing entry.
- [x] Quota re-checked at re-gate time via the competition's own
  endpoint (MQ3: can_submit true, 2 left today, 15 under hard limit).

## Gate 3: Submission quality — NO FRESH AUDIT NEEDED (no visual change; the parent decides)

- [x] README matches the requirements template (unchanged).
- [x] Entry message + signature use wallet 6do8 only; repo via PAT route (MQ4).
- [x] Claim-code handling confirmed: no claim codes issued for
  round 6; none in the repo, chat, or transcripts.
- [x] No secrets in the repo (grep clean at re-gate time).
- [x] Deadline still ahead at submit time (~5 days, MQ1/MQ3).
- [x] Reza visual audit — NO FRESH ROUND NEEDED: game/ and
  screenshots/ are byte-identical to the pushed tree Reza audited
  at 06:50 WITA (full tree diff clean, see above). The fix touches
  only main.ts (grader plumbing) + this gate record — nothing Reza
  sees has changed. The parent decides whether the existing Gas
  covers round 6; this session does NOT submit either way.

## Decision (Round-6 fix)

**MQ1–MQ8 pass. Gates 0–2 pass. Gate 3: no fresh audit needed
(no visual change) — parent decides on the existing Gas.**
The run_completes failure is fixed and proven fixed in the
grader-faithful harness; the game, the screenshots, and the dossier
are unchanged. The SUBMIT decision belongs to the parent/coordinator
(push via PAT, seal 01a1f136, submit round 6) — no seal, no submit
from this session.


---

# Round 7 — revision "PUERTO DEL SOL" (targeted, NOT a rebuild)

- Revision session: this session (builder session id in the final
  report to the coordinator; the coordinator writes the usage row).
- Recording: **01a1fcdf-790a-7789-ac8d-802d0d43fa84, LIVE since
  2026-11-21T06:51:xxZ (node PID 19722)**, started BEFORE this
  session. Usage file /home/hatch/.makefun/muse-usage-gta6-01-v6.jsonl
  (coordinator writes it after this session completes cleanly).
- Standing entry: round 6 **01a1f14b-c259-76bf-a19d-b5aea59fd0b2**,
  repo RieryBuild/makefun-gta6-01-v5 @ d12dfb7f, **rank #562/8,929**
  at MQ5 time (21 Nov ~15:05 WITA; #555/8,907 at 14:30 WITA —
  the field grew, our judge value is unchanged), judge **989,409**
  [983,258–995,560], 12W-0L provisional — outside the top-100
  prizelist. Force_Last supersede is intended.
- Scope (P0–P3 only): P0 re-stage the cover chase with a DIFFERENT
  staging idea than the failed flank attempt (rear-view: cruisers
  visibly BEHIND the hero car at its rear quarters + roadblock
  ahead; heli + beam cone IN the frame; denser icon-first HUD);
  P1 one MISSION PASSED frame as 5th shot, judged on evidence;
  P2 more committed orange-sunset palette + varied building
  silhouettes; P3 file/function-name audit for criterion 5.
  No rebuild, no re-typing of whole files (v3 lesson).
- Quota at MQ5 time (kit CLI status, 21 Nov ~15:00 WITA):
  can_submit true, day cap 5 / taken 0 / left 5 (resets
  2026-11-22T00:00:00Z), hard limit 40 / left 34,
  entries_made 6, entries_kept 3. Entries close 24 Nov 23:00 WITA.
- Dossier-cap watch: text **163,824 B** measured on the current
  tree before any edit (cap 163,840 — 16 B headroom; buildDossier
  truncates gracefully past the cap, it does not throw). Re-measure
  after the edits; the cut already sits inside facekit.js (196 of
  263 lines shown, 15 files + 129,831 B left out — pre-existing
  v5 state, not caused by this revision).

## MQ5 (round 7): brief + LIVE top-5 analysis — PASS (recorded BEFORE any build writes, per Reza's sequencing rule)

### Brief summary (re-read fresh 21 Nov ~15:00 WITA: live requirements API + kit competition.yaml + RULES.txt; deadline + caps unchanged vs v5)

- **Task:** most complete, highest-quality open-world crime game
  in the spirit of GTA 6; offline in a desktop browser from static
  files under game/ (game/index.html); keyboard + mouse; NO network
  request; three.js or any library vendored under game/. Everything
  original — NO Rockstar name/logo/character/map/asset.
- **Completeness counts most** (criterion 1): city on foot and by
  car, traffic and pedestrians, cars to steal, a wanted level and
  police, missions and a story, combat, a HUD with a minimap, a
  start and a save, and polish.
- **Scoring — pairwise AI judge, win rate (Bradley-Terry,
  millionths).** Judge = z-ai/glm-5.3-flash, reasoning effort high.
  Each game = 2 calls (both orders); each call scores the picked
  entry 0.5 + margin/10 (margin 1–5). Final: 3 Swiss rounds over
  every final entry + 4 house anchors, then a playoff over exactly
  the top 100 (each pair once). **Playoff entries place above EVERY
  non-playoff entry whatever the rates.** Final judges every entry
  afresh — **dev rating counts for NOTHING in the final.**
- **What the judge sees (1,536 input tokens/entry):** ONE JPEG
  contact sheet of every screenshot — the COVER (first screenshot
  by name) LARGE on top, the others small beneath — plus a SHORT
  source outline (file paths, sizes, first declarations). **The
  cover matters most.** Source files must be split with one clear
  job each, named for what they do (criterion 5 reads the names).
- **Judge rubric (5 criteria, most important first; the FIRST
  criterion on which two entries differ decides, unless a later one
  differs by much more):** (1) complete open world SHOWN IN
  SCREENSHOTS — city on foot and by car, traffic and pedestrians,
  wanted level with police who respond, missions; (2) depth and fun
  — missions and a story, vehicles to steal and drive, activities
  and combat, progression; (3) feel and polish — controls and a
  camera that answer well, a HUD with a minimap, effects and menus;
  (4) look and originality — a coherent sun-soaked modern city of
  its own, lighting and art direction, own names/characters/story;
  (5) structure — the outline shows source split into files with
  one clear job each, named for what they do.
- **Deliverables / caps (unchanged):** public GitHub repo (OSI
  license), main.ts (Node 22, STDLIB ONLY, runs twice
  byte-identical, ≤10 s/run), vendor/makefun-game.ts unchanged,
  game/ static files, 3–4 screenshots under screenshots/ (real
  renders, never edited/composited/borrowed), sealed recordings.
  game/ ≤993 files/dirs, ≤48 MiB; index.html ≤1 MiB; screenshots
  3–4, each ≤256 KiB, long side ≤1280, short side ≥480 px;
  dossier ≤1.5 MiB, text ≤160 KiB.
- **Money:** $1,666, 100 places: 1st $500, 2nd $250, 3rd $150,
  4th–10th $38, 11th–25th $10, 26th–50th $6, 51st–100th $4.
  Entries close 2026-11-24T15:00:00Z (24 Nov 23:00 WITA);
  result due 10 Dec 23:00 WITA.

### Live top-5 analysis (leaderboard API + all 5 cover artifacts viewed by THIS builder, 21 Nov ~15:00 WITA, field 8,929)

- **Rates (values.judge, millionths):** #1–#5 TIED at **993,977**
  (99.3977%, 12-0-0, interval [989,470–998,484]). #10 993,343;
  #20 993,343; #50 992,703; **rank-100 prizelist cutoff 992,057**
  (lucky-raven-62, "Solmar Bay"). **OURS: #562, 989,409
  [983,258–995,560], 12-0-0.** Gap to cutoff: **2,648 micro**
  (was 2,726 at the 19 Nov 02:40 gate; the cutoff rose
  989,409 → 990,081 → 992,057 while our judge value never moved —
  rank #265 → #562 is the field growing 6,286 → 8,929, not our
  score falling). Our interval still overlaps the cutoff's
  [986,817–997,296].
- **THE DECIDER IS STILL MARGIN, NOT WINS.** Every top entry is
  12-0-0. Rates differ only by the judge's MARGIN. The field has
  turned over completely since 18 Nov: only klencho survives from
  the old top 5 (now #5); ryanp #2, saputra #9, el-net #11,
  dimdam #10. Four of the current top 5 were received 19 Nov —
  the board rewards FRESH, dense chase covers.
- **Top 5 (cover artifacts downloaded to
  build-v6/top5-r7/rank{1-5}/, each viewed full-size by this builder):**
  - #1 madsrepo "Karimbu, Isle of Embers" 01a1eb7c (received 17 Nov):
    rear chase cam, orange hero car centre-low, cruisers ahead,
    heli top-centre, mission card (MISSION 6, STAGE 3/4, NEXT),
    police table (KPD RESPONSE, 6 units, RAMMING/FLANKING),
    weapon slots + crew ability cards, dialogue with portrait,
    minimap with location name, 111 km/h + car name + condition,
    radio. Bright arcade daylight, beach + palms.
  - #2 hazel-harbor-63 "TANGERINE MILE" 01a1f2a4 (19 Nov 07:10):
    rear chase cam on a beachfront avenue, red hero car, white
    cruiser RIGHT ON THE HERO'S TAIL (RAMMING 6 m), heli distant
    with its beam as a light pool on the road, police table right
    (RAMMING/PURSUIT/RESPONDING + distances), wanted stars,
    day/time, health/armour/respect bars, weapon slots, dialogue
    with police portrait, circular minimap, 73 km/h + car name +
    condition + radio. Orange sunset. The tailgating cruiser is
    what makes the pursuit read — the chaser is BEHIND the hero,
    not ahead of it.
  - #3 tidy-orca-63 "BRISA BAY" 01a1f2eb (19 Nov 08:28): rear chase
    cam on a bridge, red hero car, heli ABOVE with a HUGE white
    searchlight cone slanting onto the road ahead, dispatch table
    (RAMMING 7 m/13 m, SPOTLIGHT, CLOSING IN, ROADBLOCK + "+1 more
    unit · roadblock ahead"), explosion + cruisers at the roadblock
    ahead, weapon slots, "IN SIGHT — Air One has you in the
    light", circular minimap, health/armour, REP rank, dialogue
    with portrait, car name + condition + 61 MPH, radio. The beam
    cone is the single most legible pursuit signal in the top 5.
  - #4 plntky "LUMEN BAY" 01a1f3b8 (19 Nov 12:12): rear chase cam,
    red hero car centre, TWO cruisers FLANKING AT THE HERO'S REAR
    QUARTERS (left + right, light bars flashing, both large at the
    frame edges), heli top-centre with a BIG beam cone onto the
    road, explosion + roadblock ahead, peds on the sidewalks,
    mission card (timer 0:23, 3/5, NEXT) + crew ability chips,
    dialogue with portrait, weapon slots, 123 km/h + car name +
    condition + armour/health bars, radio, circular minimap with
    streets. Dusk. This frame sells the pursuit with ZERO need to
    read its police table — flankers + beam + explosion do it
    visually. It is the closest thing to a template for our P0,
    adapted to our own staging (not copied).
  - #5 klencho "GOLDEN HOUR KINGS" 01a1f47f (19 Nov 15:48): rear
    chase cam in a downtown canyon, red hero car, BIG heli upper
    frame with rotor, dispatch table (RAMMING 5 m/10 m, SPOTLIGHT,
    FIRING, ROADBLOCK + "+4 more units"), WANTED banner, weapon
    slots, dialogue with portrait, 113 km/h + car name + condition,
    radio, circular minimap with search ring. Purple/orange
    golden hour. The heli is IN the frame and large — ours is not.
- **Principles extracted (NO-COPY — the technique, not the surface):**
  1. The pursuit reads from GEOMETRY, not text: a chaser BEHIND
     the hero (tailgating or at the rear quarters) + a heli beam
     cone slanting onto the road ahead + a roadblock/explosion
     ahead. All five covers stage at least two of the three.
     Ours stages NONE of the three legibly (all cruisers ahead,
     heli off-frame, beam a vertical slab, roadblock dissolved
     into traffic).
  2. HUD density can be icon-first: mission card with number +
     stage + NEXT, car name + condition bar, big speed, radio
     pill, REP bar/rank, weapon slots, dialogue with portrait,
     minimap with location + converging blips. The police table
     is the one element we do NOT adopt (Reza's direction, kept).
  3. The heli must be IN the frame: every top-5 cover shows the
     heli body. Ours shows only its beam. (Measured cause: at
     height 24 m / 26 m orbit radius, the heli sits ~39° above
     the chase camera's horizon while the frame top is ~+18° —
     it cannot appear. P0 must lower it and hold its angle.)
  4. Palette: the top 5 are all COMMITTED warm — tangerine,
     golden hour, dusk orange, purple/orange. Our beige/pale
     facades + pale sky are the outlier (scorecard + teardown
     agree). P2 commits the orange.
  5. A reward moment earns a slot: #2's set (18 Nov study)
     proved MISSION PASSED carries a frame. P1 shoots it as the
     5th frame and lets the evidence decide.
- **Our 4 shipped frames viewed full-size by this builder before
  the revision (21 Nov ~15:00 WITA):** 2-title STRONG, 3-map
  STRONG, 4-combat STRONG except the tracer (a fat white beam
  dominating the frame diagonally — the "overcooked" note in the
  v5 scorecard, confirmed on sight) and a white beacon pillar at
  the left edge; 1-chase MEDIUM (beam a vertical white slab, no
  heli, cruisers ahead read as traffic, the right-hand white car
  cropped and reading as parked, HUD sparse: one-line objective,
  $1,200, 3 stars, dark minimap, speed + ammo only — no mission
  number/stage, no car name/condition, no radio, no REP label).
- **Supersede confirmation:** round 7 is a TARGETED REVISION of
  the standing round-6 entry (01a1f14b, #562, outside the
  prizelist) under Force_Last — intended. It is the cover-fix pass
  the v5 coordinator's verdict explicitly named as the next step
  ("a different staging idea than the flank attempt — a rear-view
  camera with cruisers visibly BEHIND the hero car + the roadblock
  ahead, or a cruiser mid-ram at the hero's quarter panel"), not a
  second rebuild trigger for the same submission and not a
  duplicate: the game code, the judged set's title/map frames, and
  the systems are unchanged; the cover staging, the HUD density,
  the palette commitment, and (if the evidence supports it) one
  frame are revised in-session under recording 01a1fcdf.
- **Not a duplicate:** the revision changes the cover frame (new
  staging, new HUD elements, new palette values), re-shoots all 5
  frames fresh, rewrites the scorecard fresh, and re-gates from
  MQ1. The title/map/combat frames are re-shot on the revised
  code and kept only if they still read STRONG.

## (Round-7 gate sections MQ1–MQ4, MQ6–MQ8 + Gates 0–2 are at the end of this file, after the build record — MQ5 above is the pre-build record.)

## Round-7 build record (P0–P3) — what changed, per item

Baseline before edits: `node playtest.cjs --play` on the v5 code (build-v6 harness, 21 Nov ~15:20 WITA): **28/28 checks PASS, 0 game errors** — then the harness itself failed on the `page.reload` for the Continue test (Navigation timeout 120 s, SwiftShader under a loaded VM). Re-run attempt 2 failed the same way at the FIRST `goto` (concurrent diag Chrome starving it). Lesson: run browser jobs ONE at a time on this VM. The reload timeout was raised to 300 s in the v6 harness copy (build dir only). The 28/28 + the v5 final 30/30 on the same code stand as the baseline; the final `--all` run below must be 30/30.

### P0 — re-stage cover chase (5 diag iterations, all measured)

- **Iteration 1 (rear-quarter, cz+1, ±4.2):** diag JSON: cruisers NDC (-0.54,-0.23) / (0.26,-0.27) — flanks filled the bottom corners; the hero's 2 m rear read smaller than the cruisers' 4.4 m flanks. Frame: heli + beam + mission card + radio + car name + REP all read, speedo 132 — but the hero was buried. REJECTED (diag-chase-r7-v1.jpg).
- **Iteration 2 (flank ahead, cz-4, ±3.6):** hero caught the pair by t=0.47 and pushed it; speedo collapsed to 80 (screenshot) / 97 (diag). REJECTED (r7-v2).
- **Root cause found (read the code, not guessed):** pursuit caps cruisers at `15 + wanted*1.6` = 19.8 m/s, and `player.carVsTraffic` multiplies hero speed by 0.75 EVERY frame while within 3.2 m of a cruiser. Any staged cruiser the hero can reach before the capture kills the speedo. The capture window is load-dependent (t=0.4–1.0), so margins are sized for t=1.0.
- **Iteration 3 (cz-8, same cap):** same failure at t=0.72 (86 km/h, nose-to-tail) — the intercept steering converges the pair onto the hero's line. REJECTED (r7-v3).
- **Fix:** `police.js` gains a per-cruiser staging-only `c.top` override (`const top = c.top ?? topSpeed`); staging sets `top: 34` on the flank pair only. Fresh spawns never set it; `setWanted(0)` clears it — live play unchanged.
- **Iteration 4 (cz-8, ±3.6, top 34):** hero free at 123 (diag) / 137 (screenshot); pair at 28.7 m/s, 6–7 m ahead — but stacked (both x≈-41.3), reading as one dark car. Frame otherwise STRONG. (r7-v4.)
- **Iteration 5 (cz-8, ±5, opposite wobble 0 / π):** hero 137 (diag) / **151 km/h** (screenshot); pair staggered and reading as TWO cruisers (PSPD visible on the left one). Frame STRONG. **FROZEN.** (diag-chase-r7-v5.jpg.)
- Final chase staging: flank pair cz-8, ±5 m, speed 26, top 34, wobble 0/π; ahead pair cz-24/-30; roadblockDist 18; heli angle -π/2-0.45, height 13 m, hold=true, aimAhead 15; cam distScale 0.8, drivePitch 0.12 (new knob, default 0.22, reset in newGame()/continueGame()).
- **HUD density (icon-first, no text police table):** corner mission card (`showMissionCard(..., ms, 'corner')` + CSS, top-left, 30px title); car name + condition bar above the speedo (`#hud-carname`, `hud.setCarName`, game.js passes `carName`/`carCond`); radio re-shown 120 s (`showRadio` ms param); REP rank label under the radar bars (`#hud-replabel`, `hud.setRepLabel`, game.js passes `growth.rank.name`). Chase frame shows: JOB 1/8 · FIRST LIGHT / STAGE 1/2, RADIO SOL 92.5 Sunset Sounds, Solstice GT + green condition bar, RUNNER, 3 stars, $1,200, radar blips converging, Teo subtitle + portrait.
- **Beam + tracer:** heli beam now slants diagonally onto the road with a visible pool (height 13 + aimAhead 15 + hold). Tracer tapered in `shooting.js` (CylinderGeometry 0.012 top / 0.028 muzzle, opacity 0.9) — v5's uniform 0.045 read as a fat white beam.

### P1 — one MISSION PASSED frame (5th shot)

- New staging branch `?shot=passed`: `newGame()` then `game.story.completeStage()` ×2 through the REAL stage machine — the MISSION PASSED card, +$800 / +100 REP, Pistol unlock and autosave are all genuine, not a mock. Ro on foot on the avenue by the safehouse (-40,152, facing the camera), Solstice parked beside her (-36,148), foot camera low in front of her face; bigCard + Teo's win line re-shown 120 s. `5-passed.jpg` added to the shoot list (replaces 5-city). Placement decided from the viewed frames below.

### P2 — palette more committed (orange sunset); varied silhouettes

- `palette.js` (all byte-neutral hex swaps): fog 0xdd8a63→0xe87a45, sunColor 0xffd9a0→0xffc27a, rimColor 0xff9a5c→0xff7a3d, CENTRO facades cool grey-blue→warm dusk mauve, COLINAS cream→warmer sand.
- `structures.js`: `buildDeco` crown step varies by seed (1.0 vs 1.8 m); `buildMarketRow` gains a setback upper floor (60% width, 2.5 m + trim cap) on every third row — inside the base footprint, no new collider. Both deterministic (block seed).

### P3 — file/function name audit (criterion 5)

See the table below. Verdict: **no renames** — every one of the 33 files has a descriptive name matching its single job. The closest overlaps (streetkit vs structures vs skyline vs terrain; growth vs story; world vs game) are distinct jobs, not duplicates.

| File | One job | Name matches? |
|---|---|---|
| boot.js | Entry point: query parsing, game construction, shot wiring, debug hooks | yes |
| brands.js | Brand textures (signs, billboards) | yes |
| camerawork.js | Camera modes (foot/drive/aim/cinematic/title) + boom collision | yes |
| cast.js | Characters + dialogue lines | yes |
| cityplan.js | City layout data: avenues, streets, districts, POIs | yes |
| collectibles.js | Sun Shells + stashes (pickups) | yes |
| controls.js | Keyboard/mouse input | yes |
| crowd.js | Pedestrians: spawn, walk lines, flee alarm | yes |
| enemies.js | Crew enemies: spawn, AI, health | yes |
| facekit.js | Procedural faces (portraits + 3D heads) | yes |
| game.js | Game state machine, loop, missions hooks, HUD wiring, save | yes |
| growth.js | Progression: cash, REP, ranks, unlocks, stats, shells | yes |
| hud.js | All HUD: radar, bars, cards, subtitles, speedo | yes |
| humanoid.js | Humanoid meshes (Ro, peds, crew bodies) | yes |
| landmarks.js | Landmark structures (lighthouse, Ferris wheel, pier, TORRE SOL) | yes |
| menus.js | Title/pause/map/game-over screens | yes |
| palette.js | Colour palette (sky, fog, districts, lights) | yes |
| persistence.js | Save/load (localStorage) | yes |
| player.js | Player: on-foot movement + driving + weapons + rams | yes |
| police.js | Police: cruisers, heli + beam, roadblock, bust timer | yes |
| rng.js | Seeded RNG + math helpers (clamp, damp, turnToward) | yes |
| shooting.js | Aimed fire, tracers, muzzle flash, damage numbers | yes |
| skyline.js | Sky + sun/moon + lights | yes |
| sound.js | Sound: engine, sirens, radio stations, blips | yes |
| staging.js | Screenshot staging (`?shot=...` setups) | yes |
| story.js | Mission data + stage machine | yes |
| streetkit.js | Street props (sidewalks, lamps, signs, hydrants) | yes |
| structures.js | Buildings by district archetype (tower/deco/warehouse/marketRow/villa) | yes |
| surface.js | Shared textures (glow, facade, awning, signs) | yes |
| terrain.js | Ground, beach, water, roads | yes |
| traffic.js | Traffic cars + parked cars | yes |
| vehicles.js | Car classes + meshes (hero, sedan, cruiser, etc.) | yes |
| world.js | World assembly: renderer, scene, layers, colliders, diagnostics | yes |

### Harness notes (build dir only, not submission)

- `diag-chase.cjs` (new): serves the entry on :8093, loads `?shot=chase`, waits the same capture floor as the shoot, dumps projected NDC positions for hero/cruisers/heli/roadblock/traffic + HUD state to `diag-chase-<label>.json` + a JPEG. 5 iterations run (v1–v5). On error it now kills its server (an orphaned serve from the first timed-out run held :8093 until killed by hand).
- `playtest.cjs`: SHOTS 5-city → 5-passed; `page.reload` timeout 120 s → 300 s; `protocolTimeout: 600000` (a busy SwiftShader renderer held one CDP call past the 180 s default on the loaded VM). Assertions unchanged (30).

### Round-7 completion notes (after the build record above)

- **Passed-frame t=4 bug (found by the first full shoot, fixed, verified):**
  the first `--shots` run (final-shots2.log, 5/5 PASS) captured
  5-passed.jpg AFTER t=4 game-s — mission 2 had auto-started,
  `hideBigCard()` ran and `onMissionStart` replaced the subtitle, so
  the frame showed Ro + Solstice + $2,000 but NO "MISSION PASSED"
  card and NO subtitle. Fix (staging.js, `?shot=passed` branch):
  `game.nextMissionT = 999;` right after the two `completeStage()`
  calls — same freeze pattern as the map shot. Verified by
  `diag-passed.cjs` (t=0.47: bigCard show=true, subtitle true) and
  by the single-shot re-shoot (final-shot-passed.log: PASS,
  123,645 B @q82, 8,812 draw calls) — the new frame shows the huge
  gold MISSION PASSED + "+$800 · +100 REP · Pistol" + Teo's win line.
- **Re-shoots under a loaded VM (environmental, not game bugs):**
  re-run 1 (final-shots3.log) failed shot 5 — "screenshot failed 3x"
  (SwiftShader compositor refused the capture on the heaviest page,
  5th in the session); re-run 2 (final-shots4.log) failed shot 4 —
  `ERR_INSUFFICIENT_RESOURCES` loading the game's modules + the
  180 s `__shotReady` wait timed out (34 Chrome processes from other
  sessions, load ~7-8). Fix: `playtest.cjs` gains `--shot=<name>`
  (single-shot mode, fresh browser per shot — build dir only). The
  passed frame was re-shot alone and PASSED. The placed set is:
  1-chase + 2-title from re-run 2, 4-combat from re-run 1,
  3-passed from the single-shot run — all on the final code (the
  `nextMissionT` fix lives only in the `?shot=passed` branch, which
  the other shots never execute).
- **Placement (decided from the viewed frames):** 1-chase, 2-title,
  3-passed, 4-combat. The passed frame displaces the map: the map's
  evidence class (open world + mission list + stats) is partly
  covered by the title ("Eight jobs") and the chase mission card,
  while the passed frame adds a class the set lacked entirely (the
  reward moment) and lifts the weakest v5 category (Rewards 2→2.5).
  The map frame stays as the spare in the build dir. Naming note:
  the plan said "4-passed.jpg" — the evidence decision put the
  passed frame in the map's slot, so it is **3-passed.jpg** and
  combat stays 4-combat.jpg; shots.json updated to match.
- **Play-test final (final-play4.log): 30/30, 0 errors.** The first
  two final runs got 28/28 and died on the Continue step (reload
  wait 120 s, then the reload request itself with
  ERR_INSUFFICIENT_RESOURCES); the third run died at the FIRST load
  the same way. Fix (harness only): the Continue step now closes
  the page and opens a FRESH page in the same browser for the
  reload — localStorage is per-origin, so it is the same Continue
  test — and the `__pds` wait is 300 s. Result: continue enabled
  after save + restores cash/REP/missions/position exactly
  (saved={cash:4981, rep:550, done:[borrowed-wheels, dockside,
  first-light], x:84, z:-116} restored identical).
- **Determinism + dossier (21 Nov ~09:20 UTC):** main.ts (node22)
  twice into two fresh output dirs → **byte-identical** (diff -r
  clean). Dossier text **163,809 B** (cap 163,840 — 31 B headroom);
  dossier.json 768,776 B (cap 1.5 MiB). Cut still inside facekit.js
  (166/263 lines shown; 15 files + 138,900 B left out). The text
  sits at the cap by design (the builder fills to it); the round-7
  growth in the shown files (index.html +161 B, game.js, structures.js)
  shrank facekit's shown head by ~30 lines — no cap risk.
- **Scorecard:** deleted + rewritten fresh (scorecard.md, 13,243 B):
  **2.45 avg** (v5: 2.30), zero automatic failures. PIL metrics on
  the placed frames: chase 6.39/0.110/62.4/0.144, title
  7.18/0.038/53.9/0.147, passed 6.80/0.109/58.4/0.179, combat
  5.83/0.166/60.2/0.127.
- **Gate 1 (below):** OpenRouter nemotron-3-ultra-550b-a55b:free,
  PASS, no findings, 14,099 tokens, cost $0. Gemini text/copy
  SKIPPED — 3 attempts (2.5-flash 404 retired; 3.8-flash hung 120 s,
  then errored) — recorded gap, NOT a FAIL.
- **Tree verification (before the push):** fresh clone of
  RieryBuild/makefun-gta6-01-v5 @ d12dfb7f; diff vs the working tree
  shows EXACTLY the 10 game files + gate-run.md changed (the round-7
  set) and nothing else. The full unified diff is in
  build-v6/round7-diff.txt (+217/-62 lines).

## MQ1 (round 7): Can this entry be submitted RIGHT NOW, end to end? — PASS

1. Competition: gta6-01 — entries close 2026-11-24T15:00:00Z
   (re-read fresh 21 Nov ~15:00 WITA, unchanged; ~3 days ahead).
2. Deliverables: game/ 40 files, 956,667 B; index.html 5,346 B;
   screenshots 4 × ≤256 KiB (108,103 / 118,493 / 123,645 / 99,652 B);
   shots.json (1-chase, 2-title, 3-passed, 4-combat); LICENSE,
   .makefun/owner.json (6do8), serve.ts, README.md, scorecard.md
   (2.45), main.ts (unchanged this round — the dossier is built from
   game/ sources only). The round-7 commit is a NEW commit (the
   10 changed game files + shots.json + screenshots + scorecard.md +
   this gate record) — the builder pushes it via the PAT route and
   records the remote HEAD; the coordinator seals + submits.
3. Checks: every applying check met — play-test 30/30, 0 errors on
   the final code (MQ6); determinism byte-identical; dossier text
   163,809 B ≤ 163,840; dossier.json 768,776 B ≤ 1.5 MiB;
   screenshots viewed full-size. No "probably".
4. Submit path: coordinator submits via the kit CLI with the new
   commit SHA + all SIX recordings (the five sealed v5 ones +
   the live round-7 01a1fcdf, sealed by the coordinator after this
   session). Builder does not submit (STOP after gate PASS).
5. Cost: time ~10 min to submit; capital $0.

## MQ2 (round 7): Does this entry clear the competition's bar? — PASS

- The round-7 entry is the standing v5 (judge 989,409, 12W-0L, rank
  #562/8,929 at 21 Nov ~15:00 WITA, cutoff #100: 992,057) with a
  targeted revision: the cover pursuit now reads (Obstacles 2→2.5),
  the judged set gains the reward moment (Rewards 2→2.5), the
  palette is more committed (Art direction 2→2.5) — scorecard 2.45
  vs v5's 2.30, zero automatic failures. The bar analysis from the
  v5 gate stands, strengthened. No grade is quoted as a promised
  outcome.

## MQ3 (round 7): Is the submission window actually open for this account? — PASS

- Quota via the kit CLI (`status --competition gta6-01 --json`,
  21 Nov ~15:00 WITA, re-read fresh for MQ5): **can_submit true**;
  day cap 5, taken 0, left 5 (resets 2026-11-22T00:00:00Z); hard
  limit max 40, left 34; entries_made 6, entries_kept 3.
  Deadline 2026-11-24T15:00:00Z is ~3 days ahead.
- Read-only check only — NO submit was attempted by this session.

## MQ4 (round 7): Is the entry signed by the right identity, through the right route? — PASS (unchanged)

- Wallet 6do8 ONLY (.makefun/owner.json, untouched). The round-7
  commit is pushed via the GitHub PAT route by this builder (this
  session pushes — the task orders it, changed files only, then
  verifies the tree); the coordinator seals + submits. No other
  wallet, no other route. NEVER `git push` from the local repo
  (its root commit a83983e holds only main.ts + gate-run.md).

## MQ6 (round 7): Can you prove the entry works — beyond "it should work"? — PASS

- Play-test on the FINAL code: 30/30, 0 errors (final-play4.log,
  build dir). All 28 gameplay checks pass on the first run too
  (final-play.log: m1 $800+100 REP, m2 $1,200, rifle kill at 30 m,
  m3 $2,500 + 4×$50 bounties, REP+250, rank RUNNER, Sun Shell +$100,
  waterline clamp, pause/map, BUSTED 10% fine, WASTED 10% bill);
  the Continue step is proven in the final run (restores exactly).
- Determinism byte-identical (main.ts twice); dossier text
  163,809 B ≤ cap; screenshots placed fresh and viewed full-size;
  scorecard 2.45, zero automatic failures.
- The two failed intermediate runs (final-play2/3.log) are
  environmental only (ERR_INSUFFICIENT_RESOURCES on the reload /
  first load under a loaded VM) — the game code is untouched by
  the harness fixes, and the final run is 30/30.

## MQ7 (round 7): Is this entry on the never-submit list? — PASS (no match)

- No code-drawn images (screenshots are real renders of the game).
- main.ts unchanged this round, stdlib-only (readdirSync is node:fs).
- Recording 01a1fcdf-790a-7789-ac8d-802d0d43fa84 started 21 Nov
  14:51 WITA — BEFORE this session's first build action (first
  entry-dir write ~15:20 WITA); in-session revision present (the
  P0–P3 edits + this gate record).
- Wallet 6do8 only; repo via the PAT route (MQ4). No claim codes
  anywhere (none issued for round 7; none in the repo/chat/
  transcript). No secrets in the repo (grep clean at gate time:
  no API keys, no private keys, no tokens; the only wallet address
  in the tree is owner.json's 6do8).
- can_submit true, 5 left today (MQ3). Entry needs no capital ($0).
- No grade quoted as a promised outcome (MQ2).
- Not a duplicate (MQ5). Visual change present — the scorecard +
  frames were re-verified this round (Gate 3, parent decides).

## MQ8 (round 7): Session check — PASS (sixth session, covered)

1. Round-7 session ecd86ab2-ea6b-4ec7-b139-e3f1270b202b /
   recording 01a1fcdf-790a-7789-ac8d-802d0d43fa84 — P0–P3 revision +
   this gate record. The five earlier recordings (01a1eeef,
   01a1ef13, 01a1efa5, 01a1efdb, 01a1f136) remain sealed and listed;
   round 7 lists all SIX (coverage is the union).
2. Recording start 2026-11-21T14:51 WITA — BEFORE this session's
   first build action (first entry-dir write ~15:20 WITA).
3. First action: reading the brief + live top-5 (MQ5, recorded
   before any build writes).
4. Coverage: recording LIVE through the whole revision (PID 19722,
   checked alive before the final entry-dir writes — 02:44:20
   elapsed at the last check). Seal is the coordinator's job after
   this session completes cleanly.
5. In-session revision: the P0–P3 edits + screenshots + scorecard +
   this gate record are all in-session. thinking_revised is met.

## Gate 0 (round 7): Reality — PASS

- [x] Entry passes its play-test (30/30, 0 errors) on the final
  code (MQ6).
- [x] Every deliverable from /requirements is in the tree (MQ1).
- [x] Evidence captured: play-test logs (28/28 + 30/30 final),
  determinism diff, dossier measurement, fresh-clone tree diff,
  quota response, Gate 1 raw exchange (build/gate1-review.log),
  Gemini skip log (build/gemini-copy-review.log), PIL metrics
  (build/scorecard-metrics-final.log), diag iterations (build/
  diag-chase-r7-v1..v5.jpg + diag-passed-v1.jpg).
- [x] Repo push: this builder pushes via the PAT route (changed
  files only) and records the new remote HEAD below; the
  coordinator verifies it before submit.

## Gate 1 (round 7): Quality — PASS

- [x] Multi-model review done — review of the FULL round-7 diff
  (10 files, +217/-62 lines, build/round7-diff.txt):
  code/reasoning reviewed by nvidia/nemotron-3-ultra-550b-a55b:free
  via OpenRouter (custom.openrouter helper; GET /models re-checked
  first — 441 models, 11 :free, nemotron still listed), cost $0,
  14,099 tokens (10,123 prompt / 3,976 completion; raw in
  build/gate1-review.log). Verdict PASS, no findings raised: all
  staging knobs are set only by staging.js and reset to v5 defaults
  in both newGame() and continueGame(); the passed shot completes
  mission 1 via the real story machine and freezes nextMissionT=999;
  chase geometry (8 m flank lead, top=34, opposite wobble) keeps
  cruisers outside the 3.2 m collision radius through t=1.0;
  structures.js crown/setback changes stay inside base footprints;
  HUD additions match the new DOM elements with proper visibility
  toggling and no timer leaks; palette.js is hex-only.
  - Gemini text/copy review SKIPPED — 3 attempts, all failed:
    gemini-2.5-flash generateContent → HTTP 404 (model retired);
    gemini-3.8-flash → hung past the 120 s client timeout, then
    errored on the 300 s retry (traceback truncated by the helper).
    The models endpoint itself answers (GET /v1beta/models lists
    gemini-3.8-flash). Gap recorded here; per the house rule that
    is NOT a Gate 1 FAIL. The copy changed only in HUD strings
    already visible in the viewed frames (mission card, radio pill,
    passed card), and the OpenRouter review covered the code that
    renders them.
- [x] The review exchange is recorded (model, verdict, findings)
  here and as raw JSON in the build dir.
- [x] Practice grade N/A (judged/visual competition) — the evidence
  is the top-5 study + review + scorecard, stated as evidence, never
  a promised outcome (MQ2).
- [x] Feed-first study done for this revision (MQ5 round 7): live
  top-5 analysis + principles, recorded before any build writes.

## Gate 2 (round 7): Dedup — PASS

- [x] Not a duplicate of the standing entry (MQ5) — this is a
  targeted revision of the standing v5 entry under Force_Last;
  the supersede is intended (round 7 replaces round 6's 01a1f14b).
- [x] Rebuild-once rule respected: this is a revision, not a
  rebuild — targeted edits only, no file re-typed (the v3 failure
  mode is avoided by construction; the diff is +217/-62 lines
  across 10 files, with no whole-file rewrites).
- [x] Quota re-checked at gate time via the competition's own
  endpoint (MQ3: can_submit true, 5 left today, 34 under hard limit).

## Gate 3 (round 7): Submission quality — PARENT DECIDES (Reza audit; visual change present)

- [x] README matches the requirements template (unchanged).
- [x] Entry message + signature use wallet 6do8 only; repo via PAT route (MQ4).
- [x] Claim-code handling confirmed: no claim codes issued for
  round 7; none in the repo, chat, or transcripts.
- [x] No secrets in the repo (grep clean at gate time).
- [x] Deadline still ahead at submit time (~3 days, MQ1/MQ3).
- [ ] Reza visual audit — FRESH ROUND NEEDED: game/ and
  screenshots/ CHANGED this round (cover re-stage, new passed
  frame, palette, silhouettes). The parent decides whether Reza
  audits the new frames before submit. The builder's evidence:
  all four placed frames viewed full-size this round + scorecard
  2.45 + 30/30 play-test.

## Decision (Round 7)

- **GATE PASS** (MQ1–MQ8 + Gates 0–2). The builder STOPs here:
  no seal, no submit — the coordinator seals + submits.
- Remote HEAD after the PAT push: (filled in by the push step below).
- The round-7 session completes cleanly with a prompt so the
  usage row is written.
