const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['Weekly', 'Monthly'], required: true },
    startDate: { type: Date, required: true },
    details: {
      items: [
        {
          id: { type: String },
          name: { type: String },
          price: { type: Number, default: 0 },
          quantity: { type: Number, default: 0 },
          image: { type: String },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
