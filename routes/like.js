const express = require("express");
const { Like } = require("../models/like");
const { User } = require("../models/user");
const { Lesson } = require("../models/lesson");
const router = express.Router();

router.get("/", async (req, res) => {});
router.get("/:lid", async (req, res) => {});
router.post("/", async (req, res) => {
  let like = new Like({
    lesson: req.body.lesson,
    user: req.body.user,
    actionDate: req.body.actionDate,
  });

  like = await like.save();

  if (!like)
    return res
      .status(400)
      .json({ success: false, message: "like can not be added!" });

  // Added like to the user's likes list
  let user = await User.findById(like.user);
  console.log("user: ", user);
  if (!user.likes.includes(like.id)) {
    user.likes.push(like.id);
    user = await user.save();
  }

  // Added like to the lesson's likes list
  let lesson = await Lesson.findById(like.lesson);
  console.log("lesson: ", lesson);
  if (!lesson.likes.includes(like.id)) {
    lesson.likes.push(like.id);
    lesson = await lesson.save();
  }

  res.status(201).send(like);
});
router.delete("/", async (req, res) => {});

module.exports = router;
