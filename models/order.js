const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const orderSchema = mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
        required: true
    },
    cardNumber: {
        type: String,
        required: true
    },
    actionDate: {
        type: Date,
        default: Date.now()
    }
});

orderSchema.virtual("id").get(function (params) {
    return this._id.toHexString();
});

orderSchema.set("toJSON", {
    virtuals: true,
});

const Order = mongoose.model('Order', orderSchema);

exports.Order = Order;