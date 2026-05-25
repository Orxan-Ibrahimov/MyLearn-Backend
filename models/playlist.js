const mongoose = require("mongoose");

const playlistSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  cover: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      default: [],
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaylistRating",
    },
  ],
});

playlistSchema.virtual("id").get(function (params) {
  return this._id.toHexString();
});

playlistSchema.set("toJSON", {
  virtuals: true,
});

const Playlist = mongoose.model("Playlist", playlistSchema);

exports.Playlist = Playlist;
