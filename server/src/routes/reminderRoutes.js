const express = require('express');
const Reminder = require('../models/Reminder');
const { extractReminder } = require('../services/nlpService');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const reminders = await Reminder.find().sort({ dueAt: 1, createdAt: -1 }).limit(100);
    res.json({ reminders });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { text, dueAt, source } = req.body || {};
    const parsed = extractReminder(text);
    const reminder = await Reminder.create({
      text: parsed?.normalizedText || text,
      dueAt: dueAt || null,
      source: source || 'manual'
    });
    res.status(201).json({ reminder, parsed });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
