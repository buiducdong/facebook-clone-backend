const messageCtrl = require('../controllers/messageCtrl');
const router = require('express').Router();
const auth = require('../middleware/auth');
router.get('/:id', auth, messageCtrl.getMessage);
router.post('/', messageCtrl.createMessage);

module.exports = router;
