// Input — keyboard + mouse for a desktop browser. WASD moves/drives,
// mouse aims (pointer lock on the canvas), click shoots, Shift sprints,
// Space handbrakes, F enters/exits cars, E interacts, R reloads, 1–4
// switch weapons, Q toggles aim, M opens the map, Esc pauses, V
// switches the camera, N changes the radio station, H honks.
// The game reads `keys` + the look deltas each frame; edge-triggered
// actions go through `pressed()` so a held key fires once.

export class Controls {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.justPressed = new Set();
    this.lookDX = 0;
    this.lookDY = 0;
    this.mouseDown = false;
    this.mouseDownEdge = false;
    this.aimDown = false;
    this.locked = false;
    this.onPauseKey = null;
    this.onMapKey = null;
    this.onAnyKey = null;

    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.keys[e.code] = true;
      this.justPressed.add(e.code);
      if (e.code === 'Escape' && this.onPauseKey) this.onPauseKey();
      if (e.code === 'KeyM' && this.onMapKey) this.onMapKey();
      if (this.onAnyKey) this.onAnyKey();
      if (['Space', 'Tab'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });
    window.addEventListener('blur', () => { this.keys = {}; });

    canvas.addEventListener('click', () => {
      if (!this.locked && document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
      }
      if (this.onAnyKey) this.onAnyKey();
    });
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === canvas;
    });
    document.addEventListener('mousemove', (e) => {
      if (!this.locked) return;
      this.lookDX += e.movementX;
      this.lookDY += e.movementY;
    });
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) { this.mouseDown = true; this.mouseDownEdge = true; }
      if (e.button === 2) this.aimDown = true;
      if (this.onAnyKey) this.onAnyKey();
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouseDown = false;
      if (e.button === 2) this.aimDown = false;
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  down(code) { return !!this.keys[code]; }
  pressed(code) { return this.justPressed.has(code); }

  // WASD as a -1..1 pair: x = strafe right, y = forward.
  moveAxes() {
    const x = (this.down('KeyD') ? 1 : 0) - (this.down('KeyA') ? 1 : 0);
    const y = (this.down('KeyW') ? 1 : 0) - (this.down('KeyS') ? 1 : 0);
    return { x, y };
  }

  consumeLook() {
    const dx = this.lookDX, dy = this.lookDY;
    this.lookDX = 0; this.lookDY = 0;
    return { dx, dy };
  }

  endFrame() {
    this.justPressed.clear();
    this.mouseDownEdge = false;
  }

  get aiming() { return this.aimDown || this.down('KeyQ'); }
  get sprint() { return this.down('ShiftLeft') || this.down('ShiftRight'); }
  get handbrake() { return this.down('Space'); }
}
