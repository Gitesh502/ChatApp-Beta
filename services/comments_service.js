const Comments = require('../models/comments_model');
const Dao = require('../dao/dao');
var dao = new Dao(Comments);




module.exports.save = function (newpost, callback) {
	dao.save(newpost,callback);
}
module.exports.find = function (filter, populateQuery,projectionQuery=null,sortOptions, callback) {
	dao.find(filter, populateQuery,projectionQuery=null,sortOptions, callback);
}
module.exports.remove=function(filter, options, callback)
{
	dao.findOneAndRemove(filter, options, callback);
}
module.exports.findOneAndUpdate=function(filter,updateObj, options, callback){
	dao.findOneAndUpdate(filter,updateObj, options, callback);
}

module.exports.aggregate=function(obj, callback){
	dao.aggregate(obj, callback);
}
