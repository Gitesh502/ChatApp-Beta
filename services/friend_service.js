const Dao = require('../dao/dao');
const FriednRequests = require('../models/friendRequests_model');

var dao = new Dao(FriednRequests);

module.exports.save = function (newRequest, callback) {
	dao.save(newRequest,callback);
}

module.exports.find=function (filter,populateQuery,projectionQuery,sortOptions,callback) {
	dao.find(filter, populateQuery,projectionQuery,sortOptions, callback)
};

module.exports.findOneAndUpdate = function (filter,updatedObj,options,callback) {
	dao.findOneAndUpdate(filter,updatedObj,options,callback);
}
