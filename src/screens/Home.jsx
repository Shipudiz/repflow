import React from 'react'
import { motion } from 'framer-motion'
import { WORKOUTS, KEGEL_WEEKS } from '../data/workouts'

// ─── Daily tips — rotates based on day of year ────────────────────────────────
const DAILY_TIPS = [
  'Always breathe out during a Kegel contraction — holding your breath increases downward pressure.',
  'Consistency beats intensity. Two 5-minute sessions daily is better than one 30-minute session weekly.',
  'Never squeeze your abs, glutes or thighs during Kegels — isolate the pelvic floor only.',
  'Try Kegels in different positions: lying, seated, then standing as you get stronger.',
  'The release phase is just as important as the squeeze. Practice full, conscious relaxation.',
  'Drink enough water — dehydration can increase urinary urgency and mask your progress.',
  'Don\'t practice Kegels while actually urinating — this can weaken the muscle over time.',
  'Results typically appear after 4-6 weeks of consistent daily practice.',
  'Reverse Kegels are essential — they prevent over-tightening and maintain balance.',
  'If you feel pain during Kegels, stop and consult a pelvic floor physiotherapist.',
  'Quick flicks train your fast-twitch muscles — important for reflexive control.',
  'Try the elevator technique: contract in 4 stages (25%, 50%, 75%, 100%) for deeper control.',
  'Good posture supports your pelvic floor. Sit tall and avoid slouching during sessions.',
  'Stress and tension can tighten your pelvic floor. Combine Kegels with deep breathing.',
]

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

// ─── Week progress indicator ─────────────────────────────────────────────────
function WeekProgress({ currentWeek }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div className="flex items-center gap-1" style={{ marginBottom: 6 }}>
        {KEGEL_WEEKS.map((w, i) => {
          const isActive = w.week <= currentWeek
          const isCurrent = w.week === currentWeek
          return (
            <React.Fragment key={w.week}>
              {/* Dot */}
              <div style={{
                width: isCurrent ? 10 : 6,
                height: isCurrent ? 10 : 6,
                borderRadius: '50%',
                background: isActive ? '#8b5cf6' : '#1f2937',
                border: isCurrent ? '2px solid #a78bfa' : 'none',
                transition: 'all 0.3s ease',
                boxShadow: isCurrent ? '0 0 8px rgba(139,92,246,0.5)' : 'none',
              }} />
              {/* Line between dots */}
              {i < KEGEL_WEEKS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, borderRadius: 1,
                  background: KEGEL_WEEKS[i + 1].week <= currentWeek ? '#8b5cf6' : '#1f2937',
                  transition: 'background 0.3s ease',
                }} />
              )}
            </React.Fragment>
          )
        })}
      </div>
      <div className="flex justify-between">
        {KEGEL_WEEKS.map(w => (
          <span key={w.week} style={{
            fontSize: 9, fontWeight: 500,
            color: w.week === currentWeek ? '#a78bfa' : '#374151',
          }}>W{w.week}</span>
        ))}
      </div>
    </div>
  )
}

export default function Home({ settings, onStartWorkout, onStartKegel, onNavigate }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const currentWeekData = KEGEL_WEEKS.find(w => w.week === settings.kegelWeek) || KEGEL_WEEKS[0]
  const streak = settings.streakDays || 0
  const totalWorkouts = settings.completedWorkouts?.length || 0
  const today = new Date().toDateString()
  const todayWorkouts = (settings.completedWorkouts || []).filter(w => new Date(w.date).toDateString() === today)
  const smartSession = getSmartSession(todayWorkouts)

  // Daily tip based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  const tip = DAILY_TIPS[dayOfYear % DAILY_TIPS.length]

  return (
    <div className="scroll-area" style={{ paddingLeft: 20, paddingRight: 20 }}>

      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 4, fontWeight: 500 }}>
          {greeting} {hour < 12 ? '🌅' : hour < 18 ? '☀️' : '🌙'}
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f9fafb', letterSpacing: '-0.5px' }}>
          Ready to train?
        </h1>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp(0.05)} className="grid grid-cols-3 gap-3" style={{ marginBottom: 28 }}>
        {[
          { label: 'Streak', value: `${streak}d`, icon: '🔥', color: '#f97316' },
          { label: 'Total',  value: totalWorkouts, icon: '✅', color: '#10b981' },
          { label: 'Week',   value: `W${settings.kegelWeek || 1}`, icon: '📅', color: '#8b5cf6' },
        ].map(({ label, value, icon, color }) => (
          <motion.div key={label}
            whileTap={{ scale: 0.95 }}
            className="rounded-2xl text-center"
            style={{
              background: 'linear-gradient(145deg, #111827 0%, #0d1117 100%)',
              border: '1px solid #1f2937',
              padding: '14px 8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#f9fafb' }}>{value}</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>{label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Kegel card */}
      <motion.div {...fadeUp(0.1)} style={{ marginBottom: 32 }}>
        <div className="rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1e1040 0%, #0f0f1a 100%)',
            border: '1px solid #3b0764',
            padding: '20px 20px 18px',
            boxShadow: '0 4px 24px rgba(124, 58, 237, 0.08)',
          }}>
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: '#8b5cf6', opacity: 0.12, filter: 'blur(40px)', transform: 'translate(30%,-30%)' }} />

          <div className="flex items-start justify-between" style={{ marginBottom: 12 }}>
            <div style={{ flex: 1, paddingRight: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#7c3aed', marginBottom: 4 }}>KEGEL PROGRAM</p>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f9fafb', marginBottom: 3 }}>{currentWeekData.label}</h2>
              <p style={{ fontSize: 12, color: '#9ca3af' }}>{currentWeekData.description}</p>
            </div>
            {smartSession.done ? (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10b981',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>
                ✓
              </motion.div>
            ) : (
              <span style={{ fontSize: 32 }}>🌸</span>
            )}
          </div>

          {/* Week progress bar */}
          <WeekProgress currentWeek={settings.kegelWeek || 1} />

          {/* Session button */}
          <motion.button
            disabled={!smartSession.session}
            onClick={() => smartSession.session && onStartKegel(smartSession.session)}
            whileTap={smartSession.session ? { scale: 0.97 } : {}}
            className={`w-full rounded-2xl font-bold text-sm ${smartSession.session ? 'pulse-glow' : ''}`}
            style={{
              marginTop: 16,
              padding: '14px 20px',
              background: smartSession.done ? 'rgba(16, 185, 129, 0.1)' :
                         smartSession.waiting ? '#1a1a2e' : '#7c3aed',
              color: smartSession.done ? '#10b981' :
                    smartSession.waiting ? '#4b5563' : '#fff',
              border: smartSession.done ? '1px solid rgba(16, 185, 129, 0.3)' :
                     smartSession.waiting ? '1px solid #2d1b69' : 'none',
              cursor: smartSession.session ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}>
            {smartSession.done ? '✓ Both sessions done' :
             smartSession.waiting ? `🌙 ${smartSession.label}` :
             smartSession.session === 'morning' ? `☀️ ${smartSession.label}` :
             `🌙 ${smartSession.label}`}
          </motion.button>
        </div>
      </motion.div>

      {/* Workouts */}
      <motion.div {...fadeUp(0.15)} style={{ marginBottom: 28 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280' }}>WORKOUTS</p>
          <button onClick={() => onNavigate('programs')} style={{ fontSize: 12, fontWeight: 600, color: '#f97316' }}>See all →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {WORKOUTS.map((w, i) => {
            const done = todayWorkouts.some(d => d.workoutId === w.id)
            const totalSec = w.exercises.length * (w.workSec + w.restSec)
            const mins = Math.ceil(totalSec / 60)
            return (
              <motion.button key={w.id} {...fadeUp(0.2 + i * 0.05)}
                onClick={() => onStartWorkout(w)}
                whileTap={{ scale: 0.97 }}
                className="w-full text-left rounded-3xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #111827 0%, #0d1117 100%)',
                  border: `1px solid ${done ? w.color + '44' : '#1f2937'}`,
                  padding: '16px 16px 16px 20px',
                  transition: 'all 0.2s',
                  boxShadow: done ? 'none' : '0 2px 8px rgba(0,0,0,0.2)',
                }}>
                {/* Accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
                  style={{ background: done ? w.color + '66' : w.color }} />

                {/* Subtle glow */}
                {!done && (
                  <div className="absolute inset-0 pointer-events-none rounded-3xl"
                    style={{ background: `radial-gradient(circle at 85% 50%, ${w.color}0d, transparent 70%)` }} />
                )}

                <div className="flex items-center gap-3" style={{ paddingLeft: 8 }}>
                  <span style={{ fontSize: 28 }}>{w.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2">
                      <p style={{ fontWeight: 700, color: done ? '#6b7280' : '#f9fafb', fontSize: 15 }}>{w.title}</p>
                      {done && (
                        <motion.span
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          style={{
                            fontSize: 10, padding: '2px 8px', borderRadius: 99,
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981', fontWeight: 600,
                          }}>Done</motion.span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{w.subtitle}</p>
                    <p style={{ fontSize: 12, color: w.color, marginTop: 3, fontWeight: 500 }}>
                      {w.exercises.length} exercises · ~{mins} min
                    </p>
                  </div>
                  <span style={{ color: '#374151', fontSize: 18 }}>›</span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Daily tip */}
      <motion.div {...fadeUp(0.3)} className="rounded-2xl"
        style={{
          background: 'linear-gradient(145deg, #0d1117 0%, #111827 100%)',
          border: '1px solid #1f2937',
          padding: '16px 18px',
          marginBottom: 8,
        }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', marginBottom: 6 }}>
          💡 DAILY TIP
        </p>
        <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.55 }}>{tip}</p>
      </motion.div>
    </div>
  )
}
