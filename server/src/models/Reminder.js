const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    dueAt: { type: Date },
    status: { type: String, enum: ['pending', 'done'], default: 'pending' },
    source: { type: String, default: 'manual' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);
