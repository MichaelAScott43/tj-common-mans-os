const store = require('../store/tjStore');

async function getOrCreatePreferences(userId) {
  return (await store.getPreferences(userId)) || store.upsertPreferences(userId, {});
}

async function savePreferences(userId, payload) {
  return store.upsertPreferences(userId, payload || {});
}

module.exports = { getOrCreatePreferences, savePreferences };
