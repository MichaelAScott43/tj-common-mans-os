const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    character: { type: String, enum: ['TJ', 'Arlane'], default: 'TJ' },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    text: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
