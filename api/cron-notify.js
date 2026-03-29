import { Redis } from '@upstash/redis'
import webpush from 'web-push'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

webpush.setVapidDetails(
  'mailto:noam.dayan@wsc-sports.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export default async function handler(req, res) {
  // Verify cron secret (Vercel sends this header for cron jobs)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Get all subscription keys
    const keys = await redis.keys('sub:*')
    if (!keys.length) return res.status(200).json({ sent: 0 })

    const now = new Date()
    const currentDay = now.getDay() // 0=Sun
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    let sent = 0

    for (const key of keys) {
      const raw = await redis.get(key)
      const data = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (!data?.subscription || !data?.reminders) continue

      for (const reminder of data.reminders) {
        if (!reminder.enabled) continue
        if (reminder.time !== currentTime) continue
        if (!reminder.days.includes(currentDay)) continue

        try {
          await webpush.sendNotification(
            data.subscription,
            JSON.stringify({
              title: `${reminder.label}`,
              body: reminder.body || "Time for your workout!",
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              tag: reminder.id,
            })
          )
          sent++
        } catch (pushErr) {
          console.error('Push failed for', key, pushErr.statusCode)
          // Remove expired subscriptions (410 Gone)
          if (pushErr.statusCode === 410) {
            await redis.del(key)
          }
        }
      }
    }

    return res.status(200).json({ sent, checked: keys.length, time: currentTime, day: currentDay })
  } catch (err) {
    console.error('Cron error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
