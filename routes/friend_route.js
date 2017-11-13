const express = require('express');
const router = express.Router();
const passport = require('passport');
const friednController = require('../controller/friend_controller/friends');
router.get('/getPeople',passport.authenticate('jwt', { session: false }), friednController.getPeople);
router.post('/sendFriendRequest',passport.authenticate('jwt', { session: false }), friednController.sendFriendRequest);
module.exports = router;

