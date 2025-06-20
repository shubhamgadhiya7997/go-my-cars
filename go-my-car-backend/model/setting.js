const mongoose = require("mongoose");

const settingModal = new mongoose.Schema({
    termsAndCondition: {
        type: String,
    },
    privacyPolicy: {
        type: String
    },
    protectionFees:{
        type: Number,
        default:0
    },
    convenienceFees:{
        type: Number,
        default:0
    }
}, {timestamps: true});

module.exports = mongoose.model("settings", settingModal);
