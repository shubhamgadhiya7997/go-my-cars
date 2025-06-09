const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const notificationModal = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
},
    { timestamps: true }
);
notificationModal.plugin(aggregatePaginate);
module.exports = mongoose.model("notifications", notificationModal);