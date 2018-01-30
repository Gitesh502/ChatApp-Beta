const Post = require('../models/posts_model');
const Dao = require('../dao/dao');
var dao = new Dao(Post);




module.exports.save = function (newpost, callback) {
	dao.save(newpost,callback);
}
module.exports.get = function (filter, populateQuery,projectionQuery=null,sortOptions, callback) {
	dao.find(filter, populateQuery,projectionQuery=null,sortOptions, callback);
}
module.exports.deletePost=function(filter, options, callback)
{
	dao.findOneAndRemove(filter, options, callback);
}
module.exports.findOneAndUpdate=function(filter,updateObj, options, callback){
	dao.findOneAndUpdate(filter,updateObj, options, callback);
}
