const Subscription = require('../models/Subscription');

exports.createOrUpdate = async (req, res) => {
  try {
    const { userId: bodyUserId, plan, startDate, endDate, details } = req.body || {};
    const userId = bodyUserId || req.userId;
    if (!userId || !plan || (!startDate && !endDate)) {
      return res.status(400).json({ message: 'userId, plan and startDate/endDate are required.' });
    }
    const start = startDate || endDate;
    const normalizedDetails = {
      items: (details?.items || []).map((it) => ({
        id: it.id,
        name: it.name,
        price: Number(it.price || 0),
        quantity: Number(it.quantity || it.qty || 0),
        image: it.image,
      })),
    };
    const result = await Subscription.findOneAndUpdate(
      { userId },
      { userId, plan, startDate: new Date(start), details: normalizedDetails },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(201).json({ message: 'Subscription saved', subscription: result });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to save subscription', error: err.message });
  }
};

exports.listByUser = async (req, res) => {
  try {
    const userId = req.userId || req.params.userId;
    const subs = await Subscription.find({ userId }).sort({ createdAt: -1 });
    return res.json(subs);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch subscription', error: err.message, data: [] });
  }
};
