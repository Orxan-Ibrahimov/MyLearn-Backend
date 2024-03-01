const mongoose = require("mongoose");
const { Genders } = require("../helpers/enums/gender");
const { Roles } = require("../helpers/enums/role");

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
    required: true,
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
  },
  professional: {
    type: String,
    default: 'student',
  },
  citizenship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Citizenship",
    required: true,
  },
  gender: {
    type: String,
    enum: Object.values(Genders)
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
  },
  registrationDate: {
    type: Date,
    default: Date.now()
  },
  role: {
    type: String,
    enum: Object.values(Roles)
  },
//   comments: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Comment'
//   }],
//   likes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Like'
//   }],
//   myCourses: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Playlist'
//   }],
//   myEducations: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Playlist'
//   }],
//   ratings: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Rating'
//   }],

});

const User = mongoose.model("User", UserSchema);

exports.User = User;
