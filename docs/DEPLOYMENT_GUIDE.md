# STEADY DEPLOYMENT GUIDE

## Local Development

Install dependencies:

```bash
npm install
```

Run Expo:

```bash
npm start
```

Run backend server:

```bash
npm run server
```

## Web Deployment
Recommended:
- Vercel for frontend
- Render or Railway for backend

## Required Environment Variables

```env
PORT=4000
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000
OPENAI_API_KEY=your_key_here
```

## Testing
Run Sentinel validation tests:

```bash
npx jest
```

## Build Web App

```bash
npm run build
```

## Production Goals
Steady should deploy to:
- web
- iOS
- Android

with one shared backend architecture.

## Safety Requirements
Before deployment verify:
- TJ never impersonates a human
- Arlane never gives medical advice
- unsafe prompts escalate properly
- no actions execute without confirmation
- user privacy documentation exists
