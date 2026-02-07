const router = require('express').Router();
const { list, create, update, remove } = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/', list);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;
