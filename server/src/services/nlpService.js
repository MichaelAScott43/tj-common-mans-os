function extractReminder(input) {
  const text = (input || '').trim();
  if (!text) return null;

  const lower = text.toLowerCase();
  const hasReminderIntent = ['remind', 'appointment', 'schedule', 'meeting', 'task'].some((k) =>
    lower.includes(k)
  );

  const atMatch = text.match(/(?:at|on)\s+(\d{1,2}(:\d{2})?\s?(am|pm)?|tomorrow|next\s+\w+)/i);
  return {
    isReminder: hasReminderIntent,
    extractedTimeHint: atMatch ? atMatch[1] : null,
    normalizedText: text.replace(/^remind me to\s+/i, '').trim()
  };
}

module.exports = { extractReminder };
