import React from 'react'
import { motion } from 'framer-motion'
import { WORKOUTS, KEGEL_WEEKS } from '../data/workouts'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})

function getSmartSession(todayWorkouts) {
  const now = new Date()
  const morningDone = todayWorkouts.find(w => w.workoutId === 'kegel-morning')
  const eveningDone = todayWorkouts.find(w => w.workoutId === 'kegel-evening')
  if (eveningDone) return { session: null, label: 'Both sessions done ✓', done: true }
  if (!morningDone) return { session: 'morning', label: '☀️ Start Morning Session', done: false }
  const hoursElapsed = (now - new Date(morningDone.date)) / 3600000
  if (hoursElapsed >= 2) return { session: 'evening', label: '🌙 Start Evening Session', done: false }
  return { session: null, label: `🌙 Evening available in ${Math.ceil((2 - hoursElapsed) * 60)} min`, done: false, waiting: true }
}

export default function Home({ settings, onStartWorkout, onStartKegel, onNavigate }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const currentWeek = KEGEL_WEEKS.find(w => w.week === settings.kegelWeek) || KEGEL_WEEKS[0]
  const streak = settings.streakDays || 0
  const totalWorkouts = settings.completedWorkouts?.length || 0
  const today = new Date().toDateString()
  const todayWorkouts = (settings.completedWorkouts || []).filter(w => new Date(w.date).toDateString() === today)
  const smartSession = getSmartSession(todayWorkouts)

  return (
    <div className="scroll-area" style={{ paddingLeft: 20, paddingRight: 20 }}>

      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 4, fontWeight: 500 }}>{greeting} 👋</p>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#f9fafb', letterSpacing: '-0.5px' }}>Ready to train?</h1>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp(0.05)} className="grid grid-cols-3 gap-3" style={{ marginBottom: 28 }}>
        {[
          { label: 'Streak', value: `${streak}d`, icon: '🔥' },
          { label: 'Total',  value: totalWorkouts, icon: '✅' },
          { label: 'Week',   value: `W${settings.kegelWeek || 1}`, icon: '📅' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="rounded-2xl text-center"
            style={{ background: '#111827', border: '1px solid #1f2937', padding: '14px 8px' }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#f9fafb' }}>{value}</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Kegel card */}
      <motion.div {...fadeUp(0.1)} style={{ marginBottom: 32 }}>
        <div className="rounded-3xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1e1040 0%, #0f0f1a 100%)', border: '1px solid #3b0764', padding: '20px 20px 18px' }}>
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full pointer-events-none"
            style={{ background: '#8b5cf6', opacity: 0.15, filter: 'blur(32px)', transform: 'translate(30%,-30%)' }} />
          <div className="flex items-start justify-between" style={{ marginBottom: 16 }}>
            <div style={{ flex: 1, paddingRight: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#7c3aed', marginBottom: 4 }}>KEGEL PROGRAM</p>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f9fafb', marginBottom: 3 }}>{currentWeek.label}</h2>
              <p style={{ fontSize: 12, color: '#9ca3af' }}>{currentWeek.description}</p>
            </div>
            <span style={{ fontSize: 32 }}>🌸</span>
          </div>
          <button disabled={!smartSession.session}
            onClick={() => smartSession.session && onStartKegel(smartSession.session)}
            className="w-full rounded-2xl font-bold text-sm active:scale-95"
            style={{
              padding: '14px 20px',
              background: smartSession.done || smartSession.waiting ? '#1a1a2e' : '#7c3aed',
              color: smartSession.done || smartSession.waiting ? '#4b5563' : '#fff',
              border: smartSession.done || smartSession.waiting ? '1px solid #2d1b69' : 'none',
              cursor: smartSession.session ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}>
            {smartSession.label}
          </button>
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
            return (
              <motion.button key={w.id} {...fadeUp(0.2 + i * 0.05)}
                onClick={() => onStartWorkout(w)}
                className="w-full text-left rounded-3xl relative overflow-hidden active:scale-95"
                style={{ background: '#111827', border: `1px solid ${done ? w.color + '44' : '#1f2937'}`, padding: '16px 16px 16px 20px', transition: 'all 0.2s' }}>
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl" style={{ background: w.color }} />
                {!done && <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{ background: `radial-gradient(circle at 80% 50%, ${w.color}0d, transparent)` }} />}
                <div className="flex items-center gap-3" style={{ paddingLeft: 8 }}>
                  <span style={{ fontSize: 28 }}>{w.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-2">
                      <p style={{ fontWeight: 700, color: done ? '#6b7280' : '#f9fafb' }}>{w.title}</p>
                      {done && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: '#1f2937', color: '#6b7280' }}>Done</span>}
                    </div>
                    <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{w.subtitle}</p>
                    <p style={{ fontSize: 12, color: w.color, marginTop: 3 }}>{w.exercises.length} exercises · ~10 min</p>
                  </div>
                  <span style={{ color: '#374151', fontSize: 18 }}>›</span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Daily tip */}
      <motion.div {...fadeUp(0.35)} className="rounded-2xl"
        style={{ background: '#0d1117', border: '1px solid #1f2937', padding: '16px 18px', marginBottom: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', marginBottom: 6 }}>💡 DAILY TIP</p>
        <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.5 }}>
          Always breathe out during a Kegel contraction — holding your breath increases downward pressure and reduces effectiveness.
        </p>
      </motion.div>
    </div>
  )
}
