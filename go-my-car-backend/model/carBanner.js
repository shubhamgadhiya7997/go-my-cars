const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const carBannerModal = new mongoose.Schema({
    carImage: {
        type: Object,
    },
    isSelected: {
        type: Boolean,
        default: false
    }
},
{timestamps: true}
);
carBannerModal.plugin(aggregatePaginate);
module.exports = mongoose.model("banners", carBannerModal);