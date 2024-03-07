const mongoose = require('mongoose');

const playlistRatingSchema = mongoose.Schema({
 course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    requiref: true
 },
 user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    requiref: true
 },
 ratingDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RatingDetails",
    requiref: true
 },
 actionDate: {
    type: Date,
    default: Date.now()
 }
});

const PlaylistRating = mongoose.model('PlaylistRating', playlistRatingSchema);

exports.PlaylistRating = PlaylistRating;
