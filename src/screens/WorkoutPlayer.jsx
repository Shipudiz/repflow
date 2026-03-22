import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProgressRing from '../components/ProgressRing'
import ExerciseAnimation from '../animations/ExerciseAnimation'
import { sounds, unlockAudio } from '../hooks/useSound'
import { useSmoothTimer } from '../hooks/useSmoothTimer'

const PHASE = { COUNTDOWN: 'countdown', WORK: 'work', REST: 'rest', DONE: 'done' }

export default function WorkoutPlayer({ workout, onClose, onComplete }) {
  const [exIdx, setExIdx] = useState(0)
  const [phase, setPhase] = useState(PHASE.COUNTDOWN)
  const [isPaused, setIsPaused] = useState(false)
  const [totalElapsed, setTotalElapsed] = useState(0)
  const elapsedRef = useRef(null)

  const exercises = workout.exercises
  const current = exercises[exIdx]
  const nextEx = exercises[exIdx + 1] || null
  const isLastEx = exIdx === exercises.length - 1
  const workSec = workout.workSec
  const restSec = workout.restSec

  const duration = phase === PHASE.COUNTDOWN ? 3
    : phase === PHASE.WORK ? workSec
    : phase === PHASE.REST ? restSec : 0

  const phaseColor = {
    [PHASE.COUNTDOWN]: '#6b7280',
    [PHASE.WORK]: workout.color,
    [PHASE.REST]: '#10b981',
    [PHASE.DONE]: '#f59e0b',
  }[phase]

  // Track total elapsed time
  useEffect(() => {
    if (phase === PHASE.DONE || isPaused) {
      clearInterval(elapsedRef.current)
      return
    }
    elapsedRef.current = setInterval(() => setTotalElapsed(e => e + 1), 1000)
    return () => clearInterval(elapsedRef.current)
  }, [phase, isPaused])

  // Advance logic
  const stateRef = useRef({})
  stateRef.current = { phase, exIdx, isLastEx, workSec, restSec, workout, totalElapsed }

  const advance = useCallback(() => {
    const s = stateRef.current
    if (s.phase === PHASE.COUNTDOWN) {
      sounds.workStart()
      setPhase(PHASE.WORK)
    } else if (s.phase === PHASE.WORK) {
      if (s.isLastEx) {
        sounds.done()
        setPhase(PHASE.DONE)
        onComplete?.({ workoutId: s.workout.id, durationSec: s.totalElapsed })
      } else {
        sounds.restStart()
        setPhase(PHASE.REST)
      }
    } else if (s.phase === PHASE.REST) {
      sounds.workStart()
      setExIdx(i => i + 1)
      setPhase(PHASE.WORK)
    }
  }, [onComplete])

  // Smooth timer
  const timerKey = `${phase}-${exIdx}`
  const { displayTime, progress } = useSmoothTimer(
    duration,
    isPaused || phase === PHASE.DONE,
    advance,
    timerKey
  )

  // Tick sound
  useEffect(() => {
    if (displayTime === 3 && phase !== PHASE.COUNTDOWN) sounds.tick()
  }, [displayTime, phase])

  const skipForward = () => {
    sounds.tap()
    advance()
  }

  const skipBack = () => {
    sounds.tap()
    const s = stateRef.current
    if (s.phase !== PHASE.COUNTDOWN) {
      setPhase(PHASE.COUNTDOWN)
    } else if (s.exIdx > 0) {
      setExIdx(i => i - 1)
      setPhase(PHASE.COUNTDOWN)
    }
  }

  // ── DONE ──
  if (phase === PHASE.DONE) {
    const mins = Math.floor(totalElapsed / 60)
    const secs = totalElapsed % 60
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: '#0a0a0a', padding: '0 24px' }}>

        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
          className="text-7xl mb-6">🎉</motion.div>

        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl font-bold mb-2" style={{ color: '#f9fafb' }}>
          Workout Done!
        </motion.h1>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ fontSize: 13, color: '#6b7280', marginBottom: 32 }}>
          {workout.title} · {workout.subtitle}
        </motion.p>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
          {[
            { label: 'Exercises', value: exercises.length },
            { label: 'Duration', value: `${mins}:${String(secs).padStart(2, '0')}` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl text-center"
              style={{ background: '#111827', border: '1px solid #1f2937', padding: '16px 12px' }}>
              <div className="text-2xl font-bold" style={{ color: workout.color }}>{value}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </motion.div>

        <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55 }} onClick={onClose}
          className="w-full max-w-xs py-4 rounded-2xl font-bold active:scale-95"
          style={{ background: workout.color, color: '#fff' }}>
          Back to Home
        </motion.button>
      </motion.div>
    )
  }

  // ── ACTIVE ──
  return (
    <motion.div
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 280 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#0a0a0a' }}
      onPointerDown={() => unlockAudio()}>

      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between"
        style={{
          paddingTop: 'max(56px, calc(env(safe-area-inset-top) + 12px))',
          paddingBottom: 8,
          paddingLeft: 20, paddingRight: 20,
        }}>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#6b7280' }}>✕</button>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: '#4b5563' }}>
          {workout.title}
        </p>
        <div className="w-9" />
      </div>

      {/* Progress dots */}
      <div className="flex-shrink-0 flex items-center justify-center gap-1.5" style={{ padding: '0 20px 8px' }}>
        {exercises.map((_, i) => (
          <div key={i} className="rounded-full"
            style={{
              width: i === exIdx ? 20 : 6, height: 6,
              background: i < exIdx ? workout.color : i === exIdx ? phaseColor : '#1a1a2e',
              transition: 'all 0.3s ease',
            }} />
        ))}
      </div>

      {/* Phase badge + exercise name */}
      <AnimatePresence mode="wait">
        <motion.div key={`${exIdx}-${phase}`}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-center" style={{ padding: '0 20px 4px' }}>

          <div className="inline-flex items-center gap-2 rounded-full mb-1.5"
            style={{ padding: '4px 12px', background: `${phaseColor}18`, border: `1px solid ${phaseColor}33` }}>
            <div className="rounded-full" style={{ width: 5, height: 5, background: phaseColor }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: phaseColor }}>
              {phase === PHASE.COUNTDOWN ? 'GET READY' : phase === PHASE.WORK ? 'WORK' : 'REST'}
            </span>
          </div>

          <h2 className="font-bold" style={{ fontSize: 17, color: '#f9fafb' }}>
            {phase === PHASE.REST ? '' : current.name}
          </h2>
          {phase === PHASE.WORK && current.cue && (
            <p style={{ fontSize: 12, color: '#4b5563', marginTop: 2 }}>{current.cue}</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 relative"
        style={{ padding: '0 20px', minHeight: 0 }}>

        {/* Background glow for work */}
        {phase === PHASE.WORK && (
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${workout.color}10 0%, transparent 60%)` }} />
        )}

        {/* During REST: show next exercise preview */}
        <AnimatePresence mode="wait">
          {phase === PHASE.REST && nextEx ? (
            <motion.div key="rest-preview"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 w-full">
              <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Up next</p>
              <div className="rounded-3xl w-full"
                style={{ background: '#111827', border: `1px solid ${workout.color}22`, padding: '16px 20px' }}>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 flex-shrink-0">
                    <ExerciseAnimation animType={nextEx.anim} color={workout.color} />
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: '#f9fafb' }}>{nextEx.name}</p>
                    {nextEx.cue && <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{nextEx.cue}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key={`anim-${exIdx}`}
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-36 h-28">
              <ExerciseAnimation animType={current.anim} color={workout.color} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer ring — smooth progress */}
        <ProgressRing progress={progress} size={190} strokeWidth={6}
          color={phaseColor} trackColor="#1a1a2e" smooth>
          <div className="flex flex-col items-center">
            <motion.span key={displayTime}
              initial={{ scale: 1.12, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.12 }}
              className="font-bold tabular-nums"
              style={{ fontSize: 48, color: '#f9fafb', letterSpacing: '-1px' }}>
              {displayTime}
            </motion.span>
            <span style={{ fontSize: 11, color: '#4b5563', marginTop: 2 }}>seconds</span>
          </div>
        </ProgressRing>

        <p style={{ fontSize: 13, color: '#4b5563' }}>
          <span style={{ color: '#9ca3af', fontWeight: 600 }}>{exIdx + 1}</span>
          {' / '}
          <span style={{ color: '#6b7280' }}>{exercises.length}</span>
        </p>
      </div>

      {/* Controls: back · pause · skip */}
      <div className="flex-shrink-0 flex items-center gap-3"
        style={{
          padding: '10px 20px',
          paddingBottom: 'max(32px, calc(env(safe-area-inset-bottom) + 12px))',
        }}>
        <button onClick={skipBack}
          className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90"
          style={{ background: '#1a1a2e', color: '#6b7280', fontSize: 20 }}>‹</button>

        <button onClick={() => { setIsPaused(p => !p); sounds.tap() }}
          className="flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95"
          style={{
            background: isPaused ? workout.color : '#1a1a2e',
            color: isPaused ? '#fff' : '#6b7280',
            border: isPaused ? 'none' : '1px solid #1f293733',
          }}>
          {isPaused ? '▶  Resume' : '⏸  Pause'}
        </button>

        <button onClick={skipForward}
          className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90"
          style={{ background: '#1a1a2e', color: '#6b7280', fontSize: 20 }}>›</button>
      </div>
    </motion.div>
  )
}
