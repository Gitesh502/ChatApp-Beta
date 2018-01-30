const express = require('express');
const router = express.Router();
const passport = require('passport');

const notificationController = require('../controller/notifications/notifications');

router.get('/getFCount',passport.authenticate('jwt', { session: false }), notificationController.getFCount);
router.get('/getGCount',passport.authenticate('jwt', { session: false }), notificationController.getGCount);
router.post('/save',passport.authenticate('jwt', { session: false }), notificationController.save);
router.post('/update',passport.authenticate('jwt', { session: false }), notificationController.update);

module.exports = router;
