import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Smooth timer using requestAnimationFrame.
 * Returns a float progress (0→1) that updates every frame for buttery-smooth ring fills,
 * plus an integer `displayTime` for the countdown number.
 *
 * @param {number} durationSec - how many seconds this phase lasts
 * @param {boolean} paused
 * @param {Function} onComplete - called once when timer reaches 0
 * @param {string} key - change this to restart the timer (e.g. phase+exIdx)
 */
export function useSmoothTimer(durationSec, paused, onComplete, key) {
  const [displayTime, setDisplayTime] = useState(durationSec)
  const [progress, setProgress] = useState(0) // 0 → 1

  const startTs = useRef(null)
  const pausedAt = useRef(null)
  const elapsed  = useRef(0)
  const rafId    = useRef(null)
  const done     = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  // Reset when key changes
  useEffect(() => {
    startTs.current = null
    pausedAt.current = null
    elapsed.current = 0
    done.current = false
    setDisplayTime(durationSec)
    setProgress(0)
  }, [key, durationSec])

  // The rAF loop
  useEffect(() => {
    if (paused || done.current || durationSec <= 0) {
      cancelAnimationFrame(rafId.current)
      return
    }

    const tick = (now) => {
      if (startTs.current === null) startTs.current = now - elapsed.current * 1000

      const elapsedSec = (now - startTs.current) / 1000
      elapsed.current = elapsedSec

      const remaining = Math.max(0, durationSec - elapsedSec)
      const p = Math.min(1, elapsedSec / durationSec)

      setProgress(p)
      setDisplayTime(Math.ceil(remaining))

      if (remaining <= 0 && !done.current) {
        done.current = true
        setProgress(1)
        setDisplayTime(0)
        onCompleteRef.current?.()
        return
      }

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [paused, durationSec, key])

  // Handle pause/resume — preserve elapsed
  useEffect(() => {
    if (paused) {
      cancelAnimationFrame(rafId.current)
      pausedAt.current = elapsed.current
    } else if (pausedAt.current !== null) {
      // Resume: shift startTs so elapsed stays consistent
      startTs.current = null // will be recalculated on next tick using elapsed.current
      elapsed.current = pausedAt.current
      pausedAt.current = null
    }
  }, [paused])

  return { displayTime, progress }
}
