const mongoose = require('mongoose');
const config = require('../config/config');
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection(config.connectionString);
autoIncrement.initialize(connection);


//User schema
const userSchema = mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  firstName: {
    type: String,
    require: true
  },
  surName: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true,
    select: false
  },
  birthday: {
    type: Number,
    require: true
  },
  birthmonth: {
    type: Number,
    require: true
  },
  birthyear: {
    type: Number,
    require: true
  },
  gender: {
    type: String,
    require: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false
  },
  isWizardPassed: {
    type: Boolean,
    default: false
  },
  emailHash: {
    type: String
  },
  createdOn: {
    type: Date,
  },
  updatedOn: {
    type: Date
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posts'
  }],
  profileImages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserImages'
  }],
  coverImages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserImages'
  }],
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }],
  // isNotificationSeen:{ type: Boolean, default: true },
  // isFriendRequestSeen:{ type: Boolean, default: true },
  isOnline: {
    type: String,
    enum: ['Y', 'N', 'B']
  },
  socketId: {
    type: String
  }
});
userSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'userId',
  startAt: 1
});

const User = mongoose.model("User", userSchema);

module.exports = User;
