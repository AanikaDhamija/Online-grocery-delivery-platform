const Address = require('../models/Address');

exports.list = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId;
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
    return res.json(addresses);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch addresses' });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = req.body || {};
    const userId = payload.userId || req.userId;
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    const created = await Address.create({ ...payload, userId });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to save address' });
  }
};
