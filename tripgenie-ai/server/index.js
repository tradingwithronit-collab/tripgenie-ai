import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiEnabled: Boolean(client) })
})

app.post('/api/plan', async (req, res) => {
  const { origin, destination, startDate, endDate, travelers, budget, style, notes } = req.body || {}
  if (!destination || !startDate || !endDate) {
    return res.status(400).json({ error: 'Please provide a destination and travel dates.' })
  }

  if (!client) {
    return res.json({ mode: 'demo', plan: makeDemoPlan({ origin, destination, startDate, endDate, travelers, budget, style, notes }) })
  }

  try {
    const prompt = `Create a useful, realistic travel plan in JSON for this trip.
Origin: ${origin || 'Not specified'}
Destination: ${destination}
Dates: ${startDate} to ${endDate}
Travelers: ${travelers || 1}
Total budget: ${budget || 'Not specified'} INR
Travel style: ${style || 'Balanced'}
Extra preferences: ${notes || 'None'}

Return ONLY valid JSON with this shape:
{
 "headline": "short welcoming sentence",
 "overview": "2-3 sentence overview",
 "budgetBreakdown": [{"label":"Stay","amount":12000},{"label":"Food","amount":6000},{"label":"Activities","amount":5000},{"label":"Local transport","amount":3000}],
 "days": [{"day":1,"title":"Day title","items":[{"time":"09:00","title":"Activity","description":"Useful detail","type":"activity|food|transport|stay"}]}],
 "tips": ["practical tip"],
 "bookingAdvice": ["what to book and where to verify"]
}
Use INR for amounts. Do not claim to have booked anything or invent live ticket prices/availability. Mention that opening times and transport schedules should be checked before travel. Create one day per date, maximum 7 days.`
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are TripGenie, a careful and friendly travel-planning assistant. Be practical, transparent, and safety-conscious.' },
        { role: 'user', content: prompt }
      ]
    })
    const plan = JSON.parse(completion.choices[0].message.content)
    res.json({ mode: 'ai', plan })
  } catch (error) {
    console.error('Plan generation failed:', error.message)
    res.status(500).json({ error: 'AI could not create the plan. Check your API key and try again.' })
  }
})

app.post('/api/chat', async (req, res) => {
  const { message, destination } = req.body || {}
  if (!message?.trim()) return res.status(400).json({ error: 'Type a message first.' })
  if (!client) {
    return res.json({ mode: 'demo', reply: `Great question! For ${destination || 'your trip'}, I recommend comparing transport options early, keeping a little flexibility in your schedule, and checking official operator websites for current fares and availability. Add an OpenAI API key in the .env file to enable personalized AI chat.` })
  }
  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `You are TripGenie, a helpful travel assistant. Current destination: ${destination || 'not specified'}. Give concise, practical travel guidance. Never claim to make bookings or know live prices unless connected to a verified provider.` },
        { role: 'user', content: message }
      ]
    })
    res.json({ mode: 'ai', reply: completion.choices[0].message.content })
  } catch (error) {
    console.error('Chat failed:', error.message)
    res.status(500).json({ error: 'The AI assistant is temporarily unavailable. Please try again.' })
  }
})

function makeDemoPlan(trip) {
  const dest = trip.destination
  const count = Math.max(1, Math.min(7, Math.round((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000) + 1 || 3))
  const templates = [
    [['09:00','Explore the local highlights','Start with a relaxed walk around a well-known area.','activity'],['12:30','Local lunch stop','Try a popular regional dish at a well-reviewed restaurant.','food'],['15:00','Culture and sightseeing','Choose a museum, landmark, or guided experience.','activity'],['19:00','Evening at your own pace','Enjoy a sunset viewpoint or a lively market.','activity']],
    [['08:30','Breakfast nearby','Have breakfast close to your stay.','food'],['10:00','Signature experience','Spend the morning at a major attraction.','activity'],['13:00','Lunch break','Leave time to rest and recharge.','food'],['16:00','Neighbourhood discovery','Explore shops, parks, or a scenic area.','activity']],
    [['09:00','Easy morning','Keep the morning flexible and unhurried.','activity'],['11:00','Optional day trip','Consider a nearby attraction after checking travel time.','transport'],['14:00','Regional food experience','Try another local specialty.','food'],['17:30','Pack and unwind','Confirm your return journey and check-out details.','stay']]
  ]
  const days = Array.from({length: count}, (_, i) => ({
    day: i + 1, title: ['Arrive and get oriented','Discover the best of the destination','Explore at a relaxed pace'][i % 3],
    items: templates[i % 3].map(([time,title,description,type]) => ({time,title,description: description.replaceAll('the destination', dest),type}))
  }))
  const total = Number(String(trip.budget || '30000').replace(/[^\d]/g,'')) || 30000
  return {
    headline: `Your ${count}-day ${dest} escape is taking shape`,
    overview: `A balanced starter itinerary for ${trip.travelers || 1} traveler(s), with time for local highlights, food, and flexible exploration. This is a demo plan; personalize it before you travel.`,
    budgetBreakdown: [
      {label:'Stay',amount:Math.round(total*.35)},{label:'Food',amount:Math.round(total*.2)},
      {label:'Activities',amount:Math.round(total*.2)},{label:'Local transport',amount:Math.round(total*.15)},{label:'Buffer',amount:Math.round(total*.1)}
    ],
    days,
    tips:['Check official attraction websites for current opening hours and entry rules.','Keep digital and offline copies of tickets and important documents.','Use official operator websites to verify schedules, fares, and availability.'],
    bookingAdvice:['Compare flight, train, and bus options for your dates before paying.','Book accommodation with a clear cancellation policy.','TripGenie is not connected to ticket inventory in this starter version; bookings must be completed with the provider.']
  }
}

// In production, serve the built React app from the same Express server.
const clientBuildPath = path.resolve(__dirname, '../dist')
app.use(express.static(clientBuildPath))
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'))
})

app.listen(PORT, () => console.log(`TripGenie server running on port ${PORT}`))