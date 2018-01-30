const Notifications = require('../models/notification_model');
const Dao = require('../dao/dao');
var dao = new Dao(Notifications);


module.exports.save = function (newNotify, callback) {
	dao.save(newNotify,callback);
}
module.exports.get = function (filter, populateQuery,projectionQuery=null,sortOptions, callback) {
	dao.find(filter, populateQuery,projectionQuery=null,sortOptions, callback);
}
module.exports.findOneAndUpdate=function(filter,updateObj, options, callback)
{
	dao.findOneAndUpdate(filter,updateObj, options, callback);
}
