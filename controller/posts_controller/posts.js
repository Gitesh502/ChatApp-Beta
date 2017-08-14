const Post = require('../../models/posts_model');
const PostService = require('../../services/posts_service');
const AccountService = require('../../services/account_service');
const filters = require('../../helpers/distinctFilter');
var mongoose = require('mongoose');
exports.submitPost = function (req, res) {
    let newPost = new Post({
        PostTitle: req.body.PostTitle,
        PostDescription: req.body.PostDescription,
        IsActive: req.body.IsActive,
        PostedBy: req.body.PostedBy,
        PostedOn: req.body.PostedOn,
        PostedDate: req.body.PostedDate,
        PrivacyType: req.body.PrivacyType,
    });
    PostService.submitPost(newPost, (err, newretPost, numAffected) => {
        if (err)
            res.json({ success: false, msg: "Failed to add post", error: err });
        else {
            var posts = [];
            AccountService.getById(newretPost.PostedBy, (err, user) => {
                if (user) {
                    posts = user.posts;
                    posts.push(newretPost._id);
                    posts = filters.Unique(posts);
                    AccountService.findAndUpdateUser(user._id, { $set: { 'posts': posts } }, (err, user) => {
                        console.log(err);
                        console.log(user);
                    });
                }
                else if (err) {
                    console.log(err);
                }
            });
            res.json({ success: true, msg: "Post submitted successfully" });
        }
    });
}

exports.getAllPosts = function (req, res) {
    PostService.getAllPosts((err, posts) => {
        if (err)
            res.json({ success: false, msg: "Failed to fetch posts", response: null });
        else
            res.json({ success: true, msg: "Posts retrived successfully", response: posts });
    });
}

exports.getPostByPostedBy = function (req, res) {
    PostService.getPostByPostedBy(mongoose.Types.ObjectId(req.params.id), (err, post) => {
        if (err)
            res.json({ success: false, msg: "Failed to get post", error: err });
        else if (!post)
            res.json({ success: false, msg: "No post found with this id", response: null });
        else
            res.json({ success: true, msg: "post Found", response: post });
    });
    // res.json({ success: true, msg: "User Found", response: req.user });
}


//Account Service Calls
