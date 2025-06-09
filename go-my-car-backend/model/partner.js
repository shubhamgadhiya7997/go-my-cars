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
    detail: {
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
partnerModal.plugin(aggregatePaginate);
module.exports = mongoose.model("partners", partnerModal);