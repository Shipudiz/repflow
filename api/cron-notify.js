import { Redis } from '@upstash/redis'
import { Receiver } from '@upstash/qstash'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
})

async function sendOneSignalNotification(userId, title, body) {
  const resp = await fetch('https://api.onesignal.com/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_id: process.env.ONESIGNAL_APP_ID,
      include_aliases: { external_id: [userId] },
      target_channel: 'push',
      headings: { en: title },
      contents: { en: body },
    }),
  })
  return resp.json()
}

export default async function handler(req, res) {
  try {
    const isValid = await receiver.verify({
      signature: req.headers['upstash-signature'],
      body: JSON.stringify(req.body),
    })
    if (!isValid) return res.status(401).json({ error: 'Invalid signature' })
  } catch {
    return res.status(401).json({ error: 'Signature verification failed' })
  }

  try {
    const { userId, reminderId } = req.body
    if (!userId) return res.status(400).json({ error: 'Missing userId' })

    const raw = await redis.get(`sub:${userId}`)
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!data) return res.status(404).json({ error: 'User not found' })

    const reminder = data.reminders?.find(r => r.id === reminderId)
    if (!reminder || !reminder.enabled) {
      return res.status(200).json({ skipped: true, reason: 'Reminder disabled or not found' })
    }

    const today = new Date().getDay()
    if (!reminder.days.includes(today)) {
      return res.status(200).json({ skipped: true, reason: 'Not scheduled today' })
    }

    const result = await sendOneSignalNotification(
      userId,
      reminder.label,
      reminder.body || 'Time for your workout!'
    )

    return res.status(200).json({ sent: true, reminder: reminder.label, onesignal: result })
  } catch (err) {
    console.error('Push error:', err)
    return res.status(500).json({ error: 'Push failed' })
  }
}
