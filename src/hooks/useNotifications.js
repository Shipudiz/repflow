import { useEffect, useCallback, useRef } from 'react'

const VAPID_PUBLIC_KEY = 'BJdPGgfc83VfDNmCIOketX-HvT3AUosLizS51-DwEDrhRrGlOVRRpVpjuF8-R8U66hn3ekPJY8S5Y4WYZnsqPa0'
const API_BASE = '/api'

// Convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

export function useNotifications(settings, onUpdate) {
  const syncRef = useRef(null)

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { ok: false, reason: 'Push not supported on this device' }
    }

    try {
      // Request notification permission (iOS requires user gesture)
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        return { ok: false, reason: 'Permission denied' }
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready

      // Subscribe to push
      let subscription = await registration.pushManager.getSubscription()
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })
      }

      // Send subscription + reminders to backend
      await syncReminders(subscription, settings.reminders || [])

      return { ok: true, subscription }
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
      return { ok: true }
    } catch (err) {
      console.error('Unsubscribe failed:', err)
      return { ok: false, reason: err.message }
    }
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

  // Serialize PushSubscription safely (iOS Safari compat)
  const serializeSub = (sub) => {
    if (!sub) return null
    // Try toJSON first (works on Chrome/Firefox), fall back to manual extraction
    try {
      const json = sub.toJSON()
      if (json && json.endpoint && json.keys) return json
    } catch {}
    // Manual extraction for iOS Safari
    const arrayToBase64url = (buffer) => {
      const bytes = new Uint8Array(buffer)
      let str = ''
      for (const b of bytes) str += String.fromCharCode(b)
      return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }
    const keys = sub.getKey
      ? { p256dh: arrayToBase64url(sub.getKey('p256dh')), auth: arrayToBase64url(sub.getKey('auth')) }
      : {}
    return { endpoint: sub.endpoint, keys }
  }

  // Sync reminders to backend whenever they change
  const syncReminders = async (subscription, reminders) => {
    await fetch(`${API_BASE}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: serializeSub(subscription), reminders }),
    })
  }

  // Auto-sync when reminders change (if subscribed)
  useEffect(() => {
    if (!settings.notificationsEnabled) return

    // Debounce sync
    if (syncRef.current) clearTimeout(syncRef.current)
    syncRef.current = setTimeout(async () => {
      const sub = await getSubscription()
      if (sub && settings.reminders?.length) {
        await syncReminders(sub, settings.reminders)
      }
    }, 1000)

    return () => {
      if (syncRef.current) clearTimeout(syncRef.current)
    }
  }, [settings.notificationsEnabled, settings.reminders, getSubscription])

  return { subscribe, unsubscribe, getSubscription }
}
