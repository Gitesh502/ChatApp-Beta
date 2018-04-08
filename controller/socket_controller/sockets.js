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
var rooms = [];
exports.connect = function (socket) {
  var io = this;
  var userDetails = socket.decoded_token._doc;
  var responseDetails = {
    firstName: userDetails.firstName,
    surName: userDetails.surName,
    id: userDetails._id,
    isGroup: false,
    isOnline: userDetails.isOnline,
    img: userDetails.profileImages[0].imagePath + "/" + userDetails.profileImages[0].icon_45X45
  };
  /**
   * disconnect invokes when user disconnects or logsout or idle for sometime
   */
  socket.on('disconnect', (data) => {
    var prevConn = _.find(connections, {
      userId: userDetails._id
    });
    if (prevConn != null && prevConn != undefined) {
      _.remove(connections, {
        userId: userDetails._id
      });
    }
    setTimeout(() => {
      exports.updateOnlineStatus(userDetails._id, 'N', (result, obj) => {
        var currentUserResponseDetails = [];
        exports.broadcastUsers(userDetails._id, (re, ob) => {
          responseDetails.isOnline = 'N';
          ob.forEach((item) => {
            if (item.fromId != null && item.fromId._id.toString() != data) {
              var skt = _.find(connections, {
                userId: item.fromId._id.toString()
              });
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
              var skt = _.find(connections, {
                userId: item.toId._id.toString()
              });
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
          var currentUserSkt = _.find(connections, {
            userId: data
          });
          if (currentUserSkt != null) {
            currentUserSkt.socket.emit('online-users', {
              type: 'online-users',
              response: currentUserResponseDetails
            });
          }
        })
      });
    }, 1000);

  });
  /**
   * invokes when user login or joins
   * putting all scoketids and userids into an array so that we can identify socket based on userid for private chat
   * All socket ids who are logged in are stored into connnections array
   */
  socket.on('join', (data) => {


    var prevConn = _.find(connections, {
      userId: data
    });

    if (prevConn != null && prevConn != undefined) {
      _.remove(connections, {
        userId: data
      });
    }

    connections.push({
      userId: data,
      socket: socket
    });

    connections = _.uniqBy(connections, (e) => {
      return e.userId;
    });

    exports.getRoomsByUserId(data, (result) => {
      result.forEach(elemnt => {
       
        var prevRoom = _.find(rooms, {
          roomId: elemnt.toString()
        });
        if (prevRoom != null && prevRoom != undefined) {
          _.remove(rooms, {
            roomId: elemnt.toString()
          });
        }
        
        rooms.push({
          roomId: elemnt.toString(),
          socket: socket
        });
        socket.join(elemnt.toString());
      });
    });

    exports.updateOnlineStatus(data, 'Y', (result, obj) => {
      var currentUserResponseDetails = [];
      exports.broadcastUsers(data, (re, ob) => {
        responseDetails.isOnline = 'Y';
        ob.forEach((item) => {
          if (item.fromId != null && item.fromId._id.toString() != data) {
            var skt = _.find(connections, {
              userId: item.fromId._id.toString()
            });
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
              isGroup: false,
              isOnline: item.fromId.isOnline,
              img: item.fromId.profileImages[0].imagePath + "/" + item.fromId.profileImages[0].icon_45X45
            });
          }
          if (item.toId != null && item.toId._id.toString() != data) {
            var skt = _.find(connections, {
              userId: item.toId._id.toString()
            });
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
              isGroup: false,
              isOnline: item.toId.isOnline,
              img: item.toId.profileImages[0].imagePath + "/" + item.toId.profileImages[0].icon_45X45
            });
          }
        });
        var currentUserSkt = _.find(connections, {
          userId: data
        });
        if (currentUserSkt != null) {
          currentUserSkt.socket.emit('online-users', {
            type: 'online-users',
            response: currentUserResponseDetails
          });
        }
      })
    });


  });
  /**
   * when user sneds message to another user private chat follwoing mehtod wil invoke
   * based on the reciver user id we are filtering conections array and getting socket for sender
   * and sending message to that socket
   */
  socket.on('send-message', (data) => {
    try {
       if(data.isGroup)
      {
        var roomSkt = _.find(rooms, {
          roomId: data.chatId
        });
        if (roomSkt != null) {

          socket.broadcast.to(data.chatId).emit('receive-message', {
            type: 'receive-message',
            text: data
          });
        }
      }
      else{
        var skt = _.find(connections, {
          userId: data.message.sentTo
        });
        if (skt != null) {
          skt.socket.emit('receive-message', {
            type: 'receive-message',
            text: data
          });
        }
      }
    

    } catch (ex) {
      console.log(ex);
    }
  });

  socket.on('send-request', (data) => {
    var skt = _.find(connections, {
      userId: data
    });
    if (skt != null) {
      skt.socket.emit('receive-request', {
        type: 'new-message',
        text: data
      });

    } else {
      console.log("Error", skt);
    }

  });

  socket.on('request-accepted', (data) => {

    var skt = _.find(connections, {
      userId: data
    });
    if (skt != null) {
      skt.socket.emit('friend-request-accepted-notification', {
        type: 'request-accepted',
        text: data
      });
    } else {
      console.log("Error", skt);
    }
  });

  socket.on('post-comment', (data) => {
    var skt = _.find(connections, {
      userId: data.id
    });
    if (skt != null) {
      skt.socket.emit('new-post', {
        type: 'new-post',
        text: data.text
      });
    }
  });

  socket.on('new-room', function (data) {
    try {
      socket.join(data.groupId);
      var prevRoom = _.find(rooms, {
        roomId: data.groupId
      });
      if (prevRoom != null && prevRoom != undefined) {
        _.remove(rooms, {
          roomId: data.groupId
        });
      }
      rooms.push({
        roomId: data.groupId,
        socket: socket
      });
      var response = _.remove(data.userIds, function (n) {
        return n.toString() != responseDetails.id.toString();
      });
      response.forEach((item) => {
        var skt = _.find(connections, {
          userId: item
        });
        if (skt != null) {
          skt.socket.emit('new-room', {
            type: 'new-room',
            text: data.groupId
          });
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  });

  socket.on('join-room', function (data) {
    try {

      socket.join(data.text);
      var prevRoom = _.find(rooms, {
        roomId: data.text
      });
      if (prevRoom != null && prevRoom != undefined) {
        _.remove(rooms, {
          roomId: data.text
        });
      }
      rooms.push({
        roomId: data.text,
        socket: socket
      });
    } catch (ex) {
      console.log(ex);
    }

  });


}

exports.updateOnlineStatus = function (userId, status, callback) {
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

exports.broadcastUsers = function (userId, callback) {
  var query = {
    $and: [{
      $or: [{
        "fromId": userId
      }, {
        "toId": userId
      }]
    }, {
      "status": 'Accepted'
    }]

  };

  var populateQuery = [{
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
  }];
  friendService.find(query, populateQuery, null, null, (err, users) => {
    if (err)
      throw err;
    if (users) {
      callback(true, users);
    }
  });
}

exports.sendMessage = function (from, to, message, callback) {
  var query = {
    $and: [{
      userIds: to
    }, {
      userIds: from
    }]
  };

  chatService.getOne(query, null, {}, (err, chat) => {
    if (err) throw err;

    if (!chat) {
      let newChat = new Chat({
        conversation: [{
          message: message,
          sender: from,
          recipient: to
        }],
        userIds: [
          from, to
        ],
        updated_at: new Date().toISOString()
      });
      chatService.save(newChat, callback);
    } else if (chat) {
      var query = {
        _id: chat._id
      };
      chatService.getOne(query, null, {}, (err, chat) => {
        if (err) throw err;
        if (chat) {
          chat.conversation.push({
            message: message,
            sender: from,
            recipient: to
          });
          chat.updated_at = new Date().toISOString();
          chatService.save(chat, callback);
        }
      });
    }
  });
}

exports.getFriendsById = function (loggedUserId) {
  var notInArry = [];
  var filter = {
    $and: [{
      $or: [{
          "fromId": loggedUserId
        },
        {
          "toId": loggedUserId
        }
      ]
    }, {
      "status": "Accepted"
    }]

  };
  var projectionQuery = {
    fromId: 1,
    toId: 1,
    _id: 0
  };
  friendService.find(filter, null, projectionQuery, null, (err, data) => {
    if (err) {
      throw err;
    } else {
      if (data && data.length > 0) {
        data.forEach(item => {
          notInArry.push(item.toId);
          notInArry.push(item.fromId);
        });
      }
      return notInArry;
    }
  });
}

exports.getRoomsByUserId = function (loggedUserId, callback) {
  var groupIds = [];
  try {
    var query = {
      $and: [{
          isGroup: true
        },
        {
          $or: [{
            createdBy: loggedUserId
          }, {
            userIds: loggedUserId
          }]
        }
      ]
    };
    chatService.get(query, null, null, null, (err, groups) => {
      if (err) {
        return [];
      }
      groups.forEach(element => {
        groupIds.push(element.chatId);
      });
      callback(groupIds);
    });
  } catch (ex) {
    return [];
  }
}