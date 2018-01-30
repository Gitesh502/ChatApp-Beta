const User = require('../../models/user_model');
const FriednRequests = require('../../models/friendRequests_model');
const accountService = require('../../services/account_service');
const friendService = require('../../services/friend_service');

exports.getPeople = function(req, res) {
  var notInArry = [];
  var filter={
    $or:[
      {"fromId": req.user._id},
      {"toId": req.user._id}
    ]
  }
  friendService.find(filter, null, null, null, (err, data) => {
    if (err) {
      throw err;
    } else {
      if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          notInArry.push(data[i].toId);
        }
        for (var i = 0; i < data.length; i++) {
          notInArry.push(data[i].fromId);
        }
      }
      var popuatQuery = {
        path: 'profileImages',
        match: {
          IsActive: true
        }
      };
      var filter = {
        _id: {
          $nin: notInArry
        }
      };
      accountService.getByFilter(filter, popuatQuery, null, null, (err, users) => {
        if (err) throw err;
        else res.json({
          success: true,
          msg: "Success",
          response: users
        });
      });

    }
  });
}

exports.sendFriendRequest = function(req, res) {
  var frndReq = new FriednRequests({
    fromId: req.user._id,
    toId: req.body.reqUserId,
    status: "Pending",
    requestSentOn: new Date().toISOString()
  });
  friendService.save(frndReq, (err, request) => {
    if (err) {
      res.json({
        success: false,
        msg: "Failed",
        response: err
      });
    } else {
      res.json({
        success: true,
        msg: "Sucess",
        response: request
      });
    }
  });
}

exports.getReceivedFriendRequests = function(req, res) {
  var filter = {
    $or: [{
        $and: [{
          "status": "Pending"
        }, {
          "toId": req.user._id
        }]
      },
      {
        $and: [{
          "status": "Accepted"
        }, {
          "fromId": req.user._id
        }]
      },
    ]
  };
  var populateQuery = [{
      path: 'fromId',
      select: 'firstName surName _id userId profileImages',
      populate: {
        path: 'profileImages',
        match: {
          IsActive: true
        },
        select: 'imagePath icon_45X45'
      }
    },
    {
      path: 'toId',
      select: 'firstName surName _id userId profileImages',
      populate: {
        path: 'profileImages',
        match: {
          IsActive: true
        },
        select: 'imagePath icon_45X45'
      }
    }
  ];
  friendService.find(filter, populateQuery, null, null, (err, data) => {
    if (err) {
      res.json({
        success: false,
        msg: "Error",
        response: err
      });
    } else {
      res.json({
        success: true,
        msg: "Success",
        response: data
      });
    }
  });
}

exports.confirmRequest = function(req, res) {
  var filter = {
    _id: {
      $eq: req.body.reqId
    }
  };
  var updatedObj = {
    $set: {
      "status": "Accepted",
      "requestAcceptedOn": new Date().toISOString()
    }
  };
  friendService.findOneAndUpdate(filter, updatedObj, {
    new: true
  }, (err, data) => {
    if (err) {
      res.json({
        success: false,
        msg: "Error",
        response: err
      });
    } else {
      var query={
        "_id":data.fromId
      };
      var projectionQuery={
        "firstName":1,
        "surName":1,
        "_id":1,
        "userId":1
      };
      accountService.getOne(query,null,projectionQuery,(err,reqUser)=>{
        if(err) throw err;
        if(reqUser){
          res.json({
            success: true,
            msg: "Success",
            response: reqUser
          });
        }
      });

    }
  });
}

exports.deleteRequest = function(req, res) {
  var filter = {
    _id: {
      $eq: req.body.reqId
    }
  };
  var updatedObj = {
    $set: {
      "status": "Rejected",
    }
  };
  friendService.findOneAndUpdate(filter, updatedObj, {
    new: true
  }, (err, data) => {
    if (err) {
      res.json({
        success: false,
        msg: "Error",
        response: err
      });
    } else {
      res.json({
        success: true,
        msg: "Success",
        response: data
      });
    }
  });
}
