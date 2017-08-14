const mongoose = require('mongoose');
const UserImages=require('../models/userImages_model');
const Dao = require('../dao/dao');

var dao=new Dao(UserImages);



module.exports.saveImages=function(imgObj,callback)
{
    imgObj.save(callback);
}

