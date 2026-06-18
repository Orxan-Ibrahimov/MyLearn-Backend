const express = require("express");
const { Like } = require("../models/lesson-like");
const { User } = require("../models/user");
const { Lesson } = require("../models/lesson");
const router = express.Router();

// likes GET request for to get likes list
router.get("/", async (req, res) => {
  const likesList = await Like.find().populate(["lesson", "user"]);

  if (!likesList)
    return res
      .status(404)
      .json({ success: false, message: "not found any like!" });

  res.status(200).send(likesList);
});

// likes GET request for to get the like
router.get("/:lid", async (req, res) => {
  const like = await Like.findById(req.params.lid).populate(["lesson", "user"]);

  if (!like)
    return res
      .status(404)
      .json({ success: false, message: "The like not found!" });

  res.status(200).send(like);
});

// likes POST request for to create a new like
router.post("/:lid", async (req, res) => {
  let user = await User.findById(req.body.user);
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "User not found!" });

  const lesson_slug = req.params.lid;
  let lesson = await Lesson.findOne({ slug: lesson_slug });
  if (!lesson)
    return res
      .status(400)
      .json({ success: false, message: "Lesson not found!" });


  let like = new Like({
    lesson: lesson.id,
    user: user.id,
    actionDate: Date.now(),
  });

  like = await like.save();

  if (!like)
    return res
      .status(400)
      .json({ success: false, message: "Like can not be added!" });

  // Added like to the user's likes list
  user.likes.push(like.id);
  user = await user.save();

  // Added like to the lesson's likes list
  lesson.likes.push(like.id);
  lesson = await lesson.save();

  res.status(201).send(like);
});

router.delete("/:lid", async (req, res) => {
  const lesson_slug = req.params.lid;
  let lesson = await Lesson.findOne({ slug: lesson_slug });

  if (!lesson)
    return res
      .status(400)
      .json({ success: false, message: "Lesson not found!" });

  const like = await Like.findOne({ user: req.body.user, lesson: lesson.id });

  if (!like)
    return res
      .status(400)
      .json({ success: false, message: "Like not found!" });

  const likeId = like._id;

  // Delete like
  await like.deleteOne();

  // Remove from lesson
  const lessonLikeIndex = lesson.likes.indexOf(likeId);

  if (lessonLikeIndex !== -1) {
    lesson.likes.splice(lessonLikeIndex, 1);
    await lesson.save();
  }

  // Remove from user
  let user = await User.findById(req.body.user);

  if (user) {
    const userLikeIndex = user.likes.indexOf(likeId);

    if (userLikeIndex !== -1) {
      user.likes.splice(userLikeIndex, 1);
      await user.save();
    }
  }

  return res.status(200).json({
    success: true,
    message: "Like removed successfully",
  });
});

module.exports = router;
