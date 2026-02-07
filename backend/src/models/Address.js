const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    label: String,
    flat: String,
    floor: String,
    area: String,
    landmark: String,
    name: String,
    phone: String,
    pincode: String,
    locality: String,
    city: String,
    state: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);
