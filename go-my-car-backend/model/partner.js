const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const partnerModal = new mongoose.Schema({
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
    location: {
        type: String,
        require: true
    },
    area:{
        type: String,
        require: true
    },
    registrationDate: {
        type: Date,
        require: true
    },
    carName: {
        type: String,
        require: true
    },
    carNumber: {
        type: String,
        require: true
    },

    reply: {
        type: String
    }
},
    { timestamps: true }
);
partnerModal.plugin(aggregatePaginate);
module.exports = mongoose.model("partners", partnerModal);