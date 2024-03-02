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

const Citizenship = mongoose.model('Citizenship', CitizenshipSchema);

exports.Citizenship = Citizenship;