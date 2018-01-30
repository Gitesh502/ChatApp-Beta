const mongoose = require('mongoose');
const Notifications = require('../../models/notification_model');
const notificationService = require('../../services/notification_service');

exports.save = function(req, res) {
  notificationService.get({
    "userId": req.user._id
  }, null, null, null, (err, nots) => {
    if (err) {
      throw err;
    } else {
      if (nots && nots.length > 0) {
        var n = nots[0];
        n.isFriendOpened = req.body.isFriendOpened || null;
        n.isGlobeOpened = req.body.isGlobeOpened || null;
        n.friendLastOpened = req.body.friendLastOpened || null;
        n.globeLastOpened = req.body.globeLastOpened || null;
        if (req.body.isFriendCount)
          n.friendCount = n.friendCount + 1;
        if (req.body.isGlobeCount)
          n.globeCount = n.globeCount + 1;
        n.userId = req.user._id;
        notificationService.findOneAndUpdate({
          _id: n._id
        }, n, {
          new: true
        }, (err, note) => {
          if (err) {
            res.json({
              success: false,
              msg: "Failed",
              error: err
            });
          } else {
            res.json({
              success: true,
              msg: "Success",
              response: note
            });
          }
        });
      } else {
        var friendCount=0;
        var globeCount=0;
        if (req.body.isGlobeCount) {
          globeCount = 1;
        }
        if (req.body.isFriendCount) {
          friendCount = 1;
        }
        let newNotification = new Notifications({
          isFriendOpened: req.body.isFriendOpened || null,
          isGlobeOpened: req.body.isGlobeOpened || null,
          friendLastOpened: req.body.friendLastOpened || null,
          globeLastOpened: req.body.globeLastOpened || null,
          friendCount: friendCount,
          globeCount: globeCount,
          userId: req.user._id,
        });

        notificationService.save(newNotification, (err, newretPost, numAffected) => {
          if (err) {
            res.json({
              success: false,
              msg: "Failed",
              error: err
            });
          } else {
            res.json({
              success: true,
              msg: "Success",
              response: newretPost
            });
          }
        });
      }
    }
  });
}

exports.update = function(req, res) {
  notificationService.get({
    "userId": req.user._id
  }, null, null, null, (err, nots) => {
    if (err) {
      throw err;
    } else {
      if (nots && nots.length > 0) {
        var n = nots[0];
        n.isFriendOpened = req.body.isFriendOpened || null;
        n.isGlobeOpened = req.body.isGlobeOpened || null;
        if (req.body.isFriendOpened) {
          n.friendCount = req.body.friendCount;
          n.friendLastOpened = req.body.friendLastOpened || null;
        }
        if (req.body.isGlobeOpened) {
          n.globeCount = req.body.globeCount;
          n.globeLastOpened = req.body.globeLastOpened || null;
        }

        n.userId = req.user._id;
        notificationService.findOneAndUpdate({
          _id: n._id
        }, n, {
          new: true
        }, (err, note) => {
          if (err) {
            res.json({
              success: false,
              msg: "Failed",
              error: err
            });
          } else {
            res.json({
              success: true,
              msg: "Success",
              response: note
            });
          }
        });
      } else {
        var friendCount=0;
        var globeCount=0;
        if (req.body.isGlobeCount) {
          globeCount = 1;
        }
        if (req.body.isFriendCount) {
          friendCount = 1;
        }
        let newNotification = new Notifications({
          isFriendOpened: req.body.isFriendOpened || null,
          isGlobeOpened: req.body.isGlobeOpened || null,
          friendLastOpened: req.body.friendLastOpened || null,
          globeLastOpened: req.body.globeLastOpened || null,
          friendCount: friendCount,
          globeCount: globeCount,
          userId: req.user._id,
        });
        notificationService.save(newNotification, (err, newretPost, numAffected) => {
          if (err) {
            res.json({
              success: false,
              msg: "Failed",
              error: err
            });
          } else {
            res.json({
              success: true,
              msg: "Success",
              response: newretPost
            });
          }
        });
      }
    }
  });
}


exports.getFCount = function(req, res) {
  notificationService.get({
    userId: req.user._id
  }, null, null, null, (err, notes) => {
    if (err) res.json({
      success: false,
      msg: "Failed",
      response: null
    });
    else res.json({
      success: true,
      msg: "Sucess",
      response: notes
    });
  });
}

exports.getGCount = function(req, res) {
  notificationService.get({
    userId: req.user._id
  }, null, null, null, (err, notes) => {
    if (err) res.json({
      success: false,
      msg: "Failed",
      response: null
    });
    else res.json({
      success: true,
      msg: "Sucess",
      response: notes
    });
  });
}
