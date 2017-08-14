const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const User = require('../models/user_model');
const Posts = require('../models/posts_model');
const UserTokens=require('../models/usertoken_model');
const Dao = require('../dao/dao');


module.exports.assignTokenUserId=function(userId,token,callback)
{
    var dao=new Dao(UserTokens);
    var userToken=new UserTokens({
        userId:userId,
        token:token
    })
    userToken.save(callback);
}