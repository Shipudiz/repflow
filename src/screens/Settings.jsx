import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'

// Check push support — works on iOS PWA (16.4+) and all modern browsers
function checkPushSupport() {
  return 'serviceWorker' in navigator && 'PushManager' in window
}

// ─── Inline Toggle Switch ───────────────────────────────────────────────────
function Toggle({ value, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        background: value ? '#005be6' : '#353534',
        border: 'none',
        padding: 0,
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 0.3s ease',
      }}
      role="switch"
      aria-checked={value}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        style={{
          position: 'absolute',
          top: 3,
          left: value ? 21 : 3,
          width: 20,
          height: 20,
          borderRadius: 10,
          background: '#ffffff',
        }}
      />
    </motion.button>
  )
}

// ─── Bell Icon SVG ──────────────────────────────────────────────────────────
function BellIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#b3c5ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

// ─── Swipe to Delete ────────────────────────────────────────────────────────
function SwipeToDelete({ children, onDelete, showDivider }) {
  const DELETE_WIDTH = 72

  return (
    <div>
      {showDivider && (
        <div style={{ height: 1, background: '#404040', opacity: 0.3, margin: '16px 0' }} />
      )}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Delete button behind */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: DELETE_WIDTH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            style={{
              width: '100%',
              height: '100%',
              background: '#cc0d11',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 10, color: '#fff', textTransform: 'uppercase' }}>Delete</span>
          </motion.button>
        </div>

        {/* Swipeable content */}
        <motion.div
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: -DELETE_WIDTH, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(e, info) => {
            // If swiped far enough left, snap to reveal delete
            // Otherwise snap back
            if (info.offset.x < -DELETE_WIDTH * 0.5) {
              // Stay open — the dragConstraints handle this
            }
          }}
          style={{
            background: '#201f1f',
            position: 'relative',
            zIndex: 1,
            touchAction: 'pan-y',
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

// ─── Weekly Momentum Bar Chart ──────────────────────────────────────────────
function WeeklyMomentumChart({ completedWorkouts = [] }) {
  const dayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  const now = new Date()
  const currentDay = now.getDay() // 0=Sun, 1=Mon...

  // Calculate start of current week (Monday)
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay
  const monday = new Date(now)
  monday.setDate(now.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)

  const days = useMemo(() => {
    return dayLabels.map((label, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const dateStr = d.toDateString()
      const dayWorkouts = completedWorkouts.filter(
        w => new Date(w.date).toDateString() === dateStr
      )
      // Sum up durations in minutes (data stores durationSec)
      const totalMinutes = dayWorkouts.reduce((sum, w) => sum + ((w.durationSec || 0) / 60), 0)
      // If workouts exist but duration is 0, show at least count * 10 min estimate
      const displayMinutes = totalMinutes > 0 ? totalMinutes : dayWorkouts.length * 10
      return { label, totalMinutes: displayMinutes, count: dayWorkouts.length, isSaturday: i === 5, isSunday: i === 6 }
    })
  }, [completedWorkouts])

  const maxMinutes = Math.max(60, ...days.map(d => d.totalMinutes))
  const chartHeight = 256

  // Calculate average session time
  const allWorkouts = completedWorkouts.filter(w => {
    const wd = new Date(w.date)
    wd.setHours(0, 0, 0, 0)
    return wd >= monday
  })
  const totalDurationSec = allWorkouts.reduce((sum, w) => sum + (w.durationSec || 0), 0)
  const avgSeconds = allWorkouts.length > 0 ? Math.round(totalDurationSec / allWorkouts.length) : 0
  const avgMin = Math.floor(avgSeconds / 60)
  const avgSec = avgSeconds % 60

  return (
    <div style={{ padding: '0 24px' }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            color: '#b3c5ff',
            textTransform: 'uppercase',
            letterSpacing: 2.4,
            marginBottom: 8,
          }}>
            WEEKLY MOMENTUM
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 24,
            color: '#e5e2e1',
            letterSpacing: -0.6,
          }}>
            Activity Distribution
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 10,
            color: '#8d90a2',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            AVG. SESSION
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 20,
            color: '#e5e2e1',
          }}>
            {avgMin}m {String(avgSec).padStart(2, '0')}s
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: chartHeight }}>
        {days.map((d, i) => {
          const isActive = d.totalMinutes > 0
          const barHeight = isActive
            ? Math.max(12, (d.totalMinutes / maxMinutes) * (chartHeight - 30))
            : d.isSunday ? 2 : 8

          let barColor = '#2a2a2a'
          let labelColor = '#8d90a2'

          if (d.isSaturday && isActive) {
            barColor = '#cc0d11'
            labelColor = '#ffb4aa'
          } else if (isActive) {
            barColor = '#005be6'
            labelColor = '#e5e2e1'
          }

          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: barHeight }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: '100%',
                  borderRadius: d.isSunday && !isActive ? 0 : 4,
                  background: d.isSunday && !isActive ? 'transparent' : barColor,
                  borderBottom: d.isSunday && !isActive ? '2px solid #434656' : 'none',
                  marginBottom: 10,
                }}
              />
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 10,
                color: labelColor,
                textTransform: 'uppercase',
              }}>
                {d.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Settings Component ────────────────────────────────────────────────
export default function Settings({ settings, onUpdate, subscribe, unsubscribe, getSubscription }) {
  const [pushState, setPushState] = useState('loading') // loading | unsupported | unsubscribed | subscribed | denied
  const [subscribing, setSubscribing] = useState(false)
  const [testingPush, setTestingPush] = useState(false)
  const [testResult, setTestResult] = useState('')

  // Check current push subscription status on mount
  useEffect(() => {
    if (!checkPushSupport()) {
      setPushState('unsupported')
      return
    }
    getSubscription().then(sub => {
      setPushState(sub ? 'subscribed' : 'unsubscribed')
    })
  }, [getSubscription])

  const handleSubscribe = async () => {
    setSubscribing(true)
    const result = await subscribe()
    if (result.ok) {
      setPushState('subscribed')
      onUpdate({ notificationsEnabled: true })
    } else {
      // Show the actual error so we can debug
      if (result.reason?.includes('denied')) {
        setPushState('denied')
      }
      setTestResult(result.reason || 'Subscribe failed')
      setTimeout(() => setTestResult(''), 6000)
    }
    setSubscribing(false)
  }

  const handleUnsubscribe = async () => {
    await unsubscribe()
    setPushState('unsubscribed')
    onUpdate({ notificationsEnabled: false })
  }

  const handleTestPush = async () => {
    setTestingPush(true)
    setTestResult('Sending...')
    try {
      const resp = await fetch('/api/test-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await resp.json()
      if (data.sent) {
        setTestResult('Sent! Check notifications')
      } else {
        setTestResult(data.error || JSON.stringify(data))
      }
    } catch (err) {
      setTestResult(`Failed: ${err.message}`)
    }
    setTestingPush(false)
    setTimeout(() => setTestResult(''), 8000)
  }

  // Dynamic reminders stored in settings
  const reminders = settings.reminders || [
    { id: 'morningKegel', label: 'Morning Kegel', body: 'Time for your morning pelvic floor session', time: '10:00', days: [0,1,2,3,4,5,6], enabled: true },
    { id: 'eveningKegel', label: 'Evening Kegel', body: "Don't forget your evening session!", time: '18:00', days: [0,1,2,3,4,5,6], enabled: true },
    { id: 'absWorkout', label: 'Abs Workout', body: 'Time to hit the abs!', time: '19:00', days: [0,2,4], enabled: true },
  ]

  const DAY_LABELS = ['S','M','T','W','T','F','S']

  const WORKOUT_OPTIONS = [
    'Morning Kegel', 'Evening Kegel', 'Abs Workout', 'Daily Routine', '12 Steps', 'Full Body',
  ]
  // Filter out already-used labels
  const availableOptions = WORKOUT_OPTIONS.filter(
    opt => !reminders.some(r => r.label === opt)
  )

  const updateReminders = (updated) => onUpdate({ reminders: updated })

  const addReminder = () => {
    if (availableOptions.length === 0) return
    const newReminder = {
      id: `reminder-${Date.now()}`,
      label: availableOptions[0],
      body: 'Time for your workout!',
      time: '19:00',
      days: [0,1,2,3,4,5,6],
      enabled: true,
    }
    updateReminders([...reminders, newReminder])
  }

  const removeReminder = (id) => {
    updateReminders(reminders.filter(r => r.id !== id))
  }

  const updateReminder = (id, patch) => {
    updateReminders(reminders.map(r => r.id === id ? { ...r, ...patch } : r))
  }

  const toggleDay = (id, dayIdx) => {
    const reminder = reminders.find(r => r.id === id)
    if (!reminder) return
    const days = reminder.days.includes(dayIdx)
      ? reminder.days.filter(d => d !== dayIdx)
      : [...reminder.days, dayIdx].sort()
    updateReminder(id, { days })
  }

  // Calculate streak
  const streakDays = settings.streakDays || 0

  // Calculate next milestone
  const milestones = [7, 14, 21, 30, 50, 75, 100, 150, 200, 365]
  const nextMilestone = milestones.find(m => m > streakDays) || (Math.ceil(streakDays / 100) + 1) * 100
  const daysUntilMilestone = nextMilestone - streakDays

  // Streak bubbles: 10 circles, filled for completed days
  const streakBubbleCount = 10
  const filledBubbles = Math.min(streakDays % streakBubbleCount || (streakDays > 0 ? streakBubbleCount : 0), streakBubbleCount)

  return (
    <div className="scroll-area" style={{ paddingBottom: 110 }}>
      {/* Hero Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ paddingTop: 32, paddingLeft: 24, paddingRight: 24, marginBottom: 32 }}
      >
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: 48,
          color: '#e5e2e1',
          letterSpacing: -2.4,
          lineHeight: 1.0,
          margin: 0,
        }}>
          SETTINGS<br />&amp; STATS
        </h1>
      </motion.div>

      {/* Set Reminders Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#201f1f',
          borderRadius: 4,
          padding: 32,
          marginLeft: 24,
          marginRight: 24,
          marginBottom: 40,
        }}
      >
        {/* Blue pill badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(0,91,230,0.2)',
          borderRadius: 12,
          padding: '6px 12px',
          marginBottom: 24,
        }}>
          <BellIcon />
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 10,
            color: '#b3c5ff',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            SET REMINDERS
          </span>
        </div>

        {/* Notification permission handling */}
        {pushState === 'unsupported' ? (
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: '#8d90a2',
            margin: 0,
            lineHeight: 1.5,
          }}>
            Push notifications require installing this app to your home screen. On iPhone: tap Share → Add to Home Screen, then open from there.
          </p>
        ) : pushState === 'loading' ? (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#8d90a2', margin: 0 }}>
            Checking notification status...
          </p>
        ) : pushState !== 'subscribed' ? (
          <div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: '#8d90a2',
              marginBottom: 16,
              lineHeight: 1.5,
            }}>
              {pushState === 'denied'
                ? 'Notifications were blocked. Open your device settings to allow them for this app.'
                : 'Enable push notifications to get workout reminders — even when the app is closed.'}
            </p>
            {pushState !== 'denied' && (
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  borderRadius: 8,
                  border: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  background: '#005be6',
                  color: '#ffffff',
                  opacity: subscribing ? 0.7 : 1,
                }}
              >
                {subscribing ? 'Enabling...' : 'Enable Push Notifications'}
              </button>
            )}
            {testResult && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#ff453a', marginTop: 12, textAlign: 'center', wordBreak: 'break-all' }}>
                {testResult}
              </p>
            )}
          </div>
        ) : (
          <div>
            {reminders.map((row, idx) => (
              <SwipeToDelete key={row.id} onDelete={() => removeReminder(row.id)} showDivider={idx > 0}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  {/* Toggle */}
                  <div style={{ paddingTop: 6 }}>
                    <Toggle
                      value={row.enabled}
                      onToggle={() => updateReminder(row.id, { enabled: !row.enabled })}
                    />
                  </div>

                  {/* Content: selector + days on top row, time below */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Top: workout selector + time */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <select
                        value={row.label}
                        onChange={e => updateReminder(row.id, { label: e.target.value })}
                        style={{
                          background: '#131313',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 12px',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                          fontSize: 14,
                          color: '#e5e2e1',
                          flex: 1,
                          minWidth: 0,
                          cursor: 'pointer',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238d90a2' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 12px center',
                          paddingRight: 32,
                        }}
                      >
                        <option value={row.label}>{row.label}</option>
                        {availableOptions.filter(o => o !== row.label).map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>

                      <input
                        type="time"
                        value={row.time}
                        step="900"
                        onChange={e => updateReminder(row.id, { time: e.target.value })}
                        style={{
                          background: '#131313',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 10px',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 600,
                          fontSize: 16,
                          color: '#e5e2e1',
                          flexShrink: 0,
                          width: 82,
                          cursor: 'pointer',
                          colorScheme: 'dark',
                        }}
                      />
                    </div>

                    {/* Day pills */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      {DAY_LABELS.map((label, dayIdx) => {
                        const isSelected = row.days.includes(dayIdx)
                        return (
                          <button key={dayIdx}
                            onClick={() => toggleDay(row.id, dayIdx)}
                            style={{
                              width: 28, height: 28, borderRadius: 14,
                              background: isSelected ? '#005be6' : '#353534',
                              border: 'none',
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600, fontSize: 10,
                              color: isSelected ? '#fff' : '#8d90a2',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </SwipeToDelete>
            ))}

            {/* Add new reminder button */}
            {availableOptions.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={addReminder}
                style={{
                  width: '100%',
                  marginTop: 20,
                  padding: '12px 0',
                  background: 'rgba(0,91,230,0.15)',
                  border: 'none',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  cursor: 'pointer',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="#b3c5ff" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600, fontSize: 13,
                  color: '#b3c5ff',
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                }}>
                  Add Reminder
                </span>
              </motion.button>
            )}

            {/* Test notification */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleTestPush}
              disabled={testingPush}
              style={{
                width: '100%',
                marginTop: 12,
                padding: '12px 0',
                background: '#353534',
                border: 'none',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: 'pointer',
                opacity: testingPush ? 0.6 : 1,
              }}
            >
              <BellIcon />
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600, fontSize: 13,
                color: '#e5e2e1',
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}>
                {testResult || (testingPush ? 'Sending...' : 'Test Notification')}
              </span>
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Weekly Momentum Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 40 }}
      >
        <WeeklyMomentumChart completedWorkouts={settings.completedWorkouts} />
      </motion.div>

      {/* Current Streak Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#201f1f',
          borderRadius: 4,
          padding: 32,
          marginLeft: 24,
          marginRight: 24,
          marginBottom: 40,
        }}
      >
        {/* Badge */}
        <div style={{
          display: 'inline-block',
          background: '#005be6',
          borderRadius: 2,
          padding: '4px 12px',
          marginBottom: 20,
        }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 10,
            color: '#dee4ff',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            CURRENT STREAK
          </span>
        </div>

        {/* Big streak text */}
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: 72,
          color: '#e5e2e1',
          letterSpacing: -3.6,
          lineHeight: 1.0,
          marginBottom: 16,
        }}>
          {streakDays} DAYS<br />STRONG
        </div>

        {/* Description */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: 16,
          color: '#8d90a2',
          lineHeight: '24px',
          margin: 0,
          marginBottom: 24,
        }}>
          Your discipline is forging a new standard. Keep the momentum high. {daysUntilMilestone} day{daysUntilMilestone !== 1 ? 's' : ''} until next milestone.
        </p>

        {/* Streak bubbles */}
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: streakBubbleCount }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                background: i < filledBubbles ? '#b3c5ff' : '#353534',
                boxShadow: i < filledBubbles ? '0 0 12px rgba(179,197,255,0.4)' : 'none',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
