const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  loyaltyPoints: { type: Number, default: 0 },
  loyaltyTier: { type: String, default: 'Bronze' },
});

module.exports = mongoose.model('User', userSchema);
