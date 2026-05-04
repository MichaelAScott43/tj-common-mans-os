const express = require('express');
const Conversation = require('../models/Conversation');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const messages = await Conversation.find().sort({ createdAt: -1 }).limit(100);
    res.json({ messages: messages.reverse() });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { role, text, character } = req.body;
    const message = await Conversation.create({ role, text, character });
    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
