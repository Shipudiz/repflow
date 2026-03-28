import React from 'react'
import { motion } from 'framer-motion'
import { WORKOUTS } from '../data/workouts'

const CATEGORIES = [
  { title: 'CORE STRENGTH', subtitle: 'CALISTHENICS & BODYWEIGHT' },
  { title: 'PELVIC VITALITY', subtitle: 'KEGELS & STRUCTURAL FLOWS' },
  { title: 'ABS ACADEMY', subtitle: 'THE 6 PACK JOURNEY' },
  { title: 'FULL BODY', subtitle: 'FROM HEAD TO TOES' },
]

const heading = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  color: '#e5e2e1',
}

const body = {
  fontFamily: "'Inter', sans-serif",
}

export default function Programs({ onStartWorkout, settings }) {
  return (
    <div className="scroll-area" style={{ paddingBottom: 110 }}>
      {/* Hero Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ paddingTop: 32, paddingLeft: 24, paddingRight: 24 }}
      >
        <h1 style={{
          ...heading,
          fontSize: 48,
          fontWeight: 800,
          letterSpacing: -2.4,
          lineHeight: 1,
          margin: 0,
        }}>
          WORKOUT<br />LIBRARY
        </h1>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ padding: '24px 24px 0' }}
      >
        <div style={{
          background: '#282828',
          border: '1px solid #404040',
          borderRadius: 12,
          height: 42,
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bababa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{
            ...body,
            fontSize: 18,
            fontWeight: 400,
            color: '#bababa',
          }}>Search</span>
        </div>
      </motion.div>

      {/* By Category Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ padding: '32px 24px 0' }}
      >
        <h2 style={{
          ...heading,
          fontSize: 24,
          fontWeight: 800,
          fontStyle: 'italic',
          letterSpacing: -1.2,
          textTransform: 'uppercase',
          margin: '0 0 16px 0',
        }}>BY CATEGORY</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: 240,
                borderRadius: 6,
                background: '#1c1b1b',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, #131313 0%, transparent 60%)',
              }} />
              {/* Category text */}
              <div style={{
                position: 'absolute',
                bottom: 24,
                left: 24,
              }}>
                <p style={{
                  ...heading,
                  fontSize: 30,
                  fontWeight: 800,
                  fontStyle: 'italic',
                  letterSpacing: -1.5,
                  textTransform: 'uppercase',
                  margin: 0,
                  lineHeight: 1.1,
                }}>{cat.title}</p>
                <p style={{
                  ...body,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#c3c5d9',
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  margin: '6px 0 0 0',
                }}>{cat.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Workout Programs Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ padding: '32px 24px 0' }}
      >
        {/* Section header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <h2 style={{
            ...heading,
            fontSize: 24,
            fontWeight: 800,
            fontStyle: 'italic',
            letterSpacing: -1.2,
            textTransform: 'uppercase',
            margin: 0,
          }}>WORKOUT PROGRAMS</h2>
          <span style={{
            ...body,
            fontSize: 12,
            fontWeight: 600,
            color: '#b3c5ff',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}>VIEW ALL</span>
        </div>

        {/* Workout list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {WORKOUTS.map((w, i) => {
            const totalSec = w.exercises.reduce((sum, ex) =>
              sum + (ex.workSec || w.workSec) + (ex.restSec ?? w.restSec), 0)
            const mins = Math.ceil(totalSec / 60)
            const num = String(i + 1).padStart(2, '0')

            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: '#1c1b1b',
                  padding: 24,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                }}
              >
                {/* Number */}
                <span style={{
                  ...heading,
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#8d90a2',
                  flexShrink: 0,
                }}>{num}</span>

                {/* Text content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    ...heading,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: -0.45,
                    textTransform: 'uppercase',
                    margin: 0,
                    lineHeight: 1.2,
                  }}>{w.title}</p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    marginTop: 6,
                  }}>
                    <span style={{
                      ...body,
                      fontSize: 10,
                      fontWeight: 400,
                      color: '#8d90a2',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}>{mins} MIN</span>
                    <span style={{
                      ...body,
                      fontSize: 10,
                      fontWeight: 600,
                      color: w.level === 'Beginner' ? '#b3c5ff' : '#c3c5d9',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}>{w.level || 'ALL LEVELS'}</span>
                  </div>
                </div>

                {/* Play button */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onStartWorkout(w)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: '#ff453a',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="20" viewBox="0 0 18 20" fill="white">
                    <polygon points="0,0 18,10 0,20" />
                  </svg>
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Add New Workout Button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ padding: '24px 24px 0' }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => alert('Custom workouts — coming soon!')}
          style={{
            width: '100%',
            background: 'linear-gradient(176deg, #0052ff 0%, #002b75 100%)',
            borderRadius: 6,
            border: 'none',
            padding: '20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
          }}
        >
          {/* Plus circle icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e5e2e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span style={{
            ...heading,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 1.6,
            textTransform: 'uppercase',
          }}>ADD NEW WORKOUT</span>
        </motion.button>
      </motion.div>
    </div>
  )
}
