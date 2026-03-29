import React from 'react'
import { motion } from 'framer-motion'

const tabs = [
  { id: 'home',     label: 'HOME',     icon: HomeIcon },
  { id: 'programs', label: 'LIBRARY',  icon: LibraryIcon },
  { id: 'settings', label: 'SETTINGS', icon: GearIcon },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      zIndex: 40,
      background: 'rgba(19, 19, 19, 0.9)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(229, 226, 225, 0.1)',
      boxShadow: '0px -8px 32px rgba(179, 197, 255, 0.06)',
      paddingTop: 16,
      paddingBottom: 'calc(11px + env(safe-area-inset-bottom, 0px))',
      paddingLeft: 40,
      paddingRight: 40,
      height: 92,
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <motion.button
            key={id}
            onClick={() => onChange(id)}
            whileTap={{ scale: 0.85 }}
            transition={{ duration: 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              WebkitTapHighlightColor: 'transparent',
              color: isActive ? '#ffffff' : '#8d90a2',
            }}
            aria-label={label}
            role="tab"
            aria-selected={isActive}
          >
            <div style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={28} active={isActive} />
            </div>

            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              textTransform: 'uppercase',
              letterSpacing: '1.17px',
              color: isActive ? '#ffffff' : '#8d90a2',
              transition: 'color 0.2s ease',
            }}>
              {label}
            </span>
          </motion.button>
        )
      })}
    </nav>
  )
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function HomeIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 2x2 grid — matches Figma nav */}
      <rect x="3" y="3" width="11" height="11" rx="2.5"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth={1.8} />
      <rect x="16" y="3" width="11" height="11" rx="2.5"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth={1.8} />
      <rect x="3" y="16" width="11" height="11" rx="2.5"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth={1.8} />
      <rect x="16" y="16" width="11" height="11" rx="2.5"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth={1.8} />
    </svg>
  )
}

function LibraryIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dumbbell icon — matches Figma nav */}
      <rect x="4" y="10" width="6" height="10" rx="1.5"
        stroke="currentColor" strokeWidth={1.8}
        fill={active ? 'rgba(255,255,255,0.1)' : 'none'} />
      <rect x="20" y="10" width="6" height="10" rx="1.5"
        stroke="currentColor" strokeWidth={1.8}
        fill={active ? 'rgba(255,255,255,0.1)' : 'none'} />
      <line x1="10" y1="15" x2="20" y2="15"
        stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <line x1="1" y1="15" x2="4" y2="15"
        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
      <line x1="26" y1="15" x2="29" y2="15"
        stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  )
}

function GearIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 3.5L15 3.5C15.8 3.5 16.5 4.05 16.68 4.83L17.1 6.63C17.2 7.06 17.52 7.4 17.94 7.53C18.06 7.57 18.18 7.62 18.3 7.67C18.7 7.84 19.16 7.82 19.54 7.6L21.15 6.67C21.86 6.26 22.76 6.39 23.33 6.97L23.03 7.27L23.33 6.97C23.9 7.54 24.03 8.44 23.63 9.15L22.7 10.76C22.48 11.14 22.46 11.6 22.63 12C22.68 12.12 22.73 12.24 22.77 12.36C22.9 12.78 23.24 13.1 23.67 13.2L25.47 13.62C26.25 13.8 26.8 14.5 26.8 15.3V15.3C26.8 16.1 26.25 16.8 25.47 16.98L23.67 17.4C23.24 17.5 22.9 17.82 22.77 18.24C22.73 18.36 22.68 18.48 22.63 18.6C22.46 19 22.48 19.46 22.7 19.84L23.63 21.45C24.03 22.16 23.9 23.06 23.33 23.63C22.76 24.2 21.86 24.33 21.15 23.93L19.54 23C19.16 22.78 18.7 22.76 18.3 22.93C18.18 22.98 18.06 23.03 17.94 23.07C17.52 23.2 17.2 23.54 17.1 23.97L16.68 25.77C16.5 26.55 15.8 27.1 15 27.1V27.1C14.2 27.1 13.5 26.55 13.32 25.77L12.9 23.97C12.8 23.54 12.48 23.2 12.06 23.07C11.94 23.03 11.82 22.98 11.7 22.93C11.3 22.76 10.84 22.78 10.46 23L8.85 23.93C8.14 24.33 7.24 24.2 6.67 23.63C6.1 23.06 5.97 22.16 6.37 21.45L7.3 19.84C7.52 19.46 7.54 19 7.37 18.6C7.32 18.48 7.27 18.36 7.23 18.24C7.1 17.82 6.76 17.5 6.33 17.4L4.53 16.98C3.75 16.8 3.2 16.1 3.2 15.3V15.3C3.2 14.5 3.75 13.8 4.53 13.62L6.33 13.2C6.76 13.1 7.1 12.78 7.23 12.36C7.27 12.24 7.32 12.12 7.37 12C7.54 11.6 7.52 11.14 7.3 10.76L6.37 9.15C5.97 8.44 6.1 7.54 6.67 6.97C7.24 6.39 8.14 6.26 8.85 6.67L10.46 7.6C10.84 7.82 11.3 7.84 11.7 7.67C11.82 7.62 11.94 7.57 12.06 7.53C12.48 7.4 12.8 7.06 12.9 6.63L13.32 4.83C13.5 4.05 14.2 3.5 15 3.5Z"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.8}
        fill={active ? 'rgba(255,255,255,0.08)' : 'none'}
        strokeLinejoin="round"
      />
      <circle cx="15" cy="15.3" r="3.5"
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.8} />
    </svg>
  )
}
