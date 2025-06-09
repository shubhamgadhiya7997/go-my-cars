const mongoose = require("mongoose");

const settingModal = new mongoose.Schema({
    termsAndCondition: {
        type: String,
    },
    privacyPolicy: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("settings", settingModal);
