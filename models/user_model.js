const mongoose=require('mongoose');
const config=require('../config/config');

//User schema
const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        require:true
    },
    surName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true,
        select: false
    },
    birthday:{
        type:Number,
        require:true
    },
    birthmonth:{
        type:Number,
        require:true
    },
    birthyear:{
        type:Number,
        require:true
    },
    gender:{
        type:String,
        require:true
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }],
    images:[{type: mongoose.Schema.Types.ObjectId, ref: 'UserImages'}]

});

const User=mongoose.model("User",userSchema);
module.exports=User;