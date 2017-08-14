const mongoose=require('mongoose');
const config=require('../config/config');

//User schema
const userTokenSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    token:{
        type:String,
        require:true
    }
});

const UserToken=mongoose.model("UserToken",userTokenSchema);
module.exports=UserToken;