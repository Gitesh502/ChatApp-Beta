const mongoose=require('mongoose');

const commentsSchema=mongoose.Schema({
  postId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Posts'
  },
  bucket:{
    type:Number
  },
  count:{
    type:Number,
    default:1
  },
  comments:[]
});

const Comments=mongoose.model("Comments",commentsSchema);
module.exports=Comments;
