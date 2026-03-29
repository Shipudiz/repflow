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
    const { subscription } = req.body
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Missing subscription in request body' })
    }

    // Try sending directly with the subscription from the request
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Shipud Flow',
        body: 'Push notifications are working!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'test',
      })
    )

    // Also check what's stored in Redis
    const subKey = Buffer.from(subscription.endpoint).toString('base64url').slice(0, 32)
    const stored = await redis.get(`sub:${subKey}`)

    return res.status(200).json({
      sent: true,
      storedInRedis: !!stored,
      subKeyUsed: subKey,
    })
  } catch (err) {
    console.error('Test push error:', err)
    return res.status(500).json({
      error: err.message,
      statusCode: err.statusCode,
      body: err.body,
    })
  }
}
