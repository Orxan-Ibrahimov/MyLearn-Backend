const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const http = require("http");
const path = require("path");

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
    cb(typeError, "public/avatars");
  },
  filename: function (req, file, cb) {
    const filename = file.fieldname.replace(" ", "-");
    const extension = FILE_TYPES[file.mimetype];
    cb(null, `myimagefor${filename}${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// let image = require('../helpers/images/default-avatars/');
router.get("/", (req, res) => {});

// User Register Request 
router.post("/register", uploadOptions.single('profile'), async (req, res) => {

  if(req.file) req.body.profile = `${req.protocol}://${req.get('host')}/public/avatars/${req.file.filename}`;

  let user = new User({
    name: req.body.name,
    surname: req.body.surname,
    nickname: req.body.nickname,
    birthday: req.body.birthday,
    phone: req.body.phone,
    email: req.body.email,
    professional: req.body.professional,
    citizenship: req.body.citizenship,
    gender: req.body.gender,
    password: bcryptjs.hashSync(req.body.password),
    profile:  req.body.profile,
    registrationDate: req.body.registrationDate,
    role: req.body.role,
  });

  user = await user.save();

  if (!user)
    return res
      .status(500)
      .json({ success: false, message: "User datas is wrong!" });

  res.status(201).send(user);
});
router.put("/", (req, res) => {});
router.delete("/", (req, res) => {});

module.exports = router;
