const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const User = require('../models/user_model');
const Posts = require('../models/posts_model');
const Dao = require('../dao/dao');

var dao=new Dao(User);



module.exports.getById=function(id,callback)
{
    dao.getOne(id,callback);
}

module.exports.getUserByEmail = function (id, callback) {
    dao.get(id,callback,{email:id});
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

module.exports.getMany = function (callback) {
    dao.getMany(callback);
}

module.exports.comparePassword=function(password,hashPwd,callback)
{
    bcrypt.compare(password,hashPwd,(err,isMatch)=>{
        if(err)
            throw err;
        callback(null,isMatch);
    })
}

module.exports.findAndUpdateUser=function(userId,updatedObj,callback){
    dao.findByIdAndUpdate(userId,updatedObj,callback);
}

module.exports.login = function (id, callback) {
    dao.login(id,callback,{email:id});
}

module.exports.saveUserImages=function(userId,imgObj,callback)
{

}
