const mongoose = require("mongoose");

function GetLocalTime() {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + 4 + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  return dateTime;
}

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
    default: GetLocalTime(),
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }],
  likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Likes'
  }]
});

const Lesson = mongoose.model("Lesson", LessonSchema);

exports.Lesson = Lesson;