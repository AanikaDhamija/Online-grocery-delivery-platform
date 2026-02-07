const router = require('express').Router();
const auth = require('../middleware/auth');
const { getLoyalty, createOrder } = require('../controllers/loyaltyController');

router.get('/:userId', auth, getLoyalty);
router.post('/order', auth, createOrder);

module.exports = router;
