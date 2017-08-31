var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
  conversation:[
    {
      message: {
        type:String,
        //required:true
      },
      sender:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User' ,
        require:true
      },
      recipient:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
      },
      createdOn:{
        type:Date,
        default:Date.now
      },
     
    },
     { _id: false }
   
  ],
  isGroup:{
    type:Boolean,
    required:true,
    default:false
  },
  isDelete:{
    type:Boolean,
    default:false
  },
  updated_at: { type: Date, default: Date.now },
  userIds:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


module.exports = mongoose.model('Chat', ChatSchema);