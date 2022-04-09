const router = require('express').Router();
const CommentRouter = require('../controllers/CommentCtrl');

router.post('/create', CommentRouter.create);
router.get('/getComment/:postId', CommentRouter.getComments);

module.exports = router;
