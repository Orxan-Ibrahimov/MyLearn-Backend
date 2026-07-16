const express = require("express");
const { Like } = require("../models/lesson-like");
const { User } = require("../models/user");
const { Lesson } = require("../models/lesson");
const { CommentLike } = require("../models/comment-like");
const { Comment } = require("../models/comment");
const router = express.Router();

// comment likes GET request for to get comment likes list
router.get("/", async (req, res) => {
  const comment_likes = await CommentLike.find().populate(["comment", "user"]);

  if (!comment_likes)
    return res
      .status(404)
      .json({ success: false, message: "not found any like in this comment!" });

  res.status(200).send(comment_likes);
});

// comment likes GET request for to get the comment like
router.get("/:clid", async (req, res) => {
  const comment_like = await CommentLike.findById(req.params.clid).populate(["comment", "user"]);

  if (!comment_like)
    return res
      .status(404)
      .json({ success: false, message: "The like not found in this comment!" });

  res.status(200).send(comment_like);
});

// comment likes POST request for to create a new like
router.post("/", async (req, res) => {
  let user = await User.findById(req.body.user);
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "User not found!" });

  let comment = await Comment.findById(req.body.comment);
  if (!comment)
    return res
      .status(400)
      .json({ success: false, message: "Comment not found!" });


  let comment_like = new CommentLike({
    comment: comment.id,
    user: user.id,
    actionDate: Date.now(),
  });

  comment_like = await comment_like.save();

  if (!comment_like)
    return res
      .status(400)
      .json({ success: false, message: "Like can not be added for this comment!" });

  // Added like to the user's likes list
  user.comment_likes.push(comment_like.id);
  user = await user.save();

  // Added like to the lesson's likes list
  comment.comment_likes.push(comment_like.id);
  comment = await comment.save();

  res.status(201).send(comment_like);
});

router.delete("/", async (req, res) => {
  const comment_like = await CommentLike.findOne({ user: req.body.user, comment: req.body.comment });

  if (!comment_like)
    return res
      .status(400)
      .json({ success: false, message: "Like not found in this comment!" });

  const commentLikeId = comment_like._id;

  // Delete like
  await comment_like.deleteOne();

  // Remove from comment
  let comment = await Comment.findById(req.body.comment);

  if (comment) {
    const commentLikeIndex = comment.comment_likes.indexOf(commentLikeId);

    if (commentLikeIndex !== -1) {
      comment.comment_likes.splice(commentLikeIndex, 1);
      
      await comment.save();
    }
  }

  // Remove from user
  let user = await User.findById(req.body.user);

  if (user) {
    const userLikeIndex = user.comment_likes.indexOf(commentLikeId);

    if (userLikeIndex !== -1) {
      user.comment_likes.splice(userLikeIndex, 1);
      await user.save();
    }
  }

  return res.status(200).json({
    success: true,
    message: "Like removed successfully",
  });
});

module.exports = router;
