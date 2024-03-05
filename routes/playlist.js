const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { Playlist } = require("../models/playlist");
const { User } = require("../models/user");
const path = require("path");
const playlistPath = "public/courses";

const FILE_TYPES = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let typeError = new Error({ message: "image type was not valid!" });
    const isValid = FILE_TYPES[file.mimetype];
    if (isValid) typeError = null;
    cb(typeError, playlistPath);
  },
  filename: function (req, file, cb) {
    const filename = file.fieldname.replace(" ", "-");
    const extension = FILE_TYPES[file.mimetype];
    cb(null, `myimagefor${filename}${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// Playlist GET Request To Get The Playlists List
router.get("/", async (req, res) => {
  const playlists = await Playlist.find();
  if (!playlists)
    return res
      .status(404)
      .json({ success: false, message: "Not found any playlist!" });

  res.status(200).send(playlists);
});

// Playlist GET Request To Get The Playlist For Id
router.get("/:pid", async (req, res) => {
  const playlist = await Playlist.findById(req.params.pid);
  if (!playlist)
    return res
      .status(404)
      .json({ success: false, message: "The playlist not found!" });

  res.status(200).send(playlist);
});

// Playlist POST Request To Added A New Playlist
router.post("/", uploadOptions.single("cover"), async (req, res) => {
  let creator = await User.findById(req.body.creator);
  if (!creator)
    return res
      .status(404)
      .json({ success: false, message: "The creator was not at Database" });

  const file = req.file;
  if (!file)
    return res
      .status(500)
      .send({ success: false, message: "image was not sended!" });

  const basePath = `${req.protocol}://${req.get("host")}/${playlistPath}/`;
  let playlist = new Playlist({
    title: req.body.title,
    cover: `${basePath}${file.filename}`,
    description: req.body.description,
    price: req.body.price,
    creator: req.body.creator,
  });

  playlist = await playlist.save();

  if (!playlist)
    return res
      .status(400)
      .json({ success: false, message: "The playlist can not be created!" });

  // Added a course to the user's courses that he teach
  let user = await User.findById(playlist.creator);
  if (user) {
    if (!user.myCourses.includes(playlist)) user.myCourses.push(playlist);
    user = await user.save();
  }
  res.status(201).send(playlist);
});

router.put("/:pid", async (req, res) => {
    
});

// Playlist DELETE Request To Remove The Playlist For Id
router.delete("/:pid", async (req, res) => {
  const playlist = Playlist.findByIdAndDelete(req.params.pid)
    .then(async (removedPlaylist) => {
      if (!removedPlaylist)
        return res
          .status(400)
          .json({ success: false, message: "The playlist can not be added!" });      

      // Delete course from user's myCourses list that he teach
      let user = await User.findById(removedPlaylist.creator);
      if (user) {
        let courseIndex = user.myCourses.indexOf(removedPlaylist.id);
        if (courseIndex > -1) user.myCourses.splice(courseIndex, 1);
        user = await user.save();
      }

      let coverPath = removedPlaylist.cover.split("/");
      coverPath = coverPath[coverPath.length - 1];
      coverPath = path.join(__dirname, `../${playlistPath}`, coverPath);
      console.log("cover path:", coverPath);
      let checkImage = await fs.existsSync(coverPath, (exists) => exists);
      if(checkImage) await fs.unlinkSync(coverPath);

      res.status(200).send(removedPlaylist);
    })
    .catch((err) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
    });
});

module.exports = router;
