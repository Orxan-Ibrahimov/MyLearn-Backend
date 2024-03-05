const mongoose = require('mongoose');

function GetLocalTime() {
    var today = new Date();
    var date =
      today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    var time =
      today.getHours() + 4 + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
  
    return dateTime;
  }

const RatingDetailsSchema = mongoose.Schema({
    point: {
        type: Number,
        min:0,
        max: 5,
        required:true
    },
    colour: {
        type: String,
        required:true
    },
    idea:{
        type: String,
        required:true
    },
    actionDate:{
        type: Date,
        default: GetLocalTime()
    }
});

const RatingDetails = mongoose.model('RatingDetails', RatingDetailsSchema);

exports.RatingDetails = RatingDetails;