const fs = require('fs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const User = require('../../models/user_model');
const helperService = require('../../services/helper_service');
const accountService = require('../../services/account_service');
var mailConfig = require("../../helpers/mail");
const {
	check,
	validationResult
} = require('express-validator/check');
const {
	matchedData
} = require('express-validator/filter');

/**
 * Creates new user
 * Users User model for creating new user
 */
exports.register = function (req, res) {
	var randtoken = require('rand-token');
	var emailtoken = randtoken.generate(16);
	req.check('firstName', 'Invalid name').notEmpty();
	req.check('surName', 'Invalid name').notEmpty();
	req.check('email', 'Invalid name').notEmpty();
	req.check('password', 'Invalid name').notEmpty();
	var errors = req.validationErrors();
	var months = [{
			Value: 1,
			Name: "Jan"
		},
		{
			Value: 2,
			Name: "Feb"
		},
		{
			Value: 3,
			Name: "Mar"
		},
		{
			Value: 4,
			Name: "Apr"
		},
		{
			Value: 5,
			Name: "May"
		},
		{
			Value: 6,
			Name: "Jun"
		},
		{
			Value: 7,
			Name: "Jul"
		},
		{
			Value: 8,
			Name: "Aug"
		},
		{
			Value: 9,
			Name: "Sep"
		},
		{
			Value: 10,
			Name: "Oct"
		},
		{
			Value: 11,
			Name: "Nov"
		},
		{
			Value: 12,
			Name: "Dec"
		}
	];
	if (errors) {
		res.json({
			success: false,
			msg: "Failed",
			response: errors
		});
	} else {

		if (!checkUser(req.body.email)) {

			let newuser = new User({
				firstName: req.body.firstName,
				surName: req.body.surName,
				email: req.body.email,
				password: req.body.password,
				birthday: req.body.birthday,
				birthmonth: req.body.birthmonth,
				birthyear: req.body.birthyear,
				gender: req.body.gender,
				createdOn: new Date(),
				emailHash: emailtoken
			});
			accountService.addUser(newuser, (err, user) => {
				if (err) {
					res.json({
						success: false,
						msg: "Failed to register user"
					});
				} else if (user) {
					var link = "http://" + req.get('host') + "/verify?token=" + user.emailHash + "&id=" + user.userId;
					var mailOptions = {
						from: 'raju.technoxis@gmail.com',
						to: newuser.email,
						subject: "Confirm your account",
						html: "Hello " + user.firstName + " " + user.surName + ",<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
					};
					mailConfig.sendMail(mailOptions, function (error, info) {
						if (error) {
							res.json(error);
						} else {
							res.json({
								success: true,
								msg: "User registration completed",
								response: user
							});
						}
					});
				}
			});
		} else {
			res.json({
				success: false,
				msg: "Email is already taken please try with other email",
				response: null
			})
		}
	}
}

/**
 * Calls when user clicks confirmation link in email
 */
exports.confirmRegistration = function (req, res) {
	console.log(req.query.id);
	console.log(req.query.token);
	var query = {
		userId: req.query.id.toString(),
		emailHash: req.query.token.toString()
	}
	accountService.getOne(query, null, {}, (err, user) => {
		if (err) {
			throw err;
		} else if (!user) {
			var tagline = "Token Invalid!. You may be messed up with token so please try agian :)";
			res.render('pages/notify', {
				tagline: tagline
			});
		} else if (user) {
			console.log("checked email")
			if (user.isEmailConfirmed) {
				var tagline = "Your email had  already confirmed ! Please login <a href='" + config.clientUrl + "Welcome' >here</a>";
				res.render('pages/notify', {
					tagline: tagline
				});
			} else {
				user.isEmailConfirmed = true;
				user.isActive = true;
				user.createdOn = new Date();
				accountService.save(user, (err, nuser) => {
					if (err)
						throw err;
					else {
						var tagline = "<p>";
						tagline += " Thank you for verifying your email.";
						tagline += "</p>";
						tagline += "<p>";
						tagline += "Just click below button to login and enter your credintials and enjoy :)";
						tagline += "</p>";
						tagline += "<p>";
						tagline += " <a href='" + config.clientUrl + "Welcome'  class='btn btn-success'>Log in</a>";
						tagline += "</p>";
						res.render('pages/notify', {
							tagline: tagline
						});
					}
				});
			}
		}
	});
}

/**
 * Authenticates(login) user using username and password and generates toekn
 */
exports.authenticate = function (req, res) {
	const userName = req.body.loginEmail;
	const password = req.body.loginPassword;
	req.check('loginEmail', 'Invalid name').notEmpty();
	req.check('loginPassword', 'Invalid name').notEmpty();
	var errors = req.validationErrors();
	if (errors) {
		res.render("pages/welcome", {
			loginErrors: errors,
			daymonths: months,
			borderRed: 'border-red',
			errors: null
		});
	} else {
		accountService.login(userName, (err, user) => {
			if (err) throw err;
			if (!user) return res.json({
				success: false,
				msg: "User not found",
				response: null
			});
			accountService.comparePassword(password, user.password, (err, isMatch) => {
				if (err) throw err;
				if (isMatch) {
					const token = jwt.sign(user, config.secretkey, {
						expiresIn: 604800
					});
					try {
						helperService.assignTokenUserId(user._id, token, (err, newRec, numRowsAfftecd) => {
							if (err) throw err;
						});
					}
					catch (ex) {
						throw ex;
					}
					accountService.findByIdAndUpdate(user._id,null,{$set:{'isOnline':'Y'}},(err,updateObj)=>{
						if(err) throw err;
					});
					res.json({
						success: true,
						token: "JWT " + token,
						socketToken:token,
						response: {
							id: user._id,
							firstName: user.firstName,
							surName: user.surName,
							email: user.email,
							isOnline:user.isOnline,
							profileImages: user.profileImages
						}
					})
				} else {
					res.json({
						success: false,
						msg: "Invalid Password",
						response: null
					});
				}
			});
		});
	}
}

/**
 * Get user prfile
 * omits password from user object
 */
exports.profile = function (req, res) {
	_.omit(req.user, 'password')
	res.json({
		success: true,
		msg: "User Found",
		response: req.user
	});
}

/**
 * Get all users
 * Returns list of users in fact all users in database
 */
exports.get = function (req, res) {
	var filter={
		_id: { $nin: req.user._id } ,
   }
	accountService.get(filter,null, null, null, (err, users) => {
		if (err) throw err;
		else res.json({
			success: true,
			msg: "test",
			response: users
		});
	});
}

/**
 * Get user by email
 * Returns single user object based on email condition
 */
exports.getOne = function (req, res) {
	var query = {
		email: req.params.id
	}
	accountService.getOne(query, null, {}, (err, user) => {
		if (err) {
			res.json({
				success: false,
				msg: "Failed to get User",
				error: err
			});
		} else if (!user) {
			res.json({
				success: false,
				msg: "No user found with this id",
				response: null
			});
		} else {
			res.json({
				success: true,
				msg: "User Found",
				response: user
			});
		}
	});
}

exports.updateUser=function(req, res){
	var query = {
		_id: req.user._id
	}
	accountService.getOne(query, null, {}, (err, user) => {
		if (err) {
			res.json({
				success: false,
				msg: "Failed to get User",
				error: err
			});
		} else if (!user) {
			res.json({
				success: false,
				msg: "No user found with this id",
				response: null
			});
		} else {
				if(req.body.firstName)
					user.firstName=req.body.firstName;
				if(req.body.surName)
					user.surName= req.body.surName;
				if(req.body.surName)
					user.birthday= req.body.birthday;
				if(req.body.surName)
					user.birthmonth= req.body.birthmonth;
				if(req.body.birthyear)
					user.birthyear= req.body.birthyear;
				if(req.body.gender)
					user.gender= req.body.gender;
				if(req.body.isFriendRequestSeen && req.body.isFriendRequestSeen==true)
					user.isFriendRequestSeen=true;
				else
					user.isFriendRequestSeen=false;

					accountService.findByIdAndUpdate(req.user._id,{},user, (updateerr, updateuser) => {
						if (updateerr) {
							res.json({
								success: false,
								msg: "Failed to update user"
							});
						} else if (updateuser) {
							res.json({
							success: true,
							msg: "User Found",
							response: updateuser
							});
						}
					});
			//});
		}
	});



}

/**
 * testing mail server
 */
exports.testMail = function (req, res) {
	var link = "http://" + req.get('host') + "/users/verify?id=test";
	var mailOptions = {
		from: 'raju.technoxis@gmail.com',
		to: 'raju.aag@gmail.com',
		subject: 'Sending Email using Node.js',
		html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
	};

	mailConfig.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
			res.json(error);
		} else {
			console.log('Email sent: ' + info.response);
			res.json("success");
		}
	});
}


function checkUser(email) {
	var isExists = false;
	var query = {
		email: email
	}
	accountService.getOne(query, null, {}, (err, user) => {
		if (err) {
			return true;
		} else if (!user) {
			return false;
		} else {
			return true;
		}
	});

}
