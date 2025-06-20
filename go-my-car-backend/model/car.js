const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const carModal = new mongoose.Schema({
    carName: {
        type: String,
        require: true
    },
    carModal: {
        type: Date,
        require: true
    },
    carGear: {
        type: String,
        require: true
    },
    fastag: {
        type: Boolean,
         require: true
    },
    carType: {
        type: String,
        require: true
    },
    price: {
        price1hr: {
            type: Number,
            required: true
        },
        price8hr: {
            type: Number,
            required: true
        },
        price12hr: {
            type: Number,
            required: true
        },
        fullDay: {
            type: Number,
            required: true
        }
    },
    isAvailable: {
        type: Boolean,
        require: true
    },
    availableDates: [{
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
    }],
    unavailableDates: [{
        startDate: { type: Date, },
        endDate: { type: Date, }
    }],

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
        require: true
    },
    carImage: {
        type: Object,
        require: true
    },
    chassicNo: {
        type: String,
    },
    engineNo: {
        type: String,
    },
    NumberPlate: {
        type: String,
    },
    insuranceExpiry: {
        type: Date
    },
    carColor: {
        type: String
    }

},
    { timestamps: true }
);
carModal.plugin(aggregatePaginate);
module.exports = mongoose.model("cars", carModal);