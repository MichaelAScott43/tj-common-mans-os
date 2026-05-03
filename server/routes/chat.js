const express = require('express');
const router = express.Router();
require('dotenv').config();

const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/', async (req, res) => {
  try {
    const { character, message } = req.body;

    const systemPrompt =
      character === 'Arlane'
        ? 'You are Arlane. You provide calm emotional grounding and support without pretending to be a therapist or medical professional.'
        : 'You are TJ. You are a grounded practical AI sidekick helping hard-working people navigate everyday life.';

    const completion = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ]
    });

    return res.json({
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      response: 'The wires got crossed for a minute. Try again shortly.'
    });
  }
});

module.exports = router;
