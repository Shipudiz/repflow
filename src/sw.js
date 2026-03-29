import { precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

// Precache all assets injected by vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST)

// Take control immediately
self.skipWaiting()
clientsClaim()

// ── Push notification handler ─────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body || 'Time for your workout!',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    tag: data.tag || 'repflow',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: '/' },
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Shipud Flow', options)
  )
})

// ── Notification click → open app ─────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus existing window if open
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus()
        }
      }
      // Otherwise open new window
      return self.clients.openWindow(event.notification.data?.url || '/')
    })
  )
})
