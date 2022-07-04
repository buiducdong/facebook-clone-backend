const router = require('express').Router();
const ConversationCtl = require('../controllers/ConversationCtrl');
const auth = require('../middleware/auth');

router.post('/', auth, ConversationCtl.create);
router.get('/', auth, ConversationCtl.getConversation);
router.get('/:id', auth, ConversationCtl.getSingleConversation);
module.exports = router;
