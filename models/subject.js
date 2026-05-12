const mongoose = require('mongoose');

const SubjectSchema = mongoose.Schema({
    subject: {
        type: String,
        required:true
    },
    image: {
        type: String,
        required:true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
    }]
});

SubjectSchema.virtual("id").get(function (params) {
  return this._id.toHexString();
});

SubjectSchema.set("toJSON", {
  virtuals: true,
});

const Subject = mongoose.model('Subject', SubjectSchema);

exports.Subject = Subject;