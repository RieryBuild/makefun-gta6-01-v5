// Persistence — autosave + Continue. One save slot in localStorage,
// written on every mission pass and every 30 seconds of play, plus on
// demand from the pause/map screens. The save holds the progression
// (cash, REP, skills, collectibles, stats, unlocks), the story state
// (missions done), and the player's position + vehicle, so Continue
// drops Ro exactly where she left off. Versioned: a save from another
// build is ignored, never loaded half-way.

const KEY = 'puerto-del-sol-save-v5';
const VERSION = 5;

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.version !== VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

export function writeSave(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...data, version: VERSION, savedAt: Date.now() }));
    return true;
  } catch {
    return false;
  }
}

export function clearSave() {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}

export function saveExists() {
  return loadSave() !== null;
}
