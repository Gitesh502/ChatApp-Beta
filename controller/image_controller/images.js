var mongoose = require('mongoose');
const ImagesM = require('../../models/userImages_model');
const imageService = require('../../services/image_service');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

exports.saveProfileImage = function (req, res) {
    var userDetails = req.user;
    var uploadDir = './uploads/';
    var path = '';
    if (!fs.existsSync(uploadDir + userDetails._id.toString())) {
        fs.mkdirSync(uploadDir + userDetails._id.toString());
    }

    //for file uplaod
    //require multer for the file uploads
    var multer = require('multer');
    //single('file') here file is name of input type from client side
    //for dropzone there is an option called paramName by defualt its file if you change it , then that name should be kept here
    var upload = multer({ dest: uploadDir + userDetails._id.toString() + '/' }).single('file');

    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            return res.status(422).send("an Error occured")
        }
        // No error occured.
        path = req.file.path;
        var fileExtension = "";

        var imPath = req.file.destination + req.file.filename;//+"."+mime.extension(req.file.mimetype);
        var userImages = new ImagesM({
            imageTitle: "Profile Image",
            imagePath: path,
            IsActive: true,
            uploadedBy: userDetails._id,
            uploadedOn: new Date(),
            imgExt: mime.extension(req.file.mimetype),
            imageType: 1
        });


        imageService.saveImages(userImages, (err, img) => {
            if (err)
                res.json({ success: false, msg: "Image Uploaded to folder but path did not saved to database", error: err });
            else {
                // //res.download(path);
                // var bitmapr = fs.readFile(imPath, function (err, data) {
                //     if (err) {
                //         console.log(err);
                //         throw err;
                //     }
                //     // convert binary data to base64 encoded string
                //     //res.send(new Buffer(bitmap).toString('base64'));
                //     var resPath = data.toString('base64');
                //     res.send({ success: true, resposne: resPath });
                // });



            }

        });
        // return res.send("Upload Completed for " + path);
    });
}