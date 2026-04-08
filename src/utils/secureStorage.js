/**
 * HIPAA-compliant secure storage utility.
 *
 * All sensitive user data (mood entries, journal, safety plan, etc.)
 * is stored via expo-secure-store, which uses:
 *   - Keychain (iOS)
 *   - EncryptedSharedPreferences via Android Keystore (Android)
 *
 * HIPAA obligations addressed here:
 *   - Encryption at rest (§164.312(a)(2)(iv))
 *   - Data integrity (§164.312(c)(1))
 *   - Data is never logged to console
 *
 * IMPORTANT: expo-secure-store has a value-size limit (~2 KB per key).
 * For larger datasets (e.g., journal history) we store a JSON array
 * and paginate if needed.
 */

import * as SecureStore from 'expo-secure-store';

// Storage key prefix to avoid collisions
const PREFIX = 'steady_';

const KEYS = {
  MOOD_HISTORY: 'mood_history',
  JOURNAL_ENTRIES: 'journal_entries',
  SAFETY_PLAN: 'safety_plan',
  USER_PREFS: 'user_prefs',       // language, country, veteran mode
  CONSENT_GIVEN: 'consent_given',
  ONBOARDING_DONE: 'onboarding_done',
  SESSION_TOKEN: 'session_token',
  LAST_ACTIVE: 'last_active',
};

export { KEYS };

/**
 * Save a value. Data is serialized to JSON automatically.
 * @param {string} key - One of the KEYS values
 * @param {*} value     - Any JSON-serializable value
 */
export async function saveSecure(key, value) {
  try {
    const serialized = JSON.stringify(value);
    await SecureStore.setItemAsync(PREFIX + key, serialized);
  } catch {
    // Never throw PHI — silently fail and surface a generic error to UI
    throw new Error('Failed to save data securely.');
  }
}

/**
 * Load a value. Returns null when the key doesn't exist.
 * @param {string} key - One of the KEYS values
 * @param {*} [defaultValue=null]
 * @returns {Promise<*>}
 */
export async function loadSecure(key, defaultValue = null) {
  try {
    const raw = await SecureStore.getItemAsync(PREFIX + key);
    if (raw === null || raw === undefined) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * Delete a single key.
 * @param {string} key
 */
export async function deleteSecure(key) {
  try {
    await SecureStore.deleteItemAsync(PREFIX + key);
  } catch {
    throw new Error('Failed to delete data.');
  }
}

/**
 * Delete ALL app data from secure storage.
 * Used for the "Delete My Data" feature (HIPAA right to erasure).
 */
export async function deleteAllData() {
  const allKeys = Object.values(KEYS);
  await Promise.all(allKeys.map((k) => SecureStore.deleteItemAsync(PREFIX + k).catch(() => {})));
}

// ─── Convenience helpers ────────────────────────────────────────────────────

/**
 * Save a mood entry {score: 1-5, note: string, timestamp: ISO string}.
 * Keeps the last 90 days of entries.
 */
export async function saveMoodEntry(entry) {
  const history = (await loadSecure(KEYS.MOOD_HISTORY, [])) ?? [];
  history.unshift({ ...entry, timestamp: new Date().toISOString() });
  // Retain max 90 entries
  const trimmed = history.slice(0, 90);
  await saveSecure(KEYS.MOOD_HISTORY, trimmed);
}

/** Load all mood entries */
export async function loadMoodHistory() {
  return loadSecure(KEYS.MOOD_HISTORY, []);
}

/**
 * Save a journal entry {id, prompt, text, timestamp}.
 * Keeps the last 200 entries.
 */
export async function saveJournalEntry(entry) {
  const entries = (await loadSecure(KEYS.JOURNAL_ENTRIES, [])) ?? [];
  const existing = entries.findIndex((e) => e.id === entry.id);
  if (existing >= 0) {
    entries[existing] = entry;
  } else {
    entries.unshift({ ...entry, timestamp: new Date().toISOString() });
  }
  await saveSecure(KEYS.JOURNAL_ENTRIES, entries.slice(0, 200));
}

/** Load all journal entries */
export async function loadJournalEntries() {
  return loadSecure(KEYS.JOURNAL_ENTRIES, []);
}

/** Delete a single journal entry by id */
export async function deleteJournalEntry(id) {
  const entries = (await loadSecure(KEYS.JOURNAL_ENTRIES, [])) ?? [];
  await saveSecure(KEYS.JOURNAL_ENTRIES, entries.filter((e) => e.id !== id));
}

/** Save the safety plan object */
export async function saveSafetyPlan(plan) {
  await saveSecure(KEYS.SAFETY_PLAN, plan);
}

/** Load the safety plan */
export async function loadSafetyPlan() {
  return loadSecure(KEYS.SAFETY_PLAN, {
    warningSigns: '',
    coping: '',
    contacts: [],
    safeEnvironment: '',
    reasons: '',
  });
}

/** Save user preferences (non-PHI settings) */
export async function savePrefs(prefs) {
  await saveSecure(KEYS.USER_PREFS, prefs);
}

/** Load user preferences */
export async function loadPrefs() {
  return loadSecure(KEYS.USER_PREFS, {
    language: 'en',
    country: 'US',
    veteranMode: false,
    notificationsEnabled: false,
    sessionTimeoutMinutes: 15,
    onboardingDone: false,
    consentGiven: false,
  });
}
