const store = require('../store/tjStore');

function taskTitleFromIntent(intent, commandText) {
  const clean = commandText.trim();
  if (clean.length <= 80) return clean;
  return `${intent.replaceAll('_', ' ')}: ${clean.slice(0, 77)}...`;
}

async function createPendingTask({ userId, source, parsedIntent, commandText, preference }) {
  const vendor = parsedIntent.intent === 'food_order_prep' ? (parsedIntent.extracted_fields.vendorHint || preference?.preferredPizzaVendor || '') : '';
  return store.createTask({
    userId,
    title: taskTitleFromIntent(parsedIntent.intent, commandText),
    description: parsedIntent.summary,
    intent: parsedIntent.intent,
    status: parsedIntent.required_confirmation ? 'pending' : 'confirmed',
    dueDate: null,
    vendor,
    extractedFields: parsedIntent.extracted_fields,
    source,
    requiresConfirmation: parsedIntent.required_confirmation
  });
}

module.exports = { createPendingTask };
