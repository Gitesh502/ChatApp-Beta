const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController=require('../controller/posts_controller/posts');

router.post('/submitPost',postController.save);

router.get('/getAll',postController.get);

router.get('/getPostByPostedBy/:id',postController.getPostByPostedBy);

router.delete('/deletePost',passport.authenticate('jwt', {
	session: false,
}),postController.deletePost)

module.exports = router;

