var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
  chatId:{
    type: mongoose.Schema.Types.ObjectId,
    require:true
  },
  conversation: [{
      message: {
        type: String
      },
      sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
      },
      sentTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      sentOn: {
        type: Date,
        default: new Date().toISOString()
      },
    },
    {
      _id: false
    }],
  isDelete: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: new Date().toISOString()
  },
  userIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isGroup:{
    type:Boolean,
    default:false
  },
  groupName:{
    type:String,
    default:"Name Your Group"
  }
});

module.exports = mongoose.model('Chat', ChatSchema);