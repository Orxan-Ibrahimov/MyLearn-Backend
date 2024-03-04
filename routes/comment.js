const express = require("express");
const { Comment } = require("../models/comment");
const { Lesson } = require("../models/lesson");
const { User } = require("../models/user");
const router = express.Router();

router.get("/", async (req, res) => {
  const commentsList = await Comment.find().populate(["lesson", "user"]);

  if (!commentsList)
    return res
      .status(400)
      .json({ success: false, message: "Not found any comment!" });

  res.status(200).send(commentsList);
});
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
router.put("/:cid", async (req, res) => {});
router.delete("/:cid", async (req, res) => {});

module.exports = router;
