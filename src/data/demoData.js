export const demoUser = {
  name: 'Jordan',
  mode: 'personal',
  onboarding: {
    manages: ['work', 'family', 'money', 'health', 'opportunities'],
    slips: 'Following up after important conversations and bill deadlines.',
    reminderIntensity: 'Medium',
    steadyTone: 'calm'
  }
};

export const demoTasks = [
  { id: 1, title: 'Pay electricity bill', notes: 'Due this evening', category: 'money', dueDate: '2026-04-24', recurring: 'monthly', priority: 'high', status: 'open', reminderType: 'push', contact: 'Utility Portal', followUp: false },
  { id: 2, title: 'Call mom about doctor visit', notes: 'Check recovery and next appointment', category: 'family', dueDate: '2026-04-24', recurring: 'none', priority: 'high', status: 'open', reminderType: 'sms', contact: 'Mom', followUp: true },
  { id: 3, title: 'Send proposal follow-up email', notes: 'Client: Maple Interiors', category: 'work', dueDate: '2026-04-25', recurring: 'none', priority: 'medium', status: 'in_progress', reminderType: 'email', contact: 'Maya (Maple Interiors)', followUp: true }
];

export const demoOpportunities = [
  { id: 1, name: 'Freelance analytics retainer', type: 'side_hustle', status: 'active', nextAction: 'Schedule discovery call', dueDate: '2026-04-27', potentialValue: '$1,200/mo', notes: 'Warm intro from Alex.', contact: 'Alex D.', aiRecommendation: 'Lead with a 30-day pilot offer and clear ROI metrics.' },
  { id: 2, name: 'Family vacation savings challenge', type: 'family_goal', status: 'planning', nextAction: 'Set automatic weekly transfer', dueDate: '2026-04-30', potentialValue: '$2,000 target', notes: 'Tie to no-spend weekends.', contact: 'Household', aiRecommendation: 'Gamify weekly progress and celebrate milestones.' }
];

export const demoNotes = [
  { id: 1, text: 'Networking lunch with Priya next week. Mention product dashboard concept.', tags: ['networking', 'product'], linkedTaskIds: [3], linkedOpportunityIds: [1], aiSummary: 'Important networking touchpoint tied to freelancing pipeline.', aiActions: ['Prepare a 2-minute pitch', 'Send calendar invite by tonight'] },
  { id: 2, text: 'Kid’s school trip fee due soon. Need checklist for Friday morning.', tags: ['family', 'logistics'], linkedTaskIds: [1, 2], linkedOpportunityIds: [], aiSummary: 'Family logistics item with deadline risk.', aiActions: ['Create morning checklist note', 'Set reminder for Thursday evening'] }
];

export const demoSocialFollowUps = [
  { id: 1, name: 'Jordan Lee', platform: 'Facebook Group', lastInteraction: '2026-04-19', nextFollowUp: '2026-04-26', notes: 'Shared helpful referral in local founders group.', opportunityLinked: 'Freelance analytics retainer', aiSuggestedMessage: 'Hey Jordan, appreciated your referral—want to grab 15 minutes this week?' }
];

export const demoIntegrations = [
  { id: 'gmail', label: 'Gmail Personal', connected: true, mode: 'personal', metadataOnly: true },
  { id: 'outlook_personal', label: 'Outlook Personal', connected: false, mode: 'personal', metadataOnly: true },
  { id: 'google_calendar', label: 'Google Calendar', connected: true, mode: 'personal', metadataOnly: true },
  { id: 'microsoft_calendar', label: 'Microsoft Calendar', connected: false, mode: 'work', metadataOnly: true },
  { id: 'teams', label: 'Microsoft Teams (Work)', connected: false, mode: 'work', metadataOnly: true },
  { id: 'office_addin', label: 'Outlook/Office Add-in (Work)', connected: false, mode: 'work', metadataOnly: true }
];

export const demoDailyBriefing = {
  summary: 'You have three high-impact moves today: secure your household essentials, close one revenue opportunity, and protect energy with shorter focus blocks.',
  top3Priorities: ['Pay electricity bill before 6 PM', 'Send proposal follow-up to Maple Interiors', 'Call mom and confirm next care step'],
  risks: ['Bill deadline could incur late fee', 'Missed follow-up may cool warm lead'],
  suggestedFollowUps: ['Ping Alex after proposal follow-up', 'Send school trip checklist to family chat'],
  missedOpportunities: ['No outreach logged to two dormant contacts this week'],
  doThisNext: 'Spend 12 focused minutes sending the proposal follow-up now.'
};
