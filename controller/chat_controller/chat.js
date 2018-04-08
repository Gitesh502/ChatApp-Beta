const express = require('express');
const app = express();
const Chat = require('../../models/chat_model');
const chatService = require('../../services/chat_service');
const accountService = require('../../services/account_service');
const filters = require('../../helpers/distinctFilter');
const _ = require("lodash");
var mongoose = require('mongoose');

/**
 * Method for saving messages to database
 * checks if there is record (converstation between users) by passing logged user id and userId of reciptent
 * if there is record then will update the chat document
 * if there is no record than will save to new reocrd and returns the new message that saved
 */
exports.save = function (req, res) {
	var query = {};
	var request = req.body;
	query = {
		chatId: request.chatId
	};
	/**
	 * @param  {query is just a filter condition for where condition} query
	 * @param  {null is population query here its null} null
	 * @param  {empty object is sortOptiion we do not need sorting} {}
	 * @param  {using arrow function as allback function ,it takes err and object that is returned from serivce} callback function
	 */
	chatService.getOne(query, null, {}, (err, chat) => {
		if (err) throw err;
		if (!chat) {

			let newChat = new Chat({
				conversation: [{
					message: req.body.message,
					sentBy: req.user._id,
					sentTo: req.body.recipient
				}],
				userIds: [
					req.body.recipient, req.user._id
				],
				updatedAt: new Date().toISOString(),
				createdBy: req.user._id,
				isGroup: request.isGroup
			});
			/**
			 * @param {newChat is new chat object that is to be saved to database} newChat
			 * @callback
			 */
			chatService.save(newChat, (err, newChat, numAffected) => {
				if (err) {
					res.json({
						success: false,
						msg: "Message could not delivered",
						error: err
					});
				} else {
					var newMessage = _.last(newChat.conversation.toObject());
					res.json({
						success: true,
						msg: "Message saved to database",
						response: newChat,
						msgToSend: {
							chatId: newChat.chatId,
							message: newMessage,
							isGroup: newChat.isGroup
						}
					});
				}
			});
		} else if (chat) {
			/**
			 * here getting record than uptaiing it, we can use findAndUpdate
			 */
			var query = {
				_id: chat._id
			};
			chatService.getOne(query, null, {}, (err, prevchat) => {
				if (err) throw err;
				if (prevchat) {
					prevchat.conversation.push({
						message: req.body.message,
						sentBy: req.user._id,
						sentTo: req.body.recipient
					});
					prevchat.updatedAt = new Date().toISOString();
					prevchat.createdBy = req.user._id;
					chatService.save(prevchat, (err, newChat, numAffected) => {
						if (err) {
							res.json({
								success: false,
								msg: "Message could not delivered",
								error: err
							});
						} else {
							var newMessage = _.last(newChat.conversation.toObject());
							res.json({
								success: true,
								msg: "Message saved to database",
								response: newChat,
								msgToSend: {
									chatId: newChat.chatId,
									message: newMessage,
									isGroup: newChat.isGroup
								}
							});
						}
					});
				}
			});
		}
	});
}

/**
 * Fetches the messages or converstation between two users
 * returns list of messages to user
 */
exports.getMessages = function (req, res) {
	var query = {
		chatId: req.query.chatId
	};

	var populate = {
		path: 'conversation.sender',
		select: 'firstName surName _id'
	};
	chatService.get(query, populate, null, null, (err, messages) => {
		if (err) throw err;
		else res.json({
			success: true,
			msg: "",
			response: messages
		});
	});
}
/**
 * checking if there is chat between two users
 * if there is one than updating and returning the chatid to user
 * if not ,creating a new record to database and returning newly created chatid
 */
exports.getChatId = function (req, res) {
	var params = {
		toId: req.query.toId,
		fromId: req.user._id
	};
	exports.getChatByUserIds(params, (isExisits, chat) => {
		if (!isExisits) {
			let newChat = new Chat({
				conversation: [],
				userIds: [
					req.query.toId, req.user._id
				]
			});
			chatService.save(newChat, (err, newChat, numAffected) => {
				if (err) {
					res.json({
						success: false,
						msg: "",
						error: err
					});
				} else {
					res.json({
						success: true,
						msg: "",
						response: newChat._id
					});
				}
			});
		} else {
			res.json({
				success: true,
				msg: "",
				response: chat._id
			});
		}
	});
}



exports.getChatByUserIds = function (params, callback) {
	var query = {
		$and: [{
			userIds: params.toId
		}, {
			userIds: params.fromId
		}]
	};
	chatService.getOne(query, null, null, (err, chat) => {
		if (err) throw err;
		if (!chat) {
			callback(false, null);

		} else if (chat) {
			callback(true, chat);
		} else {
			callback(false, null);
		}
	});
}

/**
 * Fecthes all chats and users with whome logged users had a chat
 */
exports.getMessengers = function (req, res) {
	var query = {
		$and: [{
			userIds: {
				$in: [req.user._id]
			}
		}, {
			$where: "this.conversation.length>0"
		}]
	};
	var popuatQuery = {
		path: 'userIds',
		match: {
			_id: {
				$ne: req.user._id
			}
		},
		populate: {
			path: 'profileImages',
			match: {
				IsActive: true
			}
		}
	};
	var sortOptions = {
		updated_at: "-1"
	};
	chatService.get(query, popuatQuery, null, sortOptions, (err, chats) => {
		if (err)
			throw err;
		if (chats) {
			res.json({
				success: true,
				msg: "success",
				response: chats
			});
		}
	});
}


exports.createGroup = function (req, res) {
	var requestData = req.body;
	var userIds = req.body.userIds;
	userIds.push(req.user._id);
	let newChat = new Chat({
		conversation: [],
		userIds: userIds,
		isGroup: true,
		groupName: req.body.groupName,
		updatedAt: new Date().toISOString(),
		chatId: mongoose.Types.ObjectId(),
		createdBy: req.user._id
	});
	chatService.save(newChat, (err, newChat, numAffected) => {
		if (err) {
			res.json({
				success: false,
				msg: "Group could not be created",
				error: err
			});
		} else {
			res.json({
				success: true,
				msg: "Group created sucessfully",
				response: newChat
			});
		}
	});
}


exports.getGroups = function (req, res) {
	var query = {

		$and: [{
				isGroup: true
			},
			{
				$or: [{
					createdBy: req.user._id
				}, {
					userIds: req.user._id
				}]
			}
		]
	};
	chatService.get(query, null, null, null, (err, groups) => {
		if (err) {
			throw err;
		}

		res.json({
			success: true,
			msg: "Success",
			response: groups
		});
	});
}

exports.createChat = function (req, res) {
	var requestData = req.body;
	var user = req.user;
	var userIds = [user._id];
	userIds.push(requestData.sentTo);
	var params = {
		toId: requestData.sentTo,
		fromId: user._id
	};
	exports.getChatByUserIds(params, (isExisits, chat) => {
		if (!isExisits) {
			let newChat = new Chat({
				chatId: mongoose.Types.ObjectId(),
				conversation: [],
				isDelete: false,
				createdBy: user._id,
				updatedAt: new Date().toISOString(),
				userIds: userIds,
			});

			chatService.save(newChat, (err, newChat, numAffected) => {
				if (err) {
					res.json({
						success: false,
						msg: "chat could not be created",
						error: err
					});
				} else {
					res.json({
						success: true,
						msg: "chat created sucessfully",
						response: newChat.chatId
					});
				}
			});
		} else {
			res.json({
				success: true,
				msg: "chat created sucessfully",
				response: chat.chatId
			});
		}
	});


}