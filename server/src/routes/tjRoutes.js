const express = require('express');
const store = require('../store/tjStore');
const { parseIntent } = require('../services/tjIntentService');
const { routeIntent } = require('../services/tjActionRouter');
const { getOrCreatePreferences, savePreferences } = require('../services/tjPreferenceService');

const router = express.Router();

function userIdFromReq(req) {
  return req.headers['x-user-id'] || req.body.userId || req.query.userId || 'demo-user';
}

router.post('/command', async (req, res, next) => {
  try {
    const commandText = String(req.body.commandText || '').trim();
    if (!commandText) return res.status(400).json({ error: 'commandText is required' });

    const userId = userIdFromReq(req);
    const preference = await getOrCreatePreferences(userId);
    const parsed = await parseIntent(commandText);
    const routed = await routeIntent({ userId, source: req.body.source || 'mobile', commandText, parsedIntent: parsed, preference });

    return res.status(201).json({
      ...parsed,
      ...routed,
      safety: 'TJ will never spend money, send messages, or book anything without explicit confirmation.',
      demoLinks: parsed.intent === 'food_order_prep' ? [{ label: "Open Domino's", url: 'https://www.dominos.com' }] : []
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await store.listTasks(userIdFromReq(req), req.query.status);
    return res.json({ tasks });
  } catch (error) {
    return next(error);
  }
});

router.post('/tasks', async (req, res, next) => {
  try {
    const userId = userIdFromReq(req);
    const { title, description = '', intent = 'unknown', dueDate = null, vendor = '', extractedFields = {} } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const task = await store.createTask({
      userId,
      title,
      description,
      intent,
      status: 'pending',
      dueDate,
      vendor,
      extractedFields,
      source: 'web',
      requiresConfirmation: true
    });
    return res.status(201).json({ task });
  } catch (error) {
    return next(error);
  }
});

router.get('/tasks/:id', async (req, res, next) => {
  try {
    const task = await store.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.json({ task });
  } catch (error) {
    return next(error);
  }
});

router.post('/tasks/:id/confirm', async (req, res, next) => {
  try {
    const task = await store.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const updated = await store.updateTask(req.params.id, {
      status: 'confirmed',
      confirmedAt: new Date().toISOString()
    });

    return res.json({
      task: updated,
      safety: 'Confirmed. Action remains simulated in MVP mode and does not trigger real-world transactions.'
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/tasks/:id/cancel', async (req, res, next) => {
  try {
    const task = await store.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const updated = await store.updateTask(req.params.id, {
      status: 'canceled',
      canceledAt: new Date().toISOString()
    });

    return res.json({ task: updated });
  } catch (error) {
    return next(error);
  }
});


router.post('/alexa', async (req, res, next) => {
  try {
    const commandText = req.body.commandText || req.body?.request?.intent?.slots?.command?.value;
    if (!commandText) {
      return res.status(400).json({ speechText: 'Say that again for me, please.', shouldEndSession: false });
    }
    const userId = userIdFromReq(req);
    const preference = await getOrCreatePreferences(userId);
    const parsed = await parseIntent(commandText);
    const routed = await routeIntent({ userId, source: 'alexa', commandText, parsedIntent: parsed, preference });
    return res.json({
      ...routed,
      speechText: `${routed.responseForUser} ${routed.needsConfirmation ? 'Say confirm or cancel.' : 'What else should I handle?'}`,
      shouldEndSession: false
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/preferences', async (req, res, next) => {
  try {
    const preference = await getOrCreatePreferences(userIdFromReq(req));
    return res.json({ preference });
  } catch (error) {
    return next(error);
  }
});

router.post('/preferences', async (req, res, next) => {
  try {
    const preference = await savePreferences(userIdFromReq(req), req.body);
    return res.status(201).json({ preference });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
