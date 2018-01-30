const mongoose=require('mongoose');

//User schema
const userImagesSchema=mongoose.Schema({
    imageTitle:{
        type:String,
        require:true
    },
    fileName:{
        type:String,
        require:true
    },
    iconName:{
        type:String

    },
    icon_45X45:{
        type:String

    },
    timeLineImg:{
        type:String

    },
    imagePath:{
        type:String,
        require:true
    },
    fullPath:{
        type:String,
        require:true
    },
    IsActive:{
        type:Boolean,
        require:true
    },
    uploadedBy:{
       type: mongoose.Schema.Types.ObjectId, ref: 'User' ,
        require:true
    },
    uploadedOn:{
        type:Date,
        require:true
    },
    imageType:{
        type:'Number',  //1=profileimg,2=bannerimages,3=timelineimage
        require:true
    }

});

const userImages=mongoose.model("UserImages",userImagesSchema);
module.exports=userImages;
