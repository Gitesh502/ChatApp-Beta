var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();

var Chat = require('../models/chat_model');
const passport = require('passport');

const chatController = require('../controller/chat_controller/chat');


router.get('/getMessages', passport.authenticate('jwt', {
	session: false,
}), chatController.getMessages);

router.get('/getChatId', passport.authenticate('jwt', {
	session: false
}), chatController.getChatId);

router.get("/getMessengers", passport.authenticate('jwt', {
	session: false
}),chatController.getMessengers);

router.get("/getGroups", passport.authenticate('jwt', {
	session: false
}),chatController.getGroups);






router.post('/save', passport.authenticate('jwt', {
	session: false
}), chatController.save);

router.post('/createGroup', passport.authenticate('jwt', {
	session: false
}), chatController.createGroup);

router.post('/createChat',passport.authenticate('jwt',{
	session:false
}),chatController.createChat)


module.exports = router;
