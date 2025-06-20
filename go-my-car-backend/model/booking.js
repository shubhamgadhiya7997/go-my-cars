const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const bookingModal = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    carID: {
        type: mongoose.Types.ObjectId,
        ref: "cars"
    },
    status: {
        type: String,
          enum: ['Confirmed', 'Cancelled', 'Ongoing', 'Completed'],
        default: "Confirmed"
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    couponCode: {
        type: String
    }


},
    { timestamps: true }
);
bookingModal.plugin(aggregatePaginate);
module.exports = mongoose.model("bookings", bookingModal);