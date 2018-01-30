const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const User = require('../models/user_model');
const Dao = require('../dao/dao');
var dao = new Dao(User);


module.exports.get = function (filter, populateQuery,projectionQuery=null,sortOptions, callback) {
	dao.find(filter, populateQuery,projectionQuery,sortOptions, callback);
}


module.exports.getByFilter = function (filter, populateQuery,projectionQuery=null,sortOptions, callback) {
	dao.find(filter, populateQuery,projectionQuery,sortOptions, callback);
}


module.exports.getOne = function (filter, populateQuery, projectionQuery, callback) {
	dao.findOne(filter, populateQuery, projectionQuery, callback);
}


module.exports.getOneById = function (id, populateQuery, projectionQuery, callback) {
	dao.findById(id, populateQuery, projectionQuery, callback);
}


module.exports.findByIdAndUpdate = function (userId,otptions, updatedObj, callback) {
	dao.findByIdAndUpdate(userId, updatedObj,otptions, callback);
}


module.exports.findOneAndUpdate = function (filter,updatedObj,otptions, callback) {
	dao.findOneAndUpdate(filter, updatedObj,otptions, callback);
}

module.exports.findOneAndRemove = function (filter,otptions, callback) {
	dao.findOneAndRemove(filter,otptions, callback);
}


module.exports.addUser = function (newUser, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}


module.exports.comparePassword = function (password, hashPwd, callback) {
	bcrypt.compare(password, hashPwd, (err, isMatch) => {
		if (err) throw err;
		callback(null, isMatch);
	})
}


module.exports.login = function (id, callback) {
	dao.login(id, callback, {
		email: id
	});
}


module.exports.save = function (newObj, callback) {
	dao.save(newObj,callback);
}

module.exports.aggregate=function(findQuery,callback){
	dao.aggregate(findQuery,callback);
}
