import React from 'react'

/**
 * Circular progress ring
 * @param {number} progress - 0 to 1
 * @param {number} size - diameter in px
 * @param {number} strokeWidth
 * @param {string} color - stroke color
 * @param {boolean} smooth - if true, no CSS transition (use with rAF-driven progress)
 * @param {React.ReactNode} children - center content
 */
export default function ProgressRing({
  progress = 0,
  size = 220,
  strokeWidth = 8,
  color = '#f97316',
  trackColor = '#1e293b',
  children,
  glow = true,
  smooth = false,
}) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(1, Math.max(0, progress)))

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        {/* track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* progress arc */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            // If smooth (rAF), don't add CSS transition — it causes jitter
            transition: smooth ? 'none' : 'stroke-dashoffset 0.5s linear',
            filter: glow ? `drop-shadow(0 0 6px ${color}88)` : 'none',
          }}
        />
      </svg>
      {/* center content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  )
}
