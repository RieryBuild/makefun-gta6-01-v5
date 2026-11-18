// The ONE committed palette of PUERTO DEL SOL: a smog sunset that never
// averages out to mud. Everything in the game — sky, fog, buildings,
// characters, HUD — draws from this file, so the mood holds in every frame.
//
// The mood: golden hour over a coastal port city. Deep violet zenith,
// magenta mid-sky, orange-gold horizon; warm rim light; purple shadows;
// neon accents that only read once the sun is low. Noon never happens.

export const SKY = {
  zenith: 0x2a1a4e,      // deep violet, top of the dome
  mid: 0x8a3d6e,         // magenta band
  horizon: 0xff8c42,     // orange gold at the sun line
  horizonFar: 0xffb36b,  // pale gold away from the sun
  sunCore: 0xffe9a8,     // the sun disc itself
  sunGlow: 0xff9a3d,     // the halo around it
  fog: 0xdd8a63,         // warm haze — fog IS the palette, not a wall
  fogNear: 120,
  fogFar: 520,
  cloudLit: 0xffc9a3,    // cloud bellies catch the sun
  cloudShade: 0x7a4a7d,  // cloud tops stay violet
  water: 0x2e4a6e,       // deep harbour blue, warmed by the sky
  waterShallow: 0x4a7a8c,
  sand: 0xe8c98f,
};

export const LIGHT = {
  sunColor: 0xffd9a0,    // warm key light
  sunIntensity: 1.35,
  hemiSky: 0x8a6bb0,     // violet fill from the sky
  hemiGround: 0x5a3a4a,  // warm dark bounce
  hemiIntensity: 0.75,
  rimColor: 0xff9a5c,    // the sunset rim on hero + cars
  rimIntensity: 0.9,
  ambient: 0x604a6a,
  ambientIntensity: 0.35,
};

// One palette per district — the city reads as six places stitched
// together, not one grid. Each entry: facade bases, trim, window glass,
// awning stripes, ground accent. Lit windows follow the same warm gold.
export const DISTRICTS = {
  CENTRO: {
    name: 'CENTRO', sub: 'Downtown',
    facades: [0x8a93a6, 0x6e7a90, 0x9aa3b5, 0x5d6a80],
    trim: 0x3a4356, glass: 0x2c3e55, glassLit: 0xffd27a,
    accent: 0x4a90d9, ground: 0x6a6f7a,
  },
  MERCADO: {
    name: 'MERCADO', sub: 'Old Market',
    facades: [0xd9a066, 0xc98a5a, 0xe0b184, 0xb87a4e],
    trim: 0x7a4a2e, glass: 0x3a2e28, glassLit: 0xffc46b,
    accent: 0xd94f3d, ground: 0x8a7a6a,
  },
  PUERTO_VIEJO: {
    name: 'PUERTO VIEJO', sub: 'The Docks',
    facades: [0x7a8a8c, 0x6a7a7c, 0x8c9a9c, 0x5a6a6c],
    trim: 0x3a4a4c, glass: 0x2a3436, glassLit: 0xffb85c,
    accent: 0xd97a2e, ground: 0x5a5a52,
  },
  PLAYA_DORADA: {
    name: 'PLAYA DORADA', sub: 'Golden Beach',
    facades: [0xf2c9c0, 0xf7ddc4, 0xc8e8d8, 0xf2e3c9],
    trim: 0xe87a8a, glass: 0x4a6a7a, glassLit: 0xffe08a,
    accent: 0x2ec4b6, ground: 0xd8c49a,
  },
  COLINAS: {
    name: 'COLINAS', sub: 'The Hills',
    facades: [0xf0ead8, 0xe8ddc4, 0xd8e0c8, 0xe0d0b8],
    trim: 0x8a7a5a, glass: 0x3a4a5a, glassLit: 0xffd27a,
    accent: 0x6a9a5a, ground: 0x7a8a6a,
  },
  VISTA_MAR: {
    name: 'VISTA MAR', sub: 'Marina',
    facades: [0x9ab8c8, 0x8aa8b8, 0xa8c4d4, 0x7a98a8],
    trim: 0x3a5a6e, glass: 0x2a4a5e, glassLit: 0xffe08a,
    accent: 0xf2a93b, ground: 0x8a9aa2,
  },
};

// HUD + UI colours (DOM side mirrors these in style.css).
export const UI = {
  money: '#7ed321',
  health: '#7ed321',
  armor: '#4a90d9',
  rep: '#f5c518',
  star: '#ffd700',
  starEmpty: '#2a2a2a',
  danger: '#ff4444',
  police: '#4a90d9',
  gold: '#f5c518',
  ink: '#14101c',
};

// Character skin tones + hair colours shared by the 3D builder and the
// 2D portraits so a character reads as the same person in both.
export const SKIN = {
  warmBrown: 0x8a5a3b, tan: 0xc98a5e, fair: 0xe8b88a,
  deep: 0x5a3a26, olive: 0xb08a5e,
};
export const HAIR = {
  black: 0x1c1410, brown: 0x4a2e1c, blonde: 0xd8a84e,
  auburn: 0x7a3a1e, grey: 0x9a9a9a, coral: 0xd95a6a,
};
