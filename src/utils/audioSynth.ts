/**
 * Web Audio API synthesizer for ambient study sounds and session chimes.
 * Operates 100% offline with zero external audio assets.
 */

let audioCtx: AudioContext | null = null;
let currentAmbientNodes: {
  stop: () => void;
} | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type AmbientSoundType = 'none' | 'white_noise' | 'rain' | 'binaural_alpha' | 'deep_stream';

export function startAmbientSound(type: AmbientSoundType, volume = 0.5): void {
  stopAmbientSound();
  if (type === 'none') return;

  try {
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume)), ctx.currentTime);
    masterGain.connect(ctx.destination);

    if (type === 'white_noise') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();

      currentAmbientNodes = {
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch {
            // ignore
          }
        },
      };
    } else if (type === 'rain') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filter approximation
        lastOut = (lastOut * 0.95) + (white * 0.05);
        data[i] = lastOut * 3;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, ctx.currentTime);

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();

      currentAmbientNodes = {
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch {
            // ignore
          }
        },
      };
    } else if (type === 'binaural_alpha') {
      // Left ear 210 Hz, Right ear 200 Hz -> 10 Hz Alpha beat
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      oscL.frequency.setValueAtTime(210, ctx.currentTime);
      oscR.frequency.setValueAtTime(200, ctx.currentTime);
      oscL.type = 'sine';
      oscR.type = 'sine';

      const merger = ctx.createChannelMerger(2);
      oscL.connect(merger, 0, 0); // left
      oscR.connect(merger, 0, 1); // right

      merger.connect(masterGain);
      oscL.start();
      oscR.start();

      currentAmbientNodes = {
        stop: () => {
          try {
            oscL.stop();
            oscR.stop();
            oscL.disconnect();
            oscR.disconnect();
          } catch {
            // ignore
          }
        },
      };
    } else if (type === 'deep_stream') {
      // Gentle stream / wave oscillation
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();

      currentAmbientNodes = {
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch {
            // ignore
          }
        },
      };
    }
  } catch (err) {
    console.warn('Audio synthesis initialized with fallback:', err);
  }
}

export function stopAmbientSound(): void {
  if (currentAmbientNodes) {
    try {
      currentAmbientNodes.stop();
    } catch {
      // ignore
    }
    currentAmbientNodes = null;
  }
}

export function playCompletionChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);

      gain.gain.setValueAtTime(0.001, now + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.3, now + index * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 0.85);
    });
  } catch (err) {
    console.warn('Could not play chime:', err);
  }
}

export function playTaskAlertChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // A two-tone bell chime (A5 -> D6)
    const tones = [880, 1174.66];
    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(0.001, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.35, now + idx * 0.15 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.65);
    });
  } catch (err) {
    console.warn('Could not play alert chime:', err);
  }
}

export function playVictoryChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Ascending major chord (C5, E5, G5, C6) with sparkle
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.001, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.55);
    });
  } catch (err) {
    console.warn('Could not play victory chime:', err);
  }
}
