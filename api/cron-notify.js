import { Redis } from '@upstash/redis'
import { Receiver } from '@upstash/qstash'
import webpush from 'web-push'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
})

webpush.setVapidDetails(
  'mailto:noam.dayan@wsc-sports.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export default async function handler(req, res) {
  // Verify request comes from QStash
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
    const { subKey, reminderId } = req.body
    if (!subKey) return res.status(400).json({ error: 'Missing subKey' })

    // Get subscription data
    const raw = await redis.get(`sub:${subKey}`)
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!data?.subscription) return res.status(404).json({ error: 'Subscription not found' })

    // Find the specific reminder
    const reminder = data.reminders?.find(r => r.id === reminderId)
    if (!reminder || !reminder.enabled) {
      return res.status(200).json({ skipped: true, reason: 'Reminder disabled or not found' })
    }

    // Check if today is a scheduled day
    const today = new Date().getDay()
    if (!reminder.days.includes(today)) {
      return res.status(200).json({ skipped: true, reason: 'Not scheduled today' })
    }

    // Send push notification
    await webpush.sendNotification(
      data.subscription,
      JSON.stringify({
        title: reminder.label,
        body: reminder.body || 'Time for your workout!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: reminder.id,
      })
    )

    return res.status(200).json({ sent: true, reminder: reminder.label })
  } catch (err) {
    // Remove expired subscription (410 Gone)
    if (err.statusCode === 410) {
      const { subKey } = req.body
      if (subKey) await redis.del(`sub:${subKey}`)
      return res.status(200).json({ removed: true, reason: 'Subscription expired' })
    }

    console.error('Push error:', err)
    return res.status(500).json({ error: 'Push failed' })
  }
}
