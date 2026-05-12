const express = require("express");
const { Subject } = require("../models/Subject");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { Roles } = require("../helpers/enums/role");
const authJwt = require("../helpers/secure/auth");
const authorize = require("../helpers/secure/role_auth");
const path = require("path");

// Apply authentication to ALL routes in this file
// router.use(authJwt());

// Apply role restriction to ALL routes in this file
// router.use(authorize([Roles.hero, Roles.superhero]));

const uploadPath = path.join(__dirname, "../public/subjects");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

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
    cb(typeError, "public/subjects");
  },
  filename: function (req, file, cb) {
    const filename = file.fieldname.replace(" ", "-");
    const extension = FILE_TYPES[file.mimetype];
    cb(null, `myimagefor${filename}${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// Subjects get request for to get Subjects list
router.get("/", async (req, res) => {
  const subjects = await Subject.find();

  if (!subjects)
    return res
      .status(404)
      .json({ success: false, message: "not found any subject!" });

  res.send(subjects);
});

// Subjects get request for to get a Subject for id
router.get("/:sid", async (req, res) => {
  const Subject = await Subject.findById(req.params.sid);

  if (!Subject)
    return res
      .status(404)
      .json({ success: false, message: "not found the subject!" });

  res.send(Subject);
});

// Subjects POST request for to create a subject
router.post("/", uploadOptions.single("image"), async (req, res) => {
  const file = req.file;

  if (!file)
    return res
      .status(500)
      .send({ success: false, message: "image was not sended!" });

 

  const basePath = `${req.protocol}://${req.get("host")}/public/subjects/`;
  let subject = new Subject({
    subject: req.body.subject,
    image: `${basePath}${file.filename}`,
  });

  subject = await subject.save();

  if (!subject)
    return res
      .status(500)
      .json({ success: false, message: "Subject can not be added!" });

  res.status(201).send(subject);
});

// subjects PUT request for to update the subject
router.put("/:sid", uploadOptions.single("image"), async (req, res) => {
  // Find Old Subject and Check
  const oldSubject = await Subject.findById(req.params.sid);
  if (!oldSubject)
    return res
      .status(500)
      .json({ success: false, message: "Subject was not found in database" });

  // Check Image Sended Or Not
  const file = req.file;
  let newImage = oldSubject.image;
  if (file) {
    // Remove Flag Image Form Folder and Define New Flag Image Path
    let oldImage = oldSubject.image.split("/");
    oldImage = oldImage[oldImage.length - 1];
    await fs.unlinkSync(`./public/subjects/${oldImage}`, (err) => {
      if (err) res.status(500).json({ success: false, message: err });
    });

    newImage = `${req.protocol}://${req.get("host")}/public/subjects/${file.filename
      }`;
  }

  // Update Subject
  let Subject = await Subject.findByIdAndUpdate(
    req.params.sid,
    {
      Subject: req.body.Subject,
      image: newImage,
    },
    {
      new: true,
    }
  );

  if (!Subject)
    return res
      .status(500)
      .json({ success: false, message: "Subject can not be updated!" });

  res.status(201).send(Subject);
});

// subjects DELETE request for to remove the subject for id
router.delete("/:sid", async (req, res) => {
  const Subject = Subject.findByIdAndDelete(req.params.sid)
    .then((deleted_subject) => {
      let image = deleted_subject.image.split("/");
      image = image[image.length - 1];
      if (!deleted_subject)
        return res
          .status(404)
          .json({ success: false, message: "Subject can not be deleted!" });

      fs.unlink(`./public/subjects/${image}`, (err) => {
        if (err)
          return res.status(500).json({ success: false, message: err.message });
      });

      res.send(Subject);
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
});

module.exports = router;
