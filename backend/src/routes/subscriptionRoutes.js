const router = require('express').Router();
const auth = require('../middleware/auth');
const { createOrUpdate, listByUser } = require('../controllers/subscriptionController');

router.post('/', auth, createOrUpdate);
router.get('/:userId', auth, listByUser);

module.exports = router;
