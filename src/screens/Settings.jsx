import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Safe Notification permission check — iOS Safari doesn't have this API
function getNotifPermission() {
  try {
    if (typeof Notification === 'undefined') return 'unsupported'
    return Notification.permission || 'default'
  } catch {
    return 'unsupported'
  }
}

// ─── 7-day activity chart ────────────────────────────────────────────────────
function ActivityChart({ completedWorkouts = [] }) {
  const days = []
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toDateString()
    const count = completedWorkouts.filter(w => new Date(w.date).toDateString() === dateStr).length
    days.push({ label: labels[d.getDay()], count, isToday: i === 0 })
  }

  const maxCount = Math.max(3, ...days.map(d => d.count))

  return (
    <div className="flex items-end justify-between gap-2" style={{ height: 60, padding: '0 4px' }}>
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
          <div style={{
            width: '100%', maxWidth: 20, borderRadius: 4,
            height: Math.max(4, (d.count / maxCount) * 40),
            background: d.count > 0
              ? d.isToday ? '#8b5cf6' : '#7c3aed88'
              : '#1f2937',
            transition: 'height 0.5s ease, background 0.3s ease',
          }} />
          <span style={{
            fontSize: 9, fontWeight: d.isToday ? 700 : 400,
            color: d.isToday ? '#a78bfa' : '#4b5563',
          }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function Settings({ settings, onUpdate, requestPermission }) {
  const [notifStatus, setNotifStatus] = useState(getNotifPermission)
  const [copied, setCopied] = useState(false)

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

  const handleCopyData = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(settings, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = JSON.stringify(settings)
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="scroll-area" style={{ paddingLeft: 20, paddingRight: 20 }}>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#f9fafb' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: '#6b7280' }}>Notifications & preferences</p>
      </motion.div>

      {/* Notifications */}
      <Section title="Push Notifications" delay={0.05}>
        {isUnsupported ? (
          <div className="p-4">
            <p className="text-sm" style={{ color: '#6b7280' }}>
              Notifications are not supported in this browser.
              On iOS, install the app to your home screen first.
            </p>
          </div>
        ) : notifStatus !== 'granted' ? (
          <div className="p-4">
            <p className="text-sm mb-4 leading-relaxed" style={{ color: '#9ca3af' }}>
              Get reminded for your morning and evening Kegel sessions.
            </p>
            <button
              onClick={handleEnableNotifications}
              disabled={notifStatus === 'denied'}
              className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
              style={{
                background: notifStatus === 'denied' ? '#1f2937' : '#8b5cf6',
                color: notifStatus === 'denied' ? '#4b5563' : '#fff',
              }}>
              {notifStatus === 'denied'
                ? 'Blocked — Enable in Browser Settings'
                : 'Enable Notifications'}
            </button>
          </div>
        ) : (
          <>
            <SettingRow label="Enable reminders"
              value={settings.notificationsEnabled}
              onToggle={() => toggle('notificationsEnabled')} />
            <TimeRow
              label="Morning Kegel"
              emoji="☀️"
              value={settings.morningTime || '07:00'}
              onChange={(v) => onUpdate({ morningTime: v })}
              disabled={!settings.notificationsEnabled} />
            <TimeRow
              label="Evening Kegel"
              emoji="🌙"
              value={settings.eveningTime || '20:00'}
              onChange={(v) => onUpdate({ eveningTime: v })}
              disabled={!settings.notificationsEnabled} />
          </>
        )}
      </Section>

      {/* Progress */}
      <Section title="Your Progress" delay={0.1}>
        {/* Activity chart */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs mb-3" style={{ color: '#4b5563', fontWeight: 500 }}>Last 7 days</p>
          <ActivityChart completedWorkouts={settings.completedWorkouts} />
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          {[
            { label: 'Current streak', value: `${settings.streakDays || 0} days`, icon: '🔥' },
            { label: 'Total workouts', value: settings.completedWorkouts?.length || 0, icon: '✅' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="rounded-2xl p-3 text-center"
              style={{
                background: 'linear-gradient(145deg, #0d1117 0%, #111827 100%)',
                border: '1px solid #1f2937',
              }}>
              <div className="text-2xl">{icon}</div>
              <div className="text-xl font-bold mt-1" style={{ color: '#f9fafb' }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={() => {
              if (window.confirm('Reset all progress? This cannot be undone.')) {
                onUpdate({ streakDays: 0, completedWorkouts: [], lastWorkoutDate: null })
              }
            }}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
            style={{ background: '#1f2937', color: '#ef4444' }}>
            Reset Progress
          </button>
        </div>
      </Section>

      {/* Data Safety */}
      <Section title="Data Safety" delay={0.15}>
        <div className="p-4 flex flex-col gap-3">
          <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
            All data is stored locally on your device. No account needed, no data leaves your phone.
          </p>
          <motion.button
            onClick={handleCopyData}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-2xl text-sm font-semibold transition-all"
            style={{
              background: copied ? 'rgba(16, 185, 129, 0.15)' : '#1f2937',
              color: copied ? '#10b981' : '#9ca3af',
              border: copied ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #374151',
            }}>
            {copied ? '✓ Copied to clipboard!' : '📋 Copy Backup Data'}
          </motion.button>
          <p className="text-xs" style={{ color: '#374151' }}>
            Save this data somewhere safe. You can restore it by pasting it back.
          </p>
        </div>
      </Section>

      {/* About */}
      <Section title="About" delay={0.2}>
        <div className="p-4 flex flex-col gap-3">
          <Row label="App" value="RepFlow" />
          <Row label="Version" value="1.1.0" />
          <Row label="Storage" value="100% local — no account needed" />
          <Row label="Cost" value="Free forever" />
        </div>
      </Section>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="text-center text-xs pb-6 mt-2"
        style={{ color: '#374151' }}>
        RepFlow · All data stays on your device
      </motion.p>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function Section({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl overflow-hidden mb-4"
      style={{
        background: 'linear-gradient(145deg, #111827 0%, #0d1117 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #1f2937' }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7280' }}>
          {title}
        </p>
      </div>
      {children}
    </motion.div>
  )
}

function SettingRow({ label, value, onToggle }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5"
      style={{ borderBottom: '1px solid #1f2937' }}>
      <span className="text-sm" style={{ color: '#e5e7eb' }}>{label}</span>
      <motion.button onClick={onToggle}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-7 rounded-full relative flex-shrink-0"
        style={{ background: value ? '#8b5cf6' : '#374151', transition: 'background 0.3s ease' }}
        role="switch" aria-checked={value}>
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className="absolute top-1 rounded-full w-5 h-5 bg-white"
          style={{ left: value ? 24 : 4 }} />
      </motion.button>
    </div>
  )
}

function TimeRow({ label, emoji, value, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5"
      style={{ borderBottom: '1px solid #1f2937', opacity: disabled ? 0.4 : 1, transition: 'opacity 0.3s' }}>
      <span className="text-sm" style={{ color: '#e5e7eb' }}>{emoji} {label}</span>
      <input type="time" value={value} disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-mono rounded-xl px-3 py-1.5 outline-none"
        style={{
          background: '#1f2937', color: '#f9fafb',
          border: '1px solid #374151',
          WebkitAppearance: 'none',
        }} />
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: '#6b7280' }}>{label}</span>
      <span className="text-sm font-medium text-right" style={{ color: '#9ca3af', maxWidth: '60%' }}>{value}</span>
    </div>
  )
}
