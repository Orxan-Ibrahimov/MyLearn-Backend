const mongoose = require("mongoose");

const LessonSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  cover: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }],
  // comments: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Comment'
  // },
  // likes: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Likes'
  // }
});

const Lesson = mongoose.model("Lesson", LessonSchema);

exports.Lesson = Lesson;
