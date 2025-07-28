const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        default: null
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isIndian: {
        type: Boolean,
        default: true
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    fcmToken: {
        type: String,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    image: [{
         type: String,
        required: false
    }
    ]

}, { timestamps: true });
userModel.plugin(aggregatePaginate);

module.exports = mongoose.model("users", userModel);