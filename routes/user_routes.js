const express = require('express');
const router = express.Router();
const passport = require('passport');
const uploadDir='./uploads/';
const usercontroller = require('../controller/account_controller/users');
router.post('/', usercontroller.register);
router.post('/register', usercontroller.register);
router.post('/authenticate', usercontroller.authenticate);
router.get('/profile', passport.authenticate('jwt', { session: false }), usercontroller.profile);
router.get('/getAll',passport.authenticate('jwt', { session: false }), usercontroller.get);
router.get('/getById/:id',passport.authenticate('jwt', { session: false }), usercontroller.getOne);
router.get("/testMail",usercontroller.testMail);
module.exports = router;

