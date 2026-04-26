const BASE_URL = process.env.TJ_API_BASE_URL || 'http://localhost:4000';

async function forwardCommandToTJ(commandText, userId) {
  const response = await fetch(`${BASE_URL}/api/tj/alexa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId || 'alexa-user'
    },
    body: JSON.stringify({ commandText })
  });

  if (!response.ok) {
    return {
      speechText: 'TJ had a backend hiccup. Try again in a moment.',
      shouldEndSession: false
    };
  }

  return response.json();
}

function buildAlexaResponse(speechText, repromptText, shouldEndSession = false) {
  return {
    version: '1.0',
    response: {
      outputSpeech: { type: 'PlainText', text: speechText },
      reprompt: { outputSpeech: { type: 'PlainText', text: repromptText || speechText } },
      shouldEndSession
    }
  };
}

exports.handler = async (event) => {
  const intentName = event?.request?.intent?.name;

  if (event?.request?.type === 'LaunchRequest') {
    return buildAlexaResponse('Welcome to TJ. Talk normal and I handle the annoying part. What should I do?', 'What should I do?');
  }

  if (intentName === 'TJCommandIntent') {
    const commandText = event?.request?.intent?.slots?.command?.value;
    const userId = event?.session?.user?.userId;
    const result = await forwardCommandToTJ(commandText, userId);
    return buildAlexaResponse(result.speechText, result.repromptText, result.shouldEndSession);
  }

  return buildAlexaResponse('I can help with reminders, drafts, and task planning. Tell me a command.', 'Tell me a command.');
};
