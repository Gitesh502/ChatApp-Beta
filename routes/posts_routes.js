const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController=require('../controller/posts_controller/posts');

router.post('/submitPost',postController.submitPost);

router.get('/getAll',postController.getAllPosts);

router.get('/getPostByPostedBy/:id',postController.getPostByPostedBy);

module.exports = router;

