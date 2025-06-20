const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const couponScheme = new mongoose.Schema({
    couponCode:{
        type: String,
        unique: true
    },
    amount:{
        type: Number
    },
    isActive:{
        type: Boolean,
        default:false
    }
}, {timestamps: true});

couponScheme.plugin(aggregatePaginate);
module.exports = mongoose.model("coupons", couponScheme);