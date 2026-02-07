const router = require('express').Router();
const auth = require('../middleware/auth');
const { createOrder } = require('../controllers/loyaltyController');

// Backward-compatible orders endpoint
router.post('/create', auth, createOrder);

module.exports = router;
