const Post = require('../models/posts_model');
const Dao = require('../dao/dao');

var dao=new Dao(Post);

module.exports.submitPost=function(newpost,callback)
{
   newpost.save(callback);
}

module.exports.getAllPosts=function(callback)
{
    dao.getMany(callback);
}

module.exports.getPostByPostedBy=function(id,callback)
{
    Post.find({PostedBy:id})
    .populate("PostedBy")
    .exec(callback)
}