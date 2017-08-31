const express = require('express');
const router = express.Router();
const passport = require('passport');
const imageController=require('../controller/image_controller/images');
router.post("/uploadProfileImage",passport.authenticate('jwt', { session: false }),imageController.saveProfileImage);
router.post("/uploadCoverImage",passport.authenticate('jwt', { session: false }),imageController.saveCoverImage);
module.exports=router;