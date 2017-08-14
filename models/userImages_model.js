const mongoose=require('mongoose');

//User schema
const userImagesSchema=mongoose.Schema({
    imageTitle:{
        type:String,
        require:true
    },
    imagePath:{
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
        type:'Number',  //1=profileimg,2=timelineimages,3=timelineimage
        require:true
    }

});

const userImages=mongoose.model("UserImages",userImagesSchema);
module.exports=userImages;