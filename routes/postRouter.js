const router = require('express').Router();
const PostCtrl = require('../controllers/postCtrl');
const auth = require('../middleware/auth');

router.post('/create', auth, PostCtrl.create);
router.get('/getPost', PostCtrl.getAllPost);
router.get('/getUserPost/:userId', PostCtrl.getUserPost);
router.put('/:id/handleLike', PostCtrl.handleLikePost);
router.delete('/delete/:postId', auth, PostCtrl.deletePost);

module.exports = router;
