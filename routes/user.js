const express = require("express");
const { User } = require("../models/user");
require("dotenv/config");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Citizenship } = require("../models/citizenship");
const imageRoute = "public/avatars";

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

// GET Request For Find Users List
router.get("/", async (req, res) => {
  const userList = await User.find().select("-password");
  if (!userList)
    return res
      .status(404)
      .json({ success: false, message: "not found any user!" });

  res.status(200).send(userList);
});

// GET Request For Find Any Users
router.get("/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId)
    .select("-password")
    .populate("citizenship");
  if (!user)
    return res.status(404).json({ success: false, message: "User not found!" });

  res.status(200).send(user);
});

// GET Request For Count Users
router.get("/get/count", async (req, res) => {
  const userCount = await User.find(req.params.userId).countDocuments();

  res.status(200).send({ success: true, count: userCount });
});

// User Login Request
router.post("/login", async (req, res) => {
  const user = await User.findOne({ nickname: req.body.nickname });
  console.log("user:", user);
  // res.send(user);
});

// User Register Request
router.post("/register", uploadOptions.single("profile"), async (req, res) => {
  if (req.file)
    req.body.profile = `${req.protocol}://${req.get("host")}/${imageRoute}/${
      req.file.filename
    }`;

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
    profile: req.body.profile,
    registrationDate: req.body.registrationDate,
    role: req.body.role,
  });

  user = user
    .save()
    .then(async (createdUser) => {
      if (!createdUser)
        return res
          .status(500)
          .json({ success: false, message: "User datas is wrong!" });

      // Add User to The Users' Citizens
      let citizenship = await Citizenship.findById(
        createdUser.citizenship
      ).populate("citizens");
      console.log("citizenship:", citizenship);
      citizenship.citizens.push(createdUser.id);
      citizenship = await citizenship.save();

      res.status(201).send(createdUser);
    })
    .catch((err) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });
    });
});

router.put("/:userId", uploadOptions.single("profile"), async (req, res) => {
  // Find old user and check it
  const oldUser = await User.findById(req.params.userId);

  if (!oldUser)
    return res.status(404).json({
      success: false,
      message: "user that you want to modify can not found!",
    });

  // Define new and old profile paths
  let newProfileImage = oldUser.profile;
  let oldProfileImage;
  if (req.file) {
    oldProfileImage = oldUser.profile.split("/");
    oldProfileImage = oldProfileImage[oldProfileImage.length - 1];
    oldProfileImage = path.join(__dirname, `../${imageRoute}`, oldProfileImage);

    newProfileImage = `${req.protocol}://${req.get("host")}/${imageRoute}/${
      req.file.filename
    }`;

    console.log(oldUser);
  }
  let user = await User.findByIdAndUpdate(
    req.params.userId,
    {
      name: req.body.name,
      surname: req.body.surname,
      nickname: req.body.nickname,
      birthday: req.body.birthday,
      phone: req.body.phone,
      email: req.body.email,
      professional: req.body.professional,
      citizenship: req.body.citizenship,
      gender: req.body.gender,
      profile: newProfileImage,
      role: req.body.role,
    },
    { new: true }
  ).select("-password");

  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "user can not be updated!" });

  // remove old image from folder
  let checkProfileExists = await fs.existsSync(oldProfileImage);
  if (checkProfileExists)
    await fs.unlinkSync(oldProfileImage, (err) => {
      if (err) res.status(500).json({ success: false, message: err });
    });

  //remove old citizenship and add new citizenship at citizenships list
  if (req.body.citizenship && req.body.citizenship != oldUser.citizenship) {
    //remove user from old citizenship's citizens list
    let oldCitizenship = await Citizenship.findById(oldUser.citizenship);
    userIndexAtCitizens = oldCitizenship.citizens.indexOf(oldUser.id);
    if (userIndexAtCitizens > -1)
      oldCitizenship.citizens.splice(userIndexAtCitizens, 1);
    oldCitizenship = await oldCitizenship.save();

    //add user to new citizenship's citizens list
    let newCitizenship = await Citizenship.findById(req.body.citizenship);
    newCitizenship.citizens.push(oldUser.id);
    newCitizenship = await newCitizenship.save();
  }

  res.status(200).send(user);
});

// DELETE Request For To Remove User By Id
router.delete("/:userId", async (req, res) => {
  const user = User.findByIdAndDelete(req.params.userId)
    .then(async function (removedUser) {
      if (!removedUser)
        return res
          .status(404)
          .json({ success: false, message: "user can not find!" });

      // Remove Removed User's Profile Image
      oldProfile = removedUser.profile.split("/");
      oldProfile = oldProfile[oldProfile.length - 1];
      let profileImage = path.join(__dirname, `../${imageRoute}`, oldProfile);
      let checkImage = await fs.existsSync(profileImage, (exists) => exists);
      if (checkImage) await fs.unlinkSync(profileImage);

      // Remove User From Citizens
      let citizenship = await Citizenship.findById(removedUser.citizenship);
      if (citizenship.citizens.includes(removedUser.id)) {
        console.log("id:", removedUser.id);
        let citizenIndex = citizenship.citizens.indexOf(removedUser.id);
        console.log("citizen index:", citizenIndex);
        citizenship.citizens.splice(citizenIndex, 1);
        citizenship = await citizenship.save();
      }

      res.status(200).send(removedUser);
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: err.message });
    });
});

module.exports = router;
