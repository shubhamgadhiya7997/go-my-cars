const { default: mongoose } = require("mongoose");
const { getDataByPaginate } = require("../../common/common");
const favorite = require("../../model/favorite");
const { SuccessCreated, InternalServerError, SuccessOk, BadRequest } = require("../../Response/response");

const getFavorite = async (req, res) => {
    try {
        const { aggregate_options, options } = getDataByPaginate(req, '');
        console.log("req.user._id", req.user._id)
        aggregate_options.push(
            {
                $lookup: {
                    from: 'cars',
                    localField: 'carID',
                    foreignField: '_id',
                    as: 'car',
                },
            },
            {
                $unwind: {
                    path: '$car',
                    preserveNullAndEmptyArrays: true,
                },
            },
              {
                $lookup: {
                    from: 'users',
                    localField: 'userID',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true,
                },
            },

        );
        if(req.user.userType == "user"){

            aggregate_options.push({
                $match: { userID: new mongoose.Types.ObjectId(req.user._id) }
            });
        }

         if (req.query.carName) {
  aggregate_options.push({
    $match: {
      "car.carName": { $regex: req.query.carName, $options: 'i' },
    },
  });
}
     if (req.query.carType) {
            aggregate_options.push({
                $match: {
                    "car.carType": req.query.carType,
                },
            });
        }
             if (req.query.carGear) {
            aggregate_options.push({
                $match: {
                    "car.carGear": req.query.carGear,
                },
            });
        }

 if (req.query.NumberPlate) {
  aggregate_options.push({
    $match: {
      "car.NumberPlate": { $regex: req.query.NumberPlate, $options: 'i' },
    },
  });
}
 if (req.query.fullName) {
  aggregate_options.push({
    $match: {
      "user.fullName": { $regex: req.query.fullName, $options: 'i' },
    },
  });
}
 if (req.query.email) {
  aggregate_options.push({
    $match: {
      "user.email": { $regex: req.query.email, $options: 'i' },
    },
  });
}
        const aggregateQuery = favorite.aggregate(aggregate_options);
        const favoritedetail = await favorite.aggregatePaginate(aggregateQuery, options);
        console.log("favoritedetail", favoritedetail)
        return SuccessOk(res, "favorite car get successfully.", favoritedetail)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
}

const postFavorite = async (req, res) => {
    try {
        const { carID, add } = req.body;
        console.log("req.body", req.body)
        let favoritedata
        if (!carID || typeof add === 'undefined') {
            return BadRequest(res, "All filed is required")

        }
        if (add == true) {
            favoritedata = await favorite.findOneAndUpdate(
                { userID:new mongoose.Types.ObjectId(req.user._id), carID },
                { $set: { userID: req.user._id, carID } },
                { new: true, upsert: true }
            )
            return SuccessCreated(res, "Car added in favorite successfully", favoritedata);

        } else {
            favoritedata = await favorite.findOneAndDelete({ userID: new mongoose.Types.ObjectId(req.user._id), carID })
            return SuccessCreated(res, "Car removed in favorite successfully", favoritedata);
        }
    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
}

module.exports = { getFavorite, postFavorite }