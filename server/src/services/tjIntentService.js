const OpenAI = require('openai');

const SUPPORTED_INTENTS = ['conversation', 'reminder', 'calendar_event', 'food_order_prep', 'message_draft', 'shopping_reorder', 'errand_task', 'unknown'];
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function localIntent(text) {
  const input = (text || '').toLowerCase();
  if (/remind|reminder/.test(input)) return 'reminder';
  if (/calendar|appointment|meeting|oil change/.test(input)) return 'calendar_event';
  if (/pizza|order|food|deliver/.test(input)) return 'food_order_prep';
  if (/text|message|dm|email/.test(input)) return 'message_draft';
  if (/shopping|reorder|grocery|buy again/.test(input)) return 'shopping_reorder';
  if (/errand|pickup|drop off/.test(input)) return 'errand_task';
  if (/hey|how are|what can you do/.test(input)) return 'conversation';
  return 'unknown';
}

function extractFields(commandText, intent) {
  const lower = commandText.toLowerCase();
  const fields = { rawText: commandText };
  if (intent === 'reminder' || intent === 'calendar_event') {
    const timeMatch = commandText.match(/\b(\d{1,2}(:\d{2})?\s?(am|pm)?)\b/i);
    const dayMatch = commandText.match(/today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday/i);
    fields.time = timeMatch ? timeMatch[1] : null;
    fields.day = dayMatch ? dayMatch[0] : null;
  }
  if (intent === 'food_order_prep') {
    fields.vendorHint = /domino/.test(lower) ? 'Domino\'s' : '';
  }
  if (intent === 'message_draft') {
    const recipient = commandText.match(/to\s+([a-z ]+)$/i);
    fields.recipient = recipient ? recipient[1].trim() : null;
  }
  return fields;
}

function suggestedResponse(intent, commandText) {
  const jokes = {
    reminder: 'Reminder queued. Future-you owes present-you a thank-you.',
    calendar_event: 'Calendar prep done. Because adulthood is just meetings in disguise.',
    food_order_prep: 'I found your food vibe. Your arteries remain concerned.',
    message_draft: 'Draft ready. I made you sound responsible.',
    shopping_reorder: 'Reorder prep done. Pantry panic averted.',
    errand_task: 'Errand task queued. Gas station coffee optional but respected.',
    conversation: 'I am TJ, not a therapist, but I am useful. What should I handle?',
    unknown: `I caught this: "${commandText}". Give me a little more detail and I will nail it.`
  };
  return jokes[intent];
}

async function parseIntent(commandText) {
  const fallbackIntent = localIntent(commandText);

  if (!openai) {
    const extracted = extractFields(commandText, fallbackIntent);
    return {
      intent: fallbackIntent,
      summary: `Parsed as ${fallbackIntent.replace('_', ' ')}.`,
      required_confirmation: fallbackIntent !== 'conversation' && fallbackIntent !== 'unknown',
      action_status: 'simulated_pending',
      suggested_response: suggestedResponse(fallbackIntent, commandText),
      extracted_fields: extracted
    };
  }

  const prompt = `You are TJ - The Common Man's OS. Parse this command into JSON fields:
intent, summary, required_confirmation, action_status, suggested_response, extracted_fields.
Allowed intent values: ${SUPPORTED_INTENTS.join(', ')}.
Safety: do not execute actions; always require confirmation for purchases, drafts, bookings.
Command: ${commandText}`;

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    input: prompt,
    response_format: { type: 'json_object' }
  });

  let parsed = {};
  try {
    parsed = JSON.parse(response.output_text || '{}');
  } catch (_error) {
    parsed = {};
  }

  const intent = SUPPORTED_INTENTS.includes(parsed.intent) ? parsed.intent : fallbackIntent;
  return {
    intent,
    summary: parsed.summary || `Parsed as ${intent}.`,
    required_confirmation: typeof parsed.required_confirmation === 'boolean' ? parsed.required_confirmation : intent !== 'conversation' && intent !== 'unknown',
    action_status: parsed.action_status || 'simulated_pending',
    suggested_response: parsed.suggested_response || suggestedResponse(intent, commandText),
    extracted_fields: parsed.extracted_fields || extractFields(commandText, intent)
  };
}

module.exports = { parseIntent };
