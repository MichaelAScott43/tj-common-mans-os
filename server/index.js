const http = require('http');
const { URL } = require('url');

const port = process.env.PORT || 4000;

const personalityModes = {
  classic: 'Steady Classic',
  tj: 'TJ Mode',
  arlane: 'Arlane Mode',
  coach: 'Coach Mode',
  companion: 'Companion Mode',
  romantic: 'Romantic Companion Mode',
  custom: 'Custom Persona'
};

const demoDailyBriefing = {
  summary: 'You have three high-impact moves today: secure essentials, close one opportunity, and reduce overload with short focus blocks.',
  top3Priorities: ['Pay electricity bill before 6 PM', 'Send proposal follow-up', 'Family medical check-in'],
  risks: ['Late payment fee risk', 'Warm opportunity cooling risk'],
  suggestedFollowUps: ['Message Alex after proposal', 'Send family checklist'],
  missedOpportunities: ['No outreach to dormant contacts this week'],
  doThisNext: 'Spend 12 focused minutes sending the proposal follow-up now.'
};

function send(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') return send(res, 200, { ok: true });

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return send(res, 200, { ok: true, service: 'steady-api', timestamp: new Date().toISOString() });
  }

  if (req.method === 'GET' && url.pathname === '/api/personality-modes') {
    return send(res, 200, personalityModes);
  }

  if (req.method === 'POST' && url.pathname === '/api/ai/daily-plan') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      let parsed = {};
      try {
        parsed = body ? JSON.parse(body) : {};
      } catch (_e) {
        return send(res, 400, { error: 'Invalid JSON body.' });
      }
      const mode = parsed.mode || 'classic';
      const summaryPrefix = personalityModes[mode] || 'Steady Classic';
      return send(res, 200, {
        ...demoDailyBriefing,
        summary: `${summaryPrefix}: ${demoDailyBriefing.summary}`,
        source: process.env.OPENAI_BASE_URL ? 'configured-ai-service-placeholder' : 'mock-engine'
      });
    });
    return;
  }

  return send(res, 404, { error: 'Not found' });
});

server.listen(port, () => {
  console.log(`Steady API listening on http://localhost:${port}`);
});
