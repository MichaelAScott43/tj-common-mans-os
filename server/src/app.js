const express = require('express');
const path = require('path');
const tjRoutes = require('./routes/tjRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  return next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'steady-tj-api', timestamp: new Date().toISOString() });
});


app.use('/api/tj', tjRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/conversations', conversationRoutes);
app.post('/api/chat', (req, res) => {
  const { message, personality } = req.body || {};

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message must be a non-empty string' });
  }

  if (personality !== 'TJ' && personality !== 'Arlane') {
    return res.status(400).json({ error: 'personality must be "TJ" or "Arlane"' });
  }

  const cleanMessage = message.trim();
  const needsPlanning = /plan|schedule|remind|task|organize/i.test(cleanMessage);
  const isStressed = /stressed|overwhelmed|anxious|tired|burned out/i.test(cleanMessage);

  let reply;
  if (personality === 'TJ') {
    reply = needsPlanning
      ? `TJ: Alright, no fluff. Let's do this in 3 moves: 1) pick the top priority, 2) timebox 25 minutes, 3) report back when done. Your first move: ${cleanMessage}`
      : `TJ: Straight answer? ${cleanMessage} matters less than your next action. Pick one small step and do it now.`;
  } else {
    reply = isStressed
      ? `Arlane: I hear you. Take one slow breath with me, then we will do this gently. Start with one small step related to: ${cleanMessage}.`
      : `Arlane: You're doing okay. Let's break "${cleanMessage}" into one simple next step and move at a steady pace.`;
  }

  return res.json({ reply });
});

app.use(express.static(path.resolve('public')));

app.get('/', (_req, res) => res.sendFile(path.resolve('public/index.html')));
app.get('/dashboard', (_req, res) => res.sendFile(path.resolve('public/dashboard.html')));
app.get('/chat', (_req, res) => res.sendFile(path.resolve('public/chat.html')));
app.get('/resume', (_req, res) => res.sendFile(path.resolve('public/resume.html')));
app.get('/funding', (_req, res) => res.sendFile(path.resolve('public/funding.html')));
app.get('/life', (_req, res) => res.sendFile(path.resolve('public/life.html')));

app.use((req, res, next) => {
  if (!res.headersSent) {
    console.error(`Route not found: ${req.method} ${req.originalUrl}`);
    return res.status(404).json({ error: 'Route not found' });
  }
  return next();
});

app.use((error, req, res, _next) => {
  console.error(`Request failed: ${req.method} ${req.originalUrl}`, error);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
