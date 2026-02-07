const User = require('../models/User');
const PointsHistory = require('../models/PointsHistory');
const Order = require('../models/Order');

const tierForPoints = (points) => {
  if (points >= 1500) return 'Gold';
  if (points >= 500) return 'Silver';
  return 'Bronze';
};

exports.getLoyalty = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const history = await PointsHistory.find({ userId: user._id }).sort({ createdAt: -1 });
    return res.json({ balance: user.loyaltyPoints || 0, history, tier: user.loyaltyTier || 'Bronze' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch loyalty info' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { userId: bodyUserId, totalAmount = 0, pointsRedeemed = 0 } = req.body || {};
    const userId = req.userId || bodyUserId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Earn 10% of order amount as loyalty points (₹100 -> 10 pts)
    const pointsEarned = Math.floor(Number(totalAmount) * 0.10);
    user.loyaltyPoints = Number(user.loyaltyPoints || 0) + pointsEarned - Number(pointsRedeemed || 0);
    user.loyaltyTier = tierForPoints(user.loyaltyPoints);
    await user.save();

    const ops = [];
    if (pointsEarned > 0) ops.push(PointsHistory.create({ userId, reason: 'Order Completion', points: pointsEarned }));
    if (pointsRedeemed > 0) ops.push(PointsHistory.create({ userId, reason: 'Redeemed at Checkout', points: -Math.abs(pointsRedeemed) }));
    // Persist order record as well
    ops.push(Order.create({ userId, totalAmount: Number(totalAmount), pointsRedeemed: Number(pointsRedeemed || 0), pointsEarned, status: 'PAID' }));
    if (ops.length) await Promise.all(ops);

    return res.status(201).json({ 
      message: 'Order created and points updated successfully!',
      balance: user.loyaltyPoints,
      tier: user.loyaltyTier,
      pointsEarned
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create order' });
  }
};
