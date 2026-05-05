const express = require('express');
const {
  rooms,
  flaggedMessages,
  getRoomMessages,
  reportMessage,
  removeMessage,
  banSession
} = require('../controllers/communityController');

const router = express.Router();

router.get('/', (_, res) => res.json({ title: 'Steady Community', subtitle: 'A place to talk without judgment.', rooms }));
router.get('/room/:roomName', (req, res) => res.json({ room: req.params.roomName, messages: getRoomMessages(req.params.roomName) }));
router.post('/report', (req, res) => {
  const { messageId, reason } = req.body || {};
  if (!messageId || !reason) {
    return res.status(400).json({ error: 'messageId and reason are required.' });
  }
  const report = reportMessage(messageId, reason);
  return res.status(201).json({ report, status: 'flagged_for_review' });
});

router.get('/admin/flagged', (_, res) => res.json({ flaggedMessages }));
router.delete('/admin/message/:messageId', (req, res) => {
  removeMessage(req.params.messageId);
  return res.json({ removed: true });
});
router.post('/admin/ban/:sessionId', (req, res) => {
  banSession(req.params.sessionId);
  return res.json({ banned: true });
});

module.exports = router;
