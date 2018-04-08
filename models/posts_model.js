const mongoose=require('mongoose');
const config=require('../config/config');

//User schema
const postSchema=mongoose.Schema({
    PostTitle:{
        type:String,
        require:true
    },
    PostDescription:{
        type:String,
        require:true
    },
    IsActive:{
        type:Boolean,
        require:true
    },
    PostedBy:{
       type: mongoose.Schema.Types.ObjectId, ref: 'User' ,
        require:true
    },
    PostedOn:{
        type:Date,
        require:true
    },
    PostedDate:{
        type:String,
        require:true
    },
    PrivacyType:{
        type:Number,
        require:true
    },
    CommentsCount:{
        type:Number
    }

});

const Posts=mongoose.model("Posts",postSchema);
module.exports=Posts;
