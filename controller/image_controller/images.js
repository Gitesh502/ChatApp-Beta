var mongoose = require('mongoose');
const ImagesM = require('../../models/userImages_model');
const imageService = require('../../services/image_service');
const accountService = require('../../services/account_service');
const config = require("../../config/config");
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var multer = require('multer');
var sharp = require('sharp');
exports.saveProfileImage = function (req, res) {
	var userDetails = req.user;
	var path = '';
	var fileName = "";
	var userFolder = config.rootUrl + config.uploads + userDetails._id.toString();
	if (!fs.existsSync(userFolder)) {
		fs.mkdirSync(userFolder);
	}
	var imgFullPath = config.rootUrl + config.uploads + userDetails._id.toString() + "/profile";
	var pathSaved = config.uploads + userDetails._id.toString() + "/profile";
	if (!fs.existsSync(imgFullPath)) {
		fs.mkdirSync(imgFullPath);
	}
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, imgFullPath)
		},
		filename: function (req, file, cb) {
			fileName = Date.now()
				.toString() + "." + mime.extension(file.mimetype);
			cb(null, fileName)
		}
	})
	var upload = multer({
			storage: storage
		})
		.single("file");
	upload(req, res, function (err) {
		if (err) {
			console.log(err);
			return res.status(422)
				.send("an Error occured")
		}
		sharp(imgFullPath + "/" + fileName)
			.resize(400, 400)
			.toFile(imgFullPath + "/profile_" + fileName, function (err) {})
			.resize(200, 200)
			.toFile(imgFullPath + "/timeline_" + fileName, function (err) {})
			.resize(60, 60)
			.toFile(imgFullPath + "/icon_" + fileName, function (err) {});
		var userImages = new ImagesM({
			imageTitle: "Profile Image",
			fileName: "profile_" + fileName,
			iconName: "icon_" + fileName,
			timeLineImg: 'timeline_' + fileName,
			imagePath: pathSaved,
			IsActive: true,
			fullPath: pathSaved + "/profile_" + fileName,
			uploadedBy: userDetails._id,
			uploadedOn: new Date(),
			imgExt: mime.extension(req.file.mimetype),
			imageType: 1
		});
		var oldProfileImages = [];
		if (userDetails != null && userDetails.profileImages != null && userDetails.profileImages != undefined) {
			oldProfileImages = userDetails.profileImages;
		}
		imageService.updateImages({
			"imageType": 1,
			"uploadedBy": userDetails._id
		}, {
			$set: {
				"IsActive": false
			}
		}, {multi:true}, (err, imgObj) => {

			imageService.saveImages(userImages, (err, img) => {
				if (err) {
					res.json({
						success: false,
						msg: "Image Uploaded to folder but path did not saved to database",
						error: err
					});
				} else {
					oldProfileImages.push(img._id);
					accountService.findByIdAndUpdate(userDetails._id, {
						'profileImages': oldProfileImages
					}, (err, user) => {
						if (err) res.json({
							success: false,
							msg: "Error occured"
						});
						else res.json({
							success: false,
							msg: "Image uploaded successfully",
							response: pathSaved + "/profile_" + fileName
						});
					});
				}
			});
		});

		

	});
}
exports.saveCoverImage = function (req, res) {
	var userDetails = req.user;
	var path = '';
	var fileName = "";
	var imgFullPath = config.rootUrl + config.uploads + userDetails._id.toString() + "/cover";
	var pathSaved = config.uploads + userDetails._id.toString() + "/cover";
	if (!fs.existsSync(config.rootUrl + config.uploads + userDetails._id.toString())) {
		fs.mkdirSync(config.rootUrl + config.uploads + userDetails._id.toString());
	}
	if (!fs.existsSync(imgFullPath)) {
		fs.mkdirSync(imgFullPath);
	}
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, imgFullPath)
		},
		filename: function (req, file, cb) {
			fileName = Date.now()
				.toString() + "." + mime.extension(file.mimetype);
			cb(null, fileName)
		}
	})
	var upload = multer({
			storage: storage
		})
		.single("file");
	upload(req, res, function (err) {
		if (err) {
			console.log(err);
			return res.status(422)
				.send("an Error occured")
		}
		sharp(imgFullPath + "/" + fileName)
			.resize(1170, 300)
			.toFile(imgFullPath + "/cover_" + fileName, function (err) {});
		var userImages = new ImagesM({
			imageTitle: "cover Image",
			fileName: "cover_" + fileName,
			imagePath: pathSaved,
			IsActive: true,
			fullPath: pathSaved + "/cover_" + fileName,
			uploadedBy: userDetails._id,
			uploadedOn: new Date(),
			imgExt: mime.extension(req.file.mimetype),
			imageType: 2
		});
		var oldCoverImages = [];
		if (userDetails != null && userDetails.coverImages != null && userDetails.coverImages != undefined) oldCoverImages = userDetails.coverImages;
		imageService.updateImages({
			"imageType": 2,
			"uploadedBy": userDetails._id
		}, {
			$set: {
				"IsActive": false
			}
		}, {
			multi: true
		}, (err, imgObj) => {
			if (err) throw err;
		});
		imageService.saveImages(userImages, (err, img) => {
			if (err) res.json({
				success: false,
				msg: "Image Uploaded to folder but path did not saved to database",
				error: err
			});
			else {
				oldCoverImages.push(img._id);
				accountService.findByIdAndUpdate(userDetails._id, {
					'coverImages': oldCoverImages
				}, (err, user) => {
					if (err) res.json({
						success: false,
						msg: "Error occured"
					});
					else res.json({
						success: false,
						msg: "Image uploaded successfully",
						response: pathSaved + "/cover_" + fileName
					});
				});
			}
		});
	});
}