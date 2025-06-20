const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userModel = new mongoose.Schema({
    fullName:{
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
    indian:{
        type: Boolean,
        default: true
    },
    profilePic:{
        type: String,
        default: null
    },
    isActive:{
        type: Boolean,
        default: true
    },
     fcmToken: {
        type: String,
        required: false
    },
    isDeleted:{
        type: Boolean,
        default: false
    },

},{timestamps: true});
userModel.plugin(aggregatePaginate);

module.exports = mongoose.model("users", userModel);