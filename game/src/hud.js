// The HUD — icon-first, per the GTA law (dossier §2): icons, bars, and
// bare numbers. Text appears ONLY transiently — an objective when it
// changes, a subtitle while someone speaks, a name when you enter a
// place — and then it leaves. Target: 0 permanent text panels, <=10
// words on screen in a typical frame.
//
// Layout (1280x720): radar bottom-left (160px, circular, with 3 bare
// bars under it), money + stars top-right, weapon silhouette + bare
// ammo bottom-right, speed above it while driving, transient objective
// top-left, transient subtitle bottom-center, transient name cards
// bottom-right. Police presence = stars + radar blips + flashing rim.
// There is NO text police table, ever.

import { AVENUES, STREETS, WORLD, POIS } from './cityplan.js';
import { DISTRICTS } from './palette.js';
import { WEAPONS } from './shooting.js';
import { makePortrait } from './facekit.js';
import { CAST } from './cast.js';

const RADAR_R = 80;      // radar radius px
const RADAR_RANGE = 130; // metres shown across the radar

function el(id) { return document.getElementById(id); }

export class Hud {
  constructor() {
    this.radar = el('radar');
    this.rctx = this.radar.getContext('2d');
    this.moneyEl = el('hud-money');
    this.starsEl = el('hud-stars');
    this.healthEl = el('bar-health');
    this.armorEl = el('bar-armor');
    this.repEl = el('bar-rep');
    this.weaponIcon = el('weapon-icon');
    this.ammoEl = el('hud-ammo');
    this.speedEl = el('hud-speed');
    this.objectiveEl = el('hud-objective');
    this.helpEl = el('hud-help');
    this.subtitleEl = el('hud-subtitle');
    this.namecardEl = el('hud-namecard');
    this.radioEl = el('hud-radio');
    this.popupEl = el('hud-popup');
    this.missionCardEl = el('hud-missioncard');
    this.bigCardEl = el('hud-bigcard');
    this.repFloatEl = el('hud-repfloat');
    this.carNameEl = el('hud-carname');
    this.repLabelEl = el('hud-replabel');
    this.slotsEl = el('weapon-slots');
    this.slotsCtx = this.slotsEl?.getContext('2d') || null;
    this.locationEl = el('hud-location');
    this.timerEl = el('hud-timer');
    this.timers = {};
    this.flashDamageUntil = 0;
    this.portraits = {};
    for (const [id, c] of Object.entries(CAST)) {
      this.portraits[id] = makePortrait(c);
    }
    this.buildRadarBase();
    this.drawWeaponIcon('pistol');
  }

  // Static radar background: roads + water + beach, drawn once.
  buildRadarBase() {
    const c = document.createElement('canvas');
    c.width = 400; c.height = 340;
    const g = c.getContext('2d');
    const sx = (x) => (x - WORLD.minX) / (WORLD.maxX - WORLD.minX) * 400;
    const sz = (z) => (z - WORLD.minZ) / (WORLD.maxZ - WORLD.minZ) * 340;
    g.fillStyle = '#2a2438';
    g.fillRect(0, 0, 400, 340);
    g.fillStyle = '#3a6a8a'; // water
    g.fillRect(0, sz(168), 400, 340 - sz(168));
    g.fillRect(sx(200), 0, 400 - sx(200), 340);
    g.fillStyle = '#c8a86a'; // beach
    g.fillRect(0, sz(168), 400, 8);
    g.strokeStyle = '#6a6478';
    g.lineWidth = 3;
    for (const ax of AVENUES) { g.beginPath(); g.moveTo(sx(ax), 0); g.lineTo(sx(ax), 340); g.stroke(); }
    for (const st of STREETS) { g.beginPath(); g.moveTo(0, sz(st)); g.lineTo(400, sz(st)); g.stroke(); }
    this.radarBase = c;
  }

  // Per-frame radar: clip to the disc, translate the base so the player
  // is centred, draw blips, the player arrow, the N marker, and the rim.
  drawRadar(state) {
    const g = this.rctx;
    const S = 160;
    g.clearRect(0, 0, S, S);
    g.save();
    g.beginPath();
    g.arc(RADAR_R, RADAR_R, RADAR_R - 2, 0, Math.PI * 2);
    g.clip();
    // Base: scale so RADAR_RANGE metres span the disc.
    const scale = (S / RADAR_RANGE) * (400 / (WORLD.maxX - WORLD.minX)) * 2;
    const bx = (state.x - WORLD.minX) / (WORLD.maxX - WORLD.minX) * 400;
    const bz = (state.z - WORLD.minZ) / (WORLD.maxZ - WORLD.minZ) * 340;
    const w = 400 * scale, h = 340 * scale;
    g.drawImage(this.radarBase, RADAR_R - bx * scale, RADAR_R - bz * scale, w, h);
    const px = (x) => RADAR_R + (x - state.x) * (S / RADAR_RANGE);
    const pz = (z) => RADAR_R + (z - state.z) * (S / RADAR_RANGE);
    // Search ring (hidden from the police): the area they are sweeping.
    if (state.searchActive) {
      g.strokeStyle = 'rgba(255,80,80,0.7)';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(RADAR_R, RADAR_R, 60 * (S / RADAR_RANGE), 0, Math.PI * 2);
      g.stroke();
    }
    // Mission marker: gold diamond, big enough to read at a glance.
    if (state.missionTarget) {
      const mx = px(state.missionTarget.x), mz = pz(state.missionTarget.z);
      g.fillStyle = '#ffd700';
      g.strokeStyle = '#ffffff';
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(mx, mz - 8); g.lineTo(mx + 7, mz); g.lineTo(mx, mz + 8); g.lineTo(mx - 7, mz);
      g.closePath(); g.fill(); g.stroke();
    }
    // POI blips (small, only the nearest few matter at this zoom).
    for (const p of POIS) {
      const x = px(p.x), z = pz(p.z);
      if (x < 0 || x > S || z < 0 || z > S) continue;
      g.fillStyle = p.kind === 'safehouse' ? '#2ecc71' : p.kind === 'police' ? '#4a90d9' : '#c8c8c8';
      g.beginPath(); g.arc(x, z, 2.5, 0, Math.PI * 2); g.fill();
    }
    // Police blips: big flashing red/blue dots with a white ring, plus
    // a short leader line toward the player arrow — the convergence
    // reads at a glance instead of a scatter of specks.
    const flash = Math.floor(performance.now() / 250) % 2 === 0;
    for (const b of state.policeBlips || []) {
      const x = px(b.x), z = pz(b.z);
      if (x < 0 || x > S || z < 0 || z > S) continue;
      g.strokeStyle = 'rgba(255,68,68,0.55)';
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(x, z);
      g.lineTo(RADAR_R + (x - RADAR_R) * 0.55, RADAR_R + (z - RADAR_R) * 0.55);
      g.stroke();
      g.fillStyle = b.kind === 'heli' ? '#ff4444' : (flash ? '#ff4444' : '#4488ff');
      g.beginPath(); g.arc(x, z, b.kind === 'heli' ? 7 : 5.5, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#ffffff';
      g.lineWidth = 1.5;
      g.stroke();
    }
    // Enemy blips: red dots.
    for (const b of state.enemyBlips || []) {
      const x = px(b.x), z = pz(b.z);
      if (x < 0 || x > S || z < 0 || z > S) continue;
      g.fillStyle = '#ff2222';
      g.beginPath(); g.arc(x, z, 3.5, 0, Math.PI * 2); g.fill();
    }
    // Player arrow: white, rotated to the heading.
    g.save();
    g.translate(RADAR_R, RADAR_R);
    g.rotate(state.heading || 0);
    g.fillStyle = '#ffffff';
    g.strokeStyle = '#14101c';
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(0, -8); g.lineTo(5.5, 6); g.lineTo(0, 3); g.lineTo(-5.5, 6);
    g.closePath(); g.fill(); g.stroke();
    g.restore();
    g.restore();
    // Rim: flashes red on damage, red/blue while wanted.
    const now = performance.now();
    let rim = 'rgba(255,255,255,0.35)';
    if (now < this.flashDamageUntil) rim = '#ff2222';
    else if (state.wanted > 0) rim = flash ? '#ff4444' : '#4488ff';
    g.strokeStyle = rim;
    g.lineWidth = 3;
    g.beginPath();
    g.arc(RADAR_R, RADAR_R, RADAR_R - 2, 0, Math.PI * 2);
    g.stroke();
    // N marker on the rim.
    g.fillStyle = '#ffffff';
    g.font = '700 11px Arial, sans-serif';
    g.textAlign = 'center';
    g.fillText('N', RADAR_R, 13);
  }

  flashDamage() { this.flashDamageUntil = performance.now() + 350; }

  setMoney(n) { this.moneyEl.textContent = '$' + n.toLocaleString('en-US'); }

  setStars(n) {
    let html = '';
    for (let i = 0; i < 5; i++) {
      html += `<span class="star ${i < n ? 'on' : 'off'}">\u2605</span>`;
    }
    this.starsEl.innerHTML = html;
    this.starsEl.style.visibility = n > 0 ? 'visible' : 'hidden';
  }

  setBars(health, armor, repFrac) {
    this.healthEl.style.width = Math.max(0, health) + '%';
    this.healthEl.classList.toggle('low', health < 25);
    this.armorEl.style.width = Math.max(0, armor) + '%';
    this.armorEl.parentElement.style.visibility = armor > 0 ? 'visible' : 'hidden';
    this.repEl.style.width = Math.max(0, Math.min(100, repFrac * 100)) + '%';
  }

  // Weapon silhouette shapes, drawn at offset (ox, oy) and scale s —
  // shared by the big weapon icon and the slots strip below.
  drawWeaponShape(g, kind, ox, oy, s) {
    const r = (x, y, w, h) => g.fillRect(ox + x * s, oy + y * s, w * s, h * s);
    if (kind === 'rifle') {
      r(8, 20, 62, 8); r(70, 22, 20, 4); r(18, 28, 7, 12);
      r(42, 28, 6, 14); r(2, 16, 10, 10); r(34, 14, 12, 5);
    } else if (kind === 'smg') {
      r(14, 20, 48, 9); r(62, 22, 14, 4); r(22, 29, 7, 12);
      r(44, 29, 6, 16); r(6, 16, 10, 9);
    } else if (kind === 'pistol') {
      r(24, 18, 44, 8); r(30, 26, 9, 16); r(60, 14, 6, 4);
    } else { // fists
      g.beginPath(); g.arc(ox + 34 * s, oy + 24 * s, 13 * s, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(ox + 62 * s, oy + 24 * s, 13 * s, 0, Math.PI * 2); g.fill();
    }
  }

  // Weapon silhouette: a small canvas drawing per weapon, white on
  // transparent — an icon, never a text label.
  drawWeaponIcon(kind) {
    const c = this.weaponIcon;
    const g = c.getContext('2d');
    g.clearRect(0, 0, 96, 48);
    g.fillStyle = '#ffffff';
    this.drawWeaponShape(g, kind, 0, 0, 1);
    this.weaponIcon.dataset.kind = kind;
  }

  // Weapon slots: the four weapons as a GTA-style strip — number,
  // silhouette, current slot gold-bordered, locked slots dimmed with
  // a padlock. Never a text list.
  drawWeaponSlots(current, unlocked) {
    const g = this.slotsCtx;
    if (!g) return;
    const order = ['fists', 'pistol', 'smg', 'rifle'];
    const W = 48, H = 40, GAP = 4;
    g.clearRect(0, 0, 204, 44);
    g.font = '700 11px Arial, sans-serif';
    g.textAlign = 'center';
    order.forEach((kind, i) => {
      const x = i * (W + GAP);
      const isCurrent = kind === current;
      const isOpen = !unlocked || unlocked.has(kind);
      g.fillStyle = isCurrent ? 'rgba(245,197,24,0.25)' : 'rgba(10,8,18,0.6)';
      g.fillRect(x, 4, W, H);
      g.strokeStyle = isCurrent ? '#f5c518' : 'rgba(255,255,255,0.35)';
      g.lineWidth = isCurrent ? 2 : 1;
      g.strokeRect(x + 0.5, 4.5, W - 1, H - 1);
      g.fillStyle = isCurrent ? '#ffd700' : 'rgba(255,255,255,0.85)';
      g.fillText(String(i + 1), x + 9, 15);
      g.save();
      g.globalAlpha = isOpen ? 1 : 0.3;
      g.fillStyle = '#ffffff';
      this.drawWeaponShape(g, kind, x + 2, 6, 0.42);
      g.restore();
      if (!isOpen) { // padlock: shackle arc + body.
        g.strokeStyle = '#ffffff';
        g.lineWidth = 1.5;
        g.beginPath(); g.arc(x + 36, 26, 5, Math.PI, 0); g.stroke();
        g.fillStyle = '#ffffff';
        g.fillRect(x + 30, 26, 12, 9);
      }
    });
  }

  setAmmo(mag, reserve, infinite) {
    this.ammoEl.textContent = infinite ? '\u221E' : `${mag} / ${reserve}`;
  }

  setSpeed(kmh, driving) {
    if (!driving) { this.speedEl.style.visibility = 'hidden'; return; }
    this.speedEl.style.visibility = 'visible';
    this.speedEl.innerHTML = `${Math.round(kmh)}<span>km/h</span>`;
  }

  // Vehicle name + condition, shown above the speedo while driving.
  // Icon-first: the name is text (the car model is the identity) and
  // the condition is a thin bar, no extra labels.
  setCarName(name, condFrac, driving) {
    if (!driving || !name) { this.carNameEl.style.visibility = 'hidden'; return; }
    this.carNameEl.style.visibility = 'visible';
    const t = this.carNameEl.querySelector('#hud-carname-text');
    if (t && t.textContent !== name) t.textContent = name;
    const b = this.carNameEl.querySelector('#bar-carcond');
    if (b) b.style.width = `${Math.round(condFrac * 100)}%`;
  }

  // REP rank label under the radar REP bar, with the bare REP number
  // (e.g. RUNNER · 500 REP) — a rank is a name plus a number.
  setRepLabel(rank, rep) {
    if (!rank) return;
    const text = rep != null ? `${rank} · ${rep} REP` : rank;
    if (this.repLabelEl.textContent !== text) this.repLabelEl.textContent = text;
  }

  // Location pill above the radar: district + day + clock (e.g.
  // MERCADO · DAY 1 · 18:24). Persistent, updated only on change.
  setLocation(districtId, day, time) {
    if (!this.locationEl || !districtId) return;
    const name = (DISTRICTS[districtId]?.name || districtId).toUpperCase();
    const text = `${name} · DAY ${day} · ${time}`;
    if (this.locationEl.dataset.text !== text) {
      this.locationEl.dataset.text = text;
      this.locationEl.innerHTML = `${name} · <span class="loc-time">DAY ${day} · ${time}</span>`;
    }
  }

  // Race countdown (M:SS), visible only while a race stage runs.
  setTimer(raceT) {
    if (!this.timerEl) return;
    if (!raceT || raceT <= 0) {
      this.timerEl.style.visibility = 'hidden';
      return;
    }
    const m = Math.floor(raceT / 60), s = Math.floor(raceT % 60);
    const text = `${m}:${String(s).padStart(2, '0')}`;
    if (this.timerEl.textContent !== text) this.timerEl.textContent = text;
    this.timerEl.style.visibility = 'visible';
  }

  // Transient helpers: show, then fade after `ms`.
  transient(elm, html, ms, key) {
    elm.innerHTML = html;
    elm.classList.add('show');
    clearTimeout(this.timers[key]);
    this.timers[key] = setTimeout(() => elm.classList.remove('show'), ms);
  }

  showObjective(text, color = '#ffd700', ms = 5000) {
    this.transient(this.objectiveEl,
      `<span class="obj-sq" style="background:${color}"></span>${text}`, ms, 'obj');
  }

  showHelp(text) { this.transient(this.helpEl, text, 4000, 'help'); }

  showSubtitle(speakerId, text, ms = 4500) {
    const c = CAST[speakerId];
    const portrait = c ? `<img src="${this.portraits[speakerId]}" alt="">` : '';
    const name = c ? `<b style="color:${c.bg === '#7a2e3e' ? '#ff9a8a' : '#ffd27a'}">${c.call}:</b> ` : '';
    this.transient(this.subtitleEl, `${portrait}<span>${name}${text}</span>`, ms, 'sub');
  }

  showNameCard(name, sub) {
    this.transient(this.namecardEl,
      `<div class="nc-name">${name}</div>${sub ? `<div class="nc-sub">${sub}</div>` : ''}`, 4000, 'nc');
  }

  showRadio(station, track, ms = 4000) {
    this.transient(this.radioEl,
      `<span class="radio-mark">\u266A</span><b>${station.name}</b><i>${track}</i>`, ms, 'radio');
  }

  showPopup(text, color = '#f5c518', ms = 2000) {
    this.transient(this.popupEl, `<span style="color:${color}">${text}</span>`, ms, 'pop');
  }

  // pos 'corner' docks the card top-left at a smaller size, so a
  // staged chase frame can show the mission brief without the centred
  // card covering the pursuit. Live play always uses the centred card.
  showMissionCard(title, sub, ms = 3000, pos) {
    this.missionCardEl.classList.toggle('corner', pos === 'corner');
    this.transient(this.missionCardEl,
      `<div class="mc-title">${title}</div><div class="mc-sub">${sub}</div>`, ms, 'mc');
  }

  hideMissionCard() {
    this.missionCardEl.classList.remove('show');
    this.missionCardEl.classList.remove('corner');
    clearTimeout(this.timers.mc);
  }

  showRepFloat(n) {
    this.transient(this.repFloatEl, `+${n} REP`, 2000, 'rep');
  }

  showBigCard(html, ms = 3500) {
    this.bigCardEl.innerHTML = html;
    this.bigCardEl.classList.add('show');
    clearTimeout(this.timers.big);
    this.timers.big = setTimeout(() => this.bigCardEl.classList.remove('show'), ms);
  }

  hideBigCard() {
    this.bigCardEl.classList.remove('show');
    clearTimeout(this.timers.big);
  }

  // Full per-frame HUD refresh from the game state.
  update(state) {
    this.drawRadar(state);
    this.setMoney(state.cash);
    this.setStars(state.wanted);
    this.setBars(state.health, state.armor, state.repFrac);
    if (state.weapon !== this._weapon) {
      this._weapon = state.weapon;
      this.drawWeaponIcon(state.weapon);
    }
    const slotKey = state.weapon + '|' + [...(state.unlocked || [])].sort().join(',');
    if (slotKey !== this._slots) {
      this._slots = slotKey;
      this.drawWeaponSlots(state.weapon, state.unlocked);
    }
    const w = WEAPONS[state.weapon];
    this.setAmmo(state.mag, state.reserve, !isFinite(w.mag));
    this.setSpeed(state.speedKmh, state.driving);
    this.setCarName(state.carName, state.carCond, state.driving);
    this.setRepLabel(state.rank, state.rep);
    this.setLocation(state.district, state.day, state.time);
    this.setTimer(state.raceT);
  }
}
