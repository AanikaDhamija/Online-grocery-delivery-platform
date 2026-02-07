const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    unit: { type: String },
    category: { type: String, index: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    supplier: { type: String },
    status: { type: String, default: 'Active' },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
