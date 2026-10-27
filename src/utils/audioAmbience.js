// Web Audio API Procedural Royal Indian Ambient Sitar/Tanpura Drone
// Generates a meditative royal raga ambiance (Sa-Pa-Sa drone with gentle harmonics)

class RoyalAudioAmbience {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.oscillators = [];
    this.gainNode = null;
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  start() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Indian Classical Tanpura fundamental frequencies (Key of D / Raga Yaman mood)
    // D3: 146.83Hz (Sa), A3: 220Hz (Pa), D4: 293.66Hz (Sa high), F#3: 185.0Hz (Ga)
    const freqs = [
      { f: 146.83, type: 'sawtooth', gain: 0.08, lfoSpeed: 0.15 },
      { f: 220.00, type: 'triangle', gain: 0.06, lfoSpeed: 0.22 },
      { f: 293.66, type: 'sine', gain: 0.05, lfoSpeed: 0.31 },
      { f: 185.00, type: 'triangle', gain: 0.04, lfoSpeed: 0.18 },
      { f: 440.00, type: 'sine', gain: 0.02, lfoSpeed: 0.12 }
    ];

    this.oscillators = [];

    freqs.forEach((item) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      // Low pass filter to create warm organic sitar/tanpura wooden tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      // Gentle LFO for natural resonant Tanpura beating
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(item.lfoSpeed, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(item.gain * 0.4, this.ctx.currentTime);

      osc.type = item.type;
      osc.frequency.setValueAtTime(item.f, this.ctx.currentTime);
      oscGain.gain.setValueAtTime(item.gain, this.ctx.currentTime);

      lfo.connect(oscGain.gain);
      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start();
      lfo.start();

      this.oscillators.push({ osc, lfo, oscGain, filter });
    });

    // Smooth fade in
    this.masterGain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 2.5);
    this.isPlaying = true;
  }

  stop() {
    if (!this.ctx || !this.isPlaying) return;

    // Smooth fade out
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
    setTimeout(() => {
      this.oscillators.forEach(({ osc, lfo }) => {
        try {
          osc.stop();
          lfo.stop();
        } catch (e) {
          // ignore already stopped
        }
      });
      this.oscillators = [];
      this.isPlaying = false;
    }, 1300);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const royalAudio = new RoyalAudioAmbience();
