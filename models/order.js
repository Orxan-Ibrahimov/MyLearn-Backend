const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
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

const Order = mongoose.model('Order', orderSchema);

exports.Order = Order;