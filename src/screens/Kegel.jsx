import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sounds, unlockAudio } from '../hooks/useSound'
import { useSeenExercises } from '../hooks/useSeenExercises'

// ─── Constants ────────────────────────────────────────────────────────────────
const ANIM_META = {
  'kegel-breathe':  { color: '#ef4444' },
  'kegel-flick':    { color: '#f59e0b' },
  'kegel-elevator': { color: '#06b6d4' },
  'kegel-reverse':  { color: '#10b981' },
}

const TUTORIALS = {
  'kegel-breathe': {
    title: 'Long Hold',
    steps: [
      'Sit or lie comfortably. Relax glutes and thighs completely.',
      'Squeeze your pelvic floor UPWARD — like stopping urine mid-flow.',
      'Hold for the full duration. Breathe out slowly during the squeeze.',
      'Fully release between reps. The release is as important as the squeeze.',
    ],
    warning: 'Never hold your breath — it increases downward pressure.',
  },
  'kegel-flick': {
    title: 'Quick Flicks',
    steps: [
      'Same starting position as Long Hold.',
      'Contract FAST and release IMMEDIATELY — like a quick pulse.',
      'Each rep must fully release before the next squeeze.',
      'Stay relaxed everywhere else (abs, glutes, thighs).',
    ],
    warning: 'Quality over speed — each rep must fully release.',
  },
  'kegel-elevator': {
    title: 'Elevator',
    steps: [
      'Imagine your pelvic floor as an elevator shaft with 4 floors.',
      'Contract to Floor 1 (25%), hold, then rise to Floor 2 (50%)...',
      'Continue to Floor 3 (75%) then Floor 4 (100%). Hold at top.',
      'Descend floor by floor back to full release.',
    ],
    warning: "Each floor is a distinct level — don't rush between them.",
  },
  'kegel-reverse': {
    title: 'Reverse Kegel',
    steps: [
      'Instead of squeezing, you are RELEASING and lengthening.',
      'Breathe in, then gently push/expand your pelvic floor outward.',
      'Hold the outward expansion for the full timer duration.',
      'Should feel like a gentle stretch downward — no pain.',
    ],
    warning: 'Stop if you feel pain. Consult a physiotherapist.',
  },
}

// ─── Tutorial Modal (with Skip button) ──────────────────────────────────────
function TutorialModal({ animType, onDone }) {
  const meta = ANIM_META[animType] || ANIM_META['kegel-breathe']
  const tutorial = TUTORIALS[animType] || TUTORIALS['kegel-breathe']
  const [step, setStep] = useState(0)
  const isLast = step === tutorial.steps.length - 1

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', padding: '0 24px' }}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ background: '#111827', border: `1px solid ${meta.color}33` }}>

        {/* Header with Skip */}
        <div className="flex items-center justify-between"
          style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1f2937' }}>
          <div>
            <p className="text-xs uppercase tracking-wider mb-1"
              style={{ color: meta.color, fontWeight: 600 }}>First time</p>
            <h2 className="text-lg font-bold" style={{ color: '#f9fafb' }}>{tutorial.title}</h2>
          </div>
          <button onClick={onDone}
            style={{ fontSize: 12, color: '#4b5563', fontWeight: 500, padding: '6px 12px' }}>
            Skip
          </button>
        </div>

        {/* Step dots */}
        <div className="flex gap-1.5" style={{ padding: '16px 20px 12px' }}>
          {tutorial.steps.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full"
              style={{ background: i <= step ? meta.color : '#1f2937', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* Step content */}
        <div style={{ padding: '0 20px 16px', minHeight: 80 }}>
          <AnimatePresence mode="wait">
            <motion.p key={step}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: 14, lineHeight: 1.6, color: '#d1d5db' }}>
              <span style={{ fontWeight: 700, color: meta.color }}>Step {step + 1}: </span>
              {tutorial.steps[step]}
            </motion.p>
          </AnimatePresence>
        </div>

        {isLast && (
          <div style={{ margin: '0 20px 16px', padding: '12px 16px', borderRadius: 16,
            background: '#1a1a2e', fontSize: 12, color: '#9ca3af' }}>
            {tutorial.warning}
          </div>
        )}

        <div className="flex gap-2" style={{ padding: '0 20px 20px' }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 rounded-2xl font-semibold text-sm active:scale-95"
              style={{ padding: '12px', background: '#1f2937', color: '#9ca3af' }}>Back</button>
          )}
          <button onClick={() => isLast ? onDone() : setStep(s => s + 1)}
            className="flex-1 rounded-2xl font-bold text-sm active:scale-95"
            style={{ padding: '12px', background: meta.color, color: '#fff' }}>
            {isLast ? "Got it!" : 'Next'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Kegel Visual ─────────────────────────────────────────────────────────────
// Ring: ONE full rotation = entire drill duration. Dot leads the arc.
// Glow: appears during squeeze, trembles, stays within screen bounds.
function KagelVisual({ isSqueeze, totalProgress, totalTimeLeft, phaseLabel, color }) {
  const ringSize = 240
  const strokeW = 3
  const r = (ringSize - strokeW * 2) / 2
  const circ = 2 * Math.PI * r

  // totalProgress: 0→1 over the ENTIRE drill (e.g. 48 sec = one full rotation)
  const p = Math.min(1, Math.max(0, totalProgress))
  const arcOffset = circ * (1 - p)

  // Dot position in SVG local coords (before rotation)
  // SVG default: angle 0 = 3 o'clock (right). With rotate(90deg), right becomes bottom.
  // So in local coords: angle 0 = right = screen bottom after rotation.
  const angle = 2 * Math.PI * p
  const dotCx = ringSize / 2 + r * Math.cos(angle)
  const dotCy = ringSize / 2 + r * Math.sin(angle)

  // Glow size: 85vw but maxed at 380px so it never overflows the screen
  // Trembling: subtle scale oscillation via CSS animation
  const glowSize = 'min(85vw, 380px)'

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-center overflow-hidden">

      {/* ── GLOW — only during squeeze ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            opacity: isSqueeze ? 1 : 0,
            scale: isSqueeze ? 1 : 0.2,
          }}
          transition={{
            opacity: { duration: isSqueeze ? 0.6 : 0.4 },
            scale: { duration: isSqueeze ? 0.8 : 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
          className={isSqueeze ? 'kegel-tremble' : ''}
          style={{
            width: glowSize, height: glowSize, flexShrink: 0, borderRadius: '50%',
            background: `radial-gradient(circle at center,
              transparent 0%,
              transparent 20%,
              ${color}15 26%,
              ${color}44 32%,
              ${color}88 40%,
              ${color}cc 48%,
              ${color}ff 55%,
              ${color}dd 62%,
              ${color}88 70%,
              ${color}44 80%,
              ${color}11 90%,
              transparent 100%)`,
          }}
        />
      </div>

      {/* ── Subtle dark halo during RELAX ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ opacity: isSqueeze ? 0 : 0.5 }}
          transition={{ duration: 0.5 }}
          style={{
            width: ringSize + 50, height: ringSize + 50, flexShrink: 0, borderRadius: '50%',
            background: 'radial-gradient(circle, #161626 0%, #10101a 45%, transparent 68%)',
          }}
        />
      </div>

      {/* ── RING ── */}
      <div className="relative flex items-center justify-center z-10"
        style={{ width: ringSize, height: ringSize }}>

        {/* SVG ring — rotate(90deg) so arc starts at bottom */}
        <svg width={ringSize} height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(90deg)' }}>
          {/* Track */}
          <circle cx={ringSize / 2} cy={ringSize / 2} r={r}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} />
          {/* Filled arc */}
          <circle cx={ringSize / 2} cy={ringSize / 2} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={arcOffset}
          />
          {/* Dot at head of arc (leads the fill) */}
          {p > 0.003 && p < 0.997 && (
            <circle cx={dotCx} cy={dotCy} r={5} fill="white"
              style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }} />
          )}
        </svg>

        {/* Tick mark at bottom (start/end) — not rotated */}
        <svg width={ringSize} height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          style={{ position: 'absolute', top: 0, left: 0 }}>
          <line
            x1={ringSize / 2} y1={ringSize / 2 + r - 7}
            x2={ringSize / 2} y2={ringSize / 2 + r + 7}
            stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} strokeLinecap="round" />
        </svg>

        {/* Dark center — only when glow is showing */}
        <div className="rounded-full flex flex-col items-center justify-center"
          style={{
            width: ringSize - strokeW * 2 - 18,
            height: ringSize - strokeW * 2 - 18,
            background: isSqueeze ? 'rgba(6,6,16,0.88)' : 'transparent',
            transition: 'background 0.5s ease',
          }}>
          {/* Total time left */}
          <span className="font-bold tabular-nums leading-none"
            style={{ fontSize: 56, color: '#fff', letterSpacing: '-2px' }}>
            {totalTimeLeft}
          </span>

          {/* Phase label */}
          <AnimatePresence mode="wait">
            <motion.span key={phaseLabel}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 8, fontWeight: 500 }}>
              {phaseLabel}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Breathing instruction — clearly visible below ring */}
      <div style={{ marginTop: 24, minHeight: 24, textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.p key={phaseLabel}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, letterSpacing: '0.03em', fontWeight: 500 }}>
            {isSqueeze ? 'breathe out slowly' : 'breathe in, full release'}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Drill Timer Hook ─────────────────────────────────────────────────────────
// One rAF timer for the entire drill.
// totalProgress: 0→1 over entire drill (one ring rotation).
// Phase (squeeze/release) derived from elapsed time.
function useDrillTimer(holdSec, restSec, reps, paused, onComplete, resetKey) {
  const totalDuration = (holdSec + restSec) * reps
  const cycleDuration = holdSec + restSec

  const [state, setState] = useState({
    totalTimeLeft: totalDuration,
    totalProgress: 0,       // 0→1 for ONE full ring rotation
    phaseLabel: 'Contract & hold',
    isSqueeze: true,
  })

  const startTs = useRef(null)
  const pausedElapsed = useRef(0)
  const rafId = useRef(null)
  const doneRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const lastSqueezeRef = useRef(null)

  useEffect(() => {
    startTs.current = null
    pausedElapsed.current = 0
    doneRef.current = false
    lastSqueezeRef.current = null
    setState({
      totalTimeLeft: totalDuration,
      totalProgress: 0,
      phaseLabel: 'Contract & hold',
      isSqueeze: true,
    })
  }, [resetKey, totalDuration])

  useEffect(() => {
    if (paused || doneRef.current || totalDuration <= 0) {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      return
    }

    const tick = (now) => {
      if (startTs.current === null) startTs.current = now - pausedElapsed.current * 1000

      const elapsed = (now - startTs.current) / 1000
      pausedElapsed.current = elapsed
      const remaining = Math.max(0, totalDuration - elapsed)

      if (remaining <= 0 && !doneRef.current) {
        doneRef.current = true
        setState(s => ({ ...s, totalTimeLeft: 0, totalProgress: 1, phaseLabel: 'Done' }))
        onCompleteRef.current?.()
        return
      }

      // Derive phase
      const cycleElapsed = elapsed % cycleDuration
      const isSqueeze = cycleElapsed < holdSec

      // Phase transition sounds
      if (lastSqueezeRef.current !== null && lastSqueezeRef.current !== isSqueeze) {
        if (isSqueeze) sounds.workStart()
        else sounds.restStart()
      }
      lastSqueezeRef.current = isSqueeze

      // (haptic handled via separate interval below)

      setState({
        totalTimeLeft: Math.ceil(remaining),
        totalProgress: elapsed / totalDuration,
        phaseLabel: isSqueeze ? 'Contract & hold' : 'Relax',
        isSqueeze,
      })

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current) }
  }, [paused, totalDuration, cycleDuration, holdSec, restSec, reps, resetKey])

  useEffect(() => {
    if (paused) {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      if (navigator.vibrate) try { navigator.vibrate(0) } catch (e) {} // stop vibration
    } else {
      startTs.current = null
    }
  }, [paused])

  return state
}

// ─── Main Session Overlay ─────────────────────────────────────────────────────
export default function KagelSessionOverlay({ session, week, onClose, onComplete }) {
  const exercises = week.sessions[session]
  const [exIdx, setExIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [started, setStarted] = useState(false)
  const [allDone, setAllDone] = useState(false)
  const [drillResetKey, setDrillResetKey] = useState(0)

  const currentEx = exercises[exIdx]
  const meta = ANIM_META[currentEx?.anim] || ANIM_META['kegel-breathe']
  const color = meta.color

  // Mute handling
  const prevMuted = useRef(isMuted)
  useEffect(() => {
    if (isMuted !== prevMuted.current) {
      prevMuted.current = isMuted
      // Toggle sound module
      if (typeof sounds.setMuted === 'function') sounds.setMuted(isMuted)
    }
  }, [isMuted])

  // Tutorial
  const { hasSeenExercise, markExerciseSeen } = useSeenExercises()
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    if (currentEx && !hasSeenExercise(currentEx.anim)) {
      setShowTutorial(true)
      setIsPaused(true)
    }
  }, [exIdx]) // eslint-disable-line

  const handleTutorialDone = () => {
    if (currentEx) markExerciseSeen(currentEx.anim)
    setShowTutorial(false)
    setIsPaused(false)
  }

  // Initial countdown
  useEffect(() => {
    if (started || showTutorial) return
    if (countdown <= 0) {
      setStarted(true)
      sounds.workStart()
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, started, showTutorial])

  // Drill timer
  const drillState = useDrillTimer(
    currentEx?.holdSec || 3,
    currentEx?.restSec || 3,
    currentEx?.reps || 8,
    !started || isPaused || showTutorial,
    () => {
      if (exIdx < exercises.length - 1) {
        setExIdx(i => i + 1)
        setDrillResetKey(k => k + 1)
      } else {
        setAllDone(true)
        sounds.done()
        onComplete?.()
      }
    },
    `${exIdx}-${drillResetKey}`
  )

  // Haptic vibration during squeeze — interval-based for reliability
  useEffect(() => {
    if (!started || isPaused || !drillState.isSqueeze) {
      if (navigator.vibrate) try { navigator.vibrate(0) } catch (e) {}
      return
    }
    // Pulse vibration every 700ms during squeeze
    const vibrate = () => {
      if (navigator.vibrate) try { navigator.vibrate(80) } catch (e) {}
    }
    vibrate() // immediate first pulse
    const id = setInterval(vibrate, 700)
    return () => {
      clearInterval(id)
      if (navigator.vibrate) try { navigator.vibrate(0) } catch (e) {}
    }
  }, [started, isPaused, drillState.isSqueeze])

  const skipForward = () => {
    sounds.tap()
    if (exIdx < exercises.length - 1) {
      setExIdx(i => i + 1)
      setDrillResetKey(k => k + 1)
    } else {
      setAllDone(true)
      sounds.done()
      onComplete?.()
    }
  }

  const skipBack = () => {
    sounds.tap()
    if (exIdx > 0) {
      setExIdx(i => i - 1)
      setDrillResetKey(k => k + 1)
    }
  }

  // ── DONE ──
  if (allDone) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: '#080810', padding: '0 24px' }}>
        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.6 }}
          style={{ fontSize: 72, marginBottom: 20 }}>🌸</motion.div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#f9fafb' }}>Session Complete!</h2>
        <p className="text-sm mb-8 text-center" style={{ color: '#6b7280' }}>
          {exercises.length} exercises
        </p>
        <button onClick={onClose}
          className="w-full max-w-xs py-4 rounded-2xl font-bold active:scale-95"
          style={{ background: '#8b5cf6', color: '#fff' }}>Done</button>
      </motion.div>
    )
  }

  // ── COUNTDOWN ──
  if (!started) {
    return (
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 280 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: '#080810' }}
        onPointerDown={unlockAudio}>
        <AnimatePresence>
          {showTutorial && currentEx && (
            <TutorialModal animType={currentEx.anim} onDone={handleTutorialDone} />
          )}
        </AnimatePresence>
        <motion.span key={countdown}
          initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: 96, fontWeight: 800, color: '#fff' }}>
          {countdown > 0 ? countdown : 'Go!'}
        </motion.span>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 12 }}>Get Ready</p>
      </motion.div>
    )
  }

  // ── ACTIVE ──
  // Layout: top bar → exercise name → [flex-1: ring+glow centered] → breathing text → controls at bottom
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#080810' }}
      onPointerDown={unlockAudio}>

      <AnimatePresence>
        {showTutorial && currentEx && (
          <TutorialModal animType={currentEx.anim} onDone={handleTutorialDone} />
        )}
      </AnimatePresence>

      {/* ── TOP: close + session title + mute ── */}
      <div className="flex-shrink-0 flex items-center justify-between"
        style={{
          paddingTop: 'max(56px, calc(env(safe-area-inset-top) + 12px))',
          paddingBottom: 4, paddingLeft: 20, paddingRight: 20,
        }}>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#6b7280', fontSize: 14 }}>✕</button>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)' }}>
          {session === 'morning' ? '☀️' : '🌙'} {session.toUpperCase()} · {week.label.split('·')[0].trim()}
        </p>
        <button onClick={() => setIsMuted(m => !m)}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90"
          style={{ background: 'rgba(255,255,255,0.06)', color: isMuted ? '#ef4444' : '#6b7280', fontSize: 16 }}>
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* ── EXERCISE NAME (near top) ── */}
      <div className="flex-shrink-0 text-center" style={{ padding: '8px 20px 0' }}>
        <AnimatePresence mode="wait">
          <motion.div key={exIdx}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#f9fafb' }}>{currentEx?.name}</p>
            <p style={{ fontSize: 12, color: '#4b5563', marginTop: 3 }}>{currentEx?.cue}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── CENTER: Ring + Glow (takes all remaining space) ── */}
      <KagelVisual
        isSqueeze={drillState.isSqueeze}
        totalProgress={drillState.totalProgress}
        totalTimeLeft={drillState.totalTimeLeft}
        phaseLabel={drillState.phaseLabel}
        color={color}
      />

      {/* ── BOTTOM ZONE: pinned to screen bottom ── */}
      <div className="flex-shrink-0" style={{ background: '#080810' }}>

        {/* Exercise tabs */}
        <div className="overflow-x-auto" style={{ padding: '0 20px 8px', scrollbarWidth: 'none' }}>
          <div className="flex gap-4 items-center" style={{ whiteSpace: 'nowrap' }}>
            <button onClick={() => { setShowTutorial(true); setIsPaused(true) }}
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: '#1a1a2e', color: '#4b5563', fontSize: 12 }}>?</button>
            {exercises.map((ex, i) => (
              <span key={i} style={{
                fontSize: 13, fontWeight: i === exIdx ? 700 : 400,
                color: i === exIdx ? '#fff' : i < exIdx ? '#2a2a3e' : '#3a3a4e',
              }}>
                {i < exIdx ? '✓ ' : ''}{ex.name}
              </span>
            ))}
          </div>
        </div>

        {/* Controls: back / pause / forward */}
        <div className="flex items-center gap-3"
          style={{ padding: '0 20px', paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
          <button onClick={skipBack}
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90"
            style={{ background: '#1a1a2e', color: '#6b7280', fontSize: 20 }}>‹</button>
          <button onClick={() => { setIsPaused(p => !p); sounds.tap() }}
            className="flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95"
            style={{
              background: isPaused ? color : '#1a1a2e',
              color: isPaused ? '#fff' : '#9ca3af',
              border: isPaused ? 'none' : '1px solid #1f293733',
            }}>
            {isPaused ? '▶  Resume' : '⏸  Pause'}
          </button>
          <button onClick={skipForward}
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90"
            style={{ background: '#1a1a2e', color: '#6b7280', fontSize: 20 }}>›</button>
        </div>
      </div>
    </motion.div>
  )
}
