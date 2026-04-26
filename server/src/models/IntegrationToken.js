const mongoose = require('mongoose');

const integrationTokenSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    integration: { type: String, enum: ['alexa', 'stripe'], required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.models.IntegrationToken || mongoose.model('IntegrationToken', integrationTokenSchema);
