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
    // Delete ALL subscriptions and schedules from Redis
    const subKeys = await redis.keys('sub:*')
    const schedKeys = await redis.keys('sched:*')
    const allKeys = [...subKeys, ...schedKeys]

    for (const key of allKeys) {
      await redis.del(key)
    }

    return res.status(200).json({ ok: true, deleted: allKeys.length })
  } catch (err) {
    console.error('Reset error:', err)
    return res.status(500).json({ error: err.message })
  }
}
