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
        default:new Date().toISOString()
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
  updated_at: { type: Date, default: new Date().toISOString() },
  userIds:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


module.exports = mongoose.model('Chat', ChatSchema);