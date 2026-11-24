# TripGenie AI — ready-to-run college project

TripGenie AI is a responsive travel-planning web app built with React, Vite, Express, and the OpenAI API. It creates day-by-day itinerary suggestions, estimates a budget, provides booking-provider links, and includes a travel chat assistant.

## 1. What is included

- Responsive landing page and destination discovery cards
- Trip form: destination, origin, dates, travelers, budget, travel style, preferences
- AI itinerary generation (OpenAI `gpt-4o-mini`)
- Budget breakdown, travel tips, and booking checklist
- Travel assistant chat
- Links to flight, train, and hotel providers
- Demo mode if you have not added an API key
- Save the generated itinerary in the browser's local storage

## 2. Requirements

Install **Node.js 20 or newer** from https://nodejs.org/ . After installation, open a terminal in this project folder.

## 3. Install and run

```bash
npm install
```

Copy `.env.example` to `.env`. On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Now start the app:

```bash
npm run dev
```

Open **http://localhost:5173** in your browser. Keep the terminal open while using the app.

## 4. Enable real AI responses (optional)

1. Create an API key from the OpenAI developer platform: https://platform.openai.com/api-keys
2. Add billing/credits if required by your OpenAI account.
3. Open `.env` and add your key:

```env
OPENAI_API_KEY=your_actual_api_key_here
PORT=3001
```

4. Stop the running server with `Ctrl + C`, then run `npm run dev` again.
5. The header should show **AI connected**.

**Security:** The API key is read by the Express backend. Do not put it in frontend code, do not use a `VITE_` prefix, and never commit your `.env` file or share screenshots containing the key.

If no key is configured, the app runs in demo mode with a sample itinerary and demo chat response. This is intentional, so you can demonstrate the UI without an API key.

## 5. Ticket booking: important project limitation

This starter app provides links to Google Flights, IRCTC, and Google Hotels. It does **not** have a live flight/train/hotel inventory connection and does not issue or pay for tickets. Real-time search and actual booking require approved provider APIs, credentials, and often commercial onboarding. Always verify fares, schedules, availability, cancellation rules, and passenger details on the provider's official site before paying.

## 6. Build for production

```bash
npm run build
```

This creates the frontend production build in `dist/`. For a public deployment, deploy the Express server and frontend together or configure your hosting platform to serve `dist` and proxy `/api` requests to the Express app. Set `OPENAI_API_KEY` as a server-side environment variable in your hosting provider.

## 7. Suggested project explanation for your viva

**Problem:** Planning a trip requires users to compare many sources, estimate costs, and organize activities.

**Solution:** TripGenie AI collects a user's destination, dates, budget, group size, and interests. It sends those preferences to an AI model, which returns a structured itinerary, budget categories, and practical tips. The user can also ask travel questions through the chat assistant.

**AI integration:** The backend calls OpenAI's Chat Completions API using `gpt-4o-mini`. The API key stays on the server. If no key is configured, the app uses a clearly labelled demo mode.

**Future improvements:** Connect authorized flight/hotel inventory APIs, add user login and cloud-saved trips, add maps and weather, and support secure checkout through an approved booking partner.
