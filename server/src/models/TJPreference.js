const mongoose = require('mongoose');

const tjPreferenceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    favoriteFoodOrder: { type: String, default: '' },
    preferredPizzaVendor: { type: String, default: '' },
    favoriteGroceryItems: { type: [String], default: [] },
    importantContacts: { type: [String], default: [] },
    defaultReminderTime: { type: String, default: '18:00' },
    tonePreference: { type: String, default: 'southern-sarcastic-warm' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.TJPreference || mongoose.model('TJPreference', tjPreferenceSchema);
