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
    <svg width={size} height={size} viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 9V0H27V9H15ZM0 15V0H12V15H0ZM15 27V12H27V27H15ZM0 27V18H12V27H0Z"
        fill={active ? '#ffffff' : '#8D90A2'} />
    </svg>
  )
}

function LibraryIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.1212 30L15 27.8788L20.3788 22.5L7.5 9.62121L2.12121 15L0 12.8788L2.12121 10.6818L0 8.56061L3.18182 5.37879L1.06061 3.18182L3.18182 1.06061L5.37879 3.18182L8.56061 0L10.6818 2.12121L12.8788 0L15 2.12121L9.62121 7.5L22.5 20.3788L27.8788 15L30 17.1212L27.8788 19.3182L30 21.4394L26.8182 24.6212L28.9394 26.8182L26.8182 28.9394L24.6212 26.8182L21.4394 30L19.3182 27.8788L17.1212 30V30"
        fill={active ? '#ffffff' : '#8D90A2'} />
    </svg>
  )
}

function GearIcon({ size, active }) {
  return (
    <svg width={size} height={size} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.76 24L8.28 20.16C8.02 20.06 7.775 19.94 7.545 19.8C7.315 19.66 7.09 19.51 6.87 19.35L3.3 20.85L0 15.15L3.09 12.81C3.07 12.67 3.06 12.535 3.06 12.405V11.595C3.06 11.465 3.07 11.33 3.09 11.19L0 8.85L3.3 3.15L6.87 4.65C7.09 4.49 7.32 4.34 7.56 4.2C7.8 4.06 8.04 3.94 8.28 3.84L8.76 0H15.36L15.84 3.84C16.1 3.94 16.345 4.06 16.575 4.2C16.805 4.34 17.03 4.49 17.25 4.65L20.82 3.15L24.12 8.85L21.03 11.19C21.05 11.33 21.06 11.465 21.06 11.595V12.405C21.06 12.535 21.04 12.67 21 12.81L24.09 15.15L20.79 20.85L17.25 19.35C17.03 19.51 16.8 19.66 16.56 19.8C16.32 19.94 16.08 20.06 15.84 20.16L15.36 24H8.76ZM12.12 16.2C13.28 16.2 14.27 15.79 15.09 14.97C15.91 14.15 16.32 13.16 16.32 12C16.32 10.84 15.91 9.85 15.09 9.03C14.27 8.21 13.28 7.8 12.12 7.8C10.94 7.8 9.945 8.21 9.135 9.03C8.325 9.85 7.92 10.84 7.92 12C7.92 13.16 8.325 14.15 9.135 14.97C9.945 15.79 10.94 16.2 12.12 16.2Z"
        fill={active ? '#ffffff' : '#8D90A2'} />
    </svg>
  )
}
