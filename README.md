# Steady (Powered by TJ)

Steady is a standalone life operating system app with a premium BlackCrest-inspired black/gold UI. It includes mock-data modules for daily operations: Life Hub, Tasks, Calendar, Notes, Contacts, Money Map, Goals, Steady Coach, and Settings.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Deployment: Render

## Project Structure
```
/
├── client/
├── server/
├── package.json
├── render.yaml
├── README.md
└── .gitignore
```

## Local Setup
1. Install everything:
   ```bash
   npm run install-all
   ```
2. Build frontend:
   ```bash
   npm run build
   ```
3. Start production server:
   ```bash
   npm start
   ```
4. Open `http://localhost:10000`.

## Dev Mode
- Backend watch mode:
  ```bash
  npm run dev
  ```
- Frontend dev server:
  ```bash
  npm run dev:client
  ```

## API Endpoints (Mock)
- `GET /api/health`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/goals`
- `POST /api/goals`

## Render Deployment
1. Push this repository to GitHub.
2. Create a new **Web Service** on Render.
3. Render will detect `render.yaml`.
4. Build command:
   `npm run install-all && npm run build`
5. Start command:
   `npm start`

The backend serves `client/dist` in production.
