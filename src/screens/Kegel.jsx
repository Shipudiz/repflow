import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sounds, unlockAudio } from '../hooks/useSound'
import { useSeenExercises } from '../hooks/useSeenExercises'

// ─── Constants ────────────────────────────────────────────────────────────────
const ANIM_META = {
  'kegel-breathe':  { color: '#b3c5ff', label: 'Long Hold' },
  'kegel-flick':    { color: '#b3c5ff', label: 'Short Flicks' },
  'kegel-elevator': { color: '#b3c5ff', label: 'Elevator' },
  'kegel-reverse':  { color: '#b3c5ff', label: 'Reverse Kegel' },
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

// ─── Font helpers ─────────────────────────────────────────────────────────────
const plusJakarta = "'Plus Jakarta Sans', sans-serif"
const inter = "'Inter', sans-serif"

// ─── Tutorial Modal ──────────────────────────────────────────────────────────
function TutorialModal({ animType, onDone }) {
  const meta = ANIM_META[animType] || ANIM_META['kegel-breathe']
  const tutorial = TUTORIALS[animType] || TUTORIALS['kegel-breathe']
  const [step, setStep] = useState(0)
  const isLast = step === tutorial.steps.length - 1

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 70,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.92)', padding: '0 24px',
      }}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%', maxWidth: 384, borderRadius: 24, overflow: 'hidden',
          background: '#201f1f', border: `1px solid ${meta.color}33`,
        }}>

        {/* Header with Skip */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 20px 16px', borderBottom: '1px solid #353534',
        }}>
          <div>
            <p style={{
              fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em',
              marginBottom: 4, color: meta.color, fontWeight: 600, fontFamily: inter,
            }}>First time</p>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e5e2e1', fontFamily: plusJakarta }}>
              {tutorial.title}
            </h2>
          </div>
          <button onClick={onDone}
            style={{
              fontSize: 12, color: '#8d90a2', fontWeight: 500, padding: '6px 12px',
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: inter,
            }}>
            Skip
          </button>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 6, padding: '16px 20px 12px' }}>
          {tutorial.steps.map((_, i) => (
            <div key={i} style={{
              height: 4, flex: 1, borderRadius: 2,
              background: i <= step ? meta.color : '#353534',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* Step content */}
        <div style={{ padding: '0 20px 16px', minHeight: 80 }}>
          <AnimatePresence mode="wait">
            <motion.p key={step}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: 14, lineHeight: 1.6, color: '#d1d5db', fontFamily: inter }}>
              <span style={{ fontWeight: 700, color: meta.color }}>Step {step + 1}: </span>
              {tutorial.steps[step]}
            </motion.p>
          </AnimatePresence>
        </div>

        {isLast && (
          <div style={{
            margin: '0 20px 16px', padding: '12px 16px', borderRadius: 16,
            background: '#353534', fontSize: 12, color: '#8d90a2', fontFamily: inter,
          }}>
            {tutorial.warning}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, padding: '0 20px 20px' }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1, padding: 12, borderRadius: 16, fontWeight: 600, fontSize: 14,
                background: '#353534', color: '#8d90a2', border: 'none', cursor: 'pointer',
                fontFamily: plusJakarta,
              }}>Back</button>
          )}
          <button onClick={() => isLast ? onDone() : setStep(s => s + 1)}
            style={{
              flex: 1, padding: 12, borderRadius: 16, fontWeight: 700, fontSize: 14,
              background: meta.color, color: '#131313', border: 'none', cursor: 'pointer',
              fontFamily: plusJakarta,
            }}>
            {isLast ? "Got it!" : 'Next'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Timer Ring Component ─────────────────────────────────────────────────────
function TimerRing({ isSqueeze, totalProgress, totalTimeLeft }) {
  const ringSize = 192
  const strokeW = 3
  const r = (ringSize - strokeW * 2) / 2
  const circ = 2 * Math.PI * r

  const p = Math.min(1, Math.max(0, totalProgress))
  const arcOffset = circ * (1 - p)

  // Dot position
  const angle = -Math.PI / 2 + 2 * Math.PI * p
  const dotCx = ringSize / 2 + r * Math.cos(angle)
  const dotCy = ringSize / 2 + r * Math.sin(angle)

  const strokeColor = '#6ba3ff'

  // Squeeze circle: trembling animation via CSS keyframes
  const trembleKeyframes = `
    @keyframes tremble {
      0%, 100% { transform: translate(0, 0) scale(1.35); }
      10% { transform: translate(-2px, 1px) scale(1.36); }
      20% { transform: translate(2px, -1px) scale(1.34); }
      30% { transform: translate(-1px, -2px) scale(1.36); }
      40% { transform: translate(1px, 2px) scale(1.35); }
      50% { transform: translate(-2px, -1px) scale(1.34); }
      60% { transform: translate(2px, 1px) scale(1.36); }
      70% { transform: translate(-1px, 2px) scale(1.35); }
      80% { transform: translate(1px, -2px) scale(1.34); }
      90% { transform: translate(-2px, 0px) scale(1.36); }
    }
  `

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Inject tremble keyframes */}
      <style>{trembleKeyframes}</style>

      {/* Squeeze glow circle — behind everything, scales up + trembles on squeeze, gone on release */}
      <motion.div
        animate={{
          opacity: isSqueeze ? 1 : 0,
          scale: isSqueeze ? 1.35 : 0.5,
        }}
        transition={{
          opacity: { duration: isSqueeze ? 0.3 : 0.4 },
          scale: { duration: isSqueeze ? 0.5 : 0.4, ease: [0.16, 1, 0.3, 1] },
        }}
        style={{
          position: 'absolute',
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,91,230,0) 75%, #005BE6 100%)',
          pointerEvents: 'none',
          animation: isSqueeze ? 'tremble 0.15s ease-in-out infinite' : 'none',
        }}
      />

      {/* SVG Ring + timer text */}
      <div style={{ position: 'relative', width: ringSize, height: ringSize }}>
        <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}
          style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Track */}
          <circle cx={ringSize / 2} cy={ringSize / 2} r={r}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeW} />
          {/* Progress arc — always blue */}
          <circle cx={ringSize / 2} cy={ringSize / 2} r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={arcOffset}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              filter: `drop-shadow(0 0 6px ${strokeColor}88)`,
            }}
          />
          {/* Dot at head of arc */}
          {p > 0.003 && p < 0.997 && (
            <circle
              cx={dotCx} cy={dotCy} r={4}
              fill="white"
              style={{ filter: `drop-shadow(0 0 5px ${strokeColor})` }}
            />
          )}
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: plusJakarta, fontWeight: 800, fontSize: 45,
            color: '#e5e2e1', letterSpacing: '-1.5px', lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {totalTimeLeft}
          </span>
          <span style={{
            fontFamily: inter, fontWeight: 600, fontSize: 9,
            color: '#8d90a2', textTransform: 'uppercase', letterSpacing: '0.1em',
            marginTop: 6,
          }}>
            REMAINING
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Drill Timer Hook ─────────────────────────────────────────────────────────
function useDrillTimer(holdSec, restSec, reps, paused, onComplete, resetKey) {
  const totalDuration = (holdSec + restSec) * reps
  const cycleDuration = holdSec + restSec

  const [state, setState] = useState({
    totalTimeLeft: totalDuration,
    totalProgress: 0,
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

      const cycleElapsed = elapsed % cycleDuration
      const isSqueeze = cycleElapsed < holdSec

      if (lastSqueezeRef.current !== null && lastSqueezeRef.current !== isSqueeze) {
        if (isSqueeze) sounds.workStart()
        else sounds.restStart()
      }
      lastSqueezeRef.current = isSqueeze

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
      if (navigator.vibrate) try { navigator.vibrate(0) } catch (e) {}
    } else {
      startTs.current = null
    }
  }, [paused])

  return state
}

// ─── Session Timeline ─────────────────────────────────────────────────────────
function SessionTimeline({ exercises, exIdx, drillProgress }) {
  const totalSegments = exercises.length
  const completedSegments = exIdx
  const currentProgress = drillProgress || 0
  const overallProgress = Math.round(((completedSegments + currentProgress) / totalSegments) * 100)

  return (
    <div style={{ padding: '0 32px', marginBottom: 16 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: inter, fontWeight: 600, fontSize: 9,
          color: '#8d90a2', textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>Session Timeline</span>
        <span style={{
          fontFamily: inter, fontWeight: 600, fontSize: 9,
          color: '#8d90a2', textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>{overallProgress}% Complete</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {exercises.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2, overflow: 'hidden',
            background: '#353534',
          }}>
            <motion.div
              animate={{
                width: i < exIdx ? '100%' : i === exIdx ? `${currentProgress * 100}%` : '0%',
              }}
              transition={{ duration: 0.3 }}
              style={{
                height: '100%', borderRadius: 2,
                background: '#b3c5ff',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Stats Grid ───────────────────────────────────────────────────────────────
function StatsGrid({ currentSet, totalSets, elapsedTime }) {
  const mins = Math.floor(elapsedTime / 60)
  const secs = elapsedTime % 60
  const timeStr = `${mins}:${String(secs).padStart(2, '0')}`

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
      padding: '0 32px', marginBottom: 16,
    }}>
      {[
        { label: 'SET', value: `${currentSet} / ${totalSets}` },
        { label: 'TOTAL TIME', value: timeStr },
      ].map(({ label, value }) => (
        <div key={label} style={{
          background: '#1c1b1b', borderRadius: 8, padding: '14px 16px',
          borderBottom: '2px solid #b3c5ff',
        }}>
          <span style={{
            fontFamily: inter, fontWeight: 600, fontSize: 9,
            color: '#8d90a2', textTransform: 'uppercase', letterSpacing: '0.08em',
            display: 'block', marginBottom: 4,
          }}>{label}</span>
          <span style={{
            fontFamily: plusJakarta, fontWeight: 700, fontSize: 18,
            color: '#e5e2e1', fontVariantNumeric: 'tabular-nums',
          }}>{value}</span>
        </div>
      ))}
    </div>
  )
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
  const [totalElapsed, setTotalElapsed] = useState(0)
  const elapsedRef = useRef(null)

  const currentEx = exercises[exIdx]
  const meta = ANIM_META[currentEx?.anim] || ANIM_META['kegel-breathe']

  // Track total elapsed time
  useEffect(() => {
    if (!started || isPaused || allDone) {
      clearInterval(elapsedRef.current)
      return
    }
    elapsedRef.current = setInterval(() => setTotalElapsed(e => e + 1), 1000)
    return () => clearInterval(elapsedRef.current)
  }, [started, isPaused, allDone])

  // Mute handling
  const prevMuted = useRef(isMuted)
  useEffect(() => {
    if (isMuted !== prevMuted.current) {
      prevMuted.current = isMuted
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

  // Haptic vibration during squeeze
  useEffect(() => {
    if (!started || isPaused || !drillState.isSqueeze) {
      if (navigator.vibrate) try { navigator.vibrate(0) } catch (e) {}
      return
    }
    const vibrate = () => {
      if (navigator.vibrate) try { navigator.vibrate(80) } catch (e) {}
    }
    vibrate()
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

  // Calculate total session duration
  const totalSessionSec = exercises.reduce((sum, ex) =>
    sum + (ex.holdSec + ex.restSec) * ex.reps * (ex.sets || 1), 0)
  const sessionMins = Math.floor(totalSessionSec / 60)
  const sessionSecs = totalSessionSec % 60

  // ── DONE ──
  if (allDone) {
    const confettiColors = ['#b3c5ff', '#6ba3ff', '#10b981', '#f59e0b', '#3b82f6', '#ec4899']
    const confetti = Array.from({ length: 24 }, (_, i) => ({
      color: confettiColors[i % confettiColors.length],
      x: `${(Math.random() - 0.5) * 240}px`,
      y: `${Math.random() * 200 + 80}px`,
      r: `${Math.random() * 720 - 360}deg`,
      delay: `${Math.random() * 0.6}s`,
      duration: `${1.2 + Math.random() * 0.8}s`,
    }))

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#131313', padding: '0 24px',
        }}>

        {/* Confetti burst */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', overflow: 'hidden',
        }}>
          {confetti.map((c, i) => (
            <div key={i} className="confetti-particle"
              style={{
                background: c.color,
                '--x': c.x, '--y': c.y, '--r': c.r,
                '--delay': c.delay, '--duration': c.duration,
                animationDelay: c.delay,
                animationDuration: c.duration,
              }} />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
          style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(179,197,255,0.2) 0%, transparent 70%)',
            border: '2px solid rgba(179,197,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24,
            boxShadow: '0 0 40px rgba(179,197,255,0.2)',
          }}>
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.6, delay: 0.3 }}
            style={{ fontSize: 44 }}>&#x1F338;</motion.span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#e5e2e1',
            fontFamily: plusJakarta,
          }}>
          Session Complete!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: 14, marginBottom: 24, textAlign: 'center',
            color: '#8d90a2', fontFamily: inter,
          }}>
          Great work on your {session} session
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          {[
            { label: 'Exercises', value: exercises.length },
            { label: 'Duration', value: `${sessionMins}:${String(sessionSecs).padStart(2, '0')}` },
            { label: 'Types', value: [...new Set(exercises.map(e => e.anim))].length },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 18, fontWeight: 700, color: '#e5e2e1', fontFamily: plusJakarta,
              }}>{value}</div>
              <div style={{
                fontSize: 11, color: '#8d90a2', marginTop: 2, fontFamily: inter,
              }}>{label}</div>
            </div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={onClose}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', maxWidth: 320, padding: '16px 0', borderRadius: 16,
            fontWeight: 700, fontSize: 14, color: '#fff', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #4a7dff 0%, #6ba3ff 100%)',
            fontFamily: plusJakarta,
          }}>
          Done
        </motion.button>
      </motion.div>
    )
  }

  // ── COUNTDOWN ──
  if (!started) {
    return (
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 280 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#131313',
        }}
        onPointerDown={unlockAudio}>
        <AnimatePresence>
          {showTutorial && currentEx && (
            <TutorialModal animType={currentEx.anim} onDone={handleTutorialDone} />
          )}
        </AnimatePresence>
        <motion.span key={countdown}
          initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            fontSize: 96, fontWeight: 800, color: '#e5e2e1',
            fontFamily: plusJakarta,
          }}>
          {countdown > 0 ? countdown : 'Go!'}
        </motion.span>
        <p style={{
          fontSize: 14, color: '#8d90a2', marginTop: 12,
          fontFamily: inter,
        }}>Get Ready</p>
      </motion.div>
    )
  }

  // ── ACTIVE ──
  const exerciseLabel = meta.label || currentEx?.name || 'Long Hold'

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', flexDirection: 'column',
        background: '#131313',
      }}
      onPointerDown={unlockAudio}>

      <AnimatePresence>
        {showTutorial && currentEx && (
          <TutorialModal animType={currentEx.anim} onDone={handleTutorialDone} />
        )}
      </AnimatePresence>

      {/* Scrollable content area */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'auto', WebkitOverflowScrolling: 'touch',
        paddingTop: 'max(56px, calc(env(safe-area-inset-top) + 12px))',
      }}>

        {/* ── Main Card ── */}
        <div style={{
          margin: '0 16px',
          background: '#201f1f',
          borderRadius: 4,
          minHeight: 527,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 32px',
        }}>
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(179,197,255,0.05) 0%, transparent 100%)',
            opacity: 0.5,
            pointerEvents: 'none',
            borderRadius: 4,
          }} />

          {/* Top bar: X close + volume */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 0 0',
            position: 'relative', zIndex: 10,
          }}>
            <button onClick={onClose}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)', color: '#8d90a2', fontSize: 14,
                border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <button onClick={() => setIsMuted(m => !m)}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
                color: isMuted ? '#ef4444' : '#8d90a2', fontSize: 16,
                border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}>
              {isMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              )}
            </button>
          </div>

          {/* Phase title: SQUEEZE or RELEASE */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 2,
            gap: 8, marginTop: -40,
          }}>
            <AnimatePresence mode="wait">
              <motion.h1 key={drillState.isSqueeze ? 'squeeze' : 'release'}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: plusJakarta, fontWeight: 800, fontSize: 48,
                  color: '#e5e2e1', textAlign: 'center', textTransform: 'uppercase',
                  letterSpacing: '-3.6px', margin: 0,
                }}>
                {drillState.isSqueeze ? 'SQUEEZE' : 'RELEASE'}
              </motion.h1>
            </AnimatePresence>

            {/* Cue text */}
            <AnimatePresence mode="wait">
              <motion.p key={drillState.isSqueeze ? 'cue-sq' : 'cue-rel'}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                style={{
                  fontFamily: plusJakarta, fontWeight: 400, fontSize: 14,
                  color: 'rgba(255,255,255,0.7)', textAlign: 'center', margin: 0,
                }}>
                {drillState.isSqueeze ? 'Breathe out' : 'Breathe in, full release'}
              </motion.p>
            </AnimatePresence>

            {/* Timer ring */}
            <div style={{ marginTop: 16, marginBottom: 8 }}>
              <TimerRing
                isSqueeze={drillState.isSqueeze}
                totalProgress={drillState.totalProgress}
                totalTimeLeft={drillState.totalTimeLeft}
              />
            </div>

            {/* Exercise type label */}
            <span style={{
              fontFamily: inter, fontWeight: 400, fontSize: 16,
              color: 'rgba(255,255,255,0.8)',
            }}>
              {exerciseLabel}
            </span>
          </div>
        </div>

        {/* ── Session Timeline ── */}
        <div style={{ marginTop: 20 }}>
          <SessionTimeline
            exercises={exercises}
            exIdx={exIdx}
            drillProgress={drillState.totalProgress}
          />
        </div>

        {/* ── Controls: back / pause / forward ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 32px', marginBottom: 16,
        }}>
          <button onClick={skipBack}
            style={{
              width: 48, height: 48, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#353534', color: '#8d90a2', fontSize: 20,
              border: 'none', cursor: 'pointer',
            }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button onClick={() => { setIsPaused(p => !p); sounds.tap() }}
            style={{
              flex: 1, height: 48, borderRadius: 6,
              fontWeight: 700, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: isPaused ? '#b3c5ff' : '#353534',
              color: isPaused ? '#131313' : '#8d90a2',
              border: 'none', cursor: 'pointer',
              fontFamily: plusJakarta,
            }}>
            {isPaused ? '▶  Resume' : '⏸  Pause'}
          </button>

          <button onClick={skipForward}
            style={{
              width: 48, height: 48, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#353534', color: '#8d90a2', fontSize: 20,
              border: 'none', cursor: 'pointer',
            }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* ── Stats Grid ── */}
        <StatsGrid
          currentSet={exIdx + 1}
          totalSets={exercises.length}
          elapsedTime={totalElapsed}
        />

        {/* ── End Workout Button ── */}
        <div style={{ padding: '0 32px', paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom) + 12px))' }}>
          <button onClick={onClose}
            style={{
              width: '100%', padding: '16px 0', borderRadius: 12,
              fontWeight: 700, fontSize: 14, textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#fff', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #4a7dff 0%, #6ba3ff 100%)',
              fontFamily: plusJakarta,
            }}>
            END WORKOUT
          </button>
        </div>
      </div>
    </motion.div>
  )
}
