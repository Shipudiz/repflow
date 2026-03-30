import { Redis } from '@upstash/redis'
import { Client } from '@upstash/qstash'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const qstash = new Client({ token: process.env.QSTASH_TOKEN })

function reminderToCron(reminder) {
  const [h, m] = reminder.time.split(':')
  const days = reminder.days.length === 7 ? '*' : reminder.days.join(',')
  return `${parseInt(m)} ${parseInt(h)} * * ${days}`
}

async function syncSchedules(userId, reminders, appUrl) {
  const existingIds = await redis.smembers(`sched:${userId}`)
  for (const schedId of existingIds || []) {
    try {
      await qstash.schedules.delete(schedId)
    } catch (e) {
      console.log('Schedule delete skipped:', schedId, e.message)
    }
  }
  await redis.del(`sched:${userId}`)

  const newIds = []
  for (const reminder of reminders) {
    if (!reminder.enabled || !reminder.days.length) continue

    const cron = reminderToCron(reminder)
    const schedule = await qstash.schedules.create({
      destination: `${appUrl}/api/cron-notify`,
      cron,
      body: JSON.stringify({ userId, reminderId: reminder.id }),
      headers: { 'Content-Type': 'application/json' },
    })
    newIds.push(schedule.scheduleId)
  }

  if (newIds.length) {
    await redis.sadd(`sched:${userId}`, ...newIds)
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const appUrl = `${proto}://${host}`

  try {
    if (req.method === 'POST') {
      const { userId, reminders } = req.body
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' })
      }

      // Store userId + reminders (OneSignal handles push delivery via external_user_id)
      await redis.set(`sub:${userId}`, JSON.stringify({ userId, reminders: reminders || [] }))
      await syncSchedules(userId, reminders || [], appUrl)

      return res.status(200).json({ ok: true })
    }

    if (req.method === 'DELETE') {
      const { userId } = req.body
      if (!userId) return res.status(400).json({ error: 'Missing userId' })

      await syncSchedules(userId, [], '')
      await redis.del(`sub:${userId}`)

      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
