// Web Audio sound effects — generated tones, no audio files. A single engine
// stops any active note before starting a new one so cues never overlap.

const SOUND_KEY = "hp_sound";

export function createSound() {
  let ctx = null;
  let soundOn = typeof window !== "undefined" ? localStorage.getItem(SOUND_KEY) !== "off" : true;
  let activeNodes = [];

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function stopAll() {
    activeNodes.forEach((n) => { try { n.stop(); } catch (e) {} });
    activeNodes = [];
  }

  function play(notes) {
    if (!soundOn) return;
    const c = ensure();
    if (!c) return;
    stopAll();
    const t0 = c.currentTime + 0.01;
    notes.forEach((n) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = n.type || "sine";
      osc.frequency.value = n.freq;
      const start = t0 + n.start;
      const peak = n.gain || 0.18;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(peak, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + n.dur);
      osc.connect(g);
      g.connect(c.destination);
      osc.start(start);
      osc.stop(start + n.dur + 0.02);
      activeNodes.push(osc);
    });
  }

  return {
    correct() {
      play([
        { freq: 659.25, start: 0,    dur: 0.12, type: "triangle" },
        { freq: 880.00, start: 0.10, dur: 0.18, type: "triangle" }
      ]);
    },
    wrong() {
      play([
        { freq: 220.00, start: 0,    dur: 0.18, type: "sawtooth", gain: 0.14 },
        { freq: 146.83, start: 0.12, dur: 0.28, type: "sawtooth", gain: 0.14 }
      ]);
    },
    fanfare() {
      play([
        { freq: 523.25, start: 0,    dur: 0.16, type: "triangle" },
        { freq: 659.25, start: 0.15, dur: 0.16, type: "triangle" },
        { freq: 783.99, start: 0.30, dur: 0.16, type: "triangle" },
        { freq: 1046.5, start: 0.45, dur: 0.40, type: "triangle" }
      ]);
    },
    tick() {
      play([{ freq: 440, start: 0, dur: 0.05, type: "square", gain: 0.05 }]);
    },
    isOn() { return soundOn; },
    toggle() {
      soundOn = !soundOn;
      if (typeof window !== "undefined") localStorage.setItem(SOUND_KEY, soundOn ? "on" : "off");
      if (soundOn) ensure();
      return soundOn;
    },
    warmUp() { ensure(); }
  };
}
