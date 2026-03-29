import { useEffect, useCallback, useRef } from 'react'

const VAPID_PUBLIC_KEY = 'BJdPGgfc83VfDNmCIOketX-HvT3AUosLizS51-DwEDrhRrGlOVRRpVpjuF8-R8U66hn3ekPJY8S5Y4WYZnsqPa0'
const API_BASE = '/api'

// Convert VAPID key from base64url to Uint8Array (required by Safari)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

// Serialize PushSubscription safely (iOS Safari compat)
function serializeSub(sub) {
  if (!sub) return null
  // Try toJSON first (Chrome/Firefox)
  try {
    const json = sub.toJSON()
    if (json && json.endpoint && json.keys) return json
  } catch {}
  // Manual extraction for iOS Safari
  try {
    const toB64url = (buffer) => {
      const bytes = new Uint8Array(buffer)
      let str = ''
      for (const b of bytes) str += String.fromCharCode(b)
      return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }
    return {
      endpoint: sub.endpoint,
      keys: {
        p256dh: toB64url(sub.getKey('p256dh')),
        auth: toB64url(sub.getKey('auth')),
      },
    }
  } catch {
    // Last resort: just endpoint, no keys
    return { endpoint: sub.endpoint, keys: {} }
  }
}

export function useNotifications(settings, onUpdate) {
  const syncRef = useRef(null)

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { ok: false, reason: 'Push not supported on this device' }
    }

    try {
      // On iOS Safari PWA, Notification.requestPermission() throws
      // "The string did not match the expected pattern".
      // pushManager.subscribe() handles the permission prompt natively on iOS.
      if ('Notification' in window) {
        try {
          const permission = await Notification.requestPermission()
          if (permission === 'denied') {
            return { ok: false, reason: 'Permission denied' }
          }
        } catch {
          // iOS throws here — fall through, pushManager.subscribe will handle it
        }
      }

      const registration = await navigator.serviceWorker.ready

      let subscription = null
      try {
        subscription = await registration.pushManager.getSubscription()
      } catch {}

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })
      }

      // Sync to backend
      const serialized = serializeSub(subscription)
      await fetch(`${API_BASE}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: serialized, reminders: settings.reminders || [] }),
      })

      return { ok: true }
    } catch (err) {
      console.error('Push subscribe failed:', err)
      return { ok: false, reason: err.message }
    }
  }, [settings.reminders])

  // Unsubscribe
  const unsubscribe = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await fetch(`${API_BASE}/subscribe`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        })
        await subscription.unsubscribe()
      }
    } catch (err) {
      console.error('Unsubscribe failed:', err)
    }
    return { ok: true }
  }, [])

  // Check if currently subscribed
  const getSubscription = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null
    try {
      const registration = await navigator.serviceWorker.ready
      return await registration.pushManager.getSubscription()
    } catch {
      return null
    }
  }, [])

  // Auto-sync reminders to backend (silent, never throws)
  useEffect(() => {
    if (!settings.notificationsEnabled) return
    if (syncRef.current) clearTimeout(syncRef.current)

    syncRef.current = setTimeout(async () => {
      try {
        const sub = await getSubscription()
        if (sub && settings.reminders?.length) {
          const serialized = serializeSub(sub)
          await fetch(`${API_BASE}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: serialized, reminders: settings.reminders }),
          })
        }
      } catch {
        // Silent — don't disrupt the UI
      }
    }, 2000)

    return () => { if (syncRef.current) clearTimeout(syncRef.current) }
  }, [settings.notificationsEnabled, settings.reminders, getSubscription])

  return { subscribe, unsubscribe, getSubscription }
}
