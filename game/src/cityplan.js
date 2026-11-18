// PUERTO DEL SOL — the city plan. One source of truth for layout: the
// road grid, the six districts, the POIs, the landmarks, and the bounds.
// The 3D builders (structures, streetkit, landmarks), the radar, the map
// screen, the missions, and the traffic all read from here, so the city
// the player drives is the city the map draws.
//
// Coordinates: x east, z south. The city is a 400 x 340 m grid; the
// beach and the ocean lie south (z > 170); the marina opens east.
// The waterline is z = 186 on the beach front — the play boundary.

export const WORLD = {
  minX: -200, maxX: 200,
  minZ: -180, maxZ: 170,   // land edge; beach runs to z=186, then water
  waterZ: 186,             // the waterline — players and cars stop here
  beachZ: 168,             // sand starts here
  groundSize: 900,         // ground plane + water plane extent
};

// Avenues run north-south (constant x), streets east-west (constant z).
// Ordered layout: a strict grid with a height gradient (tall downtown
// in CENTRO, low villas in COLINAS) — the anti-Rubik's rule.
export const AVENUES = [-160, -120, -80, -40, 0, 40, 80, 120, 160];
export const STREETS = [-140, -100, -60, -20, 20, 60, 100, 140];
export const ROAD_W = 10;      // drivable asphalt width
export const WALK_W = 4;       // sidewalk width each side
export const BLOCK_W = 30;     // building block depth between roads

// Six districts, each a rectangle with a hard identity. The lookup is
// order-sensitive: the beach strip and the docks are checked first.
export const DISTRICT_RECTS = [
  { id: 'PLAYA_DORADA', x0: -200, x1: 200, z0: 140, z1: 186 },
  { id: 'PUERTO_VIEJO', x0: -200, x1: -120, z0: -180, z1: 140 },
  { id: 'COLINAS', x0: -120, x1: -40, z0: -180, z1: -100 },
  { id: 'CENTRO', x0: 40, x1: 200, z0: -180, z1: -20 },
  { id: 'VISTA_MAR', x0: 120, x1: 200, z0: -20, z1: 140 },
  { id: 'MERCADO', x0: -120, x1: 120, z0: -100, z1: 140 }, // the centre
];

export function districtAt(x, z) {
  for (const d of DISTRICT_RECTS) {
    if (x >= d.x0 && x < d.x1 && z >= d.z0 && z < d.z1) return d.id;
  }
  return 'MERCADO';
}

// Points of interest — the map screen's legend and the mission targets.
// kind drives the map icon and the radar blip.
export const POIS = [
  { id: 'safehouse', name: 'Ro\u2019s Safehouse', kind: 'safehouse', x: -60, z: 152, district: 'PLAYA_DORADA' },
  // The garage POI sits on the forecourt in front of the building (its
  // north face is at z=-31.9), NOT at the building's centre: a POI
  // inside a collider ejects a car 9.8 m on the first frame, past the
  // 7 m deliver radius, so mission 2 could never complete.
  { id: 'garage', name: 'Teo\u2019s Garage', kind: 'garage', x: -100, z: -26, district: 'MERCADO' },
  { id: 'gunshop', name: 'Sol Arms', kind: 'weapons', x: -20, z: 40, district: 'MERCADO' },
  { id: 'respray', name: 'Color Sol Respray', kind: 'respray', x: 140, z: 60, district: 'VISTA_MAR' },
  { id: 'hospital', name: 'Hospital del Sol', kind: 'hospital', x: 80, z: -120, district: 'CENTRO' },
  { id: 'police', name: 'PSPD Central', kind: 'police', x: 120, z: -60, district: 'CENTRO' },
  { id: 'impound', name: 'PSPD Impound', kind: 'impound', x: -160, z: 60, district: 'PUERTO_VIEJO' },
  { id: 'casino', name: 'Casino del Mar', kind: 'casino', x: 60, z: 152, district: 'PLAYA_DORADA' },
  { id: 'pier', name: 'Muelle del Sol', kind: 'landmark', x: 20, z: 176, district: 'PLAYA_DORADA' },
  { id: 'lighthouse', name: 'Faro del Sol', kind: 'landmark', x: 190, z: 170, district: 'VISTA_MAR' },
  { id: 'ferris', name: 'Rueda del Sol', kind: 'landmark', x: -20, z: 162, district: 'PLAYA_DORADA' },
  { id: 'marina', name: 'Marina Vista', kind: 'marina', x: 180, z: 100, district: 'VISTA_MAR' },
  { id: 'tower', name: 'Torre Sol', kind: 'landmark', x: 100, z: -140, district: 'CENTRO' },
  { id: 'warehouse', name: 'Venn Warehouse', kind: 'story', x: -160, z: -60, district: 'PUERTO_VIEJO' },
  { id: 'market', name: 'Mercado Central', kind: 'market', x: -40, z: 20, district: 'MERCADO' },
  { id: 'causeway', name: 'Puente del Sol', kind: 'landmark', x: 160, z: 140, district: 'VISTA_MAR' },
];

export function poiById(id) { return POIS.find((p) => p.id === id); }

// Landmark positions for the 3D builders (shared with POIs where they
// coincide, but the builders need exact footprints).
export const LANDMARKS = {
  lighthouse: { x: 190, z: 172 },
  ferris: { x: -20, z: 164 },
  pier: { x: 20, z: 172 },
  tower: { x: 100, z: -140 },
  causeway: { x: 160, z: 140 },
  marina: { x: 180, z: 100 },
};

// Is a point on a road surface? Props must NEVER be placed on one —
// palms on the road was one of Reza's three rev2 faults. Roads are the
// avenue/street strips; everything else is block, sidewalk, or verge.
export function onRoad(x, z) {
  const half = ROAD_W / 2;
  for (const ax of AVENUES) if (Math.abs(x - ax) <= half) return true;
  for (const sz of STREETS) if (Math.abs(z - sz) <= half) return true;
  return false;
}

// Is a point on a sidewalk? The strip just outside the asphalt.
export function onSidewalk(x, z) {
  if (onRoad(x, z)) return false;
  const edge = ROAD_W / 2 + WALK_W;
  for (const ax of AVENUES) if (Math.abs(x - ax) <= edge) return true;
  for (const sz of STREETS) if (Math.abs(z - sz) <= edge) return true;
  return false;
}

// Nearest point on the road network (for traffic spawn + GPS snapping).
export function nearestRoadPoint(x, z) {
  let best = null, bestD = Infinity;
  for (const ax of AVENUES) {
    const d = Math.abs(x - ax);
    if (d < bestD) { bestD = d; best = { x: ax, z }; }
  }
  for (const sz of STREETS) {
    const d = Math.abs(z - sz);
    if (d < bestD) { bestD = d; best = { x, z: sz }; }
  }
  return best;
}

// Clamp a position inside the playable land (waterline + map edges).
export function clampToLand(p, margin = 2) {
  p.x = Math.max(WORLD.minX + margin, Math.min(WORLD.maxX - margin, p.x));
  p.z = Math.max(WORLD.minZ + margin, Math.min(WORLD.waterZ - margin, p.z));
  return p;
}
