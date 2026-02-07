const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
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
