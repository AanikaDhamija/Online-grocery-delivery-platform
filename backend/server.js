// --- MERGED VERSION ---
// Combines all backend features: auth, loyalty, addresses, and payments

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 3001;
const dbPath = path.join(__dirname, 'db.json');

// --- MongoDB Setup ---
const mongoose = require('mongoose');
// Prefer env var, fallback to 127.0.0.1 to avoid IPv6 (::1) resolution issues on Windows
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/grocerydb';
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('[MongoDB] connected'))
  .catch((err) => {
    console.error('[MongoDB] connection error:', err.message);
    // Do not exit; keep server alive to return helpful error responses
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  loyaltyPoints: { type: Number, default: 0 },
  loyaltyTier: { type: String, default: 'Bronze' },
});
const User = mongoose.model('User', userSchema);

// Subscriptions Schema
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
const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Points History Schema (Mongo-backed loyalty)
const pointsHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    reason: { type: String, required: true },
    points: { type: Number, required: true },
  },
  { timestamps: true }
);
const PointsHistory = mongoose.model('PointsHistory', pointsHistorySchema);
// Orders Schema
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
const Order = mongoose.model('Order', orderSchema);

// Address Schema
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
const Address = mongoose.model('Address', addressSchema);

// Middleware
app.use(cors());
app.use(express.json());
// --- Auth middleware ---
const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my-super-secret-key-that-is-long-and-random');
    req.userId = decoded?.user?.id;
    if (!req.userId) return res.status(401).json({ message: 'Invalid token payload' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


// --- Helper Functions ---
const tierForPoints = (points) => {
  if (points >= 1500) return 'Gold';
  if (points >= 500) return 'Silver';
  return 'Bronze';
};


// --- AUTHENTICATION ROUTES (MongoDB) ---
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({
      message: 'User created successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const payload = {
      user: {
        id: user._id,
        name: user.name,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'my-super-secret-key-that-is-long-and-random',
      { expiresIn: '3h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          message: 'Login successful!',
          token: token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            loyaltyTier: user.loyaltyTier
          }
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- ADDRESS API ROUTES (MongoDB) ---
// GET /api/addresses?userId=...
app.get('/api/addresses', auth, async (req, res) => {
  try {
    const { userId: queryUserId } = req.query;
    const effectiveUserId = queryUserId || req.userId;
    if (!effectiveUserId) return res.status(400).json({ message: 'userId is required' });
    const addresses = await Address.find({ userId: effectiveUserId }).sort({ createdAt: -1 });
    res.json(addresses);
  } catch (err) {
    console.error('GET /api/addresses error:', err);
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }
});

// POST /api/addresses
app.post('/api/addresses', auth, async (req, res) => {
  try {
    const payload = req.body || {};
    const userId = payload.userId || req.userId;
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    const created = await Address.create({ ...payload, userId });
    res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/addresses error:', err);
    res.status(500).json({ message: 'Failed to save address' });
  }
});


// --- LOYALTY & ORDER API ROUTES (MongoDB) ---
app.get('/api/loyalty/:userId', auth, async (req, res) => {
  try {
    const { userId: paramUserId } = req.params;
    const effectiveUserId = req.userId || paramUserId;
    const user = await User.findById(effectiveUserId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const history = await PointsHistory.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json({ balance: user.loyaltyPoints || 0, history, tier: user.loyaltyTier || 'Bronze' });
  } catch (err) {
    console.error('GET /api/loyalty/:userId error:', err);
    res.status(500).json({ message: 'Failed to fetch loyalty info' });
  }
});

app.post('/api/orders/create', auth, async (req, res) => {
  try {
    const { userId: bodyUserId, totalAmount = 0, pointsRedeemed = 0 } = req.body || {};
    const effectiveUserId = req.userId || bodyUserId;
    const user = await User.findById(effectiveUserId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Earn 10% of totalAmount (₹100 => 10 points)
    const pointsEarned = Math.floor(Number(totalAmount) * 0.10);
    user.loyaltyPoints = Number(user.loyaltyPoints || 0) + pointsEarned - Number(pointsRedeemed || 0);
    user.loyaltyTier = tierForPoints(user.loyaltyPoints);
    await user.save();

    const ops = [];
    if (pointsEarned > 0) ops.push(PointsHistory.create({ userId: effectiveUserId, reason: 'Order Completion', points: pointsEarned }));
    if (pointsRedeemed > 0) ops.push(PointsHistory.create({ userId: effectiveUserId, reason: 'Redeemed at Checkout', points: -Math.abs(pointsRedeemed) }));
    // persist order document
    ops.push(Order.create({ userId: effectiveUserId, totalAmount: Number(totalAmount), pointsRedeemed: Number(pointsRedeemed || 0), pointsEarned, status: 'PAID' }));
    if (ops.length) await Promise.all(ops);

    return res.status(201).json({
      message: 'Order created and points updated successfully!',
      balance: user.loyaltyPoints,
      tier: user.loyaltyTier,
      pointsEarned
    });
  } catch (err) {
    console.error('POST /api/orders/create error:', err);
    return res.status(500).json({ message: 'Failed to create order' });
  }
});

// --- SUBSCRIPTION ROUTES (MongoDB) ---
// Create or update a user's single active subscription
app.post('/api/subscription', auth, async (req, res) => {
  try {
    const { userId: bodyUserId, plan, startDate, endDate, details } = req.body || {};
    const userId = bodyUserId || req.userId;

    if (!userId || !plan || (!startDate && !endDate)) {
      return res.status(400).json({ message: 'userId, plan and startDate/endDate are required.' });
    }

    // Normalize start date field from payload
    const start = startDate || endDate;

    // Ensure quantities are numbers
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
    console.error('POST /api/subscription error:', err);
    return res.status(500).json({ message: 'Failed to save subscription', error: err.message });
  }
});

// Fetch subscription(s) by userId
app.get('/api/subscription/:userId', auth, async (req, res) => {
  try {
    const { userId: paramUserId } = req.params;
    const userId = req.userId || paramUserId;
    // Return as array for compatibility with UI that expects array
    const subs = await Subscription.find({ userId }).sort({ createdAt: -1 });
    return res.json(subs);
  } catch (err) {
    console.error('GET /api/subscription/:userId error:', err);
    return res.status(500).json({ message: 'Failed to fetch subscription', error: err.message, data: [] });
  }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});