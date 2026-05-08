const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    message: {
        type: String,
        default: ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

contactSchema.virtual("id").get(function (params) {
  return this._id.toHexString();
});

contactSchema.set("toJSON", {
  virtuals: true,
});

const Contact = mongoose.model('Contact', contactSchema);

exports.Contact = Contact;