const mongoose = require('mongoose');

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
        default: Date.now()
    }
});

const Comment = mongoose.model('Comment', commentSchema);

exports.Comment = Comment;