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
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    comment_likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommentLike",
        },
    ],
    actionDate: {
        type: Date,
        default: Date.now()
    }
});

commentSchema.virtual("id").get(function (params) {
    return this._id.toHexString();
});

commentSchema.set("toJSON", {
    virtuals: true,
});

const Comment = mongoose.model('Comment', commentSchema);

exports.Comment = Comment;