import { useState, useCallback } from 'react'

const KEY = 'repflow-seen-exercises'

function getSeenSet() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')) }
  catch { return new Set() }
}

function markSeen(id) {
  const s = getSeenSet()
  s.add(id)
  try { localStorage.setItem(KEY, JSON.stringify([...s])) } catch {}
}

export function useSeenExercises() {
  const [seen, setSeen] = useState(getSeenSet)

  const hasSeenExercise = useCallback((id) => seen.has(id), [seen])

  const markExerciseSeen = useCallback((id) => {
    markSeen(id)
    setSeen(s => new Set([...s, id]))
  }, [])

  return { hasSeenExercise, markExerciseSeen }
}
