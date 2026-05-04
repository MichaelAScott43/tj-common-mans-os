const express = require('express');
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


app.get('/', (_req, res) => {
  res.status(200).send('Steady is running');
});

app.use('/api/tj', tjRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/conversations', conversationRoutes);

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
