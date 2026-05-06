const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

let tasks = [{ id: 1, title: 'Submit rent assistance form', priority: 'High', done: false }];
let goals = [{ id: 1, title: 'Emergency fund', progress: 45 }];

app.get('/api/health', (_req, res) => res.json({ ok: true, app: 'Steady', poweredBy: 'TJ' }));
app.get('/api/tasks', (_req, res) => res.json(tasks));
app.get('/api/goals', (_req, res) => res.json(goals));

app.post('/api/tasks', (req, res) => {
  const task = { id: Date.now(), ...req.body };
  tasks.push(task);
  res.status(201).json(task);
});

app.post('/api/goals', (req, res) => {
  const goal = { id: Date.now(), ...req.body };
  goals.push(goal);
  res.status(201).json(goal);
});

const distPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));

app.listen(PORT, () => console.log(`Steady server running on port ${PORT}`));
