const mongoose = require("mongoose");

const adminModal = new mongoose.Schema({
    email:{
        type: String
    },
    password: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("admins", adminModal);