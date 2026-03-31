import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WORKOUTS, KEGEL_WEEKS } from '../data/workouts'

const CATEGORIES = [
  {
    id: 'core',
    title: 'CORE STRENGTH',
    subtitle: 'CALISTHENICS & BODYWEIGHT',
    image: '/categories/core-strength.png',
    workoutFilter: w => w.category === 'core',
  },
  {
    id: 'pelvic',
    title: 'PELVIC VITALITY',
    subtitle: 'KEGELS & STRUCTURAL FLOWS',
    image: '/categories/pelvic-vitality.png',
    workoutFilter: null, // special — kegel drills
  },
  {
    id: 'abs',
    title: 'ABS ACADEMY',
    subtitle: 'THE 6 PACK JOURNEY',
    image: '/categories/functional-power.png',
    workoutFilter: w => w.category === 'abs',
  },
  {
    id: 'fullbody',
    title: 'FULL BODY',
    subtitle: 'FROM HEAD TO TOES',
    image: '/categories/full-body.png',
    workoutFilter: w => w.category === 'fullbody',
  },
]

const heading = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  color: '#e5e2e1',
}

const body = {
  fontFamily: "'Inter', sans-serif",
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
})

// ── Back arrow icon ────────────────────────────────────────────────────────
function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12 4L6 10L12 16" stroke="#e5e2e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Category Detail View ─────────────────────────────────────────────────
function CategoryDetail({ category, onBack, onStartWorkout, onPreviewKegel, settings }) {
  const isKegel = category.id === 'pelvic'

  // Kegel drills: merge all unique exercises from current week (no morning/evening split)
  const currentWeek = KEGEL_WEEKS.find(w => w.week === (settings?.kegelWeek || 1)) || KEGEL_WEEKS[0]
  const allDrills = isKegel
    ? [...currentWeek.sessions.morning, ...currentWeek.sessions.evening]
    : []
  // Deduplicate by exercise name
  const uniqueDrills = isKegel
    ? allDrills.filter((d, i, arr) => arr.findIndex(x => x.name === d.name) === i)
    : []

  const workouts = isKegel ? [] : WORKOUTS.filter(category.workoutFilter || (() => false))

  return (
    <div className="scroll-area" style={{ paddingBottom: 110 }}>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ padding: '32px 24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          style={{
            width: 40, height: 40, borderRadius: 4,
            background: '#201f1f', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <BackArrow />
        </motion.button>
        <div>
          <h1 style={{ ...heading, fontSize: 28, fontWeight: 800, fontStyle: 'italic', letterSpacing: -1.4, margin: 0, textTransform: 'uppercase' }}>
            {category.title}
          </h1>
          <p style={{ ...body, fontSize: 12, fontWeight: 500, color: '#c3c5d9', letterSpacing: 1.2, textTransform: 'uppercase', margin: '4px 0 0' }}>
            {category.subtitle}
          </p>
        </div>
      </motion.div>

      {/* Hero image */}
      <motion.div {...fadeUp(0.05)} style={{ padding: '20px 24px 0' }}>
        <div style={{
          height: 180, borderRadius: 6, overflow: 'hidden',
          background: '#1c1b1b', position: 'relative',
        }}>
          <img src={category.image} alt={category.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #131313 0%, transparent 60%)' }} />
        </div>
      </motion.div>

      {/* Workout list or Kegel drills */}
      <div style={{ padding: '24px 24px 0' }}>
        {isKegel ? (
          <>
            <h2 style={{ ...heading, fontSize: 18, fontWeight: 800, fontStyle: 'italic', letterSpacing: -0.9, textTransform: 'uppercase', margin: '0 0 16px' }}>
              {currentWeek.label}
            </h2>
            <p style={{ ...body, fontSize: 14, color: '#8d90a2', margin: '0 0 20px', lineHeight: 1.5 }}>
              {currentWeek.description}
            </p>

            <h3 style={{ ...heading, fontSize: 14, fontWeight: 700, color: '#b3c5ff', textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 12px' }}>
              Exercises
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {uniqueDrills.map((drill, i) => (
                <motion.div key={drill.name} {...fadeUp(0.1 + i * 0.04)}
                  style={{ background: '#1c1b1b', padding: '16px 20px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 16 }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ ...heading, fontSize: 16, fontWeight: 700, color: '#e5e2e1', margin: 0 }}>{drill.name}</p>
                    <p style={{ ...body, fontSize: 12, color: '#8d90a2', margin: '4px 0 0' }}>
                      {drill.holdSec}s hold · {drill.restSec}s rest · {drill.reps} reps × {drill.sets} sets
                    </p>
                    <p style={{ ...body, fontSize: 11, color: '#c3c5d9', margin: '4px 0 0' }}>{drill.cue}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onPreviewKegel && onPreviewKegel(drill)}
                    style={{
                      background: 'linear-gradient(169deg, #FFB4AA 0%, #FF3B30 100%)',
                      border: 'none', borderRadius: 6, cursor: 'pointer',
                      padding: '10px 16px', flexShrink: 0,
                    }}
                  >
                    <span style={{ ...body, fontSize: 12, fontWeight: 700, color: '#201f1f', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      Try
                    </span>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </>
        ) : workouts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {workouts.map((w, i) => {
              const totalSec = w.exercises.reduce((sum, ex) =>
                sum + (ex.workSec || w.workSec) + (ex.restSec ?? w.restSec), 0)
              const mins = Math.ceil(totalSec / 60)
              return (
                <motion.div key={w.id} {...fadeUp(0.1 + i * 0.06)}
                  style={{ background: '#1c1b1b', padding: 24, display: 'flex', alignItems: 'center', gap: 16, borderRadius: 4 }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: 72, height: 72, borderRadius: 4, overflow: 'hidden', background: '#353534', flexShrink: 0 }}>
                    {w.thumb && <img src={w.thumb} alt={w.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ ...heading, fontSize: 18, fontWeight: 700, letterSpacing: -0.45, textTransform: 'uppercase', margin: 0, lineHeight: 1.2 }}>{w.title}</p>
                    <p style={{ ...body, fontSize: 12, color: '#8d90a2', margin: '4px 0 0' }}>{w.subtitle}</p>
                    <p style={{ ...body, fontSize: 10, color: '#8d90a2', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: 1 }}>{w.exercises.length} exercises · ~{mins} min</p>
                  </div>
                  <motion.button whileTap={{ scale: 0.92 }} onClick={() => onStartWorkout(w)}
                    style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: '#ff453a', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="white"><polygon points="0,0 18,10 0,20" /></svg>
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <p style={{ ...body, fontSize: 14, color: '#8d90a2', textAlign: 'center', padding: '40px 0' }}>
            No workouts in this category yet.
          </p>
        )}
      </div>
    </div>
  )
}

// ── Main Programs Component ──────────────────────────────────────────────
export default function Programs({ onStartWorkout, onPreviewKegel, settings }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)

  // Search filtering
  const filteredWorkouts = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    return WORKOUTS.filter(w =>
      w.title.toLowerCase().includes(q) ||
      w.subtitle.toLowerCase().includes(q) ||
      w.exercises.some(ex => ex.name.toLowerCase().includes(q))
    )
  }, [search])

  // If a category is active, show the detail view
  if (activeCategory) {
    return (
      <CategoryDetail
        category={activeCategory}
        onBack={() => setActiveCategory(null)}
        onStartWorkout={onStartWorkout}
        onPreviewKegel={onPreviewKegel}
        settings={settings}
      />
    )
  }

  return (
    <div className="scroll-area" style={{ paddingBottom: 110 }}>
      {/* Hero Title */}
      <motion.div {...fadeUp(0)} style={{ paddingTop: 32, paddingLeft: 24, paddingRight: 24 }}>
        <h1 style={{ ...heading, fontSize: 48, fontWeight: 800, letterSpacing: -2.4, lineHeight: 1, margin: 0 }}>
          WORKOUT<br />LIBRARY
        </h1>
      </motion.div>

      {/* Search Bar — functional */}
      <motion.div {...fadeUp(0.05)} style={{ padding: '24px 24px 0' }}>
        <div style={{
          background: '#282828', borderRadius: 12, height: 42,
          padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bababa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              ...body,
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: 18,
              fontWeight: 400,
              color: '#e5e2e1',
              padding: 0,
            }}
          />
          {search && (
            <motion.button
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3L13 13M13 3L3 13" stroke="#8d90a2" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Search results */}
      <AnimatePresence>
        {filteredWorkouts !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ padding: '16px 24px 0', overflow: 'hidden' }}
          >
            {filteredWorkouts.length === 0 ? (
              <p style={{ ...body, fontSize: 14, color: '#8d90a2', textAlign: 'center', padding: '20px 0' }}>
                No results for "{search}"
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ ...body, fontSize: 12, fontWeight: 600, color: '#8d90a2', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {filteredWorkouts.length} result{filteredWorkouts.length !== 1 ? 's' : ''}
                </span>
                {filteredWorkouts.map((w) => {
                  const totalSec = w.exercises.reduce((sum, ex) =>
                    sum + (ex.workSec || w.workSec) + (ex.restSec ?? w.restSec), 0)
                  const mins = Math.ceil(totalSec / 60)
                  const matchingExercises = search.trim()
                    ? w.exercises.filter(ex => ex.name.toLowerCase().includes(search.toLowerCase()))
                    : []

                  return (
                    <motion.div key={w.id} {...fadeUp(0.05)}
                      style={{ background: '#1c1b1b', padding: 16, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 14 }}
                    >
                      <div style={{ width: 64, height: 64, borderRadius: 4, overflow: 'hidden', background: '#353534', flexShrink: 0 }}>
                        {w.thumb && <img src={w.thumb} alt={w.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ ...heading, fontSize: 16, fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>{w.title}</p>
                        <p style={{ ...body, fontSize: 11, color: '#8d90a2', margin: '2px 0 0' }}>
                          {w.exercises.length} exercises · ~{mins} min
                        </p>
                        {matchingExercises.length > 0 && (
                          <p style={{ ...body, fontSize: 11, color: '#b3c5ff', margin: '4px 0 0' }}>
                            Matches: {matchingExercises.map(e => e.name).join(', ')}
                          </p>
                        )}
                      </div>
                      <motion.button whileTap={{ scale: 0.92 }} onClick={() => onStartWorkout(w)}
                        style={{
                          width: 40, height: 40, borderRadius: 10,
                          background: '#ff453a', border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', flexShrink: 0,
                        }}
                      >
                        <svg width="14" height="16" viewBox="0 0 18 20" fill="white"><polygon points="0,0 18,10 0,20" /></svg>
                      </motion.button>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* By Category Section — only shown when not searching */}
      {!filteredWorkouts && (
        <>
          <motion.div {...fadeUp(0.1)} style={{ padding: '32px 24px 0' }}>
            <h2 style={{ ...heading, fontSize: 24, fontWeight: 800, fontStyle: 'italic', letterSpacing: -1.2, textTransform: 'uppercase', margin: '0 0 16px 0' }}>
              BY CATEGORY
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  {...fadeUp(0.15 + i * 0.06)}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    height: 200, borderRadius: 6, background: '#1c1b1b',
                    overflow: 'hidden', position: 'relative',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    width: '100%', padding: 0,
                  }}
                >
                  {/* Category image */}
                  <img src={cat.image} alt={cat.title}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                  {/* Gradient overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #131313 0%, transparent 60%)' }} />
                  {/* Category text */}
                  <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
                    <p style={{ ...heading, fontSize: 30, fontWeight: 800, fontStyle: 'italic', letterSpacing: -1.5, textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
                      {cat.title}
                    </p>
                    <p style={{ ...body, fontSize: 12, fontWeight: 500, color: '#c3c5d9', letterSpacing: 1.2, textTransform: 'uppercase', margin: '6px 0 0 0' }}>
                      {cat.subtitle}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Workout Programs Section */}
          <motion.div {...fadeUp(0.3)} style={{ padding: '32px 24px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ ...heading, fontSize: 24, fontWeight: 800, fontStyle: 'italic', letterSpacing: -1.2, textTransform: 'uppercase', margin: 0 }}>
                WORKOUT PROGRAMS
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {WORKOUTS.map((w, i) => {
                const totalSec = w.exercises.reduce((sum, ex) =>
                  sum + (ex.workSec || w.workSec) + (ex.restSec ?? w.restSec), 0)
                const mins = Math.ceil(totalSec / 60)
                const num = String(i + 1).padStart(2, '0')
                return (
                  <motion.div key={w.id} {...fadeUp(0.35 + i * 0.06)}
                    style={{ background: '#1c1b1b', padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}
                  >
                    <span style={{ ...heading, fontSize: 24, fontWeight: 800, color: '#8d90a2', flexShrink: 0 }}>{num}</span>
                    {/* Thumbnail */}
                    <div style={{ width: 56, height: 56, borderRadius: 4, overflow: 'hidden', background: '#353534', flexShrink: 0 }}>
                      {w.thumb && <img src={w.thumb} alt={w.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ ...heading, fontSize: 18, fontWeight: 700, letterSpacing: -0.45, textTransform: 'uppercase', margin: 0, lineHeight: 1.2 }}>{w.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
                        <span style={{ ...body, fontSize: 10, fontWeight: 400, color: '#8d90a2', textTransform: 'uppercase', letterSpacing: 1 }}>{mins} MIN</span>
                        <span style={{ ...body, fontSize: 10, fontWeight: 600, color: '#c3c5d9', textTransform: 'uppercase', letterSpacing: 1 }}>ALL LEVELS</span>
                      </div>
                    </div>
                    <motion.button whileTap={{ scale: 0.92 }} onClick={() => onStartWorkout(w)}
                      style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#ff453a', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      <svg width="18" height="20" viewBox="0 0 18 20" fill="white"><polygon points="0,0 18,10 0,20" /></svg>
                    </motion.button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Add New Workout Button */}
          <motion.div {...fadeUp(0.5)} style={{ padding: '24px 24px 0' }}>
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => alert('Custom workouts — coming soon!')}
              style={{
                width: '100%',
                background: 'linear-gradient(176deg, #0052ff 0%, #002b75 100%)',
                borderRadius: 6, border: 'none', padding: '20px 0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, cursor: 'pointer',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e5e2e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span style={{ ...heading, fontSize: 16, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase' }}>ADD NEW WORKOUT</span>
            </motion.button>
          </motion.div>
        </>
      )}
    </div>
  )
}
