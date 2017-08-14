const jwt = require('jsonwebtoken');
const _ = require('lodash');
const accountService = require('../../services/account_service');
const helperService = require('../../services/helper_service');
const User = require('../../models/user_model');
const config = require('../../config/config');
var fs = require('fs');

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

    accountService.login(userName, (err, user) => {
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

                //saving token and user id into collection 
                try {
                    helperService.assignTokenUserId(user._id, token, (err, newRec, numRowsAfftecd) => {
                        if (err)
                            console.log(err);

                    });
                }
                catch (ex) {

                }
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
    _.omit(req.user, 'password')
    res.json({ success: true, msg: "User Found", response: req.user });
}

exports.getAll = function (req, res) {
    accountService.getMany((err, users) => {
        if (err) throw err;
        else
            res.json({ success: true, msg: "test", response: users });
    });
}

exports.getById = function (req, res) {
    accountService.getUserByEmail(req.params.id, (err, user) => {
        if (err)
            res.json({ success: false, msg: "Failed to get User", error: err });
        else if (!user)
            res.json({ success: false, msg: "No user found with this id", response: null });
        else
            res.json({ success: true, msg: "User Found", response: user });
    });
}


exports.updateProfile=function(req,res){
   // accountService.findAndUpdateUser(req.user._id,)
}


