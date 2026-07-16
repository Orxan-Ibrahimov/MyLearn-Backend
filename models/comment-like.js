const mongoose = require("mongoose");

const CommentLikeSchema = mongoose.Schema({
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
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

CommentLikeSchema.virtual("id").get(function (params) {
  return this._id.toHexString();
});

CommentLikeSchema.set("toJSON", {
  virtuals: true,
});

const CommentLike = mongoose.model("CommentLike", CommentLikeSchema);

exports.CommentLike = CommentLike;