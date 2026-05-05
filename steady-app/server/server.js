const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const characterStyles = {
  TJ: {
    opening: [
      'No fluff: you can handle this.',
      'Straight up—you need momentum, not perfection.',
      'Here is the truth: your next move matters more than your mood.'
    ]
  },
  Arlane: {
    opening: [
      'You are not behind; you are rebuilding.',
      'Take a breath. We can do this one step at a time.',
      'You deserve a plan that feels supportive and clear.'
    ]
  }
};

const resourcesByTopic = {
  mental: [
    { label: '988 Lifeline', url: 'https://988lifeline.org/' },
    { label: 'NAMI HelpLine', url: 'https://www.nami.org/support-education/nami-helpline/' }
  ],
  money: [
    { label: 'Consumer Financial Protection Bureau', url: 'https://www.consumerfinance.gov/' },
    { label: 'USA Benefits Finder', url: 'https://www.usa.gov/benefit-finder' }
  ],
  jobs: [
    { label: 'CareerOneStop', url: 'https://www.careeronestop.org/' },
    { label: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/' }
  ]
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function detectTopics(message) {
  const text = message.toLowerCase();
  return {
    mental: /(anx|stress|depress|overwhelm|panic|mental)/.test(text),
    money: /(money|debt|rent|bill|budget|finance)/.test(text),
    jobs: /(job|resume|interview|career|work)/.test(text)
  };
}

function createResponse(message, character = 'Arlane') {
  const persona = characterStyles[character] || characterStyles.Arlane;
  const topics = detectTopics(message || '');

  const tone = character === 'TJ'
    ? 'You are capable, but you need structure today. Stop waiting for motivation and execute.'
    : 'You are carrying a lot, and your progress still counts. Let us focus on calm, practical steps.';

  const actionableSteps = [
    'Write one concrete goal for the next 24 hours in a sentence.',
    'Block 25 minutes on your calendar to complete the highest-impact task.',
    'Send one message or complete one form that moves your life forward today.'
  ];

  const priorityAction = 'Do this today: Complete the 25-minute focus block before 6:00 PM.';

  const resources = [
    ...(topics.mental ? resourcesByTopic.mental : [resourcesByTopic.mental[0]]),
    ...(topics.money ? resourcesByTopic.money : [resourcesByTopic.money[0]]),
    ...(topics.jobs ? resourcesByTopic.jobs : [resourcesByTopic.jobs[0]])
  ].slice(0, 3);

  return {
    response: `${pick(persona.opening)} ${tone} Based on what you shared: "${message}"`,
    nextStep: {
      actionableSteps,
      priorityAction,
      resources
    }
  };
}

app.post('/api/chat', (req, res) => {
  const { message, character } = req.body || {};

  if (!message || !character) {
    return res.status(400).json({ error: 'message and character are required.' });
  }

  return res.json(createResponse(message, character));
});

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', service: 'steady-life-os' });
});

app.listen(PORT, () => {
  console.log(`Steady server running on port ${PORT}`);
});
