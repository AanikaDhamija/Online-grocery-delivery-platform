const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User with this email already exists.' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    return res.status(201).json({ message: 'User created successfully!', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials.' });
    const payload = { user: { id: user._id, name: user.name } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'my-super-secret-key-that-is-long-and-random', { expiresIn: '3h' });
    return res.status(200).json({ message: 'Login successful!', token, user: { id: user._id, name: user.name, email: user.email, loyaltyTier: user.loyaltyTier } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
