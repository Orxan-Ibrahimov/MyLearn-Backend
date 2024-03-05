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

const playlistSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
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
    default: GetLocalTime(),
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // ratings: [
  //     {
  //         type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Rating',
  //     }
  // ]
});

const Playlist = mongoose.model("Playlist", playlistSchema);

exports.Playlist = Playlist;
