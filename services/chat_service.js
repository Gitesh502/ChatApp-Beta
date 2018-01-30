const Dao = require('../dao/dao');
const Chat = require('../models/chat_model');


var dao = new Dao(Chat);
module.exports.save = function (newMessage, callback) {
	dao.save(newMessage,callback);
}

module.exports.update = function (filter,chatObj,options,callback) {
	dao.update(filter,chatObj,options,callback);
}

module.exports.get = function (filter,populateionQuery,projectionQuery=null,sortOptions, callback) {
	dao.find(filter,populateionQuery,projectionQuery=null,sortOptions, callback);
}

module.exports.getOne = function (filter,populateQuery,projectionQuery,  callback) {
	dao.findOne(filter,populateQuery,projectionQuery, callback);
}

module.exports.findOneAndUpdate = function (filter,chatObj,options,  callback) {
	dao.findOneAndUpdate	(filter,chatObj,options, callback);
}
