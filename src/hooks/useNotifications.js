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

// Wait for OneSignal to assign a subscription ID (polls up to 10s)
function waitForSubscriptionId(maxWaitMs = 10000) {
  return new Promise((resolve) => {
    const id = OneSignal.User.PushSubscription.id
    if (id) return resolve(id)

    const start = Date.now()
    const interval = setInterval(() => {
      const subId = OneSignal.User.PushSubscription.id
      if (subId) {
        clearInterval(interval)
        resolve(subId)
      } else if (Date.now() - start > maxWaitMs) {
        clearInterval(interval)
        resolve(null)
      }
    }, 300)
  })
}

let onesignalReady = false

export function useNotifications(settings, onUpdate) {
  const syncRef = useRef(null)

  // Initialize OneSignal once
  useEffect(() => {
    if (onesignalReady || !ONESIGNAL_APP_ID) return
    onesignalReady = true

    OneSignal.init({
      appId: ONESIGNAL_APP_ID,
      serviceWorkerPath: '/sw.js',
      serviceWorkerParam: { scope: '/' },
      allowLocalhostAsSecureOrigin: true,
    }).then(() => {
      // Login with persistent user ID immediately
      const userId = getUserId()
      return OneSignal.login(userId)
    }).catch(err => console.warn('OneSignal init:', err))
  }, [])

  const subscribe = useCallback(async () => {
    try {
      if (!ONESIGNAL_APP_ID) return { ok: false, reason: 'OneSignal not configured' }

      await OneSignal.Notifications.requestPermission()
      await OneSignal.User.PushSubscription.optIn()

      const subId = await waitForSubscriptionId()
      if (!subId) return { ok: false, reason: 'No subscription ID — try again' }

      const userId = getUserId()

      await fetch(`${API_BASE}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subId,
          userId,
          reminders: settings.reminders || [],
        }),
      })

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
          const subId = OneSignal.User.PushSubscription.id
          if (subId) {
            await fetch(`${API_BASE}/subscribe`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                subscriptionId: subId,
                userId,
                reminders: settings.reminders,
              }),
            })
          }
        }
      } catch {
        // Silent
      }
    }, 2000)

    return () => { if (syncRef.current) clearTimeout(syncRef.current) }
  }, [settings.notificationsEnabled, settings.reminders, getSubscription])

  return { subscribe, unsubscribe, getSubscription }
}
