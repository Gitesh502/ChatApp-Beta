const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const User = require('../models/user_model');
const Dao = require('../dao/dao');
var dao = new Dao(User);


module.exports.get = function (filter, populateQuery,sortOptions, callback) {
	dao.find({}, populateQuery,sortOptions, callback);
}
module.exports.getOne = function (filter, populateQuery, projectionQuery, callback) {
	dao.findOne(filter, populateQuery, projectionQuery, callback);
}
module.exports.getOneById = function (id, populateQuery, projectionQuery, callback) {
	dao.findById(id, populateQuery, projectionQuery, callback);
}
module.exports.findByIdAndUpdate = function (userId, updatedObj, callback) {
	dao.findByIdAndUpdate(userId, updatedObj, callback);
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