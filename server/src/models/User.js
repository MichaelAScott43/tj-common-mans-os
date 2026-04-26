const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    externalId: { type: String, index: true, unique: true, required: true },
    name: { type: String, default: 'TJ User' },
    email: { type: String },
    timezone: { type: String, default: 'America/New_York' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
