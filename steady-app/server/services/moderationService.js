const HATE_SPEECH_KEYWORDS = [
  'kill all',
  'go back to your country',
  'subhuman',
  'white power',
  'nazi',
  'lynch',
  'racial slur'
];

const AGGRESSIVE_PHRASES = [
  'shut up',
  'you are worthless',
  'idiot',
  'moron',
  'i hate you',
  'nobody likes you',
  'stupid'
];

function analyzeMessage(message = '') {
  const normalized = message.toLowerCase().trim();
  if (!normalized) {
    return { blocked: true, toxic: true, reason: 'empty' };
  }

  const matchedHateSpeech = HATE_SPEECH_KEYWORDS.find((keyword) => normalized.includes(keyword));
  if (matchedHateSpeech) {
    return { blocked: true, toxic: true, reason: 'hate_speech', matched: matchedHateSpeech };
  }

  const aggressiveHits = AGGRESSIVE_PHRASES.filter((phrase) => normalized.includes(phrase));
  const punctuationIntensity = (normalized.match(/!{2,}/g) || []).length;
  const allCapsWords = message.split(/\s+/).filter((word) => word.length > 3 && word === word.toUpperCase()).length;

  const toxicScore = aggressiveHits.length + punctuationIntensity + (allCapsWords > 2 ? 1 : 0);
  if (toxicScore > 0) {
    return {
      blocked: true,
      toxic: true,
      reason: 'aggressive_language',
      matched: aggressiveHits
    };
  }

  return { blocked: false, toxic: false, reason: null };
}

module.exports = { analyzeMessage };
