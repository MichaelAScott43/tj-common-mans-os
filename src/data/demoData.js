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

export const demoProcurementAlerts = [
  {
    id: 'ALT-001',
    type: 'Margin leakage',
    title: 'Margin leakage detected',
    happened: 'Gross margin on aluminum enclosure assemblies dropped from 21.8% to 15.9% over the last 60 days.',
    drivingIt: 'Supplier unit costs rose across three POs while customer resale prices remained unchanged.',
    financialImpact: '$18,420 estimated monthly margin loss; $221,040 annualized exposure.',
    rootCause: 'Supplier price increases are being accepted without updated customer resale pricing.',
    related: {
      supplier: 'ABC Metals',
      po: 'PO-88421, PO-88502, PO-88617',
      category: 'Machined Components',
      contract: 'MSA-ABC-2025',
      buyer: 'S. Ramirez',
      item: 'Aluminum housing AH-440'
    },
    evidence: [
      'PO cost increased 12.4% from $84.50 to $94.98 per unit.',
      'Customer sell price remained $119.00 for 90 days.',
      'No approved pricing workflow ticket in CPQ for this account.',
      'Margin variance exceeded 4-point threshold for 5 consecutive weeks.'
    ],
    recommendedAction: 'Review customer pricing, renegotiate supplier cost, or flag account for margin recovery.',
    priority: 'Critical',
    owner: 'Category Manager - Metals',
    nextBestAction: 'Open a margin recovery case and schedule joint supplier/customer pricing review within 48 hours.'
  },
  {
    id: 'ALT-002',
    type: 'Supplier delivery risk',
    title: 'Late delivery trend - Nori Industrial',
    happened: 'On-time delivery performance fell to 76% this month versus the 95% SLA.',
    drivingIt: 'Transit delays and repeated incomplete ASN updates on high-volume lanes.',
    financialImpact: '$42,000 potential expedite and line-down costs over next 30 days.',
    rootCause: 'Carrier reallocation and weak supplier shipping discipline during demand ramp.',
    related: { supplier: 'Nori Industrial', po: 'PO-90231', category: 'Fasteners', contract: 'SLA-NORI-2024', buyer: 'M. Chen', item: 'Hex bolt HB-10' },
    evidence: ['8 of last 21 shipments arrived >3 days late.', 'Fill rate dropped from 98% to 89%.', 'Three customer orders at risk of promised-date miss this week.'],
    recommendedAction: 'Activate dual-carrier plan, require daily shipment confirmations, and expedite at supplier expense per SLA.',
    priority: 'High',
    owner: 'Supplier Performance Lead',
    nextBestAction: 'Trigger supplier corrective action request (SCAR) and escalate to logistics manager today.'
  },
  {
    id: 'ALT-003',
    type: 'Supplier quality risk',
    title: 'Defect spike in molded connectors',
    happened: 'Incoming quality reject rate increased to 5.8% from 1.2% baseline.',
    drivingIt: 'Lot-to-lot process variation and insufficient first-article controls.',
    financialImpact: '$27,600 monthly scrap/rework impact plus delayed shipments risk.',
    rootCause: 'Supplier process drift after tooling maintenance without validated PPAP resubmission.',
    related: { supplier: 'Precision PolyWorks', po: 'PO-89344', category: 'Electrical Components', contract: 'QAA-PPW-2025', buyer: 'A. Patel', item: 'Connector C-92' },
    evidence: ['46 defects recorded across last 4 lots.', 'Dimensional failures concentrated on cavity #3.', 'PPAP revision status still marked pending.'],
    recommendedAction: 'Hold new receipts, perform 100% sort on in-transit lots, and require updated PPAP approval.',
    priority: 'High',
    owner: 'SQE Manager',
    nextBestAction: 'Book supplier containment call and deploy receiving inspection escalation immediately.'
  },
  {
    id: 'ALT-004',
    type: 'Price variance',
    title: 'Invoice price variance above tolerance',
    happened: 'Invoices for stainless tubing exceeded PO prices by 6.7% average.',
    drivingIt: 'Unapproved surcharge line items and manual PO edits post-release.',
    financialImpact: '$9,870 overbilled in the last 45 days.',
    rootCause: '3-way match controls are bypassed when buyers approve post-receipt change orders.',
    related: { supplier: 'Summit Tube Co.', po: 'PO-87710, PO-87954', category: 'Raw Materials', contract: 'LTA-STC-2025', buyer: 'K. Johnson', item: 'SS Tube ST-316-20mm' },
    evidence: ['14 invoices over PO unit price tolerance (2%).', 'Surcharge code "FUEL-ADJ" not present in contract terms.', 'Manual overrides by two buyers in ERP logs.'],
    recommendedAction: 'Freeze disputed invoices, enforce tolerance blocks, and retrain buyers on change-order governance.',
    priority: 'Medium',
    owner: 'AP Controls Analyst',
    nextBestAction: 'Launch invoice recovery workflow and recover overbilling credits this week.'
  },
  {
    id: 'ALT-005',
    type: 'Maverick spend',
    title: 'Unapproved supplier spend detected',
    happened: '18% of MRO spend last month was placed with non-contracted vendors.',
    drivingIt: 'Rush purchases bypassing procurement and use of corporate card checkouts.',
    financialImpact: '$63,500 unmanaged spend with 7-11% estimated savings leakage.',
    rootCause: 'Catalog coverage gaps and weak approval routing for urgent requisitions.',
    related: { supplier: 'Multiple (7 non-contracted vendors)', po: 'P-Card / Spot Buys', category: 'MRO', contract: 'No active agreement', buyer: 'Plant Supervisors (various)', item: 'Safety gloves, cutters, adhesives' },
    evidence: ['112 off-contract transactions in 30 days.', 'Top plant site accounted for 61% of off-contract spend.', 'Average unit price 9.3% above contracted benchmark.'],
    recommendedAction: 'Expand approved catalog for urgent SKUs and enforce spend controls for non-contracted vendors.',
    priority: 'High',
    owner: 'Procurement Operations Manager',
    nextBestAction: 'Create rapid-contract wave for top 3 rogue vendors and block new vendor onboarding without sourcing review.'
  },
  {
    id: 'ALT-006',
    type: 'PO aging',
    title: 'Aged open POs accumulating',
    happened: '47 open purchase orders are older than 120 days without receipt or closure.',
    drivingIt: 'Partial deliveries not reconciled and stale demand signals from legacy planning jobs.',
    financialImpact: '$1.2M in committed spend distorting forecast and accrual accuracy.',
    rootCause: 'PO closeout process is manual and exceptions are not assigned clear ownership.',
    related: { supplier: 'Multi-supplier', po: '47 aged POs', category: 'Indirect + Direct Mixed', contract: 'Mixed', buyer: 'Procurement Shared Services', item: 'Multiple items' },
    evidence: ['19 POs show 0 receipts for >150 days.', '28 POs partially received with no close request.', 'No owner assigned in 36% of aged PO records.'],
    recommendedAction: 'Run PO clean-up sprint, auto-assign owners, and close or revise stale commitments.',
    priority: 'Medium',
    owner: 'Procurement Shared Services Lead',
    nextBestAction: 'Start 2-week aged-PO war room and prioritize top value POs >$25k.'
  },
  {
    id: 'ALT-007',
    type: 'Contract leakage',
    title: 'Contract leakage in packaging spend',
    happened: 'Contracted rebate tiers were missed in Q2 due to fragmented supplier allocation.',
    drivingIt: 'Volume split across regional vendors prevented tier attainment with primary supplier.',
    financialImpact: '$54,000 rebate opportunity lost this quarter.',
    rootCause: 'Category strategy not enforced at plant level purchasing.',
    related: { supplier: 'PackRight Global + regional vendors', po: 'Q2 Packaging Blanket POs', category: 'Packaging', contract: 'PACK-LTA-2026', buyer: 'L. Ortiz', item: 'Corrugate and inserts' },
    evidence: ['Primary supplier share dropped to 62% (target 80%).', 'Missed rebate tier by $180k volume.', 'Four plants placing independent spot orders.'],
    recommendedAction: 'Rebalance allocations to contracted supplier and centralize packaging sourcing governance.',
    priority: 'High',
    owner: 'Packaging Category Director',
    nextBestAction: 'Issue allocation directive to plants and lock non-approved packaging suppliers in ERP.'
  },
  {
    id: 'ALT-008',
    type: 'Expiring supplier agreement',
    title: 'Critical agreement expiring in 45 days',
    happened: 'Primary electronics supplier agreement expires on 2026-06-10 with no renewal in legal review.',
    drivingIt: 'Renewal playbook started late and commercial redlines remain unresolved.',
    financialImpact: 'Up to $3.4M annual spend at risk of reverting to list pricing.',
    rootCause: 'No automated renewal trigger tied to contract milestone governance.',
    related: { supplier: 'ElectraCore Components', po: 'PO-Framework EC-2024', category: 'Electronics', contract: 'MSA-EC-2024', buyer: 'R. Gupta', item: 'PCB assemblies' },
    evidence: ['Renewal status = "Draft sent" for 21 days.', 'Legal clause dispute unresolved on liability cap.', 'No backup supplier qualified for 38% of affected SKUs.'],
    recommendedAction: 'Escalate renewal negotiation, secure interim extension, and launch contingency qualification.',
    priority: 'Critical',
    owner: 'Strategic Sourcing Manager - Electronics',
    nextBestAction: 'Book executive supplier negotiation call within 24 hours and finalize stop-gap extension language.'
  },
  {
    id: 'ALT-009',
    type: 'Demand spike',
    title: 'Unexpected demand spike in replacement kits',
    happened: 'Weekly demand for service replacement kits surged 31% above forecast.',
    drivingIt: 'Customer field campaign accelerated maintenance orders in two regions.',
    financialImpact: '$280,000 incremental revenue opportunity at risk if supply not rebalanced.',
    rootCause: 'Forecast inputs from service channel were not integrated into procurement planning cycle.',
    related: { supplier: 'Multi-supplier', po: 'Rolling MRP releases', category: 'Aftermarket Kits', contract: 'Mixed', buyer: 'T. Morgan', item: 'Service kit SK-41' },
    evidence: ['Backlog grew from 4 days to 11 days cover.', 'Region West orders +44% WoW.', 'No planner override entered before MRP run cutoff.'],
    recommendedAction: 'Reforecast with service demand signal and prioritize constrained components for expedited replenishment.',
    priority: 'High',
    owner: 'Demand Planning Manager',
    nextBestAction: 'Trigger cross-functional S&OP huddle and approve temporary safety-stock uplift.'
  },
  {
    id: 'ALT-010',
    type: 'Inventory shortage risk',
    title: 'Inventory shortage risk - motor controllers',
    happened: 'Projected stockout in 12 days for motor controller MC-880 at current consumption.',
    drivingIt: 'Usage increase plus delayed inbound shipment from tier-2 source.',
    financialImpact: '$510,000 revenue exposure from potential production interruption.',
    rootCause: 'Safety stock policy not recalibrated after product mix shifted to MC-880-heavy orders.',
    related: { supplier: 'Kappa Motion', po: 'PO-90772', category: 'Control Electronics', contract: 'LTA-KM-2025', buyer: 'E. Brooks', item: 'Motor controller MC-880' },
    evidence: ['On-hand: 1,420 units; daily demand: 118 units.', 'Next confirmed receipt delayed 9 days.', 'Safety stock target still set to pre-mix baseline (620 units).'],
    recommendedAction: 'Pull in alternate supply, rebalance inventory from low-demand sites, and reset safety stock parameters.',
    priority: 'Critical',
    owner: 'Inventory Control Lead',
    nextBestAction: 'Execute shortage playbook now and secure emergency transfer by end of day.'
  },
  {
    id: 'ALT-011',
    type: 'Single-source dependency',
    title: 'Single-source dependency - high criticality resin',
    happened: '92% of resin R-17 volume depends on one supplier with no approved alternate.',
    drivingIt: 'Qualification of backup source stalled due to limited lab testing capacity.',
    financialImpact: '$6.8M annual production risk if primary supplier disruption occurs.',
    rootCause: 'Supplier risk mitigation milestone missed in last two quarterly reviews.',
    related: { supplier: 'OmniResin Ltd.', po: 'Annual Blanket BR-17', category: 'Specialty Chemicals', contract: 'SUP-OMNI-2025', buyer: 'P. Dawson', item: 'Resin R-17' },
    evidence: ['Alternate supplier qualification 54 days behind plan.', 'No dual-source readiness score in risk dashboard.', 'Critical product family consumption concentrated in one plant.'],
    recommendedAction: 'Accelerate alternate qualification, secure buffer inventory, and formalize disruption response plan.',
    priority: 'High',
    owner: 'Supplier Risk Manager',
    nextBestAction: 'Approve overtime lab testing and complete alternate source PPAP by next steering committee.'
  },
  {
    id: 'ALT-012',
    type: 'Quote-to-award delay',
    title: 'RFQ cycle slipping beyond target',
    happened: 'Average quote-to-award cycle for machining RFQs reached 47 days vs 28-day target.',
    drivingIt: 'Slow technical evaluations and fragmented stakeholder approvals.',
    financialImpact: '$140,000 opportunity cost from delayed cost-down projects.',
    rootCause: 'Sourcing workflow lacks deadline ownership and automated escalation.',
    related: { supplier: 'Multiple bidders', po: 'Pre-award stage', category: 'Machining Services', contract: 'New award pending', buyer: 'C. Nguyen', item: 'Bracket family B-200 series' },
    evidence: ['9 active RFQs older than 40 days.', 'Engineering response time average: 11.5 days.', 'No escalation sent for 6 expired approval tasks.'],
    recommendedAction: 'Set stage-level SLA timers, assign accountable approvers, and automate escalation reminders.',
    priority: 'Medium',
    owner: 'Strategic Sourcing PMO',
    nextBestAction: 'Run expedited award workshop and close top 3 aged RFQs this week.'
  }
];
