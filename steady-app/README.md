# STEADY – LIFE OPERATING SYSTEM

Production-ready React + Express application for personal life operations.

## Run locally

```bash
cd steady-app
npm install
npm run dev
```

- Client runs on `http://localhost:5173`
- Server runs on `http://localhost:5000`

## Render deployment

1. Create a new **Web Service** for `steady-app/server`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Set Root Directory to `steady-app/server`.
5. (Optional) deploy client separately as a static site from `steady-app/client`:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Configure frontend env var for API base URL when needed.

## Structure

```
steady-app/
  client/
  server/
  package.json
  README.md
```
