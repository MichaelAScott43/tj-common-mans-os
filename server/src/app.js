const express = require('express');
const tjRoutes = require('./routes/tjRoutes');

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

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
