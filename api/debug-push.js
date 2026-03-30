export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const envCheck = {
    ONESIGNAL_APP_ID: process.env.ONESIGNAL_APP_ID ? 'set' : 'MISSING',
    ONESIGNAL_REST_API_KEY: process.env.ONESIGNAL_REST_API_KEY ? `set (${process.env.ONESIGNAL_REST_API_KEY.slice(0, 8)}...)` : 'MISSING',
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? 'set' : 'MISSING',
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? 'set' : 'MISSING',
    QSTASH_TOKEN: process.env.QSTASH_TOKEN ? 'set' : 'MISSING',
    VITE_ONESIGNAL_APP_ID: process.env.VITE_ONESIGNAL_APP_ID ? 'set' : 'MISSING',
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY ? 'set' : 'MISSING',
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY ? 'set' : 'MISSING',
  }

  // Test QStash connection
  let qstashTest = null
  try {
    const { Client } = await import('@upstash/qstash')
    const qstash = new Client({ token: process.env.QSTASH_TOKEN })
    const schedules = await qstash.schedules.list()
    qstashTest = {
      ok: true,
      schedules: schedules.map(s => ({
        id: s.scheduleId,
        cron: s.cron,
        destination: s.destination,
        body: s.body,
      })),
    }
  } catch (err) {
    qstashTest = { error: err.message }
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
        reminders: (data?.reminders || []).map(r => ({
          id: r.id, label: r.label, time: r.time, enabled: r.enabled, days: r.days,
        })),
      })
    }
    const schedKeys = await redis.keys('sched:*')
    redisData = { subscriptions: subs, scheduleKeys: schedKeys }
  } catch (err) {
    redisData = { error: err.message }
  }

  return res.status(200).json({ envCheck, redis: redisData, qstash: qstashTest })
}
