const mongoose = require('mongoose');
const Post = require('../../models/posts_model');
const filters = require('../../helpers/distinctFilter');
const postService = require('../../services/posts_service');
const accountService = require('../../services/account_service');
const commentService = require('../../services/comments_service');

exports.save = function(req, res) {
  let newPost = new Post({
    PostTitle: req.body.PostTitle,
    PostDescription: req.body.PostDescription,
    IsActive: req.body.IsActive,
    PostedBy: req.body.PostedBy,
    PostedOn: req.body.PostedOn,
    PostedDate: req.body.PostedDate,
    PrivacyType: req.body.PrivacyType
  });
  postService.save(newPost, (err, newretPost, numAffected) => {
    if (err) {
      res.json({success: false, msg: "Failed to add post", error: err});
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
          }, (err, user) => {});
        } else if (err) {
          console.log(err);
        }
      });
      res.json({success: true, msg: "Post submitted successfully"});
    }
  });
}

exports.get = function(req, res) {
  postService.get({}, null, null, null, (err, posts) => {
    if (err)
      res.json({success: false, msg: "Failed to fetch posts", response: null});
    else
      res.json({success: true, msg: "Posts retrived successfully", response: posts});
    }
  );
}

exports.getPostByPostedBy = function(req, res) {
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
  postService.get(query, populateQuery, null, sortedQuery, (err, post) => {
    if (err) {
      res.json({success: false, msg: "Failed to get post", error: err});
    } else if (!post)
      res.json({success: false, msg: "No post found with this id", response: null});
    else
      res.json({success: true, msg: "post Found", response: post});
    }
  );
}

exports.deletePost = function(req, res) {
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
      res.json({success: false, msg: "No Post Found", response: null});
    }
    if (post) {
      res.json({success: true, msg: "Post Deleted", response: null});
    }
  });
}

exports.saveComment = function(req, res) {

  commentService.find({
    "postId": req.body.parentpostid
  }, null, null, {
    bucket: '-1'
  }, (err, resp) => {
    if (err)
      throw err;
    var bucketCount = 0;
    if (resp) {
      if (typeof resp != 'undefined' && typeof resp[0] != 'undefined' && typeof resp[0].bucket != 'undefined')
        bucketCount = resp[0].bucket;

      var options = {
        upsert: true,
        new: true
      };
      var commentsObj = {
        commentId: mongoose.Types.ObjectId(),
        text: req.body.comment,
        author: req.user._id,
        on: new Date().toISOString()
      };
      var filterQuery = {
        'postId': req.body.parentpostid,
        'count': {
          $lt: 5
        }
      };
      var query = {
        '$set': {
          'postId': req.body.parentpostid
        },
        '$inc': {
          'count': 1
        },
        '$push': {
          'comments': commentsObj
        },
        $setOnInsert: {
          bucket: bucketCount + 1
        }
      };
      commentService.findOneAndUpdate(filterQuery, query, options, (err, obj) => {
        if (err)
          throw err;
        if (obj) {
          res.json({'success': true, response: obj})
        }
      });
    }
  });
}

exports.getCommentsByPostId = function(req, res) {
console.log(req.params.postId)
  var aggregateQuery = [
    {
      $match: {
        postId: mongoose.Types.ObjectId(req.params.postId) 
      }
    }, {
      $unwind: "$comments"
    }, {
      $group: {
        _id: null,
        cmnts: {
          $push: "$comments"
        }
      }
    }, {
      $project: {
        _id: 0,
        comments: "$cmnts"
      }
    }
  ];
  commentService.aggregate(aggregateQuery, (err, ob) => {
    if (err)
      throw err;
    if (ob) {
      res.json({success: true, response: ob})
    }
  });

}
