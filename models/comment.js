const mongoose = require('mongoose');

function GetLocalTime() {
    var today = new Date();
    var date =
      today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    var time =
      today.getHours() + 4 + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
  
    return dateTime;
  }

const commentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
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
        default: GetLocalTime()
    }
});

const Comment = mongoose.model('Comment', commentSchema);

exports.Comment = Comment;