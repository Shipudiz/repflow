import { useEffect, useCallback, useRef } from 'react'
import OneSignal from 'react-onesignal'

const ONESIGNAL_APP_ID = import.meta.env.VITE_ONESIGNAL_APP_ID
const API_BASE = '/api'

function getUserId() {
  let id = localStorage.getItem('repflow-user-id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('repflow-user-id', id)
  }
  return id
}

let initDone = false

export function useNotifications(settings, onUpdate) {
  const syncRef = useRef(null)

  // Initialize OneSignal eagerly on mount — not on button tap
  useEffect(() => {
    if (initDone || !ONESIGNAL_APP_ID) return
    initDone = true

    OneSignal.init({
      appId: ONESIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,
    }).then(() => OneSignal.login(getUserId()))
      .catch(err => console.warn('OneSignal init:', err))
  }, [])

  // Called directly from user tap — NO awaits before permission request
  const subscribe = useCallback(async () => {
    try {
      if (!ONESIGNAL_APP_ID) return { ok: false, reason: 'OneSignal not configured' }

      // These must happen in direct response to user tap — no async gaps
      await OneSignal.User.PushSubscription.optIn()

      const userId = getUserId()

      // Save to backend for scheduled reminders
      const resp = await fetch(`${API_BASE}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          reminders: settings.reminders || [],
          tzOffset: new Date().getTimezoneOffset(),
        }),
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        return { ok: false, reason: err.error || `Server ${resp.status}` }
      }

      return { ok: true }
    } catch (err) {
      console.error('Subscribe failed:', err)
      return { ok: false, reason: err.message }
    }
  }, [settings.reminders])

  const unsubscribe = useCallback(async () => {
    try {
      const userId = getUserId()
      await fetch(`${API_BASE}/subscribe`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      await OneSignal.User.PushSubscription.optOut()
    } catch (err) {
      console.error('Unsubscribe failed:', err)
    }
    return { ok: true }
  }, [])

  const getSubscription = useCallback(async () => {
    try {
      if (!ONESIGNAL_APP_ID) return null
      const optedIn = OneSignal.User.PushSubscription.optedIn
      return optedIn ? { active: true } : null
    } catch {
      return null
    }
  }, [])

  // Auto-sync reminders to backend when they change
  useEffect(() => {
    if (!settings.notificationsEnabled) return
    if (syncRef.current) clearTimeout(syncRef.current)

    syncRef.current = setTimeout(async () => {
      try {
        const sub = await getSubscription()
        if (sub && settings.reminders?.length) {
          const userId = getUserId()
          await fetch(`${API_BASE}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              reminders: settings.reminders,
              tzOffset: new Date().getTimezoneOffset(),
            }),
          })
        }
      } catch {
        // Silent
      }
    }, 2000)

    return () => { if (syncRef.current) clearTimeout(syncRef.current) }
  }, [settings.notificationsEnabled, settings.reminders, getSubscription])

  return { subscribe, unsubscribe, getSubscription }
}
