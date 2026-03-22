// Web Audio API sound feedback — no external files needed
let audioCtx = null
let muted = false

function getCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)() }
    catch { return null }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playTone(freq, duration = 0.12, type = 'sine', volume = 0.4, delay = 0) {
  if (muted) return
  const ctx = getCtx()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, ctx.currentTime + delay)
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)
  osc.start(ctx.currentTime + delay)
  osc.stop(ctx.currentTime + delay + duration + 0.05)
}

export const sounds = {
  workStart() {
    playTone(880, 0.1, 'sine', 0.35)
    playTone(1100, 0.12, 'sine', 0.3, 0.12)
  },
  restStart() {
    playTone(440, 0.12, 'sine', 0.3)
    playTone(330, 0.12, 'sine', 0.3, 0.15)
  },
  tick() { playTone(660, 0.07, 'sine', 0.2) },
  done() {
    playTone(523, 0.1, 'sine', 0.3, 0)
    playTone(659, 0.1, 'sine', 0.3, 0.1)
    playTone(784, 0.1, 'sine', 0.3, 0.2)
    playTone(1047, 0.25, 'sine', 0.35, 0.32)
  },
  tap() { playTone(800, 0.05, 'sine', 0.15) },
  setMuted(val) { muted = !!val },
  isMuted() { return muted },
}

export function unlockAudio() { getCtx() }
