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

// Lesson GET Request To Get lessons list
router.get("/", async (req, res) => {
  const lessons = await Lesson.find();

  if (!lessons)
    return res
      .status(404)
      .json({ success: false, message: "not found any lesson!" });

  res.status(200).send(lessons);
});

// Lesson GET Request To Get the lesson
router.get("/:lid", async (req, res) => {
  const lesson = await Lesson.findById(req.params.lid);

  if (!lesson)
    return res
      .status(404)
      .json({ success: false, message: "The lesson not found!" });

  res.status(200).send(lesson);
});

// Lesson POST Request To Added A New Lesson
router.post("/", uploadOptions.single("cover"), async (req, res) => {
  if (!req.file)
    return res
      .status(500)
      .json({ success: false, message: "cover image was not sended!" });

  let cover = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/lessons/`;

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

// Lesson PUT Request To edit the lesson for ID
router.put("/:lid", uploadOptions.single("cover"), async (req, res) => {
  // Find Old lesson and Check
  const oldlesson = await Lesson.findById(req.params.lid);
  if (!oldlesson)
    return res
      .status(500)
      .json({ success: false, message: "lesson was not found in database" });

  // Check Cover Image Sended Or Not
  const file = req.file;
  let newCoverImage = oldlesson.cover;
  if (file) {
    // Remove Cover Image Form Folder and Define New Cover Image Path
    let oldCoverImage = oldlesson.cover.split("/");
    oldCoverImage = oldCoverImage[oldCoverImage.length - 1];
    await fs.unlinkSync(`./public/lessons/${oldCoverImage}`, (err) => {
      if (err) return res.status(500).json({ success: false, message: err });
    });

    newCoverImage = `${req.protocol}://${req.get("host")}/public/lessons/${
      file.filename
    }`;
  }

  // Update Lesson
  let lesson = await Lesson.findByIdAndUpdate(
    req.params.lid,
    {
      name: req.body.name,
      description: req.body.description,
      isFree: req.body.isFree,
      cover: newCoverImage,
      createdDate: req.body.createdDate,
    },
    {
      new: true,
    }
  );

  if (!lesson)
    return res
      .status(500)
      .json({ success: false, message: "The lesson can not be updated!" });

  // lesson = await lesson.save();

  res.status(201).send(lesson);
});

// Lesson DELETE Request To Remove the lesson For ID
router.delete("/:lid", (req, res) => {
  let lesson = Lesson.findByIdAndDelete(req.params.lid)
    .then((oldLesson) => {
      if (!oldLesson)
        return res
          .status(400)
          .json({ success: false, message: "lesson can not be deleted!" });

      // remove cover image from folder
      let coverImage = oldLesson.cover.split("/");
      coverImage = coverImage[coverImage.length - 1];
      fs.unlink(`./public/lessons/${coverImage}`, (err) => {
        if (err)
          return res.status(500).json({ success: false, message: err.message });
      });

      res.status(200).send(lesson);
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err.message });
    });
});

module.exports = router;
