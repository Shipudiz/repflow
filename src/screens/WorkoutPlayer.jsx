import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProgressRing from '../components/ProgressRing'
import ExerciseAnimation from '../animations/ExerciseAnimation'
import { sounds, unlockAudio } from '../hooks/useSound'
import { useSmoothTimer } from '../hooks/useSmoothTimer'

const PHASE = { COUNTDOWN: 'countdown', WORK: 'work', REST: 'rest', DONE: 'done' }

// SVG icons as inline components
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 1L13 13M13 1L1 13" stroke="#8d90a2" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const VolumeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="#8d90a2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="#8d90a2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SkipBackIcon = () => (
  <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
    <path d="M12 1L6 6l6 5V1zM2 1v10" stroke="#e5e2e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SkipForwardIcon = () => (
  <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
    <path d="M1 1l6 5-6 5V1zM11 1v10" stroke="#e5e2e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PauseIcon = () => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
    <rect x="1" y="1" width="4" height="14" rx="1" fill="#e5e2e1" />
    <rect x="9" y="1" width="4" height="14" rx="1" fill="#e5e2e1" />
  </svg>
)

const PlayIcon = () => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
    <path d="M1 1.5L13 8L1 14.5V1.5Z" fill="#e5e2e1" />
  </svg>
)

const StopIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect width="12" height="12" rx="2" fill="white" />
  </svg>
)

const formatTime = (sec) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

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
  // Per-exercise workSec override (for mixed-timing workouts like Daily Routine)
  const workSec = current?.workSec || workout.workSec
  const restSec = current?.restSec ?? workout.restSec

  const duration = phase === PHASE.COUNTDOWN ? 3
    : phase === PHASE.WORK ? workSec
    : phase === PHASE.REST ? restSec : 0

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
  stateRef.current = { phase, exIdx, isLastEx, workout, totalElapsed }

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

  // Calculate completion percentage for session timeline
  const completionPercent = Math.round((exIdx / exercises.length) * 100 + (progress * 100 / exercises.length))

  // ── DONE ──
  if (phase === PHASE.DONE) {
    const mins = Math.floor(totalElapsed / 60)
    const secs = totalElapsed % 60
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: '#131313', padding: '0 24px' }}>

        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
          style={{ fontSize: 56, marginBottom: 24 }}>🎉</motion.div>

        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: 28, color: '#e5e2e1', marginBottom: 8,
          }}>
          Workout Done!
        </motion.h1>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8d90a2', marginBottom: 32 }}>
          {workout.title} · {workout.subtitle}
        </motion.p>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', maxWidth: 320, marginBottom: 32 }}>
          {[
            { label: 'Exercises', value: exercises.length },
            { label: 'Duration', value: `${mins}:${String(secs).padStart(2, '0')}` },
          ].map(({ label, value }) => (
            <div key={label}
              style={{
                background: '#1c1b1b', borderRadius: 6, textAlign: 'center', padding: '16px 12px',
              }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, color: '#b3c5ff' }}>{value}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#8d90a2', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </motion.div>

        <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55 }} onClick={onClose}
          style={{
            width: '100%', maxWidth: 320, padding: '24px 0', borderRadius: 6,
            background: 'linear-gradient(176deg, #0052ff 0%, #002b75 100%)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 16,
            letterSpacing: '3.2px', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
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
      className="fixed inset-0 z-50"
      style={{
        background: '#131313',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}
      onPointerDown={() => unlockAudio()}>

      {/* Main Card */}
      <div style={{
        background: '#201f1f',
        borderRadius: 4,
        margin: 'max(48px, env(safe-area-inset-top)) 0 0 0',
        padding: '24px 32px 20px',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Subtle gradient overlay */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 120,
          background: 'linear-gradient(to bottom, rgba(179,197,255,0.05) 0%, transparent 100%)',
          opacity: 0.5, pointerEvents: 'none',
        }} />

        {/* Top bar: X close + volume */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 18px', marginBottom: 16, position: 'relative', zIndex: 1,
        }}>
          <button onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <CloseIcon />
          </button>
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <VolumeIcon />
          </button>
        </div>

        {/* Exercise name */}
        <AnimatePresence mode="wait">
          <motion.div key={`name-${exIdx}-${phase}`}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{
              textAlign: 'center', marginBottom: 12, position: 'relative', zIndex: 1,
            }}>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800, fontSize: 22, color: '#e5e2e1',
              textTransform: 'uppercase', letterSpacing: '-1px',
              maxWidth: 200, margin: '0 auto', lineHeight: 1.2,
            }}>
              {phase === PHASE.REST ? (nextEx ? nextEx.name : 'REST') : phase === PHASE.COUNTDOWN ? 'GET READY' : current.name}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Exercise animation area */}
        <AnimatePresence mode="wait">
          <motion.div key={`anim-${exIdx}`}
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 168, height: 122, margin: '0 auto 16px',
              position: 'relative', zIndex: 1,
            }}>
            <ExerciseAnimation animType={phase === PHASE.REST && nextEx ? nextEx.anim : current.anim} color={workout.color} />
          </motion.div>
        </AnimatePresence>

        {/* Timer ring */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 20,
          position: 'relative', zIndex: 1,
        }}>
          <ProgressRing progress={progress} size={208} strokeWidth={6}
            color="#b3c5ff" trackColor="#353534" smooth glow={false}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <motion.span key={displayTime}
                initial={{ scale: 1.08, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.12 }}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800, fontSize: 48.75, color: '#e5e2e1',
                  letterSpacing: '-1px', fontVariantNumeric: 'tabular-nums',
                }}>
                {displayTime}
              </motion.span>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600, fontSize: 9.75, color: '#8d90a2',
                textTransform: 'uppercase', letterSpacing: '0.975px',
                marginTop: 2,
              }}>
                REMAINING
              </span>
            </div>
          </ProgressRing>
        </div>

        {/* Session Timeline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 8,
          }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600, fontSize: 10, color: '#8d90a2',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              SESSION TIMELINE
            </span>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600, fontSize: 10, color: '#b3c5ff',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              {completionPercent}% COMPLETE
            </span>
          </div>

          {/* Progress segments */}
          <div style={{
            display: 'flex', gap: 4, alignItems: 'center',
          }}>
            {exercises.map((_, i) => {
              const isCompleted = i < exIdx
              const isCurrent = i === exIdx
              return (
                <div key={i} style={{
                  flex: 1, height: 12, borderRadius: 2,
                  background: isCompleted ? '#005be6' : isCurrent ? '#b3c5ff' : '#353534',
                  position: 'relative',
                  overflow: isCurrent ? 'visible' : 'hidden',
                }}>
                  {/* White cursor for current exercise */}
                  {isCurrent && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        left: `${progress * 100}%`,
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 4, height: 20, borderRadius: 2,
                        background: '#ffffff',
                      }}
                      animate={{ left: `${progress * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div style={{
        display: 'flex', gap: 15, padding: '15px 32px 0',
        flexShrink: 0,
      }}>
        {/* Back button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={skipBack}
          style={{
            background: '#353534', borderRadius: 6, border: 'none',
            padding: '20px 30px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <SkipBackIcon />
        </motion.button>

        {/* Pause / Resume button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => { setIsPaused(p => !p); sounds.tap() }}
          style={{
            flex: 1, background: '#353534', borderRadius: 6, border: 'none',
            padding: '20px 35px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
          {isPaused ? <PlayIcon /> : <PauseIcon />}
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700, fontSize: 16, color: '#e5e2e1',
            textTransform: 'uppercase', letterSpacing: '1.6px',
          }}>
            {isPaused ? 'Resume' : 'Pause'}
          </span>
        </motion.button>

        {/* Forward button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={skipForward}
          style={{
            background: '#353534', borderRadius: 6, border: 'none',
            padding: '20px 30px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <SkipForwardIcon />
        </motion.button>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
        padding: '16px 32px 0',
        flexShrink: 0,
      }}>
        {/* SET */}
        <div style={{
          background: '#1c1b1b', borderRadius: 6,
          borderBottom: '2px solid #b3c5ff',
          padding: 24,
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600, fontSize: 10, color: '#8d90a2',
            textTransform: 'uppercase', letterSpacing: '1px',
            marginBottom: 8,
          }}>
            SET
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700, fontSize: 30, color: '#e5e2e1',
            }}>
              {exIdx + 1}
            </span>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500, fontSize: 18, color: '#8d90a2',
              marginLeft: 2,
            }}>
              {' / '}{exercises.length}
            </span>
          </div>
        </div>

        {/* TOTAL TIME */}
        <div style={{
          background: '#1c1b1b', borderRadius: 6,
          padding: 24,
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600, fontSize: 10, color: '#8d90a2',
            textTransform: 'uppercase', letterSpacing: '1px',
            marginBottom: 8,
          }}>
            TOTAL TIME
          </div>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700, fontSize: 30, color: '#e5e2e1',
          }}>
            {formatTime(totalElapsed)}
          </div>
        </div>
      </div>

      {/* End Workout button */}
      <div style={{
        padding: '16px 32px',
        paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom) + 12px))',
        marginTop: 'auto',
        flexShrink: 0,
      }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          style={{
            width: '100%',
            background: 'linear-gradient(176deg, #0052ff 0%, #002b75 100%)',
            borderRadius: 6, border: 'none', cursor: 'pointer',
            padding: '24px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
          <StopIcon />
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, fontSize: 16, color: '#ffffff',
            textTransform: 'uppercase', letterSpacing: '3.2px',
          }}>
            END WORKOUT
          </span>
        </motion.button>
      </div>
    </motion.div>
  )
}
