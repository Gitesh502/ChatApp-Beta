const mongoose = require('mongoose');
const config = require('../config/config');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(config.connectionString);
autoIncrement.initialize(connection);


const notificationsSchema=mongoose.Schema({
  isFriendOpened:{
    type: Boolean,
  },
  isGlobeOpened:{
    type: Boolean,
  },
  friendLastOpened:{
    type:Date
  },
  globeLastOpened:{
    type:Date
  },
  friendCount:{
    type: Number,
  },
  globeCount:{
    type: Number,
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
});

notificationsSchema.plugin(autoIncrement.plugin, {
    model: 'Notifications',
    field: 'notificationId',
    startAt: 1
});

const Notifications = mongoose.model("Notifications", notificationsSchema);

module.exports = Notifications;
