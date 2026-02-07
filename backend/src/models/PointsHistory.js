const mongoose = require('mongoose');

const pointsHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    reason: { type: String, required: true },
    points: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PointsHistory', pointsHistorySchema);
