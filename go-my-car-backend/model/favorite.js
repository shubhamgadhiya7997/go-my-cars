const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const favoriteScheme = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    carID: {
        type: mongoose.Types.ObjectId,
        ref: "cars"
    },

}, { timestamps: true });

favoriteScheme.plugin(aggregatePaginate);
module.exports = mongoose.model("favorites", favoriteScheme);