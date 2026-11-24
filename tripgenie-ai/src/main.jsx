import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, Compass, MapPin, Plane, TrainFront, Hotel, Sparkles, Wallet, Menu, X, Send, Clock3, ShieldCheck, Bookmark, Plus, Luggage, Sun, Coffee, Camera, Bus, LoaderCircle } from 'lucide-react'
import './styles.css'

const popular = [
  { name: 'Goa', country: 'India', tag: 'Beach escape', days: '4–5 days', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85' },
  { name: 'Jaipur', country: 'India', tag: 'Culture & heritage', days: '2–3 days', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=85' },
  { name: 'Manali', country: 'India', tag: 'Mountain retreat', days: '4–6 days', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=85' },
  { name: 'Kerala', country: 'India', tag: 'Nature & backwaters', days: '5–7 days', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85' }
]
const money = n => '₹' + Number(n || 0).toLocaleString('en-IN')

function App() {
  const [destination, setDestination] = useState('')
  const [origin, setOrigin] = useState('Bengaluru')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [travelers, setTravelers] = useState('2')
  const [budget, setBudget] = useState('30000')
  const [style, setStyle] = useState('Balanced')
  const [notes, setNotes] = useState('')
  const [plan, setPlan] = useState(null)
  const [mode, setMode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([{role:'assistant',text:'Hi! I’m your TripGenie travel companion. Where are you dreaming of going?'}])
  const [chatLoading, setChatLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [apiStatus, setApiStatus] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(() => {
    fetch('/api/health').then(r=>r.json()).then(d=>setApiStatus(d.aiEnabled)).catch(()=>{})
    const today = new Date().toISOString().slice(0,10)
    const later = new Date(Date.now()+3*86400000).toISOString().slice(0,10)
    setStartDate(today); setEndDate(new Date(Date.now()+6*86400000).toISOString().slice(0,10))
  }, [])

  async function createPlan(e) {
    e.preventDefault(); setError('')
    if (!destination.trim()) return setError('Please enter where you want to go.')
    if (endDate < startDate) return setError('Return date must be after your departure date.')
    setLoading(true); setPlan(null); setSaved(false)
    try {
      const response = await fetch('/api/plan', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({origin,destination,startDate,endDate,travelers,budget,style,notes})})
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not create your trip.')
      setPlan(data.plan); setMode(data.mode)
      setTimeout(()=>document.getElementById('your-plan')?.scrollIntoView({behavior:'smooth'}),100)
    } catch (err) { setError(err.message || 'Could not reach the server. Start the project using the README steps.') }
    finally { setLoading(false) }
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!message.trim() || chatLoading) return
    const text = message.trim(); setMessage('')
    setMessages(prev=>[...prev,{role:'user',text}]); setChatLoading(true)
    try {
      const r = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,destination})})
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      setMessages(prev=>[...prev,{role:'assistant',text:data.reply}])
    } catch { setMessages(prev=>[...prev,{role:'assistant',text:'I could not connect just now. Please check that the project server is running and try again.'}]) }
    finally { setChatLoading(false) }
  }

  function pickDestination(name) {
    setDestination(name)
    document.getElementById('planner')?.scrollIntoView({behavior:'smooth'})
  }

  return <div className="app">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-icon"><Compass size={22}/></span><span>tripgenie<span className="brand-ai">.ai</span></span></a>
      <nav className={mobileMenu?'nav open':'nav'}>
        <a href="#how">How it works</a><a href="#discover">Discover</a><a href="#planner">AI trip planner</a>
      </nav>
      <div className="header-actions"><span className="live-pill"><i/> {apiStatus?'AI connected':'Demo mode'}</span><button className="nav-cta" onClick={()=>document.getElementById('planner').scrollIntoView({behavior:'smooth'})}>Plan a trip <ArrowUpRight size={16}/></button></div>
      <button className="mobile-toggle" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">{mobileMenu?<X/>:<Menu/>}</button>
    </header>

    <main>
      <section className="hero">
        <div className="hero-image"/>
        <div className="hero-shade"/>
        <div className="hero-content">
          <div className="eyebrow light"><Sparkles size={14}/> YOUR PERSONAL AI TRAVEL COMPANION</div>
          <h1>Go beyond<br/><em>the ordinary.</em></h1>
          <p className="hero-copy">Big adventures. Thoughtful plans. Zero planning stress.<br/>Let AI turn your travel dreams into a journey.</p>
          <div className="hero-buttons"><button className="button button-lime" onClick={()=>document.getElementById('planner').scrollIntoView({behavior:'smooth'})}>Plan my trip <ArrowRight size={17}/></button><a className="text-link light-link" href="#discover">Explore destinations <ArrowUpRight size={16}/></a></div>
          <div className="hero-note"><span className="avatar-stack"><b>✦</b><b>✈</b><b>⌖</b></span><span>Made for curious minds<br/><strong>and spontaneous souls.</strong></span></div>
        </div>
        <div className="hero-stamp"><Compass size={19}/><span>THE WORLD<br/>IS YOURS</span></div>
        <div className="hero-bottom"><span>01 / DREAM IT</span><span>SCROLL TO EXPLORE ↓</span><span>MADE FOR THE WAY YOU WANDER</span></div>
      </section>

      <section className="intro section-wrap" id="how">
        <div className="section-kicker">A BETTER WAY TO GET THERE <span>✳</span></div>
        <div className="intro-grid"><h2>Less planning.<br/><em>More living.</em></h2><div className="intro-copy"><p>From the first “what if?” to your final boarding call, TripGenie brings your whole journey together in one thoughtful place.</p><a href="#planner" className="under-link">Meet your travel planner <ArrowRight size={16}/></a></div></div>
        <div className="feature-row">
          <Feature icon={<Sparkles/>} num="01" title="AI-crafted itineraries" desc="A day-by-day plan shaped around your pace, budget, and interests."/>
          <Feature icon={<Wallet/>} num="02" title="Budgets that make sense" desc="See where your money could go before you hit the road."/>
          <Feature icon={<Luggage/>} num="03" title="Your trip, in one place" desc="Keep your ideas, plans, and booking links together."/>
        </div>
      </section>

      <section className="discover section-wrap" id="discover">
        <div className="section-heading"><div><div className="section-kicker">A LITTLE INSPIRATION</div><h2>Where to <em>next?</em></h2></div><p>Some places just stay with you.<br/>Here are a few to get you going.</p></div>
        <div className="destination-grid">{popular.map((d,i)=><button className="destination-card" key={d.name} onClick={()=>pickDestination(d.name)}>
          <img src={d.image} alt={`${d.name}, ${d.country}`} loading="lazy"/><span className="destination-index">0{i+1}</span><span className="destination-info"><small>{d.tag} · {d.days}</small><strong>{d.name}</strong><span className="destination-arrow"><ArrowUpRight size={18}/></span></span>
        </button>)}</div>
      </section>

      <section className="planner-section" id="planner">
        <div className="section-wrap planner-wrap">
          <div className="planner-heading"><div className="section-kicker light">YOUR NEXT CHAPTER STARTS HERE</div><h2>Dream it.<br/><em>We'll map it.</em></h2><p>Tell us a little about your trip. Our AI will shape a thoughtful itinerary around you.</p><div className="planner-perks"><span><Check size={15}/> Personalised ideas</span><span><Check size={15}/> Budget breakdown</span><span><Check size={15}/> Day-by-day plan</span></div></div>
          <form className="planner-card" onSubmit={createPlan}>
            <div className="form-top"><div><span className="form-step">LET'S GET GOING</span><h3>Build your trip</h3></div><span className="form-spark"><Sparkles/></span></div>
            <div className="field"><label>WHERE ARE YOU HEADING?</label><div className="input-icon"><MapPin size={17}/><input value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Try Kyoto, Goa, or anywhere..." required/></div></div>
            <div className="field"><label>STARTING FROM</label><div className="input-icon"><Plane size={17}/><input value={origin} onChange={e=>setOrigin(e.target.value)} placeholder="Your city"/></div></div>
            <div className="field-row"><div className="field"><label>DEPARTURE</label><input type="date" value={startDate} min={new Date().toISOString().slice(0,10)} onChange={e=>setStartDate(e.target.value)} required/></div><div className="field"><label>RETURN</label><input type="date" value={endDate} min={startDate} onChange={e=>setEndDate(e.target.value)} required/></div></div>
            <div className="field-row"><div className="field"><label>TRAVELLERS</label><select value={travelers} onChange={e=>setTravelers(e.target.value)}><option value="1">1 traveller</option><option value="2">2 travellers</option><option value="3">3 travellers</option><option value="4">4 travellers</option><option value="5">5+ travellers</option></select></div><div className="field"><label>TOTAL BUDGET (₹)</label><input type="number" min="1000" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="30000"/></div></div>
            <div className="field"><label>YOUR TRAVEL VIBE</label><div className="vibe-options">{['Balanced','Adventure','Relaxed','Culture'].map(v=><button type="button" className={style===v?'vibe active':'vibe'} onClick={()=>setStyle(v)} key={v}>{v}</button>)}</div></div>
            <div className="field"><label>ANYTHING ELSE? <span className="optional">OPTIONAL</span></label><textarea rows="2" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Foodie spots, hidden gems, must-see places..."/></div>
            {error&&<p className="error-msg">{error}</p>}
            <button className="button button-dark submit-button" disabled={loading}>{loading?<><LoaderCircle className="spin" size={18}/> Creating your trip...</>:<>Create my itinerary <Sparkles size={17}/></>}</button>
            <p className="form-foot"><ShieldCheck size={14}/> Your details stay in this demo app. No booking is made.</p>
          </form>
        </div>
      </section>

      {plan&&<section className="results-section section-wrap" id="your-plan">
        <div className="results-head"><div><div className="section-kicker">YOUR TRIP IS TAKING SHAPE</div><h2>{plan.headline}</h2><p>{plan.overview}</p></div><div className="result-actions"><span className="mode-tag"><Sparkles size={13}/>{mode==='ai'?'AI generated':'Demo itinerary'}</span><button className="save-button" onClick={()=>{localStorage.setItem('tripgenie-last-plan',JSON.stringify({destination,plan}));setSaved(true)}}><Bookmark size={16}/>{saved?'Saved':'Save plan'}</button></div></div>
        <div className="results-grid"><div className="itinerary">
          <h3><CalendarDays size={19}/> Your day-by-day plan</h3>
          {plan.days?.map(day=><div className="day-card" key={day.day}><div className="day-label"><span>DAY {String(day.day).padStart(2,'0')}</span><strong>{day.title}</strong></div><div className="timeline">{day.items?.map((item,i)=><div className="timeline-item" key={i}><span className="time">{item.time}</span><span className="timeline-dot">{item.type==='food'?<Coffee size={14}/>:item.type==='transport'?<Bus size={14}/>:item.type==='stay'?<Hotel size={14}/>:<Camera size={14}/>}</span><div><strong>{item.title}</strong><p>{item.description}</p></div></div>)}</div></div>)}
        </div><aside className="budget-panel"><h3><Wallet size={18}/> Budget snapshot</h3><p className="budget-total">{money(plan.budgetBreakdown?.reduce((a,b)=>a+Number(b.amount||0),0))}<small> estimated total</small></p><div className="budget-list">{plan.budgetBreakdown?.map((b,i)=><div key={b.label}><span>{b.label}</span><strong>{money(b.amount)}</strong></div>)}</div><div className="tips-box"><h4><Sun size={16}/> A few good-to-knows</h4>{plan.tips?.map((t,i)=><p key={i}>✳ {t}</p>)}</div><div className="booking-box"><h4><ShieldCheck size={16}/> Booking checklist</h4>{plan.bookingAdvice?.map((t,i)=><p key={i}>{i+1}. {t}</p>)}</div><p className="disclaimer">Estimates and suggestions only. Confirm prices, schedules, and availability with official providers before payment.</p></aside></div>
      </section>}

      <section className="booking-strip"><div className="section-wrap booking-inner"><div><div className="section-kicker light">READY WHEN YOU ARE</div><h2>From here to <em>there.</em></h2><p>Find the right way to get moving. Compare options with trusted travel providers.</p></div><div className="booking-links"><BookingLink icon={<Plane/>} title="Find flights" url="https://www.google.com/travel/flights" desc="Compare flight options"/><BookingLink icon={<TrainFront/>} title="Book trains" url="https://www.irctc.co.in/" desc="Official Indian Railways"/><BookingLink icon={<Hotel/>} title="Find stays" url="https://www.google.com/travel/hotels" desc="Explore accommodation"/></div></div></section>

      <footer><div className="footer-brand"><a className="brand" href="#"><span className="brand-icon"><Compass size={21}/></span><span>tripgenie<span className="brand-ai">.ai</span></span></a><p>Thoughtful journeys start with a little imagination.</p></div><div className="footer-right"><span>BUILT FOR THE LOVE OF GOING</span><span>© 2026 TRIPGENIE AI · COLLEGE PROJECT</span></div></footer>
    </main>

    <button className="chat-fab" onClick={()=>setChatOpen(!chatOpen)} aria-label="Open AI travel chat">{chatOpen?<X/>:<><Sparkles size={18}/> <span>Ask TripGenie</span></>}</button>
    {chatOpen&&<div className="chat-panel"><div className="chat-head"><div className="chat-avatar"><Sparkles size={18}/></div><div><strong>Your travel buddy</strong><small>TripGenie AI assistant</small></div><button onClick={()=>setChatOpen(false)}><X size={18}/></button></div><div className="chat-messages">{messages.map((m,i)=><div className={`chat-bubble ${m.role}`} key={i}>{m.text}</div>)}{chatLoading&&<div className="chat-bubble assistant"><LoaderCircle className="spin" size={16}/> Thinking...</div>}</div><form className="chat-form" onSubmit={sendMessage}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Ask me anything about travel..."/><button disabled={chatLoading}><Send size={17}/></button></form></div>}
  </div>
}

function Feature({icon,num,title,desc}) { return <div className="feature"><div className="feature-top"><span>{icon}</span><small>{num}</small></div><h3>{title}</h3><p>{desc}</p></div> }
function BookingLink({icon,title,url,desc}) { return <a className="booking-link" href={url} target="_blank" rel="noreferrer"><span className="booking-icon">{icon}</span><span><strong>{title}</strong><small>{desc}</small></span><ArrowUpRight size={17}/></a> }

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)