const express = require("express");
const { User } = require("../models/user");
const { Playlist } = require("../models/playlist");
const { PlaylistRating } = require("../models/playlist-rating");
const router = express.Router();

router.get("/", async (req, res) => {});
router.get("/", async (req, res) => {});
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
      if(user){
        if(!user.ratings.includes(playlistRating)) user.ratings.push(playlistRating);
        user = await user.save();
      }

      // add to course's ratings list
      let course = await Playlist.findById(playlistRating.course);
      if(course){
        if(!course.ratings.includes(playlistRating)) course.ratings.push(playlistRating);
        course = await course.save();
      }

  res.status(201).send(playlistRating);
});
// router.put('/', async (req, res) => {})
// router.delete('/', async (req, res) => {})

module.exports = router;
