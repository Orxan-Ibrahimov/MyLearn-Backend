const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { Lesson } = require("../models/lesson");

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
    cb(typeError, "public/lessons");
  },
  filename: function (req, file, cb) {
    const filename = file.fieldname.replace(" ", "-");
    const extension = FILE_TYPES[file.mimetype];
    cb(null, `myimagefor${filename}${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get("/", async (req, res) => {});
router.get("/:lid", async (req, res) => {});

// Lesson POST Request For Added A New Lesson
router.post("/", uploadOptions.single("cover"), async (req, res) => {
  if (!req.file)
    return res
      .status(500)
      .json({ success: false, message: "cover image was not sended!" });

  let cover = req.file.filename;
  const basePath = `${req.protocol}://${req.get(
    "host"
  )}/public/lessons/`;

  let lesson = new Lesson({
    name: req.body.name,
    description: req.body.description,
    isFree: req.body.isFree,
    cover: `${basePath}${cover}`,
    createdDate: req.body.createdDate,
  });

  lesson = await lesson.save();

  if (!lesson)
    return res
      .status(500)
      .json({ success: false, message: "The lesson can not be created!" });

  res.status(201).send(lesson);
});
router.put("/:lid", async (req, res) => {});
router.delete("/:lid", async (req, res) => {});

module.exports = router;
