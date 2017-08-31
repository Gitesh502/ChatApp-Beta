const mongoose = require('mongoose');
const Post = require('../../models/posts_model');
const filters = require('../../helpers/distinctFilter');
const postService = require('../../services/posts_service');
const accountService = require('../../services/account_service');

exports.save = function (req, res) {
	let newPost = new Post({
		PostTitle: req.body.PostTitle,
		PostDescription: req.body.PostDescription,
		IsActive: req.body.IsActive,
		PostedBy: req.body.PostedBy,
		PostedOn: req.body.PostedOn,
		PostedDate: req.body.PostedDate,
		PrivacyType: req.body.PrivacyType,
	});
	postService.save(newPost, (err, newretPost, numAffected) => {
		if (err) {
			res.json({
				success: false,
				msg: "Failed to add post",
				error: err
			});
		} else {
			var posts = [];
			accountService.getOneById(newretPost.PostedBy, null, {}, (err, user) => {
				if (user) {
					posts = user.posts;
					posts.push(newretPost._id);
					posts = filters.Unique(posts);
					accountService.findByIdAndUpdate(user._id, {
						$set: {
							'posts': posts
						}
					}, (err, user) => {
					});
				} else if (err) {
					console.log(err);
				}
			});
			res.json({
				success: true,
				msg: "Post submitted successfully"
			});
		}
	});
}

exports.get = function (req, res) {
	postService.get({}, null, (err, posts) => {
		if (err) res.json({
			success: false,
			msg: "Failed to fetch posts",
			response: null
		});
		else res.json({
			success: true,
			msg: "Posts retrived successfully",
			response: posts
		});
	});
}

exports.getPostByPostedBy = function (req, res) {
	var query = {
		PostedBy: mongoose.Types.ObjectId(req.params.id)
	};
	var populateQuery = {
		path: 'PostedBy',
		populate: {
			path: 'profileImages',
			match: {
				IsActive: true
			}
		}
	};
	var sortedQuery = {
		"PostedOn": -1
	};
	postService.get(query, populateQuery, sortedQuery, (err, post) => {
		if (err) {
			res.json({
				success: false,
				msg: "Failed to get post",
				error: err
			});
		} else if (!post) res.json({
			success: false,
			msg: "No post found with this id",
			response: null
		});
		else res.json({
			success: true,
			msg: "post Found",
			response: post
		});
	});
}

exports.deletePost = function (req, res) {
	var postId = req.query.postId;
	var userId = req.user._id;
	var query = {
		PostedBy: userId,
		_id: postId
	};
	postService.deletePost(query, {}, (err, post) => {
		if (err)
			throw err;
		if (!post) {
			res.json({
				success: false,
				msg: "No Post Found",
				response: null
			});
		}
		if (post) {
			res.json({
				success: true,
				msg: "Post Deleted",
				response: null
			});
		}
	});
}