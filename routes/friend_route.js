const express = require('express');
const router = express.Router();
const passport = require('passport');

const friednController = require('../controller/friend_controller/friends');


router.get('/getPeople',passport.authenticate('jwt', { session: false }), friednController.getPeople);
router.get('/getReceivedFriendRequests',passport.authenticate('jwt',{session:false}),friednController.getReceivedFriendRequests);
router.post('/sendFriendRequest',passport.authenticate('jwt', { session: false }), friednController.sendFriendRequest);
router.post('/confirmRequest',passport.authenticate('jwt', { session: false }), friednController.confirmRequest);
router.post('/deleteRequest',passport.authenticate('jwt', { session: false }), friednController.deleteRequest);

module.exports = router;
