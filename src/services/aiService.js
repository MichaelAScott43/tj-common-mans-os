import { personalityModes } from '../config/personalityPromptConfig';

const crisisPatterns = /(suicide|kill myself|hurt myself|self-harm|end my life|danger|abuse|overdose)/i;

export function detectCrisisLanguage(text) {
  return crisisPatterns.test(text || '');
}

export function getEmergencyPrompt() {
  return 'If you are in immediate danger, call emergency services now (911 in the U.S.). You can also contact or text 988 for the Suicide & Crisis Lifeline.';
}

export function generateDailyPlan({ briefing, personalitySettings }) {
  const modeConfig = personalityModes[personalitySettings.mode] || personalityModes.classic;
  const prefix = {
    classic: 'Steady Classic:',
    tj: 'TJ Mode says:',
    arlane: 'Arlane here:',
    coach: 'Coach Mode:',
    companion: 'Companion check-in:',
    romantic: 'Romantic Companion (with boundaries):',
    custom: `${personalitySettings.customPersona.name || 'Custom Persona'}:`
  }[personalitySettings.mode];

  return {
    ...briefing,
    styledBriefing: `${prefix} ${briefing.summary}`,
    doThisNext: `${briefing.doThisNext} (${modeConfig.reminderStyle})`
  };
}
