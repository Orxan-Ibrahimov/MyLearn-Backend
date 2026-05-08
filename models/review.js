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

reviewSchema.virtual("id").get(function (params) {
   return this._id.toHexString();
});

reviewSchema.set("toJSON", {
   virtuals: true,
});

const Review = mongoose.model("Review", reviewSchema);

exports.Review = Review;
