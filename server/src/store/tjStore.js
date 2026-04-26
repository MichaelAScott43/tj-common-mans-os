const { randomUUID } = require('crypto');
const { isDatabaseConnected } = require('../db');
const TJPreference = require('../models/TJPreference');
const TJTask = require('../models/TJTask');

const memory = {
  preferences: new Map(),
  tasks: []
};

function toObject(doc) {
  if (!doc) return null;
  if (typeof doc.toObject === 'function') {
    const data = doc.toObject();
    data.id = String(data._id);
    return data;
  }
  return doc;
}

async function getPreferences(userId) {
  if (isDatabaseConnected()) {
    return toObject(await TJPreference.findOne({ userId }));
  }
  return memory.preferences.get(userId) || null;
}

async function upsertPreferences(userId, patch) {
  if (isDatabaseConnected()) {
    return toObject(
      await TJPreference.findOneAndUpdate(
        { userId },
        { $set: { ...patch, userId } },
        { new: true, upsert: true }
      )
    );
  }

  const next = {
    id: memory.preferences.get(userId)?.id || randomUUID(),
    userId,
    favoriteFoodOrder: '',
    preferredPizzaVendor: '',
    favoriteGroceryItems: [],
    importantContacts: [],
    defaultReminderTime: '18:00',
    tonePreference: 'southern-sarcastic-warm',
    ...memory.preferences.get(userId),
    ...patch,
    updatedAt: new Date().toISOString()
  };

  memory.preferences.set(userId, next);
  return next;
}

async function createTask(task) {
  if (isDatabaseConnected()) {
    return toObject(await TJTask.create(task));
  }
  const record = {
    id: randomUUID(),
    ...task,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  memory.tasks.unshift(record);
  return record;
}

async function listTasks(userId, status) {
  if (isDatabaseConnected()) {
    const query = { userId };
    if (status) query.status = status;
    const tasks = await TJTask.find(query).sort({ createdAt: -1 }).limit(200);
    return tasks.map(toObject);
  }
  return memory.tasks.filter((task) => task.userId === userId && (!status || task.status === status));
}

async function getTaskById(id) {
  if (isDatabaseConnected()) {
    return toObject(await TJTask.findById(id));
  }
  return memory.tasks.find((task) => task.id === id) || null;
}

async function updateTask(id, patch) {
  if (isDatabaseConnected()) {
    return toObject(await TJTask.findByIdAndUpdate(id, { $set: patch }, { new: true }));
  }
  const idx = memory.tasks.findIndex((task) => task.id === id);
  if (idx < 0) return null;
  memory.tasks[idx] = { ...memory.tasks[idx], ...patch, updatedAt: new Date().toISOString() };
  return memory.tasks[idx];
}

module.exports = {
  getPreferences,
  upsertPreferences,
  createTask,
  listTasks,
  getTaskById,
  updateTask
};
