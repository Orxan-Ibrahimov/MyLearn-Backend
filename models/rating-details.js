const mongoose = require("mongoose");

const RatingDetailsSchema = mongoose.Schema({
  point: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  colour: {
    type: String,
    required: true,
  },
  idea: {
    type: String,
    required: true,
  },
  actionDate: {
    type: Date,
    default: Date.now(),
  },
});

RatingDetailsSchema.virtual("id").get(function (params) {
   return this._id.toHexString();
});

RatingDetailsSchema.set("toJSON", {
   virtuals: true,
});

const RatingDetails = mongoose.model("RatingDetails", RatingDetailsSchema);

exports.RatingDetails = RatingDetails;
