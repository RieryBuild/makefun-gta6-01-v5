// The fake-brand system — graphic design as world-building (GTA P8).
// Ten original brands with canvas-drawn logos, applied to billboards,
// storefronts, containers, and car liveries. Every brand is invented
// here; nothing is a Rockstar name, and the shipping line is DEL SOL
// LINE (the PUERTO DEL SOL rename, never SOLMAR).

function hex(n) { return '#' + n.toString(16).padStart(6, '0'); }

export const BRANDS = {
  delSolLine: { name: 'DEL SOL LINE', tag: 'SHIPPING · PUERTO DEL SOL', bg: 0x1c4a6e, fg: 0xffd27a, accent: 0xf2a93b, mark: 'sun' },
  solBrau: { name: 'SOL BRAU', tag: 'CERVEZA DEL PUERTO', bg: 0x8a2e1e, fg: 0xffe9a8, accent: 0xf5c518, mark: 'bottle' },
  burgerSol: { name: 'BURGER SOL', tag: 'FAST · HOT · LOUD', bg: 0xd94f3d, fg: 0xffffff, accent: 0xffd27a, mark: 'burger' },
  marlinMotors: { name: 'MARLIN MOTORS', tag: 'COASTAL AUTO WORKS', bg: 0x1e3a4e, fg: 0x9ad8e8, accent: 0x2ec4b6, mark: 'fin' },
  radioSol: { name: 'RADIO SOL 92.5', tag: 'SUNSET SOUNDS', bg: 0x4a1e6e, fg: 0xff9ad8, accent: 0xf5c518, mark: 'wave' },
  solaire: { name: 'HOTEL SOLAIRE', tag: 'PLAYA DORADA', bg: 0xe8d8b8, fg: 0x8a5a2e, accent: 0xd94f3d, mark: 'sun' },
  vistaGas: { name: 'VISTA GAS', tag: 'FUEL · 24 HOURS', bg: 0x2e6e3e, fg: 0xffffff, accent: 0xffd27a, mark: 'drop' },
  coralCola: { name: 'CORAL COLA', tag: 'TASTE THE TIDE', bg: 0xe87a8a, fg: 0xffffff, accent: 0x2ec4b6, mark: 'wave' },
  playaWear: { name: 'PLAYA WEAR', tag: 'BEACH OUTFITTERS', bg: 0x2ec4b6, fg: 0x0c2a2e, accent: 0xffffff, mark: 'palm' },
  lunaAir: { name: 'LUNA AIR', tag: 'FLY THE COAST', bg: 0x2a2a4e, fg: 0xc8c8ff, accent: 0xffd27a, mark: 'moon' },
};

// Draw a brand's mark (a tiny pictogram) into the context.
function drawMark(g, mark, cx, cy, r, fg, accent) {
  g.fillStyle = hex(accent);
  g.strokeStyle = hex(fg);
  g.lineWidth = 2;
  if (mark === 'sun') {
    g.beginPath(); g.arc(cx, cy, r * 0.55, 0, Math.PI * 2); g.fill();
    g.strokeStyle = hex(accent);
    g.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.beginPath();
      g.moveTo(cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7);
      g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      g.stroke();
    }
  } else if (mark === 'wave') {
    g.strokeStyle = hex(accent);
    g.lineWidth = 4;
    for (let row = 0; row < 3; row++) {
      g.beginPath();
      for (let x = -r; x <= r; x += 4) {
        const y = cy + (row - 1) * r * 0.5 + Math.sin((x / r) * Math.PI * 2) * r * 0.18;
        if (x === -r) g.moveTo(cx + x, y); else g.lineTo(cx + x, y);
      }
      g.stroke();
    }
  } else if (mark === 'moon') {
    g.beginPath(); g.arc(cx, cy, r * 0.8, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#2a2a4e';
    g.beginPath(); g.arc(cx + r * 0.35, cy - r * 0.2, r * 0.65, 0, Math.PI * 2); g.fill();
  } else if (mark === 'drop') {
    g.beginPath();
    g.moveTo(cx, cy - r);
    g.quadraticCurveTo(cx + r * 0.8, cy, cx, cy + r * 0.7);
    g.quadraticCurveTo(cx - r * 0.8, cy, cx, cy - r);
    g.fill();
  } else if (mark === 'palm') {
    g.strokeStyle = hex(accent);
    g.lineWidth = 4;
    g.beginPath(); g.moveTo(cx, cy + r); g.lineTo(cx, cy - r * 0.3); g.stroke();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI * 0.85 + (i / 4) * Math.PI * 0.7;
      g.beginPath();
      g.moveTo(cx, cy - r * 0.3);
      g.quadraticCurveTo(cx + Math.cos(a) * r * 0.7, cy - r * 0.3 + Math.sin(a) * r * 0.5, cx + Math.cos(a) * r, cy + r * 0.2);
      g.stroke();
    }
  } else if (mark === 'fin') {
    g.beginPath();
    g.moveTo(cx - r, cy + r * 0.4);
    g.quadraticCurveTo(cx, cy - r, cx + r, cy + r * 0.2);
    g.quadraticCurveTo(cx + r * 0.3, cy + r * 0.5, cx - r, cy + r * 0.4);
    g.fill();
  } else if (mark === 'burger') {
    g.fillStyle = hex(accent);
    g.beginPath(); g.ellipse(cx, cy - r * 0.3, r * 0.9, r * 0.45, 0, Math.PI, Math.PI * 2); g.fill();
    g.fillStyle = '#7a4a2e';
    g.fillRect(cx - r * 0.9, cy - r * 0.1, r * 1.8, r * 0.3);
    g.fillStyle = hex(accent);
    g.beginPath(); g.ellipse(cx, cy + r * 0.4, r * 0.9, r * 0.3, 0, 0, Math.PI); g.fill();
  } else { // bottle
    g.fillStyle = hex(accent);
    g.fillRect(cx - r * 0.25, cy - r, r * 0.5, r * 0.6);
    g.beginPath();
    g.ellipse(cx, cy + r * 0.4, r * 0.55, r * 0.6, 0, 0, Math.PI * 2);
    g.fill();
  }
}

// A brand logo board: mark + name + tagline, landscape 512x256.
export function makeBrandTexture(brandId, wide = false) {
  const b = BRANDS[brandId] || BRANDS.delSolLine;
  const W = wide ? 1024 : 512, H = wide ? 256 : 256;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = hex(b.bg);
  g.fillRect(0, 0, W, H);
  g.strokeStyle = hex(b.accent);
  g.lineWidth = 6;
  g.strokeRect(8, 8, W - 16, H - 16);
  drawMark(g, b.mark, 96, H / 2, 56, b.fg, b.accent);
  g.fillStyle = hex(b.fg);
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  g.font = `800 ${wide ? 72 : 44}px "Arial Narrow", Arial, sans-serif`;
  g.fillText(b.name, 176, H / 2 - 18);
  g.font = `600 ${wide ? 30 : 20}px Arial, sans-serif`;
  g.fillStyle = hex(b.accent);
  g.fillText(b.tag, 178, H / 2 + 34);
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  t.anisotropy = 4;
  return t;
}

// A tall vertical sign (for towers / the casino): mark on top, name
// stacked below, 256x512.
export function makeVerticalSignTexture(brandId) {
  const b = BRANDS[brandId] || BRANDS.solaire;
  const c = document.createElement('canvas');
  c.width = 256; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = hex(b.bg);
  g.fillRect(0, 0, 256, 512);
  g.strokeStyle = hex(b.accent);
  g.lineWidth = 6;
  g.strokeRect(8, 8, 240, 496);
  drawMark(g, b.mark, 128, 110, 64, b.fg, b.accent);
  g.fillStyle = hex(b.fg);
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const words = b.name.split(' ');
  g.font = '800 44px "Arial Narrow", Arial, sans-serif';
  words.forEach((w, i) => g.fillText(w, 128, 230 + i * 52));
  g.font = '600 20px Arial, sans-serif';
  g.fillStyle = hex(b.accent);
  g.fillText(b.tag, 128, 230 + words.length * 52 + 26);
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  return t;
}

// PSPD door decal: a star + PSPD text, for the cruiser livery.
export function makePoliceDecalTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 128;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 256, 128);
  g.fillStyle = '#1e3a5e';
  g.beginPath();
  // five-point star
  const cx = 52, cy = 64, R = 40, r = 16;
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
    const rad = i % 2 ? r : R;
    const x = cx + Math.cos(a) * rad, y = cy + Math.sin(a) * rad;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath(); g.fill();
  g.fillStyle = '#ffffff';
  g.beginPath(); g.arc(cx, cy, 10, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#1e3a5e';
  g.font = '800 52px "Arial Narrow", Arial, sans-serif';
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  g.fillText('PSPD', 108, 58);
  g.font = '600 20px Arial, sans-serif';
  g.fillText('PUERTO DEL SOL', 108, 96);
  const t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  return t;
}
