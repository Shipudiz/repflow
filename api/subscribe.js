import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'POST') {
      const { subscription, reminders } = req.body
      if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Missing subscription' })
      }

      // Store subscription + reminders keyed by endpoint hash
      const key = `sub:${Buffer.from(subscription.endpoint).toString('base64url').slice(0, 32)}`
      await redis.set(key, JSON.stringify({ subscription, reminders: reminders || [] }))

      return res.status(200).json({ ok: true })
    }

    if (req.method === 'DELETE') {
      const { endpoint } = req.body
      if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' })

      const key = `sub:${Buffer.from(endpoint).toString('base64url').slice(0, 32)}`
      await redis.del(key)

      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
