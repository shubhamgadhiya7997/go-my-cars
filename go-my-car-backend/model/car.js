const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const carModal = new mongoose.Schema({
    carName: {
        type: String,
        require: true
    },
    carModal: {
        type: Number,
        require: true
    },
    carGear: {
        type: String,
        require: true
    },
    carType: {
        type: String,
        require: true
    },
    carSheet: {
        type: String,
        require: true
    },
    fastag: {
        type: Boolean,
        require: true
    },
    carPrice: {
        type: Number,
        require: true
    },
    isAvailable: {
        type: Boolean,
        require: true
    },
    startDate: {
        type: Date,
        require: true
    },
    endDate: {
        type: Date,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    hostName: {
        type: String,
        require: true
    },
    feature: {
        type: Object,
        require:true
    },
    carImage: {
        type: Object,
        require:true
    }
},
{timestamps: true}
);
carModal.plugin(aggregatePaginate);
module.exports = mongoose.model("cars", carModal);