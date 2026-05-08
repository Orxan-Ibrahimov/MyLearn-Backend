const mongoose = require('mongoose');

const CitizenshipSchema = mongoose.Schema({
    citizenship: {
        type: String,
        required:true
    },
    flag: {
        type: String,
        required:true
    },
    citizens: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
});

CitizenshipSchema.virtual("id").get(function (params) {
  return this._id.toHexString();
});

CitizenshipSchema.set("toJSON", {
  virtuals: true,
});

const Citizenship = mongoose.model('Citizenship', CitizenshipSchema);

exports.Citizenship = Citizenship;