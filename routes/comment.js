const express = require("express");
const { Comment } = require("../models/comment");
const { Lesson } = require("../models/lesson");
const { User } = require("../models/user");
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
  let comment = new Comment({
    text: req.body.text,
    lesson: req.body.lesson,
    user: req.body.user,
    actionDate: req.body.actionDate,
  });

  comment = await comment.save();

  if (!comment)
    return res
      .status(400)
      .json({ success: false, message: "comment can not be created!!" });

  // Added Comment to the lesson's comments list
  let lesson = await Lesson.findById(req.body.lesson);

  if (!lesson)
    return res
      .status(400)
      .json({ success: false, message: "comment's lesson not found!" });
  console.log("lesson: ", lesson);
  lesson.comments.push(comment);
  lesson = await lesson.save();

  // Added Comment to the user's comments list
  let user = await User.findById(req.body.user);

  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "comment's user not found!" });
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
  const comment = Comment.findByIdAndDelete(req.params.cid)
    .then(async (deletedComment) => {
      if (!deletedComment)
        return res
          .status(400)
          .json({ success: false, message: "Comment can not be deleted!" });

      // Delete Comment From Lesson's Comments List
      let lesson = await Lesson.findById(deletedComment.lesson);
      commnetIndexAtLessonComments = lesson.comments.indexOf(deletedComment.id);
      if (commnetIndexAtLessonComments > -1) {
        lesson.comments.splice(commnetIndexAtLessonComments, 1);
        lesson = await lesson.save();
      }

      // Delete Comment From User's Comments List
      let user = await User.findById(deletedComment.user);
      commnetIndexAtUserComments = user.comments.indexOf(deletedComment.id);
      if (commnetIndexAtUserComments > -1) {
        user.comments.splice(commnetIndexAtUserComments, 1);
        user = await user.save();
      }
      res.status(200).send(deletedComment);
    })
    .catch((err) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
    });
});

module.exports = router;
