import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WORKOUTS } from '../data/workouts'

export default function Programs({ onStartWorkout }) {
  const [selected, setSelected] = useState(null)

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
        {WORKOUTS.map((w, i) => (
          <motion.div key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}>

            {/* Workout header card */}
            <button
              onClick={() => setSelected(selected === w.id ? null : w.id)}
              className="w-full text-left rounded-3xl p-5 transition-all active:scale-98"
              style={{ background: '#111827', border: `1px solid #1f2937` }}>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: `${w.color}22`, border: `1px solid ${w.color}44` }}>
                    {w.emoji}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: '#f9fafb' }}>{w.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{w.subtitle}</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: selected === w.id ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: '#6b7280' }}>›</motion.div>
              </div>

              {/* exercise count pills */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: `${w.color}22`, color: w.color }}>
                  {w.exercises.length} exercises
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: '#1f2937', color: '#9ca3af' }}>
                  ~10 min
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: '#1f2937', color: '#9ca3af' }}>
                  {w.workSec}s work
                </span>
              </div>
            </button>

            {/* Exercise list (expandable) */}
            <AnimatePresence>
              {selected === w.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden">

                  <div className="mt-2 rounded-3xl overflow-hidden"
                    style={{ background: '#0d1117', border: '1px solid #1f2937' }}>

                    {w.exercises.map((ex, idx) => (
                      <div key={ex.id}
                        className="flex items-center gap-3 px-4 py-3"
                        style={{ borderBottom: idx < w.exercises.length - 1 ? '1px solid #111827' : 'none' }}>
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: `${w.color}22`, color: w.color }}>
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: '#e5e7eb' }}>{ex.name}</p>
                          <p className="text-xs" style={{ color: '#6b7280' }}>{ex.cue}</p>
                        </div>
                        <span className="text-xs" style={{ color: '#374151' }}>{w.workSec}s</span>
                      </div>
                    ))}

                    {/* Start button */}
                    <div className="p-3">
                      <button
                        onClick={() => onStartWorkout(w)}
                        className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
                        style={{ background: w.color, color: '#fff' }}>
                        Start Workout →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Add custom workout (coming soon) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: WORKOUTS.length * 0.08 + 0.1 }}>
          <button
            className="w-full rounded-3xl py-4 border-dashed flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ border: '2px dashed #1f2937', color: '#374151' }}
            onClick={() => alert('Custom workouts — coming soon! 🚧')}>
            <span className="text-xl">+</span>
            <span className="font-medium text-sm">Add Custom Workout</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
