import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const subKeys = await redis.keys('sub:*')
    const schedKeys = await redis.keys('sched:*')

    const subs = []
    for (const key of subKeys) {
      const raw = await redis.get(key)
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw
      subs.push({ key, subscriptionId: data?.subscriptionId, reminderCount: data?.reminders?.length })
    }

    return res.status(200).json({
      subscriptions: subs,
      scheduleKeys: schedKeys,
      envCheck: {
        hasAppId: !!process.env.ONESIGNAL_APP_ID,
        hasRestKey: !!process.env.ONESIGNAL_REST_API_KEY,
        hasRedis: !!process.env.UPSTASH_REDIS_REST_URL,
        hasQstash: !!process.env.QSTASH_TOKEN,
      },
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
