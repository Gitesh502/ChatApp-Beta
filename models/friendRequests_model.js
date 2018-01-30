const mongoose = require('mongoose');
const config = require('../config/config');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(config.connectionString);
autoIncrement.initialize(connection);


const friendRequestSchema=mongoose.Schema({
  fromId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  toId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status:{
    type:String,enum: ['Pending', 'Accepted', 'Rejected']
  },
  requestSentOn:{
    type:Date
  },
  requestAcceptedOn:{
    type:Date
  }
});

friendRequestSchema.plugin(autoIncrement.plugin, {
    model: 'FriednRequests',
    field: 'friednRequestId',
    startAt: 1
});

const FriendRequests = mongoose.model("FriendRequests", friendRequestSchema);

module.exports = FriendRequests;
