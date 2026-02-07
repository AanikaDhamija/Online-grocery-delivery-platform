const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, required: true },
    pointsRedeemed: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    status: { type: String, default: 'PAID' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
