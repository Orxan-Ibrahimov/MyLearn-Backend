const mongoose = require('mongoose');

const educationSchema = mongoose.Schema({
    subscriber:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
        required: true
    },
    actionDate:{
        type: Date,
        default: Date.now()
    }
});

const Education = mongoose.model('Education', educationSchema);

exports.Education = Education;