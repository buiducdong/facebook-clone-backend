const storyCtrl = require('../controllers/storyCtrl');
const router = require('express').Router();
const auth = require('../middleware/auth');

router.post('/create', storyCtrl.createStory);
router.get('/getStories', storyCtrl.getAllStory);

module.exports = router;
