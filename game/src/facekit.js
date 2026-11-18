// Faces — the part that makes a character read as DESIGNED instead of a
// capsule with a ponytail. Two outputs from one face language:
//  1. makeFaceTexture(spec): features drawn on a transparent canvas and
//     mapped onto a curved patch hugging the front of the 3D head sphere.
//     Skin shows through from the head mesh; only the features are ink.
//  2. makePortrait(spec): a flat-design 2D portrait (data URL) for the
//     dialogue strip, the title screen, and the map screen — same face,
//     same hair, same outfit colours, so a character is one person in
//     3D and in 2D.
//
// Face space: the canvas is 256x256, the face centre at (128, 128).
// Eyes sit at y≈104, mouth at y≈182. Expressions come from the brows
// (angle + height) and the mouth (shape) — the two cheapest levers.

import { hashStr } from './rng.js';

function hex(n) { return '#' + n.toString(16).padStart(6, '0'); }

// Draw one face's features into context g, centred at (cx, cy), scaled
// by s (s=1 is the 256px face space). `spec` carries the identity.
export function drawFace(g, spec, cx, cy, s) {
  const {
    eyeColor = 0x2a1a10, browColor = 0x1c1410, lipColor = 0xa04a4a,
    expression = 'calm', stubble = false, freckles = false,
    eyeShadow = null, lashes = false,
  } = spec;
  const X = (v) => cx + v * s;
  const Y = (v) => cy + v * s;

  // Brows — the expression lives here. Calm: gentle arc. Determined:
  // angled down toward the nose. Smug: one brow raised.
  const browY = -34, browDX = 30, browW = 26;
  g.strokeStyle = hex(browColor);
  g.lineWidth = 5 * s;
  g.lineCap = 'round';
  const browAngle = expression === 'determined' ? 0.35 : expression === 'smug' ? -0.12 : 0.08;
  for (const side of [-1, 1]) {
    const inner = X(side * (browDX - browW / 2));
    const outer = X(side * (browDX + browW / 2));
    const lift = expression === 'smug' && side === 1 ? -6 * s : 0;
    g.beginPath();
    g.moveTo(outer, Y(browY) + lift - Math.abs(browAngle) * 4 * s);
    g.quadraticCurveTo(
      X(side * browDX), Y(browY - 6) + lift - browAngle * 10 * s * (side < 0 ? -1 : 1) * -1,
      inner, Y(browY + browAngle * 12 * s) + lift,
    );
    g.stroke();
  }

  // Eyes: white, iris, pupil, highlight. Slightly almond, not dots.
  for (const side of [-1, 1]) {
    const ex = X(side * 30), ey = Y(-14);
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.ellipse(ex, ey, 12 * s, 8 * s, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = hex(eyeColor);
    g.beginPath(); g.arc(ex, ey, 5.5 * s, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#0a0a0a';
    g.beginPath(); g.arc(ex, ey, 2.8 * s, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath(); g.arc(ex - 2 * s, ey - 2 * s, 1.4 * s, 0, Math.PI * 2); g.fill();
    if (lashes) { // upper lash line
      g.strokeStyle = '#14100c';
      g.lineWidth = 2.5 * s;
      g.beginPath();
      g.ellipse(ex, ey - 1 * s, 12 * s, 8 * s, 0, Math.PI * 1.05, Math.PI * 1.95);
      g.stroke();
    }
  }
  if (eyeShadow) {
    g.fillStyle = eyeShadow;
    for (const side of [-1, 1]) {
      g.beginPath();
      g.ellipse(X(side * 30), Y(-20), 14 * s, 6 * s, 0, Math.PI, Math.PI * 2);
      g.fill();
    }
  }

  // Nose: a short bridge line + two nostril dots. Small — it reads at
  // screenshot distance without dominating the face.
  g.strokeStyle = 'rgba(0,0,0,0.28)';
  g.lineWidth = 2.5 * s;
  g.beginPath();
  g.moveTo(X(0), Y(2)); g.lineTo(X(2), Y(22)); g.stroke();
  g.fillStyle = 'rgba(0,0,0,0.35)';
  g.beginPath(); g.arc(X(-5), Y(26), 2 * s, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(X(5), Y(26), 2 * s, 0, Math.PI * 2); g.fill();

  if (stubble) { // lower-face shade for the men
    g.fillStyle = 'rgba(30,20,14,0.22)';
    g.beginPath();
    g.ellipse(X(0), Y(48), 34 * s, 30 * s, 0, 0, Math.PI);
    g.fill();
  }
  if (freckles) {
    g.fillStyle = 'rgba(120,70,30,0.5)';
    for (const [fx, fy] of [[-22, 12], [-14, 18], [18, 14], [26, 20], [-26, 22], [10, 20]]) {
      g.beginPath(); g.arc(X(fx), Y(fy), 1.6 * s, 0, Math.PI * 2); g.fill();
    }
  }

  // Mouth — the second expression lever.
  g.fillStyle = hex(lipColor);
  g.strokeStyle = 'rgba(0,0,0,0.25)';
  g.lineWidth = 1.5 * s;
  const my = Y(52);
  if (expression === 'smirk' || expression === 'smug') {
    g.beginPath();
    g.moveTo(X(-14), my);
    g.quadraticCurveTo(X(0), my + 7 * s, X(16), my - 4 * s);
    g.quadraticCurveTo(X(2), my + 11 * s, X(-14), my);
    g.closePath(); g.fill(); g.stroke();
  } else if (expression === 'smile') {
    g.beginPath();
    g.moveTo(X(-15), my);
    g.quadraticCurveTo(X(0), my + 10 * s, X(15), my);
    g.quadraticCurveTo(X(0), my + 3 * s, X(-15), my);
    g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.moveTo(X(-9), my + 1 * s);
    g.quadraticCurveTo(X(0), my + 5 * s, X(9), my + 1 * s);
    g.quadraticCurveTo(X(0), my + 3 * s, X(-9), my + 1 * s);
    g.closePath(); g.fill();
  } else { // calm / determined: a straight, closed mouth
    g.beginPath();
    g.moveTo(X(-13), my);
    g.quadraticCurveTo(X(0), my + 4 * s, X(13), my);
    g.quadraticCurveTo(X(0), my - 3 * s, X(-13), my);
    g.closePath(); g.fill(); g.stroke();
  }
}

// The 3D face patch texture. Transparent background — the head mesh's
// skin shows through; only brows, eyes, nose and mouth are ink.
export function makeFaceTexture(spec) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 256, 256);
  drawFace(g, spec, 128, 128, 1);
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  t.anisotropy = 4;
  return t;
}

// Hair silhouettes for the 2D portraits, drawn behind/around the head.
function drawPortraitHair(g, spec, cx, cy, s) {
  const { hairColor = 0x1c1410, hairStyle = 'short' } = spec;
  g.fillStyle = hex(hairColor);
  const W = (v) => cx + v * s, Y = (v) => cy + v * s;
  if (hairStyle === 'bun') { // low bun: cap + bun circle at the back
    g.beginPath();
    g.ellipse(W(0), Y(-34), 44 * s, 40 * s, 0, Math.PI, Math.PI * 2);
    g.fill();
    g.beginPath(); g.arc(W(40), Y(-8), 13 * s, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(W(-40), Y(-8), 13 * s, 0, Math.PI * 2); g.fill();
  } else if (hairStyle === 'bob') {
    g.beginPath();
    g.ellipse(W(0), Y(-6), 46 * s, 52 * s, 0, Math.PI * 0.95, Math.PI * 2.05);
    g.fill();
    g.fillRect(W(-46), Y(-10), 92 * s, 46 * s);
  } else if (hairStyle === 'slick') {
    g.beginPath();
    g.ellipse(W(0), Y(-38), 42 * s, 30 * s, 0, Math.PI, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.moveTo(W(-42), Y(-38)); g.lineTo(W(42), Y(-38));
    g.lineTo(W(38), Y(-52)); g.lineTo(W(-38), Y(-52));
    g.closePath(); g.fill();
  } else if (hairStyle === 'cap') {
    g.fillStyle = spec.capColor ? hex(spec.capColor) : '#2a4a6a';
    g.beginPath();
    g.ellipse(W(0), Y(-40), 44 * s, 26 * s, 0, Math.PI, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.ellipse(W(0), Y(-38), 52 * s, 10 * s, 0, 0, Math.PI);
    g.fill();
  } else { // short
    g.beginPath();
    g.ellipse(W(0), Y(-36), 43 * s, 34 * s, 0, Math.PI, Math.PI * 2);
    g.fill();
  }
}

// Flat-design portrait, 160x200, as a data URL for <img> use.
export function makePortrait(spec) {
  const W = 160, H = 200;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const seed = hashStr(spec.name || 'x');
  // Background: character colour, diagonal shade.
  const grad = g.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, spec.bg || '#3a2a4e');
  grad.addColorStop(1, spec.bg2 || '#1c1428');
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(255,255,255,0.06)';
  g.beginPath(); g.arc(W - 20, 24, 46, 0, Math.PI * 2); g.fill();
  const cx = W / 2, cy = 96, s = 0.62;
  // Shoulders / outfit.
  g.fillStyle = spec.outfit ? hex(spec.outfit) : '#555';
  g.beginPath();
  g.ellipse(cx, H + 18, 74, 62, 0, Math.PI, Math.PI * 2);
  g.fill();
  if (spec.outfitDetail === 'collar') {
    g.fillStyle = '#f0ead8';
    g.beginPath();
    g.moveTo(cx - 16, 158); g.lineTo(cx, 176); g.lineTo(cx + 16, 158);
    g.lineTo(cx + 10, 152); g.lineTo(cx, 162); g.lineTo(cx - 10, 152);
    g.closePath(); g.fill();
  }
  if (spec.outfitDetail === 'badge') {
    g.fillStyle = '#f5c518';
    g.beginPath(); g.arc(cx + 34, 168, 7, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#14101c';
    g.beginPath(); g.arc(cx + 34, 168, 3, 0, Math.PI * 2); g.fill();
  }
  // Neck + head.
  g.fillStyle = spec.skin ? hex(spec.skin) : '#c98a5e';
  g.fillRect(cx - 11, 118, 22, 26);
  g.beginPath();
  g.ellipse(cx, cy, 40 * s / 0.62 * 0.62, 48 * s / 0.62 * 0.62, 0, 0, Math.PI * 2);
  g.fill();
  // Ears.
  g.beginPath(); g.arc(cx - 40, cy + 2, 7, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(cx + 40, cy + 2, 7, 0, Math.PI * 2); g.fill();
  drawPortraitHair(g, spec, cx, cy, s);
  if (spec.sunglasses) {
    g.fillStyle = '#0c0c12';
    g.beginPath();
    g.roundRect(cx - 34, cy - 24, 30, 16, 5); g.fill();
    g.beginPath();
    g.roundRect(cx + 4, cy - 24, 30, 16, 5); g.fill();
    g.fillRect(cx - 5, cy - 20, 10, 3);
  } else {
    drawFace(g, spec, cx, cy, s);
  }
  if (spec.earrings) {
    g.fillStyle = '#f5c518';
    g.beginPath(); g.arc(cx - 40, cy + 12, 4, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(cx + 40, cy + 12, 4, 0, Math.PI * 2); g.fill();
  }
  if (spec.mustache) {
    g.fillStyle = hex(spec.hairColor || 0x1c1410);
    g.beginPath();
    g.ellipse(cx - 9, cy + 30, 11, 4, -0.2, 0, Math.PI * 2); g.fill();
    g.beginPath();
    g.ellipse(cx + 9, cy + 30, 11, 4, 0.2, 0, Math.PI * 2); g.fill();
  }
  // Name plate.
  g.fillStyle = 'rgba(10,8,16,0.72)';
  g.fillRect(0, H - 26, W, 26);
  g.fillStyle = '#ffffff';
  g.font = '700 13px "Arial Narrow", Arial, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText((spec.name || '').toUpperCase(), cx, H - 13);
  return c.toDataURL('image/png');
}
