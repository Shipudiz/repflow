import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const keys = await redis.keys('sub:*')
    if (!keys.length) {
      return res.status(404).json({ error: 'No subscriptions in Redis. Enable notifications first.' })
    }

    const results = []
    for (const key of keys) {
      const raw = await redis.get(key)
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (!data?.subscriptionId) continue

      // Try both targeting methods
      try {
        const resp = await fetch('https://api.onesignal.com/notifications', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            app_id: process.env.ONESIGNAL_APP_ID,
            include_player_ids: [data.subscriptionId],
            headings: { en: 'Shipud Flow' },
            contents: { en: 'Push notifications are working!' },
          }),
        })
        const result = await resp.json()
        results.push({ key, subId: data.subscriptionId, sent: !result.errors, onesignal: result })
      } catch (err) {
        results.push({ key, error: err.message })
      }
    }

    return res.status(200).json({ sent: results.some(r => r.sent), results })
  } catch (err) {
    console.error('Test push error:', err)
    return res.status(500).json({ error: err.message })
  }
}
