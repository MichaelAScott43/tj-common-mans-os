const { analyzeMessage } = require('../services/moderationService');

const rooms = ['Vent', 'Need Advice', 'Looking for Friends', 'Career Help', 'Mental Reset'];
const reports = [];
const flaggedMessages = [];
const messages = new Map();
const moderationByUser = new Map();

const FIVE_MINUTES = 5 * 60 * 1000;

function getUserState(sessionId) {
  if (!moderationByUser.has(sessionId)) {
    moderationByUser.set(sessionId, { offenses: 0, mutedUntil: 0, banned: false });
  }
  return moderationByUser.get(sessionId);
}

function evaluateSafety(sessionId, message) {
  const state = getUserState(sessionId);
  const now = Date.now();

  if (state.banned) {
    return { blocked: true, action: 'banned', message: 'Your session is banned from this community.' };
  }
  if (state.mutedUntil > now) {
    return { blocked: true, action: 'muted', mutedUntil: state.mutedUntil, message: 'You are temporarily muted.' };
  }

  const analysis = analyzeMessage(message);
  if (!analysis.blocked) {
    return { blocked: false, toxic: false, warningIssued: false };
  }

  state.offenses += 1;
  if (state.offenses === 1) {
    return {
      blocked: true,
      toxic: true,
      warningIssued: true,
      action: 'warning',
      message: 'This message violates community standards. Please rephrase.'
    };
  }

  if (state.offenses === 2) {
    state.mutedUntil = now + FIVE_MINUTES;
    return {
      blocked: true,
      toxic: true,
      warningIssued: true,
      action: 'muted',
      mutedUntil: state.mutedUntil,
      message: 'This message violates community standards. You are muted for 5 minutes.'
    };
  }

  state.banned = true;
  return {
    blocked: true,
    toxic: true,
    warningIssued: true,
    action: 'banned',
    message: 'This message violates community standards. Your session is now banned.'
  };
}

function addMessage(payload) {
  const list = messages.get(payload.room) || [];
  list.push(payload);
  messages.set(payload.room, list.slice(-200));
}

function getRoomMessages(room) {
  return messages.get(room) || [];
}

function reportMessage(messageId, reason) {
  const item = { messageId, reason, timestamp: new Date().toISOString() };
  reports.push(item);
  flaggedMessages.push(item);
  return item;
}

function removeMessage(messageId) {
  for (const [room, roomMessages] of messages.entries()) {
    messages.set(room, roomMessages.filter((m) => m.id !== messageId));
  }
}

function banSession(sessionId) {
  const state = getUserState(sessionId);
  state.banned = true;
}

module.exports = {
  rooms,
  reports,
  flaggedMessages,
  evaluateSafety,
  addMessage,
  getRoomMessages,
  reportMessage,
  removeMessage,
  banSession
};
