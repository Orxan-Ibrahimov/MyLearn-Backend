const mongoose = require("mongoose");

const LessonSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
   slug: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true
  },
  isFree: {
    type: Boolean,
    default: false
  },
  cover: {
    type: String,
    required: true
  },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now()
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Likes"
    }
  ],
});

LessonSchema.virtual("id").get(function (params) {
  return this._id.toHexString();
});

LessonSchema.set("toJSON", {
  virtuals: true,
});

const Lesson = mongoose.model("Lesson", LessonSchema);

exports.Lesson = Lesson;
