import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WORKOUTS } from '../data/workouts'

export default function Programs({ onStartWorkout, settings }) {
  const [selected, setSelected] = useState(null)
  const today = new Date().toDateString()
  const todayWorkouts = (settings?.completedWorkouts || []).filter(w => new Date(w.date).toDateString() === today)

  return (
    <div className="scroll-area" style={{ paddingLeft: 20, paddingRight: 20 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#f9fafb' }}>Programs</h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Tap a workout to preview exercises</p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {WORKOUTS.map((w, i) => {
          const done = todayWorkouts.some(d => d.workoutId === w.id)
          const totalSec = w.exercises.length * (w.workSec + w.restSec)
          const mins = Math.ceil(totalSec / 60)

          return (
            <motion.div key={w.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>

              {/* Workout header card */}
              <motion.button
                onClick={() => setSelected(selected === w.id ? null : w.id)}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left rounded-3xl p-5 transition-all"
                style={{
                  background: 'linear-gradient(145deg, #111827 0%, #0d1117 100%)',
                  border: `1px solid ${done ? w.color + '44' : '#1f2937'}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: `${w.color}15`, border: `1px solid ${w.color}33` }}>
                      {w.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold" style={{ color: '#f9fafb' }}>{w.title}</p>
                        {done && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{
                              fontSize: 9, padding: '2px 6px', borderRadius: 99,
                              background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600,
                            }}>Done</motion.span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{w.subtitle}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: selected === w.id ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: '#4b5563', fontSize: 20, fontWeight: 300 }}>›</motion.div>
                </div>

                {/* exercise count pills */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: `${w.color}15`, color: w.color, fontWeight: 500 }}>
                    {w.exercises.length} exercises
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: '#1f2937', color: '#9ca3af' }}>
                    ~{mins} min
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: '#1f2937', color: '#9ca3af' }}>
                    {w.workSec}s work
                  </span>
                </div>
              </motion.button>

              {/* Exercise list (expandable) */}
              <AnimatePresence>
                {selected === w.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden">

                    <div className="mt-2 rounded-3xl overflow-hidden"
                      style={{
                        background: 'linear-gradient(145deg, #0d1117 0%, #111827 100%)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}>

                      {w.exercises.map((ex, idx) => (
                        <motion.div key={ex.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center gap-3 px-4 py-3"
                          style={{ borderBottom: idx < w.exercises.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: `${w.color}15`, color: w.color }}>
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: '#e5e7eb' }}>{ex.name}</p>
                            <p className="text-xs" style={{ color: '#4b5563' }}>{ex.cue}</p>
                          </div>
                          <span className="text-xs font-mono" style={{ color: '#374151' }}>{w.workSec}s</span>
                        </motion.div>
                      ))}

                      {/* Start button */}
                      <div className="p-3">
                        <motion.button
                          onClick={() => onStartWorkout(w)}
                          whileTap={{ scale: 0.97 }}
                          className="w-full py-3.5 rounded-2xl font-bold text-sm"
                          style={{ background: w.color, color: '#fff' }}>
                          Start Workout →
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}

        {/* Add custom workout (coming soon) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: WORKOUTS.length * 0.08 + 0.1 }}>
          <button
            className="w-full rounded-3xl py-4 border-dashed flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ border: '2px dashed #1f2937', color: '#374151' }}
            onClick={() => alert('Custom workouts — coming soon!')}>
            <span className="text-xl">+</span>
            <span className="font-medium text-sm">Add Custom Workout</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
