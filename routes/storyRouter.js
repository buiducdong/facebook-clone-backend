const storyCtrl = require('../controllers/storyCtrl');
const router = require('express').Router();

router.post('/creat', storyCtrl.createStory);
router.post('/', storyCtrl.getAllStory);

module.exports = router;
