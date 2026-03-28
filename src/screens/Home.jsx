import React from 'react'
import { motion } from 'framer-motion'
import { WORKOUTS, KEGEL_WEEKS } from '../data/workouts'

// ── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg: '#131313',
  surface: '#201f1f',
  surfaceHigh: '#2a2a2a',
  textPrimary: '#e5e2e1',
  textSecondary: '#8d90a2',
  textTertiary: '#c3c5d9',
  primary: '#b3c5ff',
  primaryContainer: '#005be6',
  success: '#00b27c',
  tertiary: '#ffb4aa',
  track: '#353534',
}

const FONT_HEADING = "'Plus Jakarta Sans', sans-serif"
const FONT_BODY = "'Inter', sans-serif"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
})

function getSmartSession(todayWorkouts) {
  const now = new Date()
  const morningDone = todayWorkouts.find(w => w.workoutId === 'kegel-morning')
  const eveningDone = todayWorkouts.find(w => w.workoutId === 'kegel-evening')
  if (eveningDone) return { session: null, label: 'Both sessions done', done: true }
  if (!morningDone) return { session: 'morning', label: 'Start Morning Session', done: false }
  const hoursElapsed = (now - new Date(morningDone.date)) / 3600000
  if (hoursElapsed >= 2) return { session: 'evening', label: 'Start Evening Session', done: false }
  return { session: null, label: `Evening in ${Math.ceil((2 - hoursElapsed) * 60)} min`, done: false, waiting: true }
}

// ── Shared card style ────────────────────────────────────────────────────────
const cardStyle = {
  background: T.surface,
  borderRadius: 4,
  boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
  padding: 32,
}

// ── Tag badge component ──────────────────────────────────────────────────────
function TagBadge({ label, variant = 'blue' }) {
  const colors = {
    blue: { bg: 'rgba(0,91,230,0.2)', text: '#b3c5ff' },
    red: { bg: 'rgba(204,13,17,0.2)', text: '#ffb4aa' },
  }
  const c = colors[variant] || colors.blue
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: c.bg, color: c.text,
      fontFamily: FONT_BODY, fontSize: 10, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '1px',
      padding: '4px 10px', borderRadius: 12,
    }}>
      {variant === 'blue' && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5.5 0.5L2 5.5H4.5L4 9.5L8 4.5H5.5L5.5 0.5Z" fill={c.text} />
        </svg>
      )}
      {label}
    </div>
  )
}

// ── Blue gradient button ─────────────────────────────────────────────────────
function BlueButton({ children, onClick, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      style={{
        width: '100%',
        padding: '14px 20px',
        background: 'linear-gradient(176deg, #0052ff 0%, #002b75 100%)',
        color: '#fff',
        fontFamily: FONT_HEADING,
        fontWeight: 700,
        fontSize: 14,
        border: 'none',
        borderRadius: 10,
        cursor: disabled ? 'default' : 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </motion.button>
  )
}

// ── Done button ──────────────────────────────────────────────────────────────
function DoneButton() {
  return (
    <div style={{
      width: '100%',
      padding: '14px 20px',
      background: 'rgba(0,98,68,0.2)',
      border: `1px solid ${T.success}`,
      borderRadius: 10,
      color: T.success,
      fontFamily: FONT_BODY,
      fontWeight: 800,
      fontSize: 14,
      textTransform: 'uppercase',
      letterSpacing: '1.4px',
      textAlign: 'center',
    }}>
      DONE FOR TODAY
    </div>
  )
}

// ── Green checkmark ──────────────────────────────────────────────────────────
function GreenCheck() {
  return (
    <motion.div
      initial={{ scale: 0 }} animate={{ scale: 1 }}
      transition={{ type: 'spring', bounce: 0.5 }}
      style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(0,178,124,0.15)',
        border: `2px solid ${T.success}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8.5L6.5 12L13 4" stroke={T.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  )
}

// ── Play icon ────────────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: T.surfaceHigh,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
        <path d="M1 1.5L11 7L1 12.5V1.5Z" fill={T.textPrimary} />
      </svg>
    </div>
  )
}

export default function Home({ settings, onStartWorkout, onStartKegel, onNavigate }) {
  const currentWeekData = KEGEL_WEEKS.find(w => w.week === settings.kegelWeek) || KEGEL_WEEKS[0]
  const streak = settings.streakDays || 0
  const today = new Date().toDateString()
  const todayWorkouts = (settings.completedWorkouts || []).filter(w => new Date(w.date).toDateString() === today)
  const smartSession = getSmartSession(todayWorkouts)

  // Daily routine done?
  const dailyRoutineDone = todayWorkouts.some(w => w.workoutId === 'daily-routine')
  const dailyRoutineWorkout = WORKOUTS.find(w => w.id === 'daily-routine')

  // Kegel status
  const morningKegelDone = todayWorkouts.some(w => w.workoutId === 'kegel-morning')
  const eveningKegelDone = todayWorkouts.some(w => w.workoutId === 'kegel-evening')

  // Any workout done today (non-daily-routine, non-kegel)
  const workoutDone = todayWorkouts.some(w =>
    w.workoutId !== 'daily-routine' &&
    w.workoutId !== 'kegel-morning' &&
    w.workoutId !== 'kegel-evening'
  )

  // Daily sessions progress
  const sessions = [
    { label: 'Daily Routine', done: dailyRoutineDone },
    { label: 'Morning Kegel', done: morningKegelDone },
    { label: 'Evening Kegel', done: eveningKegelDone },
    { label: 'Workout', done: workoutDone },
  ]
  const doneCount = sessions.filter(s => s.done).length

  // Streak week bars (last 7 days)
  const weekBars = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dayStr = d.toDateString()
    const hasWorkout = (settings.completedWorkouts || []).some(w => new Date(w.date).toDateString() === dayStr)
    return hasWorkout
  })

  return (
    <div className="scroll-area" style={{ paddingBottom: 110, background: T.bg }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)} style={{
        padding: '16px 24px',
      }}>
        <h1 style={{
          fontFamily: FONT_HEADING,
          fontWeight: 800,
          fontStyle: 'italic',
          fontSize: 32,
          color: T.textPrimary,
          margin: 0,
        }}>
          SHIPUD FLOW
        </h1>
      </motion.div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Daily Routine Card (The Daily 10) ─────────────────────────────── */}
        <motion.div {...fadeUp(0.05)} style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <TagBadge label="HIGH PERFORMANCE" variant="blue" />
            {dailyRoutineDone && <GreenCheck />}
          </div>
          <h2 style={{
            fontFamily: FONT_HEADING, fontWeight: 800,
            fontSize: 48, color: T.textPrimary,
            letterSpacing: '-2.4px', textTransform: 'uppercase',
            margin: 0, lineHeight: 1,
          }}>
            THE DAILY 10
          </h2>
          <p style={{
            fontFamily: FONT_BODY, fontWeight: 400,
            fontSize: 18, color: T.textTertiary,
            margin: '8px 0 24px',
          }}>
            Our 10-minute daily routine
          </p>
          {dailyRoutineDone ? (
            <DoneButton />
          ) : (
            <BlueButton onClick={() => dailyRoutineWorkout && onStartWorkout(dailyRoutineWorkout)}>
              START SESSION
            </BlueButton>
          )}
        </motion.div>

        {/* ── Kegel Card ────────────────────────────────────────────────────── */}
        <motion.div {...fadeUp(0.1)} style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <TagBadge label={smartSession.session === 'evening' ? 'KEGEL' : 'MORNING'} variant="red" />
            {smartSession.done && <GreenCheck />}
          </div>
          <h2 style={{
            fontFamily: FONT_HEADING, fontWeight: 800,
            fontSize: 48, color: T.textPrimary,
            letterSpacing: '-2.4px', textTransform: 'uppercase',
            margin: 0, lineHeight: 1,
          }}>
            KEGEL PROGRAM
          </h2>
          <p style={{
            fontFamily: FONT_BODY, fontWeight: 400,
            fontSize: 18, color: T.textTertiary,
            margin: '8px 0 24px',
          }}>
            {currentWeekData.label} &middot; {currentWeekData.description}
          </p>
          {smartSession.done ? (
            <DoneButton />
          ) : smartSession.waiting ? (
            <BlueButton disabled>
              {smartSession.label}
            </BlueButton>
          ) : (
            <BlueButton onClick={() => smartSession.session && onStartKegel(smartSession.session)}>
              {smartSession.session === 'morning' ? 'START MORNING SESSION' : 'START EVENING SESSION'}
            </BlueButton>
          )}
        </motion.div>

        {/* ── Daily Sessions Progress ───────────────────────────────────────── */}
        <motion.div {...fadeUp(0.15)} style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{
              fontFamily: FONT_HEADING, fontWeight: 700,
              fontSize: 12, color: T.textSecondary,
              textTransform: 'uppercase', letterSpacing: '1.2px',
            }}>
              DAILY SESSIONS PROGRESS
            </span>
            <span style={{
              fontFamily: FONT_HEADING, fontWeight: 800,
              fontSize: 24, color: T.primary,
            }}>
              {doneCount}/{sessions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            width: '100%', height: 8, borderRadius: 4,
            background: T.track, overflow: 'hidden', marginBottom: 20,
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(doneCount / sessions.length) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 4, background: T.primary }}
            />
          </div>

          {/* Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sessions.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: s.done ? 1 : 0.4,
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: s.done ? T.primary : 'transparent',
                  border: s.done ? 'none' : `2px solid ${T.track}`,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: FONT_BODY, fontWeight: 500,
                  fontSize: 14, color: T.textPrimary,
                }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Trainer Streak ────────────────────────────────────────────────── */}
        <motion.div {...fadeUp(0.2)} style={cardStyle}>
          <span style={{
            fontFamily: FONT_HEADING, fontWeight: 700,
            fontSize: 12, color: T.textSecondary,
            textTransform: 'uppercase', letterSpacing: '1.2px',
          }}>
            TRAINER STREAK
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8, marginBottom: 16 }}>
            <span style={{
              fontFamily: FONT_HEADING, fontWeight: 800, fontStyle: 'italic',
              fontSize: 60, color: T.textPrimary,
              letterSpacing: '-3px', lineHeight: 1,
            }}>
              {streak}
            </span>
            <span style={{
              fontFamily: FONT_BODY, fontWeight: 600,
              fontSize: 12, color: T.primary,
              textTransform: 'uppercase', letterSpacing: '1.2px',
            }}>
              DAYS
            </span>
          </div>

          {/* Week bars */}
          <div style={{ display: 'flex', gap: 4 }}>
            {weekBars.map((filled, i) => (
              <div key={i} style={{
                flex: 1, height: 32, borderRadius: 3,
                background: filled ? T.primary : T.track,
                transition: 'background 0.3s ease',
              }} />
            ))}
          </div>
        </motion.div>

        {/* ── Last Workouts ─────────────────────────────────────────────────── */}
        <motion.div {...fadeUp(0.25)} style={{ marginTop: 8 }}>
          <h3 style={{
            fontFamily: FONT_HEADING, fontWeight: 800,
            fontSize: 20, color: T.textSecondary,
            textTransform: 'uppercase', letterSpacing: '2px',
            margin: '0 0 16px',
          }}>
            LAST WORKOUTS
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {WORKOUTS.map((w, i) => {
              const totalSec = w.exercises.reduce((sum, ex) =>
                sum + (ex.workSec || w.workSec) + (ex.restSec ?? w.restSec), 0)
              const mins = Math.ceil(totalSec / 60)
              return (
                <motion.button
                  key={w.id}
                  {...fadeUp(0.3 + i * 0.05)}
                  onClick={() => onStartWorkout(w)}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: T.surface,
                    borderRadius: 4,
                    border: 'none',
                    borderLeft: `2px solid ${T.primary}`,
                    padding: '16px 16px 16px 18px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    cursor: 'pointer',
                  }}
                >
                  {/* Thumbnail placeholder */}
                  <div style={{
                    width: 80, height: 80, borderRadius: 4,
                    background: T.track,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, flexShrink: 0,
                    filter: 'saturate(0.3)',
                  }}>
                    {w.emoji}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: FONT_HEADING, fontWeight: 700,
                      fontSize: 14, color: T.textPrimary,
                      textTransform: 'uppercase', letterSpacing: '-0.35px',
                      margin: 0,
                    }}>
                      {w.title}
                    </p>
                    <p style={{
                      fontFamily: FONT_BODY, fontWeight: 400,
                      fontSize: 12, color: T.textSecondary,
                      margin: '4px 0 0',
                    }}>
                      {w.exercises.length} exercises &middot; ~{mins} min
                    </p>
                  </div>

                  <PlayIcon />
                </motion.button>
              )
            })}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
