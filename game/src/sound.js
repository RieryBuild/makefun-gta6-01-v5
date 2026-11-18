// Sound — everything synthesized with the Web Audio API, zero audio
// files. Three radio stations (procedural loops: synthwave, latin
// groove, chill pads), an engine hum that follows speed, a two-tone
// siren that follows the nearest cruiser, gunshots, and UI blips.
// Audio starts on the first user gesture (autoplay policy) and stays
// muted until then; M toggles mute. Screenshots don't need audio, so
// a missing AudioContext never breaks the game.

export const STATIONS = [
  { id: 'sol', name: 'RADIO SOL 92.5', show: 'Sunset Sounds', color: '#ff9ad8' },
  { id: 'wave', name: 'WAVE 88.1', show: 'Neon Drive', color: '#2ec4b6' },
  { id: 'luna', name: 'LUNA FM 101.9', show: 'Night Tide', color: '#c8c8ff' },
];

export class Sound {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
    this.stationIdx = 0;
    this.radioNodes = [];
    this.radioTimer = null;
    this.engineOsc = null;
    this.engineGain = null;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.sirenFlip = false;
    this.sirenTimer = null;
  }

  // Create the context if missing. Never resumes here — resume() on a
  // suspended context logs a warning per call, and setEngine/setSiren
  // call ensure() every frame. Only unlock() resumes, and only from a
  // user gesture.
  ensure() {
    if (this.ctx) return true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.5;
      this.master.connect(this.ctx.destination);
      return true;
    } catch {
      return false;
    }
  }

  // Call from a user gesture only: creates + resumes the context.
  unlock() {
    if (!this.ensure()) return false;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.5;
  }

  get station() { return STATIONS[this.stationIdx]; }

  nextStation() {
    this.stationIdx = (this.stationIdx + 1) % STATIONS.length;
    this.startRadio();
    return this.station;
  }

  // A station loop: a bass line + a lead arp, scheduled per bar.
  // Each station has its own scale + tempo + timbre.
  startRadio() {
    if (!this.ensure()) return;
    this.stopRadio();
    const st = this.station;
    const ctx = this.ctx;
    const gain = ctx.createGain();
    gain.gain.value = 0.16;
    gain.connect(this.master);
    this.radioNodes.push(gain);
    const scales = {
      sol: { bpm: 96, root: 220, notes: [0, 3, 5, 7, 10, 12], wave: 'sawtooth' },
      wave: { bpm: 116, root: 196, notes: [0, 2, 4, 7, 9, 12], wave: 'square' },
      luna: { bpm: 78, root: 174.6, notes: [0, 3, 5, 7, 10, 12, 15], wave: 'triangle' },
    };
    const cfg = scales[st.id] || scales.sol;
    const barMs = (60 / cfg.bpm) * 4 * 1000;
    let step = 0;
    const playBar = () => {
      if (!this.ctx) return;
      const t0 = ctx.currentTime + 0.05;
      const beat = 60 / cfg.bpm;
      // Bass: root + fifth, one note per beat.
      for (let b = 0; b < 4; b++) {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = cfg.root / 2 * (b === 3 ? 1.5 : 1);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.5, t0 + b * beat);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + b * beat + beat * 0.9);
        o.connect(g).connect(gain);
        o.start(t0 + b * beat);
        o.stop(t0 + b * beat + beat);
      }
      // Lead arp: 8th notes cycling the scale.
      for (let n = 0; n < 8; n++) {
        const note = cfg.notes[(step * 3 + n) % cfg.notes.length];
        const o = ctx.createOscillator();
        o.type = cfg.wave;
        o.frequency.value = cfg.root * Math.pow(2, note / 12);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.12, t0 + n * beat / 2);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + n * beat / 2 + beat * 0.45);
        o.connect(g).connect(gain);
        o.start(t0 + n * beat / 2);
        o.stop(t0 + n * beat / 2 + beat * 0.5);
      }
      step++;
    };
    playBar();
    this.radioTimer = setInterval(playBar, barMs);
  }

  stopRadio() {
    if (this.radioTimer) { clearInterval(this.radioTimer); this.radioTimer = null; }
    for (const n of this.radioNodes) { try { n.disconnect(); } catch { /* noop */ } }
    this.radioNodes = [];
  }

  // Engine: a saw osc through a lowpass, pitch + loudness by speed.
  setEngine(speed, driving) {
    if (!this.ensure()) return;
    if (!this.engineOsc) {
      const ctx = this.ctx;
      this.engineOsc = ctx.createOscillator();
      this.engineOsc.type = 'sawtooth';
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      this.engineGain = ctx.createGain();
      this.engineGain.gain.value = 0;
      this.engineOsc.connect(filter).connect(this.engineGain).connect(this.master);
      this.engineOsc.start();
    }
    const target = driving ? 0.05 + Math.min(0.1, speed * 0.002) : 0;
    this.engineGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.15);
    this.engineOsc.frequency.setTargetAtTime(55 + speed * 2.4, this.ctx.currentTime, 0.1);
  }

  // Siren: two alternating tones, loudness by the nearest cruiser.
  setSiren(distance) {
    if (!this.ensure()) return;
    if (distance == null || distance > 80) {
      if (this.sirenGain) this.sirenGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      return;
    }
    if (!this.sirenOsc) {
      const ctx = this.ctx;
      this.sirenOsc = ctx.createOscillator();
      this.sirenOsc.type = 'triangle';
      this.sirenGain = ctx.createGain();
      this.sirenGain.gain.value = 0;
      this.sirenOsc.connect(this.sirenGain).connect(this.master);
      this.sirenOsc.start();
      this.sirenTimer = setInterval(() => {
        if (!this.sirenOsc) return;
        this.sirenFlip = !this.sirenFlip;
        this.sirenOsc.frequency.setTargetAtTime(this.sirenFlip ? 880 : 660, this.ctx.currentTime, 0.05);
      }, 380);
    }
    const vol = 0.09 * (1 - distance / 80);
    this.sirenGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.2);
  }

  shot() {
    if (!this.ensure()) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = 0.5;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 1800;
    src.connect(f).connect(g).connect(this.master);
    src.start(t);
  }

  blip(freq = 660, dur = 0.09, vol = 0.2) {
    if (!this.ensure()) return;
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g).connect(this.master);
    o.start();
    o.stop(ctx.currentTime + dur);
  }

  jingle() { // mission passed: three rising notes
    if (!this.ensure()) return;
    [523, 659, 784].forEach((f, i) => {
      setTimeout(() => this.blip(f, 0.16, 0.25), i * 110);
    });
  }

  sting() { // wasted / busted: two falling notes
    if (!this.ensure()) return;
    [392, 262].forEach((f, i) => {
      setTimeout(() => this.blip(f, 0.3, 0.25), i * 200);
    });
  }
}
