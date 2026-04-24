# Steady — Life Operations OS

Steady is a mobile-first Life Operations OS that gives everyday people executive-level support for organizing tasks, reminders, opportunities, notes, follow-ups, and AI-guided planning.

## Product Positioning
- Calm, premium, AI-powered command center.
- Not a basic todo app.
- Personal Mode and Work Mode are separated.
- Personality Engine changes AI communication style without changing core app logic.

## Current Stack
- Expo + React Native (iOS, Android, and Web)
- Node.js HTTP placeholder backend (`server/index.js`)
- Modular config/services for AI prompt personalities and integration interfaces
- Demo-first architecture (works without live API credentials)

## Core Modules Included
- Landing page messaging and beta CTA framing
- Life Command Center dashboard with AI briefing and Top 3 priorities
- Tasks + reminders model
- Opportunity tracker model
- Notes + memory + social follow-up tracker
- Integrations center with mock connect/disconnect state
- Personal vs Work mode separation UI
- Work route and add-in/Teams scaffold docs in `integrations/work`
- Privacy & Trust page
- Personality Settings with 7 modes:
  - Steady Classic
  - TJ Mode
  - Arlane Mode
  - Coach Mode
  - Companion Mode
  - Romantic Companion Mode (age gate + consent)
  - Custom Persona

## Setup
### 1) Install
```bash
npm install
```

### 2) Run app
```bash
npm start
```

### Optional platform targets
```bash
npm run start:web
npm run start:android
npm run start:ios
```

### 3) Run backend placeholder
```bash
npm run server
```

## Environment Variables
Create `.env` (all optional for demo mode):

```bash
PORT=4000
OPENAI_BASE_URL=
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
FIREBASE_PROJECT_ID=
GOOGLE_CLIENT_ID=
MICROSOFT_CLIENT_ID=
```

No API keys are hardcoded.

## Integration Roadmap
- Gmail / Outlook personal sync (metadata first)
- Google / Microsoft Calendar sync and conflict detection
- Teams / Office add-in + Graph integration for Work Mode
- Optional OAuth flows and token vaulting

## Mobile App Roadmap
- Current app is mobile-first and touch-friendly in Expo.
- Add offline queueing and push-notification orchestration.
- Wrap web build with Capacitor or evolve into native React Native modules as needed.

## Teams / Office Add-on Roadmap
See `integrations/work/` for manifest placeholders and Graph implementation steps.

## Privacy Architecture
- User-controlled integration permissions
- Disconnect options for connected accounts
- Personal/work data separation
- Metadata-first ingestion defaults
- Minimum necessary data retention
- Crisis safety language escalation and emergency prompts (911 and 988 in U.S.)

## Deployment
- Frontend: Expo EAS or Expo web hosting pipeline
- Backend: deploy `server/index.js` to Node-compatible host (Render/Fly/Railway)

