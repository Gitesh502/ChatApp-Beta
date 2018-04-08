const mongoose = require("mongoose");
const Post = require("../../models/posts_model");
const UserModel = require("../../models/user_model");
const filters = require("../../helpers/distinctFilter");
const postService = require("../../services/posts_service");
const accountService = require("../../services/account_service");
const commentService = require("../../services/comments_service");
const friendsService = require("../../services/friend_service");
const _ = require("lodash");

exports.save = function(req, res) {
  let newPost = new Post({
    PostTitle: req.body.PostTitle,
    PostDescription: req.body.PostDescription,
    IsActive: req.body.IsActive,
    PostedBy: req.body.PostedBy,
    PostedOn: req.body.PostedOn,
    PostedDate: req.body.PostedDate,
    PrivacyType: req.body.PrivacyType,
    CommentsCount: 0
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
          accountService.findByIdAndUpdate(
            user._id,
            {
              $set: {
                posts: posts
              }
            },
            (err, user) => {}
          );
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
};

exports.get = function(req, res) {
  getFriendsIds(req.user._id, (err, x) => {
    var response = [];
    x.forEach(item => {
      response.push(item.fromId);
      response.push(item.toId);
    });
    _.uniq(response);

    var friendsIds = response;
    // var friendsIds = _.remove(response, function(n) {
    //   return n != req.user._id.toString();
    // });
    var query = {
      PostedBy: { $in: friendsIds }
    };

    var populateQuery = [
      {
        path: "PostedBy",
        populate: {
          path: "profileImages",
          match: {
            IsActive: true
          }
        }
      }
    ];
    var sortedQuery = {
      PostedOn: -1
    };
    postService.get(query, populateQuery, null, sortedQuery, (err, post) => {
      if (err) {
        res.json({
          success: false,
          msg: "Failed to get post",
          error: err
        });
      } else if (!post)
        res.json({
          success: false,
          msg: "No post found with this id",
          response: null
        });
      else
        res.json({
          success: true,
          msg: "post Found",
          response: post
        });
    });
  });
};

exports.getPostByPostedBy = function(req, res) {
  var query = {
    PostedBy: mongoose.Types.ObjectId(req.params.id)
  };
  var populateQuery = {
    path: "PostedBy",
    populate: {
      path: "profileImages",
      match: {
        IsActive: true
      }
    }
  };
  var sortedQuery = {
    PostedOn: -1
  };
  postService.get(query, populateQuery, null, sortedQuery, (err, post) => {
    if (err) {
      res.json({
        success: false,
        msg: "Failed to get post",
        error: err
      });
    } else if (!post)
      res.json({
        success: false,
        msg: "No post found with this id",
        response: null
      });
    else
      res.json({
        success: true,
        msg: "post Found",
        response: post
      });
  });
};

exports.deletePost = function(req, res) {
  var postId = req.query.postId;
  var userId = req.user._id;
  var query = {
    PostedBy: userId,
    _id: mongoose.Types.ObjectId(postId)
  };
  postService.deletePost(query, {}, (err, post) => {
    if (err) throw err;
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
};

exports.saveComment = function(req, res) {
  commentService.find(
    {
      postId: req.body.parentpostid
    },
    null,
    null,
    {
      bucket: "-1"
    },
    (err, resp) => {
      if (err) throw err;
      var bucketCount = 0;
      if (resp) {
        if (
          typeof resp != "undefined" &&
          typeof resp[0] != "undefined" &&
          typeof resp[0].bucket != "undefined"
        )
          bucketCount = resp[0].bucket;

        var options = {
          upsert: true,
          new: true
        };
        var commentsObj = {
          commentId: mongoose.Types.ObjectId(),
          text: req.body.comment,
          author: req.user._id,
          on: new Date().toISOString(),
          parentCommentId: -1
        };
        var filterQuery = {
          postId: req.body.parentpostid,
          count: {
            $lt: 5
          }
        };
        var query = {
          $set: {
            postId: req.body.parentpostid
          },
          $inc: {
            count: 1
          },
          $push: {
            comments: commentsObj
          },
          $setOnInsert: {
            bucket: bucketCount + 1
          }
        };
        commentService.findOneAndUpdate(
          filterQuery,
          query,
          options,
          (err, obj) => {
            if (err) throw err;
            if (obj) {
              postService.findOneAndUpdate(
                { _id: obj.postId },
                { CommentsCount: obj.count },
                { upsert: false, new: false },
                (err, post) => {
                  res.json({
                    success: true,
                    response: obj
                  });
                }
              );
            }
          }
        );
      }
    }
  );
};

exports.getCommentsByPostId = function(req, res) {
  var aggregateQuery = [
    {
      $match: {
        postId: mongoose.Types.ObjectId(req.params.postId)
      }
    },
    {
      $unwind: "$comments"
    },
    {
      $group: {
        _id: null,
        cmnts: {
          $push: "$comments"
        }
      }
    },
    {
      $project: {
        _id: 0,
        comments: "$cmnts"
      }
    }
  ];
  commentService.aggregate(aggregateQuery, (err, ob) => {
    if (err) throw err;
    if (ob) {
      ob.forEach(item => {
        item.comments.forEach(item1 => {
          getUserDetailsById(item1.author, (err, data) => {
            item1.author = data;
          });
        });
      });
      setTimeout(() => {
        res.json({
          success: true,
          response: ob
        });
      }, 1000);
    }
  });
};

exports.saveSubComment = function(req, res) {
  commentService.find(
    {
      postId: req.body.parentPostId
      // "comments.commentId": req.body.parentCommentId
    },
    null,
    null,
    {
      bucket: "-1"
    },
    (err, resp) => {
      if (err) throw err;
      var bucketCount = 0;
      if (resp) {
        if (
          typeof resp != "undefined" &&
          typeof resp[0] != "undefined" &&
          typeof resp[0].bucket != "undefined"
        ) {
          bucketCount = resp[0].bucket;
        }

        var options = {
          upsert: true,
          new: true
        };

        var commentsObj = {
          parentCommentId: req.body.parentCommentId,
          commentId: mongoose.Types.ObjectId(),
          text: req.body.comment,
          author: req.user._id,
          on: new Date().toISOString()
        };

        var filterQuery = {
          postId: req.body.parentPostId,
          count: {
            $lt: 5
          }
        };

        var query = {
          $set: {
            postId: req.body.parentPostId
          },
          $inc: {
            count: 1
          },
          $push: {
            comments: commentsObj
          },
          $setOnInsert: {
            bucket: bucketCount + 1
          }
        };

        commentService.findOneAndUpdate(
          filterQuery,
          query,
          options,
          (err, obj) => {
            if (err) throw err;
            if (obj) {
              res.json({
                success: true,
                response: obj
              });
            }
          }
        );
      }
    }
  );
};

function getFriendsIds(loggeduserId, callback) {
  var query = {
    $and: [
      {
        $or: [{ fromId: loggeduserId }, { toId: loggeduserId }]
      },
      {
        status: "Accepted"
      }
    ]
  };
  var projections = {
    fromId: 1,
    toId: 1,
    _id: 0
  };
  friendsService.find(query, null, projections, null, (err, friendIds) => {
    if (err) {
      callback(err, friendIds);
    } else {
      callback(err, friendIds);
    }
  });
}

function getUserDetailsById(authorId, callback) {
  var populateQuery = {
    path: "profileImages",
    match: {
      IsActive: true
    },
    select: "imagePath icon_45X45"
  };
  var projectionQuery = {
    firstName: 1,
    surName: 1,
    _id: 1,
    userId: 1,
    profileImages: 1
  };
  accountService.getOneById(authorId, populateQuery, projectionQuery, callback);
}
