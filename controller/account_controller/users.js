const jwt=require('jsonwebtoken');

const accountService = require('../../services/account_service');
const User = require('../../models/user_model');
const config = require('../../config/config');

exports.register = function (req, res) {
    let newuser = new User({
        firstName: req.body.firstName,
        surName: req.body.surName,
        email: req.body.email,
        password: req.body.password,
        birthday: req.body.birthday,
        birthmonth: req.body.birthmonth,
        birthyear: req.body.birthyear,
        gender: req.body.gender
    });
    accountService.addUser(newuser, (err, user) => {
        if (err)
            res.json({ success: false, msg: "Failed to register user" });
        else
            res.json({ success: true, msg: "User registered" });
    });
}

exports.authenticate = function (req, res) {
    const userName = req.body.loginEmail;
    const password = req.body.loginPassword;

    accountService.getUserByUserName(userName, (err, user) => {
        if (err)
            throw err;
        if (!user)
            return res.json({ success: false, msg: "User not found", response: null });

        accountService.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user, config.secretkey, {
                    expiresIn: 604800 //1 week
                });
                res.json({
                    success: true,
                    token: "JWT " + token,
                    response: {
                        id: user._id,
                        firstName: user.firstName,
                        surName: user.surName,
                        email: user.email
                    }
                })
            }
            else {
                res.json({ success: false, msg: "Invalid Password", response: null });
            }
        });
    });
}

exports.profile = function (req, res) {
    // accountService.getUserById(req.params.id, (err, user) => {
    //     if (err)
    //         res.json({ success: false, msg: "Failed to get User" });
    //     else if (!user)
    //         res.json({ success: false, msg: "No user found with this id", response: null });
    //     else
    //         res.json({ success: true, msg: "User Found", response: user });
    // });
    res.json({ success: true, msg: "User Found", response: req.user });
}

exports.getAll = function (req, res) {
    accountService.getAll((err, users) => {
        if (err) throw err;
        else
            res.json({ success: true, msg: "test", response: users });
    });
}