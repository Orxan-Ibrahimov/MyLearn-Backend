const mongoose = require("mongoose");
const { Genders } = require("../helpers/enums/gender");
const { Roles } = require("../helpers/enums/role");

function GetLocalTime() {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + 4 + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  return dateTime;
}

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  professional: {
    type: String,
    default: "student",
  },
  citizenship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Citizenship",
    required: true,
  },
  gender: {
    type: String,
    enum: Object.values(Genders),
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  profile: {
    type: String,
    default: "default.jpg",
  },
  registrationDate: {
    type: Date,
    default: GetLocalTime(),
  },
  role: {
    type: String,
    enum: Object.values(Roles),
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
  myCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
    },
  ],
  myEducations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
    },
  ],
  //   ratings: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Rating'
  //   }],
});

Object.assign(UserSchema.statics, {
  Genders,
  Roles,
});

const User = mongoose.model("User", UserSchema);

exports.User = User;
