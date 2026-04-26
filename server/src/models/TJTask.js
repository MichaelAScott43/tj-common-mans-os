const mongoose = require('mongoose');

const tjTaskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    intent: {
      type: String,
      enum: ['conversation', 'reminder', 'calendar_event', 'food_order_prep', 'message_draft', 'shopping_reorder', 'errand_task', 'unknown'],
      default: 'unknown'
    },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'canceled'], default: 'pending' },
    dueDate: { type: Date, default: null },
    vendor: { type: String, default: '' },
    extractedFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    source: { type: String, enum: ['mobile', 'alexa', 'web'], default: 'mobile' },
    requiresConfirmation: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.TJTask || mongoose.model('TJTask', tjTaskSchema);
