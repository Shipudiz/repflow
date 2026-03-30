import { precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

// Precache all assets injected by vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST)

// Take control immediately
self.skipWaiting()
clientsClaim()
