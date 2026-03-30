export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    // Send to ALL OneSignal subscribers directly — no Redis lookup needed
    const resp = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        included_segments: ['All'],
        headings: { en: 'Shipud Flow' },
        contents: { en: 'Push notifications are working!' },
      }),
    })
    const result = await resp.json()
    return res.status(200).json({ sent: !result.errors, onesignal: result })
  } catch (err) {
    console.error('Test push error:', err)
    return res.status(500).json({ error: err.message })
  }
}
