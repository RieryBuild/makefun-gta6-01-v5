// Procedural canvas textures. Every surface in the game is textured —
// no flat-color architecture anywhere (house rule §5). All textures are
// generated at boot from the palette, so the game ships zero image assets.
//
// THE RECTANGLE RULE: billboard textures (cloud, glow, flash, smoke)
// MUST fade to alpha 0 at ALL edges (radial gradient) with
// depthWrite:false, or a hard edge reads as a floating rectangle.
// makeGlowTexture is the only sanctioned glow source.

import { Rng, hashStr } from './rng.js';

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function toTexture(c, repeat) {
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  t.anisotropy = 4;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  return t;
}

function hex(n) { return '#' + n.toString(16).padStart(6, '0'); }

// --- The sanctioned glow: radial gradient, alpha 0 at every edge. -----
// `stops` are [offset, color, alpha] triplets; the last stop is always
// forced to alpha 0 at offset 1 so the quad's bounds can never show.
export function makeGlowTexture(stops, size = 256) {
  const [c, g] = canvas(size, size);
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col, a] of stops) grad.addColorStop(o, rgba(col, a));
  grad.addColorStop(1, rgba(stops[stops.length - 1][1], 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return toTexture(c);
}

function rgba(n, a) {
  const r = (n >> 16) & 255, gg = (n >> 8) & 255, b = n & 255;
  return `rgba(${r},${gg},${b},${a})`;
}

// Soft cloud puff: several overlapping radial blobs, each feathered to
// alpha 0, on a canvas whose own corners stay fully transparent. The
// puff never touches the canvas edge, so no straight edge can appear.
export function makeCloudTexture(seed, lit = 0xffc9a3, shade = 0x7a4a7d) {
  const rng = new Rng(seed);
  const [c, g] = canvas(256, 128);
  const blobs = 7;
  for (let i = 0; i < blobs; i++) {
    const x = 40 + rng.range(0, 176), y = 48 + rng.range(-14, 26);
    const r = rng.range(26, 52);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const col = i % 2 ? lit : shade;
    grad.addColorStop(0, rgba(col, 0.55));
    grad.addColorStop(0.6, rgba(col, 0.28));
    grad.addColorStop(1, rgba(col, 0));
    g.fillStyle = grad;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  return toTexture(c);
}

// --- Facades: aligned window grids, one palette per building. ---------
// Window logic (the Rubik's fix): windows sit on a strict grid; the lit
// pattern has a REASON — ground floor is shops (mostly lit), the top
// floor is penthouse (lit), middle floors light in horizontal bands
// (whole floors on or off, never scattered dice). A building's windows
// share one glass colour and one lit colour.
export function makeFacadeTexture(opts) {
  const {
    base, trim, glass, glassLit, cols = 6, rows = 8,
    seed = 1, shopfront = false, banding = true,
  } = opts;
  const W = 256, H = 512;
  const [c, g] = canvas(W, H);
  const rng = new Rng(hashStr('facade' + seed));
  g.fillStyle = hex(base);
  g.fillRect(0, 0, W, H);
  // Subtle vertical grime + panel seams — texture, not flat colour.
  for (let x = 0; x < W; x += 4) {
    g.fillStyle = `rgba(0,0,0,${rng.range(0, 0.05)})`;
    g.fillRect(x, 0, 2, H);
  }
  g.fillStyle = hex(trim);
  g.fillRect(0, 0, W, 8);            // cornice
  g.fillRect(0, H - 6, W, 6);        // plinth
  const marginX = 18, gapX = 10, gapY = 14;
  const winW = (W - marginX * 2 - gapX * (cols - 1)) / cols;
  const topY = shopfront ? 96 : 28;
  const winH = 26;
  const rowH = (H - topY - 20 - winH) / Math.max(1, rows - 1);
  // Lit-floor decision: whole floors, decided once per floor.
  const litFloor = [];
  for (let r = 0; r < rows; r++) {
    if (r === 0) litFloor.push(true);                    // penthouse lit
    else if (banding) litFloor.push(rng.chance(0.45));   // band on/off
    else litFloor.push(rng.chance(0.3));
  }
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const x = marginX + col * (winW + gapX);
      const y = topY + r * rowH;
      const lit = litFloor[r] && rng.chance(0.85);
      g.fillStyle = hex(trim);
      g.fillRect(x - 2, y - 2, winW + 4, winH + 4);      // frame
      g.fillStyle = hex(lit ? glassLit : glass);
      g.fillRect(x, y, winW, winH);
      if (!lit) { // unlit glass catches a diagonal sky sheen
        g.fillStyle = 'rgba(255,255,255,0.10)';
        g.beginPath();
        g.moveTo(x, y + winH); g.lineTo(x + winW * 0.45, y);
        g.lineTo(x + winW * 0.7, y); g.lineTo(x + winW * 0.25, y + winH);
        g.closePath(); g.fill();
      }
      g.fillStyle = 'rgba(0,0,0,0.25)';                  // mullion cross
      g.fillRect(x + winW / 2 - 1, y, 2, winH);
      g.fillRect(x, y + winH / 2 - 1, winW, 2);
    }
  }
  if (shopfront) {
    // Ground floor: shop glass + door + sign band, all aligned.
    g.fillStyle = hex(trim);
    g.fillRect(0, 56, W, 30);
    g.fillStyle = hex(glassLit);
    g.fillRect(10, 92, W - 20, 52);
    g.fillStyle = 'rgba(0,0,0,0.35)';
    for (let x = 10; x < W - 10; x += 18) g.fillRect(x, 92, 3, 52);
    g.fillStyle = hex(trim);
    g.fillRect(W / 2 - 16, 96, 32, 48);                  // door
  }
  return toTexture(c);
}

// Glass tower facade: full-height curtain wall, horizontal floor bands,
// lit bands by floor — the downtown look.
export function makeTowerTexture(opts) {
  const { glass, glassLit, trim, seed = 1, floors = 14 } = opts;
  const W = 256, H = 512;
  const [c, g] = canvas(W, H);
  const rng = new Rng(hashStr('tower' + seed));
  g.fillStyle = hex(glass);
  g.fillRect(0, 0, W, H);
  const bandH = H / floors;
  for (let f = 0; f < floors; f++) {
    const lit = f === 0 || rng.chance(0.4);
    const y = f * bandH;
    g.fillStyle = hex(lit ? glassLit : glass);
    g.fillRect(0, y + 2, W, bandH - 4);
    // Vertical mullions, evenly spaced — never random.
    g.fillStyle = hex(trim);
    for (let x = 0; x <= W; x += 32) g.fillRect(x, y, 2, bandH);
    g.fillRect(0, y, W, 2); // floor slab line
    if (!lit) {
      g.fillStyle = 'rgba(255,180,120,0.08)';
      g.fillRect(0, y + 2, W, (bandH - 4) / 2);
    }
  }
  return toTexture(c);
}

// --- Ground surfaces ---------------------------------------------------
export function makeRoadTexture() {
  const [c, g] = canvas(128, 256);
  g.fillStyle = '#33333a';
  g.fillRect(0, 0, 128, 256);
  const rng = new Rng(7);
  for (let i = 0; i < 500; i++) { // asphalt grain
    g.fillStyle = `rgba(${rng.chance(0.5) ? '255,255,255' : '0,0,0'},${rng.range(0.02, 0.07)})`;
    g.fillRect(rng.range(0, 128), rng.range(0, 256), 2, 2);
  }
  g.fillStyle = '#d8c25a'; // double centre line
  g.fillRect(60, 0, 3, 256);
  g.fillRect(66, 0, 3, 256);
  g.fillStyle = '#e8e8e8'; // edge lines
  g.fillRect(4, 0, 2, 256);
  g.fillRect(122, 0, 2, 256);
  const t = toTexture(c, true);
  t.repeat.set(1, 1);
  return t;
}

export function makeSidewalkTexture() {
  const [c, g] = canvas(128, 128);
  g.fillStyle = '#8a8378';
  g.fillRect(0, 0, 128, 128);
  const rng = new Rng(11);
  for (let i = 0; i < 260; i++) {
    g.fillStyle = `rgba(0,0,0,${rng.range(0.02, 0.06)})`;
    g.fillRect(rng.range(0, 128), rng.range(0, 128), 2, 2);
  }
  g.strokeStyle = 'rgba(0,0,0,0.25)';
  g.lineWidth = 2;
  for (let i = 0; i <= 128; i += 32) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 128); g.stroke();
    g.beginPath(); g.moveTo(0, i); g.lineTo(128, i); g.stroke();
  }
  const t = toTexture(c, true);
  return t;
}

export function makeSandTexture() {
  const [c, g] = canvas(128, 128);
  g.fillStyle = '#e8c98f';
  g.fillRect(0, 0, 128, 128);
  const rng = new Rng(13);
  for (let i = 0; i < 700; i++) {
    g.fillStyle = `rgba(${rng.chance(0.5) ? '120,90,50' : '255,240,200'},${rng.range(0.05, 0.14)})`;
    g.fillRect(rng.range(0, 128), rng.range(0, 128), 2, 1);
  }
  return toTexture(c, true);
}

export function makeWaterTexture() {
  const [c, g] = canvas(256, 256);
  const grad = g.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#2e4a6e');
  grad.addColorStop(0.5, '#3a5a7e');
  grad.addColorStop(1, '#2a4266');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const rng = new Rng(17);
  for (let i = 0; i < 90; i++) { // sun glints + wave streaks
    g.fillStyle = `rgba(255,190,120,${rng.range(0.04, 0.12)})`;
    g.fillRect(rng.range(0, 256), rng.range(0, 256), rng.range(8, 30), 2);
  }
  return toTexture(c, true);
}

export function makeGrassTexture() {
  const [c, g] = canvas(128, 128);
  g.fillStyle = '#5a7a4a';
  g.fillRect(0, 0, 128, 128);
  const rng = new Rng(19);
  for (let i = 0; i < 500; i++) {
    g.fillStyle = `rgba(${rng.chance(0.5) ? '40,70,30' : '140,170,90'},${rng.range(0.1, 0.25)})`;
    g.fillRect(rng.range(0, 128), rng.range(0, 128), 2, 3);
  }
  return toTexture(c, true);
}

// Corrugated container wall with a brand stripe.
export function makeContainerTexture(base, stripe) {
  const [c, g] = canvas(256, 128);
  g.fillStyle = hex(base);
  g.fillRect(0, 0, 256, 128);
  for (let x = 0; x < 256; x += 16) {
    g.fillStyle = 'rgba(0,0,0,0.18)';
    g.fillRect(x, 0, 4, 128);
    g.fillStyle = 'rgba(255,255,255,0.08)';
    g.fillRect(x + 8, 0, 4, 128);
  }
  g.fillStyle = hex(stripe);
  g.fillRect(0, 52, 256, 24);
  return toTexture(c);
}

// Awning stripes for market shopfronts.
export function makeAwningTexture(c1, c2) {
  const [c, g] = canvas(128, 64);
  for (let x = 0; x < 128; x += 16) {
    g.fillStyle = hex((x / 16) % 2 ? c1 : c2);
    g.fillRect(x, 0, 16, 64);
  }
  g.fillStyle = 'rgba(0,0,0,0.12)';
  g.fillRect(0, 52, 128, 12);
  return toTexture(c, true);
}

// Text signage: a shop or billboard face. One font stack, drawn crisp.
export function makeSignTexture(text, opts = {}) {
  const { bg = 0x14101c, fg = 0xffe08a, sub = '', w = 512, h = 128 } = opts;
  const [c, g] = canvas(w, h);
  g.fillStyle = hex(bg);
  g.fillRect(0, 0, w, h);
  g.strokeStyle = hex(fg);
  g.lineWidth = 4;
  g.strokeRect(6, 6, w - 12, h - 12);
  g.fillStyle = hex(fg);
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `700 ${sub ? 52 : 64}px "Arial Narrow", Arial, sans-serif`;
  g.fillText(text, w / 2, sub ? h / 2 - 18 : h / 2);
  if (sub) {
    g.font = '600 28px Arial, sans-serif';
    g.fillStyle = '#ffffff';
    g.fillText(sub, w / 2, h / 2 + 34);
  }
  return toTexture(c);
}

// Damage-number / popup sprite: bold text on transparent canvas.
export function makeTextSpriteTexture(text, color = '#ffd700', size = 64) {
  const [c, g] = canvas(256, 96);
  g.clearRect(0, 0, 256, 96);
  g.font = `800 ${size}px "Arial Narrow", Arial, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.lineWidth = 8;
  g.strokeStyle = 'rgba(0,0,0,0.85)';
  g.strokeText(text, 128, 48);
  g.fillStyle = color;
  g.fillText(text, 128, 48);
  return toTexture(c);
}
