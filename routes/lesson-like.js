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

router.delete("/:lid", async (req, res) => {
  const like = Like.findByIdAndDelete(req.params.lid)
    .then(async (removedLike) => {
      if (!removedLike)
        return res
          .status(400)
          .json({ success: false, message: "The like can not be deleted!" });

      // Delete Removed Like From User's Likes List
      let user = await User.findById(removedLike.user);
      if (user) {
        commnetIndexAtUserLikes = user?.likes.indexOf(removedLike.id);
        if (commnetIndexAtUserLikes > -1) {
          user.likes.splice(commnetIndexAtUserLikes, 1);
          user = await user.save();
        }
      }

      // Delete Removed Like From Lesson's Likes List
      let lesson = await Lesson.findById(removedLike.lesson);
      if (lesson) {
        commnetIndexAtLessonLikes = lesson?.likes.indexOf(removedLike.id);
        if (commnetIndexAtLessonLikes > -1) {
          lesson.likes.splice(commnetIndexAtLessonLikes, 1);
          lesson = await lesson.save();
        }
      }

      res.status(200).send(removedLike);
    })
    .catch((err) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
    });
});

module.exports = router;
