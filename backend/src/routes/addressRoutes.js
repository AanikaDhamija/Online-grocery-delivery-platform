const router = require('express').Router();
const auth = require('../middleware/auth');
const { list, create } = require('../controllers/addressController');

router.get('/', auth, list);
router.post('/', auth, create);

module.exports = router;
