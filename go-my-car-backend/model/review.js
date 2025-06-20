const mongoose = require("mongoose");

const reviewModal = new mongoose.Schema({
    carID: {
        type: mongoose.Types.ObjectId,
        ref: "cars"
    },
    review: [{
        userID: {
            type: mongoose.Types.ObjectId,
            ref: "users"
        },
        comment: {
            type: String
        },
        rating: {
            type: Number
        }
    }]

}, { timestamps: true });

module.exports = mongoose.model("reviews", reviewModal);