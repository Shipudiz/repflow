import { Redis } from '@upstash/redis'
import { Client } from '@upstash/qstash'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const qstash = new Client({ token: process.env.QSTASH_TOKEN })

// Build a cron expression: "MM HH * * days"
function reminderToCron(reminder) {
  const [h, m] = reminder.time.split(':')
  // Convert day indices to cron (0=Sun in both JS and cron)
  const days = reminder.days.length === 7 ? '*' : reminder.days.join(',')
  return `${parseInt(m)} ${parseInt(h)} * * ${days}`
}

async function syncSchedules(subKey, reminders, appUrl) {
  // 1. Delete all existing QStash schedules for this subscription
  const existingIds = await redis.smembers(`sched:${subKey}`)
  for (const schedId of existingIds || []) {
    try {
      await qstash.schedules.delete(schedId)
    } catch (e) {
      // Schedule may already be gone
      console.log('Schedule delete skipped:', schedId, e.message)
    }
  }
  await redis.del(`sched:${subKey}`)

  // 2. Create new schedules for each enabled reminder
  const newIds = []
  for (const reminder of reminders) {
    if (!reminder.enabled) continue
    if (!reminder.days.length) continue

    const cron = reminderToCron(reminder)
    const schedule = await qstash.schedules.create({
      destination: `${appUrl}/api/cron-notify`,
      cron,
      body: JSON.stringify({ subKey, reminderId: reminder.id }),
      headers: { 'Content-Type': 'application/json' },
    })
    newIds.push(schedule.scheduleId)
  }

  // 3. Store schedule IDs so we can clean them up later
  if (newIds.length) {
    await redis.sadd(`sched:${subKey}`, ...newIds)
  }
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  // Derive app URL from request
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const appUrl = `${proto}://${host}`

  try {
    if (req.method === 'POST') {
      const { subscription, reminders } = req.body
      if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Missing subscription' })
      }

      const subKey = Buffer.from(subscription.endpoint).toString('base64url').slice(0, 32)

      // Store subscription + reminders in Redis
      await redis.set(`sub:${subKey}`, JSON.stringify({ subscription, reminders: reminders || [] }))

      // Sync QStash schedules
      await syncSchedules(subKey, reminders || [], appUrl)

      return res.status(200).json({ ok: true })
    }

    if (req.method === 'DELETE') {
      const { endpoint } = req.body
      if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' })

      const subKey = Buffer.from(endpoint).toString('base64url').slice(0, 32)

      // Clean up schedules
      await syncSchedules(subKey, [], '')

      // Remove subscription
      await redis.del(`sub:${subKey}`)

      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
