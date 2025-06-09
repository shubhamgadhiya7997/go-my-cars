const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const supportModal = new mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    comment: {
        type: String,
        require: true
    },
    userID: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    reply: {
        type: String
    }
},
{timestamps: true}
);
supportModal.plugin(aggregatePaginate);
module.exports = mongoose.model("supports", supportModal);