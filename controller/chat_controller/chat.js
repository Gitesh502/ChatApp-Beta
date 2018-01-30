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
	var query = {
		$and: [{
			userIds: req.body.to
		}, {
			userIds: req.user._id
		}]
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
					sender: req.user._id,
					recipient: req.body.to
				}],
				userIds: [
					req.body.to, req.user._id
				],
				updated_at: new Date()
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
					var newMessage = _.orderBy(newChat.conversation, 'createdOn', 'desc');
					res.json({
						success: true,
						msg: "Message saved to database",
						response: newChat,
						msgToSend: {
							chatId: newChat._id,
							message: newMessage[0]
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
			chatService.getOne(query, null, {}, (err, chat) => {
				if (err) throw err;
				if (chat) {
					chat.conversation.push({
						message: req.body.message,
						sender: req.user._id,
						recipient: req.body.to
					});
					chat.updated_at = new Date();
					chatService.save(chat, (err, newChat, numAffected) => {
						if (err) {
							res.json({
								success: false,
								msg: "Message could not delivered",
								error: err
							});
						} else {
							var newMessage = _.orderBy(newChat.conversation, 'createdOn', 'desc');
							res.json({
								success: true,
								msg: "Message saved to database",
								response: newChat,
								msgToSend: {
									chatId: newChat._id,
									message: newMessage[0]
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
		$and: [{
			userIds: req.query.toId
		}, {
			userIds: req.user._id
		}]
	};
	chatService.get(query, null,null, null, (err, messages) => {
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
exports.getChatByUserIds = function (req, res) {
	var query = {
		$and: [{
			userIds: req.query.toId
		}, {
			userIds: req.user._id
		}]
	};
	chatService.get(query,null, null, null, (err, chat) => {
		if (err) throw err;
		if (!chat) {
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
		} else if (chat) {
			res.json({
				success: true,
				msg: "",
				response: chat._id
			});
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
	chatService.get(query, popuatQuery,null, sortOptions, (err, chats) => {
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
