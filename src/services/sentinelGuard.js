const crisisKeywords = [
  'kill myself',
  'hurt myself',
  'suicide',
  'end my life',
  'hurt someone'
];

export function evaluateSafety(input = '') {
  const normalized = input.toLowerCase();

  const matched = crisisKeywords.find((keyword) =>
    normalized.includes(keyword)
  );

  if (matched) {
    return {
      safe: false,
      escalation: true,
      response:
        'I am really glad you said something. Please contact emergency services, a licensed professional, or a trusted person nearby right now. You do not have to carry this alone.'
    };
  }

  return {
    safe: true,
    escalation: false
  };
}
