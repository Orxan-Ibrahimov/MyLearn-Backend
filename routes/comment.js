const express = require("express");
const { Comment } = require("../models/comment");
const { Lesson } = require("../models/lesson");
const { User } = require("../models/user");
const { CommentLike } = require("../models/comment-like");
const router = express.Router();

// comments GET request for to get the comments list
router.get("/", async (req, res) => {
  const commentsList = await Comment.find().populate(["lesson", "user"]);

  if (!commentsList)
    return res
      .status(400)
      .json({ success: false, message: "Not found any comment!" });

  res.status(200).send(commentsList);
});

// comments GET request for to get the comment
router.get("/:cid", async (req, res) => {
  const comment = await Comment.findById(req.params.cid).populate([
    "lesson",
    "user",
  ]);

  if (!comment)
    return res
      .status(400)
      .json({ success: false, message: "The comment not found!" });

  res.status(200).send(comment);
});

// comments POST request for to create a new comment
router.post("/", async (req, res) => {
  let user = await User.findOne({ nickname: req.body.user });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "comment's user not found!" });

  let lesson = await Lesson.findOne({ slug: req.body.lesson });

  if (!lesson)
    return res
      .status(400)
      .json({ success: false, message: "comment's lesson not found!" });

  let comment = new Comment({
    text: req.body.text,
    lesson: lesson._id,
    user: user._id,
    parent: req.body.parent,
    actionDate: Date.now(),
  });

  comment = await comment.save();

  if (!comment)
    return res
      .status(400)
      .json({ success: false, message: "comment can not be created!!" });

  // Added Comment to the parent's comments list
  if (req.body.parent) {
    const parentComment = await Comment.findById(req.body.parent);

    if (parentComment) {
      parentComment.replies.push(comment);
      await parentComment.save();
    }
  }

  // Added Comment to the lesson's comments list
  lesson.comments.push(comment);
  lesson = await lesson.save();

  // Added Comment to the user's comments list
  user.comments.push(comment);
  user = await user.save();

  res.status(201).send(comment);
});

// comments UPDATE request for to modify the comment
router.put("/:cid", async (req, res) => {
  const comment = Comment.findByIdAndUpdate(
    req.params.cid,
    {
      text: req.body.text,
    },
    { new: true }
  )
    .then((updatedComment) => {
      if (!updatedComment)
        return res
          .status(400)
          .json({ success: false, message: "comment can not be modifying!" });

      res.status(200).send(updatedComment);
    })
    .catch((err) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
    });
});

// comments DELETE request for to delete the comment
router.delete("/:cid", async (req, res) => {
  const deletedComment = await Comment.findByIdAndDelete(req.params.cid);

  if (!deletedComment)
    return res
      .status(400)
      .json({ success: false, message: "Comment can not be deleted!" });

  // Delete Comment From Lesson's Comments List
  let lesson = await Lesson.findById(deletedComment.lesson);

  const commnetIndexAtLessonComments = lesson.comments.indexOf(deletedComment.id);
  if (commnetIndexAtLessonComments > -1) {
    lesson.comments.splice(commnetIndexAtLessonComments, 1);
    lesson = await lesson.save();
  }

  // Delete Comment From User's Comments List
  let user = await User.findById(deletedComment.user);
  const commnetIndexAtUserComments = user.comments.indexOf(deletedComment.id);
  if (commnetIndexAtUserComments > -1) {
    user.comments.splice(commnetIndexAtUserComments, 1);
    user = await user.save();
  }

  if (deletedComment.comment_likes.length) {
    deletedComment.comment_likes.forEach(async (comment_like) => {
      const deleted_comment_like = await CommentLike.findByIdAndDelete(comment_like);

      // Delete Like From User's Comments likes List
      let user_liked = await User.findById(deleted_comment_like.user);
      const commentLikeIndexAtUserCommentLikes = user_liked.comment_likes.indexOf(deleted_comment_like.id);
      if (commentLikeIndexAtUserCommentLikes > -1) {
        user_liked.comment_likes.splice(commentLikeIndexAtUserCommentLikes, 1);
        user_liked = await user_liked.save();
      }
    });
  }

  for (const element of deletedComment.replies) {
    const deleted_element = await Comment.findByIdAndDelete(element);
    let sub_lesson = await Lesson.findById(deleted_element.lesson);

    const commnetIndexAtSubLessonComments = sub_lesson.comments.indexOf(deleted_element.id);
    if (commnetIndexAtSubLessonComments > -1) {
      sub_lesson.comments.splice(commnetIndexAtSubLessonComments, 1);
      sub_lesson = await sub_lesson.save();
    }

    // Delete Comment From User's Comments List
    let sub_user = await User.findById(deleted_element.user);
    const commnetIndexAtSubUserComments = sub_user.comments.indexOf(deleted_element.id);
    if (commnetIndexAtSubUserComments > -1) {
      sub_user.comments.splice(commnetIndexAtSubUserComments, 1);
      sub_user = await sub_user.save();
    }
    // remove subelements' likes
    for (const comment_like of deleted_element.comment_likes) {
      const deleted_comment_like = await CommentLike.findByIdAndDelete(comment_like);

      // Delete Like From User's Comments likes List For subs
      let user_liked = await User.findById(deleted_comment_like.user);
      const commentLikeIndexAtUserCommentLikes = user_liked.comment_likes.indexOf(deleted_comment_like.id);
      if (commentLikeIndexAtUserCommentLikes > -1) {
        user_liked.comment_likes.splice(commentLikeIndexAtUserCommentLikes, 1);
        user_liked = await user_liked.save();
      }
    }
  }

  res.status(200).send(deletedComment);
});

module.exports = router;