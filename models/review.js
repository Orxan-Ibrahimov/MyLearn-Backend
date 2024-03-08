const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    default: "",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  actionDate: {
    type: Date,
    default: Date.now(),
  },
  ratingDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RatingDetails",
    required: true,
  }
});

const Review = mongoose.model("Review", reviewSchema);

exports.Review = Review;
