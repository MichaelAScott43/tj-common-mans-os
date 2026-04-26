const { createPendingTask } = require('./tjTaskService');

function buildUserResponse(parsedIntent, preference) {
  if (parsedIntent.intent === 'food_order_prep') {
    if (!preference?.favoriteFoodOrder) {
      return {
        responseForUser: 'I can prep that order, but you have no favorite saved yet. Add one in Preferences and I will keep it ready.',
        nextStep: 'Save favoriteFoodOrder in Preferences to enable one-line order prep.'
      };
    }

    return {
      responseForUser: `I found your usual order: ${preference.favoriteFoodOrder}. Want me to prep it?`,
      nextStep: `Confirm to prep order details${preference.preferredPizzaVendor ? ` with ${preference.preferredPizzaVendor}` : ''}. Demo link: Open Domino's.`
    };
  }

  if (parsedIntent.intent === 'reminder' && !parsedIntent.extracted_fields.day && !parsedIntent.extracted_fields.time) {
    return {
      responseForUser: 'I can set that reminder. When should it fire?',
      nextStep: 'Reply with a day or time (example: Friday at 8 AM).'
    };
  }

  return {
    responseForUser: parsedIntent.suggested_response,
    nextStep: parsedIntent.required_confirmation ? 'Confirm or cancel this pending action.' : 'No confirmation needed.'
  };
}

async function routeIntent({ userId, source, commandText, parsedIntent, preference }) {
  const task = await createPendingTask({ userId, source, parsedIntent, commandText, preference });
  const responseBits = buildUserResponse(parsedIntent, preference);

  return {
    success: true,
    intent: parsedIntent.intent,
    taskCreated: true,
    task,
    responseForUser: responseBits.responseForUser,
    needsConfirmation: parsedIntent.required_confirmation,
    nextStep: responseBits.nextStep
  };
}

module.exports = { routeIntent };
