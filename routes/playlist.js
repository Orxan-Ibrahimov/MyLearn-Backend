const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { Playlist } = require("../models/playlist");
const { User } = require("../models/user");
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

router.get("/", async (req, res) => {});
router.get("/:pid", async (req, res) => {});
router.post("/", uploadOptions.single("cover"), async (req, res) => {
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

    // Added a course to the user's educations that he learn
    if (!user.myEducations.includes(playlist)) user.myEducations.push(playlist);
    user = await user.save();
  }
  res.status(201).send(playlist);
});
router.put("/:pid", async (req, res) => {});
router.delete("/:pid", async (req, res) => {});

module.exports = router;
