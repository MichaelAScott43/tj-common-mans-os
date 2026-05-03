import { evaluateSafety } from './sentinelGuard';

export function generateResponse({ character, input }) {
  const safety = evaluateSafety(input);

  if (!safety.safe) {
    return safety.response;
  }

  if (character === 'Arlane') {
    return generateArlaneResponse(input);
  }

  return generateTJResponse(input);
}

function generateTJResponse(input) {
  const normalized = input.toLowerCase();

  if (normalized.includes('rent') || normalized.includes('bill')) {
    return 'Let us break it down one piece at a time. Start with what absolutely has to get paid first.';
  }

  if (normalized.includes('organize') || normalized.includes('schedule')) {
    return 'Good. Getting organized makes life feel lighter. Start with the next three important things.';
  }

  if (normalized.includes('cheap') || normalized.includes('afford')) {
    return 'Let me help you stretch the dollar without making life miserable.';
  }

  return 'I got you. Let us simplify the chaos and figure out the next move.';
}

function generateArlaneResponse(input) {
  const normalized = input.toLowerCase();

  if (normalized.includes('overwhelmed') || normalized.includes('stress')) {
    return 'You do not have to solve your entire life tonight. Focus on the next small step in front of you.';
  }

  if (normalized.includes('tired') || normalized.includes('burned out')) {
    return 'Being exhausted does not mean you are weak. It means you have been carrying a lot for a long time.';
  }

  return 'Take a breath first. We can work through this slowly.';
}
