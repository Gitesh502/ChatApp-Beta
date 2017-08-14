const express = require('express');
const router = express.Router();
const passport = require('passport');
const imageController=require('../controller/image_controller/images');

router.post("/uploadProfileImage",passport.authenticate('jwt', { session: false }),imageController.saveProfileImage);

module.exports=router;