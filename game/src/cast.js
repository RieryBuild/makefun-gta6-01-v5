// The cast of PUERTO DEL SOL — named characters with roles, portraits,
// and dialogue in-frame (every top-5 entry has this; identity matters
// as much as polygons). Each entry carries the 3D spec (humanoid.js),
// the 2D portrait spec (facekit.js), and their mission dialogue lines.
//
// The story: Rosa "Ro" Delgado, a getaway driver who walked away from
// the life three years ago, is pulled back when her brother's garage
// debt lands on Dario Venn's books. Eight jobs to buy the garage back
// — and to burn Venn's operation down on the way out.

import { SKIN, HAIR } from './palette.js';

export const CAST = {
  ro: {
    id: 'ro', name: 'Rosa Delgado', call: 'Ro', role: 'Getaway Driver',
    tagline: 'Three years clean. One debt. Eight jobs to buy it back.',
    skin: SKIN.warmBrown, hairColor: HAIR.black, hairStyle: 'bun',
    jacket: 0xd95a4a, shirt: 0xf2ead8, pants: 0x2a2e3a, shoes: 0x1c1c22,
    earrings: true, sleeves: 'short',
    face: { eyeColor: 0x2a1a10, browColor: HAIR.black, lipColor: 0x9a4a3e, expression: 'determined', lashes: true, freckles: true },
    bg: '#7a2e3e', bg2: '#2a1420', outfit: 0xd95a4a,
    lines: {
      start: 'Teo, I am back. One job — then I am gone again.',
      chase: 'They are all over me, Teo. Talk me through it.',
      combat: 'Venn sends boys to do a driver\u2019s job. Cute.',
      win: 'That\u2019s the garage. That\u2019s my name back.',
    },
  },
  teo: {
    id: 'teo', name: 'Mateo Fuentes', call: 'Teo', role: 'Mechanic · Garage Owner',
    tagline: 'Ro\u2019s brother. Owes Venn. Fixes everything except his debts.',
    skin: SKIN.tan, hairColor: HAIR.brown, hairStyle: 'cap', capColor: 0x2a4a6a,
    jacket: 0x2e4a6a, shirt: 0x8a8a86, pants: 0x3a3a42, shoes: 0x2a2018,
    mustache: true, sleeves: 'short',
    face: { eyeColor: 0x3a2a18, browColor: HAIR.brown, lipColor: 0x8a5a4a, expression: 'smile', stubble: true },
    bg: '#1e3a5e', bg2: '#101a2a', outfit: 0x2e4a6a, outfitDetail: 'collar',
    lines: {
      start: 'Ro! The Solstice is tuned. Don\u2019t scratch her. Scratch them.',
      chase: 'Cut through the market — the cruisers can\u2019t follow the stalls!',
      combat: 'Stay low, sis. Venn\u2019s boys shoot like they drive. Badly.',
      win: 'The garage is ours again. You did it, Ro.',
    },
  },
  ines: {
    id: 'ines', name: 'In\u00e9s Cabrera', call: 'In\u00e9s', role: 'Fixer',
    tagline: 'Knows every job in the city. Sells them to the highest bidder.',
    skin: SKIN.olive, hairColor: HAIR.black, hairStyle: 'bob',
    jacket: 0x1c1c22, shirt: 0xd8c49a, pants: 0x1c1c22, shoes: 0x0c0c10,
    earrings: true, sleeves: 'long',
    face: { eyeColor: 0x1c2a1a, browColor: HAIR.black, lipColor: 0xa03a4e, expression: 'smug', lashes: true, eyeShadow: 'rgba(120,40,90,0.35)' },
    // Portrait backdrop, lifted to a mid mauve: on the old near-black
    // purple her dark hair + olive skin + black outfit vanished.
    bg: '#7a4a68', bg2: '#3e2438', outfit: 0x1c1c22,
    lines: {
      start: 'Delgado. Venn wants his money. I want his routes. We can both win.',
      chase: 'The PSPD is bought, Ro — but only up to three stars. Stay under.',
      combat: 'Take the warehouse and Venn loses the docks. Go.',
      win: 'The city is yours now, Ro. Spend it well.',
    },
  },
  reyes: {
    id: 'reyes', name: 'Aldo Reyes', call: 'Captain Reyes', role: 'PSPD Captain',
    tagline: 'Runs the department. Venn runs Reyes. Mostly.',
    skin: SKIN.tan, hairColor: HAIR.grey, hairStyle: 'cap', capColor: 0x1e3a5e,
    jacket: 0x1e3a5e, shirt: 0x9ab8c8, pants: 0x1e2a3a, shoes: 0x0c0c10,
    sunglasses: true, sleeves: 'long',
    face: { eyeColor: 0x2a1a10, browColor: HAIR.grey, lipColor: 0x7a4a3e, expression: 'determined', stubble: true },
    bg: '#1e3a5e', bg2: '#0c1626', outfit: 0x1e3a5e, outfitDetail: 'badge',
    lines: {
      chase: 'All units, Delgado is in the wind. Box her in — now.',
      combat: 'You picked the wrong city to come home to, Delgado.',
      win: '…Fine. The docks are clean. Don\u2019t make me regret this.',
    },
  },
  venn: {
    id: 'venn', name: 'Dario Venn', call: 'Venn', role: 'Smuggler Kingpin',
    tagline: 'Owns the docks, the routes, and half the department.',
    skin: SKIN.fair, hairColor: HAIR.brown, hairStyle: 'slick',
    jacket: 0xf2ead8, shirt: 0x1c1c22, pants: 0xf2ead8, shoes: 0x2a2018,
    sleeves: 'long',
    face: { eyeColor: 0x4a3a1a, browColor: HAIR.brown, lipColor: 0x8a4a4a, expression: 'smirk', stubble: false },
    bg: '#4a3a1e', bg2: '#1e1608', outfit: 0xf2ead8, outfitDetail: 'collar',
    lines: {
      start: 'Rosa Delgado. Your brother owes me. You drive for me now.',
      combat: 'You think one driver burns my city down? Shoot her.',
      win: '…You win, Delgado. The docks are yours. The debt is gone.',
    },
  },
};

// Pedestrian families — four palette families with varied silhouettes
// and gaits, so the crowd never reads as clones.
export const PED_FAMILIES = [
  { name: 'beach', jacket: 0x2ec4b6, shirt: 0xf2ead8, pants: 0xe8d8b8, shoes: 0x8a6a4a, hairStyles: ['short', 'bob', 'afro'], skins: [SKIN.tan, SKIN.fair, SKIN.warmBrown] },
  { name: 'market', jacket: 0xd9a066, shirt: 0xf2ead8, pants: 0x5a4a3a, shoes: 0x2a2018, hairStyles: ['bun', 'short', 'bob'], skins: [SKIN.olive, SKIN.tan, SKIN.deep] },
  { name: 'downtown', jacket: 0x3a4a6a, shirt: 0xffffff, pants: 0x2a2e3a, shoes: 0x0c0c10, hairStyles: ['slick', 'short', 'bob'], skins: [SKIN.fair, SKIN.tan, SKIN.warmBrown] },
  { name: 'docks', jacket: 0x6a7a5a, shirt: 0x8a8a86, pants: 0x3a3a42, shoes: 0x2a2018, hairStyles: ['cap', 'short', 'afro'], skins: [SKIN.deep, SKIN.tan, SKIN.olive] },
];

// Venn's crew — the enemies: dark red jackets, black pants, caps.
export const ENEMY_SPEC = {
  skin: SKIN.tan, hairColor: HAIR.black, hairStyle: 'cap', capColor: 0x5a1e1e,
  jacket: 0x7a2e2e, shirt: 0x1c1c22, pants: 0x1c1c22, shoes: 0x0c0c10,
  face: { eyeColor: 0x2a1a10, browColor: HAIR.black, lipColor: 0x7a4a3e, expression: 'determined', stubble: true },
  sleeves: 'long',
};

// PSPD officers — navy uniform, cap, badge.
export const COP_SPEC = {
  skin: SKIN.tan, hairColor: HAIR.brown, hairStyle: 'cap', capColor: 0x1e3a5e,
  jacket: 0x1e3a5e, shirt: 0x9ab8c8, pants: 0x1e2a3a, shoes: 0x0c0c10,
  face: { eyeColor: 0x2a1a10, browColor: HAIR.brown, lipColor: 0x7a4a3e, expression: 'calm' },
  sleeves: 'long',
};
