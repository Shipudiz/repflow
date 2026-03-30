export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const envCheck = {
    ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID ? 'set' : 'MISSING',
    ONESIGNAL_REST_API_KEY: process.env.ONESIGNAL_REST_API_KEY ? `set (${process.env.ONESIGNAL_REST_API_KEY.slice(0, 8)}...)` : 'MISSING',
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? 'set' : 'MISSING',
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? 'set' : 'MISSING',
    QSTASH_TOKEN: process.env.QSTASH_TOKEN ? 'set' : 'MISSING',
    VITE_ONESIGNAL_APP_ID: process.env.VITE_ONESIGNAL_APP_ID ? 'set' : 'MISSING',
  }

  let redisData = null
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    const subKeys = await redis.keys('sub:*')
    const subs = []
    for (const key of subKeys) {
      const raw = await redis.get(key)
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw
      subs.push({
        key,
        subscriptionId: data?.subscriptionId || 'NONE',
        reminderCount: data?.reminders?.length || 0,
      })
    }
    const schedKeys = await redis.keys('sched:*')
    redisData = { subscriptions: subs, scheduleKeys: schedKeys }
  } catch (err) {
    redisData = { error: err.message }
  }

  return res.status(200).json({ envCheck, redis: redisData })
}
