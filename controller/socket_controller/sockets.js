const _ = require("lodash");
const Chat = require('../../models/chat_model');
const accountService = require('../../services/account_service');
const friendService = require('../../services/friend_service');
const chatService = require('../../services/chat_service');

/**
 * below is socket io code
 * calls when user connects or login
 */
var connections = [];
exports.connect = function(socket) {
  var userDetails = socket.decoded_token._doc;
  var responseDetails = {
    firstName: userDetails.firstName,
    surName: userDetails.surName,
    id: userDetails._id,
    isOnline: userDetails.isOnline,
    img: userDetails.profileImages[0].imagePath + "/" + userDetails.profileImages[0].icon_45X45
  };
  /**
   * disconnect invokes when user disconnects or logsout or idle for sometime
   */
  socket.on('disconnect', function(data) {
    var prevConn = _.find(connections, {userId: userDetails._id});
    if (prevConn != null && prevConn != undefined) {
      _.remove(connections, {userId: userDetails._id});
    }
    setTimeout(()=>{
      exports.updateOnlineStatus(userDetails._id, 'N', (result, obj) => {
        var currentUserResponseDetails = [];
        exports.broadcastUsers(userDetails._id, (re, ob) => {
            responseDetails.isOnline='N';
          ob.forEach((item) => {
            if (item.fromId != null && item.fromId._id.toString() != data) {
              var skt = _.find(connections, {userId: item.fromId._id.toString()});

              if (skt != null) {
                skt.socket.emit('online-users', {
                  type: 'online-users',
                  response: [responseDetails]
                });
              }
              currentUserResponseDetails.push({
                firstName: item.fromId.firstName,
                surName: item.fromId.surName,
                id: item.fromId._id,
                isOnline: item.fromId.isOnline,
                img: item.fromId.profileImages[0].imagePath + "/" + item.fromId.profileImages[0].icon_45X45
              });
            }
            if (item.toId != null && item.toId._id.toString() != data) {
              var skt = _.find(connections, {userId: item.toId._id.toString()});
              if (skt != null) {
                skt.socket.emit('online-users', {
                  type: 'online-users',
                  response: [responseDetails]
                });
              }
              currentUserResponseDetails.push({
                firstName: item.toId.firstName,
                surName: item.toId.surName,
                id: item.toId._id,
                isOnline: item.toId.isOnline,
                img: item.toId.profileImages[0].imagePath + "/" + item.toId.profileImages[0].icon_45X45
              });
            }
          });
          var currentUserSkt = _.find(connections, {userId: data});
          if (currentUserSkt != null) {
            currentUserSkt.socket.emit('online-users', {
              type: 'online-users',
              response: currentUserResponseDetails
            });
          }
        })
      });
    },1000);

  });
  /**
   * invokes when user login or joins
   * putting all scoketids and userids into an array so that we can identify socket based on userid for private chat
   * All socket ids who are logged in are stored into connnections array
   */
  socket.on('join', function(data) {
    var prevConn = _.find(connections, {userId: data});
    if (prevConn != null && prevConn != undefined) {
      _.remove(connections, {userId: data});
    }
    connections.push({userId: data, socket: socket});
    connections = _.uniqBy(connections, function(e) {
      return e.userId;
    });

    exports.updateOnlineStatus(data, 'Y', (result, obj) => {
      var currentUserResponseDetails = [];
      exports.broadcastUsers(data, (re, ob) => {
          responseDetails.isOnline='Y';
        ob.forEach((item) => {
          if (item.fromId != null && item.fromId._id.toString() != data) {
            var skt = _.find(connections, {userId: item.fromId._id.toString()});
            if (skt != null) {
              skt.socket.emit('online-users', {
                type: 'online-users',
                response: [responseDetails]
              });
            }
            currentUserResponseDetails.push({
              firstName: item.fromId.firstName,
              surName: item.fromId.surName,
              id: item.fromId._id,
              isOnline: item.fromId.isOnline,
              img: item.fromId.profileImages[0].imagePath + "/" + item.fromId.profileImages[0].icon_45X45
            });
          }
          if (item.toId != null && item.toId._id.toString() != data) {
            var skt = _.find(connections, {userId: item.toId._id.toString()});
            if (skt != null) {
              skt.socket.emit('online-users', {
                type: 'online-users',
                response: [responseDetails]
              });
            }
            currentUserResponseDetails.push({
              firstName: item.toId.firstName,
              surName: item.toId.surName,
              id: item.toId._id,
              isOnline: item.toId.isOnline,
              img: item.toId.profileImages[0].imagePath + "/" + item.toId.profileImages[0].icon_45X45
            });
          }
        });
        var currentUserSkt = _.find(connections, {userId: data});
        if (currentUserSkt != null) {
          currentUserSkt.socket.emit('online-users', {
            type: 'online-users',
            response: currentUserResponseDetails
          });
        }
      })
    })
  });
  /**
   * when user sneds message to another user private chat follwoing mehtod wil invoke
   * based on the reciver user id we are filtering conections array and getting socket for sender
   * and sending message to that socket
   */
  //console.log(connections);
  socket.on('send-message', function(data) {
    exports.sendMessage(data.message.sender, data.message.recipient, data.message.message, (err, response) => {
      if (err)
        throw err;
      if (response) {
        var skt = _.find(connections, {userId: data.message.recipient});
        if (skt != null) {
          skt.socket.emit('receive-message', {
            type: 'receive-message',
            text: data
          });
        }
      }
    });
  });

  socket.on('send-request', function(data) {
    exports.sendRequest(userDetails._id, data, (err, resp) => {
      if (err) {
        res.json({success: false, msg: "Failed", response: err});
      } else {
        var skt = _.find(connections, {userId: data});
        if (skt != null) {
          skt.socket.emit('receive-request', {
            type: 'new-message',
            text: data
          });
        } else {
          console.log("Error", skt);
        }
      }
    });

  });

  socket.on('request-accepted', function(data) {
    var skt = _.find(connections, {userId: data});
    if (skt != null) {
      skt.socket.emit('friend-request-accepted-notification', {
        type: 'request-accepted',
        text: data
      });
    } else {
      console.log("Error", skt);
    }
  });
}

exports.updateOnlineStatus = function(userId, status, callback) {
  accountService.findByIdAndUpdate(userId, null, {
    $set: {
      "isOnline": status
    }
  }, (err, obj) => {
    if (err)
      throw err;
    if (obj) {
      callback(true, obj)
    }
  });
}

exports.broadcastUsers = function(userId, callback) {
  var query = {
    $and: [
      {
        $or: [
          {
            "fromId": userId
          }, {
            "toId": userId
          }
        ]
      }, {
        "status": 'Accepted'
      }
    ]

  };

  var populateQuery = [
    {
      path: 'fromId',
      select: 'firstName surName _id userId profileImages isOnline',
      match: {
        _id: {
          $ne: userId
        }
      },
      populate: {
        path: 'profileImages',
        match: {
          IsActive: true
        },
        select: 'imagePath icon_45X45'
      }
    }, {
      path: 'toId',
      select: 'firstName surName _id userId profileImages isOnline',
      match: {
        _id: {
          $ne: userId
        }
      },
      populate: {
        path: 'profileImages',
        match: {
          IsActive: true
        },
        select: 'imagePath icon_45X45'
      }
    }
  ];
  friendService.find(query, populateQuery, null, null, (err, users) => {
    if (err)
      throw err;
    if (users) {
      callback(true, users);
    }
  });
}

exports.sendMessage = function(from, to, message, callback) {
  var query = {
    $and: [
      {
        userIds: to
      }, {
        userIds: from
      }
    ]
  };
  var options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  };
  let newChat = {
    $push: {
      conversation: {
        message: message,
        sender: from,
        recipient: to
      }
    },
    userIds: [
      to, from
    ],
    updated_at: new Date().toISOString()
  };
  var productToUpdate = {};
  productToUpdate = Object.assign(productToUpdate, newChat._doc);
  delete productToUpdate._id;
  chatService.findOneAndUpdate(query, productToUpdate, options, callback);
}

exports.sendFriendRequest = function(userId, reqUserId, callback) {
  var frndReq = new FriednRequests({fromId: userId, toId: reqUserId, status: "Pending", requestSentOn: new Date().toISOString()});
  friendService.save(frndReq, callback);
}
