import { useEffect, useCallback } from 'react'

export function useNotifications(settings, onUpdate) {
  // Request permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  }, [])

  // Schedule a push notification using setTimeout (works while app is open)
  // For true background notifications a service worker would be needed
  const scheduleNotification = useCallback((title, body, timeStr) => {
    if (Notification.permission !== 'granted') return
    const [h, m] = timeStr.split(':').map(Number)
    const now = new Date()
    const target = new Date()
    target.setHours(h, m, 0, 0)
    if (target <= now) target.setDate(target.getDate() + 1)
    const delay = target - now
    setTimeout(() => {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: title,
        renotify: true,
      })
    }, delay)
  }, [])

  // Re-schedule whenever settings change
  useEffect(() => {
    if (!settings.notificationsEnabled) return
    scheduleNotification(
      '🌅 Morning Kegel Session',
      'Time for your morning pelvic floor workout!',
      settings.morningTime
    )
    scheduleNotification(
      '🌙 Evening Kegel Session',
      'Don\'t forget your evening session!',
      settings.eveningTime
    )
  }, [settings.notificationsEnabled, settings.morningTime, settings.eveningTime, scheduleNotification])

  return { requestPermission }
}
