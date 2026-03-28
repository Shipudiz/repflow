import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

// Safe Notification permission check — iOS Safari doesn't have this API
function getNotifPermission() {
  try {
    if (typeof Notification === 'undefined') return 'unsupported'
    return Notification.permission || 'default'
  } catch {
    return 'unsupported'
  }
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
      // Sum up durations in minutes
      const totalMinutes = dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0)
      return { label, totalMinutes, count: dayWorkouts.length, isSaturday: i === 5, isSunday: i === 6 }
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
  const totalDuration = allWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0)
  const avgSeconds = allWorkouts.length > 0 ? Math.round((totalDuration / allWorkouts.length) * 60) : 2535
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
export default function Settings({ settings, onUpdate, requestPermission }) {
  const [notifStatus, setNotifStatus] = useState(getNotifPermission)

  const handleEnableNotifications = async () => {
    try {
      const granted = await requestPermission()
      const status = granted ? 'granted' : 'denied'
      setNotifStatus(status)
      if (granted) onUpdate({ notificationsEnabled: true })
    } catch {
      setNotifStatus('denied')
    }
  }

  const toggle = (key) => onUpdate({ [key]: !settings[key] })
  const isUnsupported = notifStatus === 'unsupported'

  // Reminder rows configuration
  const reminderRows = [
    {
      key: 'morningKegel',
      label: 'Morning Kegel',
      time: settings.morningTime || '10:00',
      timeKey: 'morningTime',
      schedule: 'Everyday',
      enabled: settings.morningKegelEnabled !== false && settings.notificationsEnabled,
      toggleKey: 'morningKegelEnabled',
    },
    {
      key: 'eveningKegel',
      label: 'Evening Kegel',
      time: settings.eveningTime || '18:00',
      timeKey: 'eveningTime',
      schedule: 'Everyday',
      enabled: settings.eveningKegelEnabled !== false && settings.notificationsEnabled,
      toggleKey: 'eveningKegelEnabled',
    },
    {
      key: 'absWorkout',
      label: 'Abs Workout',
      time: settings.absTime || '19:00',
      timeKey: 'absTime',
      schedule: 'Sun Tue Thu',
      enabled: settings.absWorkoutEnabled !== false && settings.notificationsEnabled,
      toggleKey: 'absWorkoutEnabled',
    },
    {
      key: 'fullBody',
      label: 'Full Body',
      time: settings.fullBodyTime || '19:30',
      timeKey: 'fullBodyTime',
      schedule: 'Mon Wed',
      enabled: settings.fullBodyEnabled !== false && settings.notificationsEnabled,
      toggleKey: 'fullBodyEnabled',
    },
  ]

  // Calculate streak
  const streakDays = settings.streakDays || 0

  // Calculate next milestone
  const milestones = [7, 14, 21, 30, 50, 75, 100, 150, 200, 365]
  const nextMilestone = milestones.find(m => m > streakDays) || (Math.ceil(streakDays / 100) + 1) * 100
  const daysUntilMilestone = nextMilestone - streakDays

  // Streak bubbles: 10 circles, filled for completed days
  const streakBubbleCount = 10
  const filledBubbles = Math.min(streakDays % streakBubbleCount || (streakDays > 0 ? streakBubbleCount : 0), streakBubbleCount)

  // Format time for display (HH:MM -> "10:00" style large text)
  const formatTimeDisplay = (time) => {
    const [h, m] = (time || '00:00').split(':')
    return `${h}:${m}`
  }

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
        {isUnsupported ? (
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: '#8d90a2',
            margin: 0,
          }}>
            Notifications are not supported in this browser. On iOS, install the app to your home screen first.
          </p>
        ) : notifStatus !== 'granted' ? (
          <div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: '#8d90a2',
              marginBottom: 16,
              lineHeight: 1.5,
            }}>
              Enable notifications to set workout reminders.
            </p>
            <button
              onClick={handleEnableNotifications}
              disabled={notifStatus === 'denied'}
              style={{
                width: '100%',
                padding: '14px 0',
                borderRadius: 8,
                border: 'none',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                cursor: notifStatus === 'denied' ? 'not-allowed' : 'pointer',
                background: notifStatus === 'denied' ? '#353534' : '#005be6',
                color: notifStatus === 'denied' ? '#8d90a2' : '#ffffff',
              }}
            >
              {notifStatus === 'denied' ? 'Blocked — Enable in Browser Settings' : 'Enable Notifications'}
            </button>
          </div>
        ) : (
          <div>
            {reminderRows.map((row, idx) => (
              <div key={row.key}>
                {idx > 0 && (
                  <div style={{ height: 1, background: '#404040', opacity: 0.3, margin: '16px 0' }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Toggle */}
                  <Toggle
                    value={row.enabled}
                    onToggle={() => {
                      if (!settings.notificationsEnabled) {
                        onUpdate({ notificationsEnabled: true, [row.toggleKey]: true })
                      } else {
                        onUpdate({ [row.toggleKey]: !row.enabled })
                      }
                    }}
                  />

                  {/* Label + schedule */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      background: '#131313',
                      border: '1px solid #404040',
                      borderRadius: 8,
                      padding: '8px 12px',
                      width: 120,
                      marginBottom: 4,
                    }}>
                      <span style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: 14,
                        color: '#bababa',
                      }}>
                        {row.label}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      fontSize: 11,
                      color: '#bababa',
                    }}>
                      {row.schedule}
                    </span>
                  </div>

                  {/* Time display */}
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: 30,
                    color: '#bababa',
                    flexShrink: 0,
                  }}>
                    {formatTimeDisplay(row.time)}
                  </span>
                </div>
              </div>
            ))}
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
