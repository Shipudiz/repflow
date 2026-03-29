import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BottomNav from './components/BottomNav'
import Home from './screens/Home'
import Programs from './screens/Programs'
import Settings from './screens/Settings'
import WorkoutPlayer from './screens/WorkoutPlayer'
import KagelSessionOverlay from './screens/Kegel'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useNotifications } from './hooks/useNotifications'
import { DEFAULT_SETTINGS, KEGEL_WEEKS } from './data/workouts'

export default function App() {
  const [tab, setTab] = useState('home')
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [activeKegel, setActiveKegel] = useState(null) // 'morning' | 'evening' | null
  const [settings, setSettings] = useLocalStorage('repflow-settings', DEFAULT_SETTINGS)

  const updateSettings = (patch) => setSettings(prev => ({ ...prev, ...patch }))
  const { subscribe, unsubscribe, getSubscription } = useNotifications(settings, updateSettings)

  const recordWorkout = (workoutId, durationSec = 0) => {
    const today = new Date().toDateString()
    const last = settings.lastWorkoutDate
    const yesterdayStr = new Date(Date.now() - 86400000).toDateString()
    const newStreak = last === yesterdayStr
      ? (settings.streakDays || 0) + 1
      : last === today ? settings.streakDays || 0 : 1

    updateSettings({
      lastWorkoutDate: today,
      streakDays: newStreak,
      completedWorkouts: [
        ...(settings.completedWorkouts || []),
        { date: new Date().toISOString(), workoutId, durationSec }
      ]
    })
  }

  // Smart Kegel: determine which session to start and open overlay directly
  const startKegel = (session) => {
    setActiveKegel(session)
  }

  const currentWeek = KEGEL_WEEKS.find(w => w.week === settings.kegelWeek) || KEGEL_WEEKS[0]

  // Check if any overlay is active — hide nav when it is
  const hasOverlay = !!activeWorkout || !!activeKegel

  return (
    <>
      {/* Screen area */}
      <div className="relative flex-1 overflow-hidden" style={{ background: '#131313' }}>
        <AnimatePresence mode="wait">
          {tab === 'home' && (
            <motion.div key="home" className="absolute inset-0"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}>
              <Home
                settings={settings}
                onStartWorkout={(w) => setActiveWorkout(w)}
                onStartKegel={startKegel}
                onNavigate={setTab}
              />
            </motion.div>
          )}
          {tab === 'programs' && (
            <motion.div key="programs" className="absolute inset-0"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}>
              <Programs onStartWorkout={(w) => setActiveWorkout(w)} settings={settings} />
            </motion.div>
          )}
          {tab === 'settings' && (
            <motion.div key="settings" className="absolute inset-0"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}>
              <Settings
                settings={settings}
                onUpdate={updateSettings}
                subscribe={subscribe}
                unsubscribe={unsubscribe}
                getSubscription={getSubscription}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom navigation — hidden during overlays */}
      {!hasOverlay && <BottomNav active={tab} onChange={setTab} />}

      {/* Full-screen workout overlay */}
      <AnimatePresence>
        {activeWorkout && (
          <WorkoutPlayer
            workout={activeWorkout}
            onClose={() => setActiveWorkout(null)}
            onComplete={({ workoutId, durationSec }) => {
              recordWorkout(workoutId, durationSec)
              setActiveWorkout(null)
            }}
          />
        )}
      </AnimatePresence>

      {/* Full-screen Kegel overlay */}
      <AnimatePresence>
        {activeKegel && (
          <KagelSessionOverlay
            session={activeKegel}
            week={currentWeek}
            onClose={() => setActiveKegel(null)}
            onComplete={() => {
              recordWorkout(`kegel-${activeKegel}`)
              setActiveKegel(null)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
