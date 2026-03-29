import { Redis } from '@upstash/redis'
import webpush from 'web-push'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

webpush.setVapidDetails(
  'mailto:noam.dayan@wsc-sports.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    // Find all stored subscriptions in Redis and send test to all
    const keys = await redis.keys('sub:*')
    if (!keys.length) {
      return res.status(404).json({ error: 'No subscriptions stored in Redis. Try toggling notifications off and on.' })
    }

    const results = []
    for (const key of keys) {
      const raw = await redis.get(key)
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (!data?.subscription) continue

      try {
        await webpush.sendNotification(
          data.subscription,
          JSON.stringify({
            title: 'Shipud Flow',
            body: 'Push notifications are working!',
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: 'test',
          })
        )
        results.push({ key, sent: true })
      } catch (pushErr) {
        results.push({ key, error: pushErr.message, statusCode: pushErr.statusCode })
        if (pushErr.statusCode === 410) {
          await redis.del(key)
        }
      }
    }

    return res.status(200).json({ sent: results.some(r => r.sent), results })
  } catch (err) {
    console.error('Test push error:', err)
    return res.status(500).json({ error: err.message })
  }
}
