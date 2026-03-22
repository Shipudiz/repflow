import React, { useState } from 'react'
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
              🚫 Notifications are not supported in this browser.
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
                ? '🚫 Blocked — Enable in Browser Settings'
                : '🔔 Enable Notifications'}
            </button>
          </div>
        ) : (
          <>
            <SettingRow label="Enable reminders"
              value={settings.notificationsEnabled}
              onToggle={() => toggle('notificationsEnabled')} />
            <TimeRow
              label="☀️ Morning Kegel"
              value={settings.morningTime || '07:00'}
              onChange={(v) => onUpdate({ morningTime: v })}
              disabled={!settings.notificationsEnabled} />
            <TimeRow
              label="🌙 Evening Kegel"
              value={settings.eveningTime || '20:00'}
              onChange={(v) => onUpdate({ eveningTime: v })}
              disabled={!settings.notificationsEnabled} />
          </>
        )}
      </Section>

      {/* Progress */}
      <Section title="Progress" delay={0.1}>
        <div className="grid grid-cols-2 gap-3 p-4">
          {[
            { label: 'Streak', value: `${settings.streakDays || 0} days`, icon: '🔥' },
            { label: 'Workouts', value: settings.completedWorkouts?.length || 0, icon: '✅' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="rounded-2xl p-3 text-center"
              style={{ background: '#0d1117', border: '1px solid #1f2937' }}>
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

      {/* About */}
      <Section title="About" delay={0.15}>
        <div className="p-4 flex flex-col gap-3">
          <Row label="App" value="RepFlow" />
          <Row label="Version" value="1.0.0" />
          <Row label="Storage" value="100% local — no account needed" />
          <Row label="Cost" value="Free forever 🎉" />
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
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="rounded-3xl overflow-hidden mb-4"
      style={{ background: '#111827', border: '1px solid #1f2937' }}>
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
      <button onClick={onToggle}
        className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
        style={{ background: value ? '#8b5cf6' : '#374151' }}>
        <div className="absolute top-0.5 rounded-full w-5 h-5 bg-white transition-all"
          style={{ left: value ? 26 : 2 }} />
      </button>
    </div>
  )
}

function TimeRow({ label, value, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5"
      style={{ borderBottom: '1px solid #1f2937', opacity: disabled ? 0.4 : 1 }}>
      <span className="text-sm" style={{ color: '#e5e7eb' }}>{label}</span>
      <input type="time" value={value} disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-mono rounded-xl px-3 py-1.5 outline-none"
        style={{ background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' }} />
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
