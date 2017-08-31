const Dao = require('../dao/dao');
const Chat = require('../models/chat_model');


var dao = new Dao(Chat);
module.exports.save = function (newMessage, callback) {
	dao.save(newMessage,callback);
}

module.exports.get = function (filter,populateionQuery,sortOptions, callback) {
	dao.find(filter,populateionQuery,sortOptions, callback);
}

module.exports.getOne = function (filter,populateQuery,projectionQuery,  callback) {
	dao.findOne(filter,populateQuery,projectionQuery, callback);
}
