const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');

router.post('/register', userCtrl.register);
router.post('/activation', userCtrl.activateEmail);
router.post('/login', userCtrl.login);
router.post('/refresh_token', userCtrl.getAccessToken);
router.post('/forgot_password', userCtrl.forgotPassword);
router.post('/reset_password', auth, userCtrl.resetPassword);
router.get('/get_auth_info', auth, userCtrl.getAuthInfo);
router.get('/get_user_info', userCtrl.getUserInfo);
router.get('/get_friends', userCtrl.getFriends);
router.put('/:userId/follow', userCtrl.follow);
router.put('/:userId/unfollow', userCtrl.unfollow);
router.post('/logout', userCtrl.logout);

module.exports = router;
