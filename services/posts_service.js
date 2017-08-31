const Post = require('../models/posts_model');
const Dao = require('../dao/dao');
var dao = new Dao(Post);




module.exports.save = function (newpost, callback) {
	dao.save(newpost,callback);
}
module.exports.get = function (filter, populateQuery,sortOptions, callback) {
	dao.find(filter, populateQuery,sortOptions, callback);
}
module.exports.deletePost=function(filter, options, callback)
{
	dao.findOneAndRemove(filter, options, callback);
	// Post.findOne({
	// 	PostedBy:userId,
	// 	_id:postId
	// }).remove().exec(callback);
}