const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const locationModal = new mongoose.Schema({
    name: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
},
    { timestamps: true }
);
locationModal.plugin(aggregatePaginate);

module.exports = mongoose.model("locations", locationModal);