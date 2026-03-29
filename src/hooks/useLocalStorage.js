import { useState, useEffect, useRef } from 'react'

const CURRENT_VERSION = 2

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return initialValue

      const parsed = JSON.parse(raw)

      // Handle versioned envelope
      if (parsed && typeof parsed === 'object' && '_v' in parsed) {
        // If version is outdated and data looks empty, use fresh defaults
        if (parsed._v < CURRENT_VERSION && (!parsed.data?.completedWorkouts || parsed.data.completedWorkouts.length === 0)) {
          return initialValue
        }
        return { ...initialValue, ...parsed.data }
      }

      // Legacy unversioned data — if empty, use fresh defaults
      if (!parsed.completedWorkouts || parsed.completedWorkouts.length === 0) {
        return initialValue
      }
      return { ...initialValue, ...parsed }
    } catch {
      return initialValue
    }
  })

  // Debounced writes — 300ms delay to batch rapid changes
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      try {
        const envelope = { _v: CURRENT_VERSION, data: value }
        localStorage.setItem(key, JSON.stringify(envelope))
      } catch (e) {
        console.warn('[RepFlow] localStorage write failed:', e.message)
        // Try to clean up old data if quota exceeded
        try {
          const keys = Object.keys(localStorage)
          if (keys.length > 10) {
            // Remove non-essential cached data if any
            keys.filter(k => k.startsWith('repflow-cache-')).forEach(k => localStorage.removeItem(k))
          }
        } catch {}
      }
    }, 300)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [key, value])

  return [value, setValue]
}
