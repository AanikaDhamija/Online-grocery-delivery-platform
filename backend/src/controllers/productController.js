const Product = require('../models/Product');

async function list(req, res) {
  try {
    const { search = '', category, stock } = req.query;
    const q = {};
    if (search) {
      q.$or = [
        { name: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category !== 'all') {
      q.category = category;
    }
    if (stock && stock !== 'all') {
      if (stock === 'low') q.stock = { $gt: 0, $lt: 10 };
      if (stock === 'out') q.stock = 0;
    }
    const products = await Product.find(q).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
}

async function create(req, res) {
  try {
    const body = req.body || {};
    const doc = await Product.create(body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create product', error: err.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const doc = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Product not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update product', error: err.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const doc = await Product.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete product', error: err.message });
  }
}

module.exports = { list, create, update, remove };
