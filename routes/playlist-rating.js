const express = require("express");
const { User } = require("../models/user");
const { Playlist } = require("../models/playlist");
const { PlaylistRating } = require("../models/playlist-rating");
const router = express.Router();

// PlaylistRating GET Request To Get The Playlist Ratings List
router.get("/", async (req, res) => {
  const playlistRatingLists = await PlaylistRating.find().populate([
    "course",
    "user",
    "ratingDetails",
  ]);

  if (!playlistRatingLists)
    return res
      .status(404)
      .json({ success: false, message: "Not found any course rating!" });

  res.status(200).send(playlistRatingLists);
});

// PlaylistRating GET Request To Get The Playlist Rating By Id
router.get("/:prid", async (req, res) => {
  const playlistRating = await PlaylistRating.findById(
    req.params.prid
  ).populate(["course", "user", "ratingDetails"]);

  if (!playlistRating)
    return res
      .status(404)
      .json({ success: false, message: "Course rating not found!" });

  res.status(200).send(playlistRating);
});

// PlaylistRating POST Request To Create A New Playlist Rating
router.post("/", async (req, res) => {
  let playlistRating = new PlaylistRating({
    course: req.body.course,
    user: req.body.user,
    ratingDetails: req.body.ratingDetails,
  });

  playlistRating = await playlistRating.save();

  if (!playlistRating)
    return res
      .status(400)
      .json({ success: false, message: "course rating can not be added!" });

  // add to user's ratings list
  let user = await User.findById(playlistRating.user);
  if (user) {
    if (!user.ratings.includes(playlistRating))
      user.ratings.push(playlistRating);
    user = await user.save();
  }

  // add to course's ratings list
  let course = await Playlist.findById(playlistRating.course);
  if (course) {
    if (!course.ratings.includes(playlistRating))
      course.ratings.push(playlistRating);
    course = await course.save();
  }

  res.status(201).send(playlistRating);
});

// PlaylistRating PUT Request To Modify The Playlist Rating
router.put("/:prid", async (req, res) => {
  const playlistRating = await PlaylistRating.findByIdAndUpdate(
    req.params.prid,
    {
      ratingDetails: req.body.ratingDetails,
    },
    { new: true }
  )
    .then((modifiedPR) => {
      if (!modifiedPR)
        return res.status(400).json({
          success: false,
          message: "Course rating can not be modifying!",
        });

      res.status(200).send(modifiedPR);
    })
    .catch((err) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
    });
});

// delete function can not be added
module.exports = router;
