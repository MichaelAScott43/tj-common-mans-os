# TJ - The Common Man's OS

**Tagline:** Talk normal. TJ handles the annoying part.

TJ is a practical AI sidekick for regular people. It turns natural commands into structured tasks, asks for confirmation, and keeps daily life organized without pretending to be human.

## MVP Features
- Landing, Chat, Tasks, Preferences, and Beta signup screens
- Conversational command input with quick examples
- Intent parsing service with supported intents:
  - `conversation`
  - `reminder`
  - `calendar_event`
  - `food_order_prep`
  - `message_draft`
  - `shopping_reorder`
  - `errand_task`
  - `unknown`
- Pending task confirmation workflow (confirm/cancel)
- Preferences persistence for food, contacts, and tone
- Safe action router that **simulates only** (no real-world execution)
- Alexa-compatible endpoint + lambda handler

## Safety Rules
TJ never spends money, sends messages, or books services without explicit confirmation.
In MVP mode, all such actions are simulated.

## Stack
- Expo + React Native frontend
- Node.js + Express backend
- MongoDB/Mongoose models with in-memory fallback for local dev
- Optional OpenAI-powered intent parsing (rule-based parser fallback)

## API Routes
- `POST /api/tj/command`
- `GET /api/tj/tasks`
- `POST /api/tj/tasks`
- `GET /api/tj/tasks/:id`
- `POST /api/tj/tasks/:id/confirm`
- `POST /api/tj/tasks/:id/cancel`
- `GET /api/tj/preferences`
- `POST /api/tj/preferences`
- `POST /api/tj/alexa`

## Setup
```bash
npm install
npm run server
npm run dev
```

## Scripts
- `npm start` - Expo app
- `npm run dev` - alias to start app
- `npm run server` - Express API
- `npm run build` - Expo web export

## Environment Variables
- `PORT=4000`
- `MONGODB_URI=<atlas-uri>`
- `MONGODB_DB=steady`
- `OPENAI_API_KEY=<optional>`
- `OPENAI_MODEL=gpt-4.1-mini`
- `EXPO_PUBLIC_API_BASE_URL=http://localhost:4000`
- `TJ_API_BASE_URL=http://localhost:4000`

## Roadmap
- Native speech-to-text for true voice-first UX
- Push notifications for reminders
- Auth-bound multi-user data isolation
- Google Calendar sync
- Vendor integrations for food and groceries
