const express = require('express');
const router = express.Router();
const usercontroller = require('../controller/account_controller/users');

router.get('/', usercontroller.confirmRegistration);

module.exports = router;

