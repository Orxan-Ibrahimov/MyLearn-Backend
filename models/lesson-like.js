const mongoose = require("mongoose");

const LikeSchema = mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  actionDate: {
    type: Date,
    default: Date.now()
  }
});

const Like = mongoose.model("Like", LikeSchema);

exports.Like = Like;