const review = require("../../model/review");
const { InternalServerError, SuccessOk } = require("../../Response/response");
const { default: mongoose } = require("mongoose");


const postReview = async (req, res) => {
    try{
        const {carID, comment, rating} = req.body;
        const reviewdata = {userID: new mongoose.Types.ObjectId(req.user._id),comment, rating}
        const reviewData = await review.findOneAndUpdate (
            {carID},
            {$push: {review:reviewdata}},
            {new : true, upsert: true}
        )
                return SuccessOk(res, "Review added successfully.", reviewData)


    }catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

module.exports = {postReview}