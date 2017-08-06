const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const User = require('../models/user_model');
const Dao = require('../dao/dao');


var dao=new Dao(User);

module.exports.getUserById = function (id, callback) {
    dao.getOne(id,callback);
}

module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err)
                throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getAll = function (callback) {
    dao.getAll(callback);
}

module.exports.getUserByUserName=function(userName,callback)
{
    dao.getOneByUserName(userName,callback);
}

module.exports.comparePassword=function(password,hashPwd,callback)
{
    bcrypt.compare(password,hashPwd,(err,isMatch)=>{
        if(err)
            throw err;
        callback(null,isMatch);
    })
}