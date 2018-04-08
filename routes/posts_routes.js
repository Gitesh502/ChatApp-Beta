const express = require("express");
const router = express.Router();
const passport = require("passport");
const postController = require("../controller/posts_controller/posts");

router.post("/submitPost", postController.save);
router.post(
  "/submitComment",
  passport.authenticate("jwt", {
    session: false
  }),
  postController.saveComment
);
router.post(
  "/submitChildComment",
  passport.authenticate("jwt", {
    session: false
  }),
  postController.saveSubComment
);

router.get(
  "/get",
  passport.authenticate("jwt", {
    session: false
  }),
  postController.get
);

router.get("/getPostByPostedBy/:id", postController.getPostByPostedBy);

router.delete(
  "/deletePost",
  passport.authenticate("jwt", {
    session: false
  }),
  postController.deletePost
);

router.get(
  "/getCommentsByPostId/:postId",
  passport.authenticate("jwt", {
    session: false
  }),
  postController.getCommentsByPostId
);

module.exports = router;
