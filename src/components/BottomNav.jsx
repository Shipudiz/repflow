import React from 'react'
import { motion } from 'framer-motion'

const tabs = [
  { id: 'home',     label: 'Home',     icon: HomeIcon },
  { id: 'programs', label: 'Programs', icon: ListIcon },
  { id: 'settings', label: 'Settings', icon: GearIcon },
]

export default function BottomNav({ active, onChange }) {
  return (
    <>
      {/* Solid fill behind the safe area / home indicator */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 39,
        height: 'env(safe-area-inset-bottom, 0px)',
        background: '#0a0a0a',
      }} />

      {/* Nav bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, zIndex: 40,
        background: '#0a0a0a',
        borderTop: '1px solid #111827',
        paddingTop: 10,
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      }}>
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button key={id} onClick={() => onChange(id)}
              className="flex flex-col items-center gap-1 relative"
              style={{ color: isActive ? '#fff' : '#4b5563', padding: '0 24px 2px' }}>
              {isActive && (
                <motion.div layoutId="nav-pill"
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: '#f97316' }} />
              )}
              <Icon size={22} active={isActive} />
              <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}

// ─── Icons ──────────────────────────────────────────────────────────────────
function HomeIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
        stroke="currentColor" strokeWidth={active ? 2 : 1.5}
        fill={active ? 'currentColor' : 'none'} opacity={active ? 0.15 : 1}
        strokeLinejoin="round" />
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
        stroke="currentColor" strokeWidth={active ? 2 : 1.5}
        fill="none" strokeLinejoin="round" />
    </svg>
  )
}

function ListIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2"
        stroke="currentColor" strokeWidth={active ? 2 : 1.5} />
      <line x1="7" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GearIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={active ? 2 : 1.5} />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
