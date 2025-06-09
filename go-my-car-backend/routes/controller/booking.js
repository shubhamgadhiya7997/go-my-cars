const moment = require("moment");
const booking = require("../../model/booking");
const { SuccessCreated, InternalServerError, SuccessOk } = require("../../Response/response");
const { getDataByPaginate } = require("../../common/common");
const Mail = require("../../mailer/mail");

const addBooking = async (req, res) => {
    try {
        const { carID, location, startDate, endDate } = req.body;
        const start = moment(startDate);
        const end = moment(endDate);
        console.log("req.user", req.user)
        const carbookingdata = new booking({
            userID: req.user._id, carID, startDate: start, endDate: end, location
        })
        await carbookingdata.save();
             const sendmail = await Mail.SendBooking(req.user.email,req.user.fullName, start, end, location);
        
        return SuccessCreated(res, "Car booking successfully.", carbookingdata)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const getBooking = async (req, res) => {
    try {
        const { aggregate_options, options } = getDataByPaginate(req, '');
        aggregate_options.push({
            $match: { userID: req.user._id, status: "Pending" }
        })
        const aggregateQuery = booking.aggregate(aggregate_options);
        const Carbooking = await booking.aggregatePaginate(aggregateQuery, options);
        return SuccessOk(res, "Carbooking get successfully.", Carbooking)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}
const getPastBooking = async (req, res) => {
    try {
        const { aggregate_options, options } = getDataByPaginate(req, '');
        aggregate_options.push({
            $match: { userID: req.user._id, status: "Completed" }
        })
        const aggregateQuery = booking.aggregate(aggregate_options);
        const Carbooking = await booking.aggregatePaginate(aggregateQuery, options);
        return SuccessOk(res, "Carbooking get successfully.", Carbooking)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const getAllBooking = async (req, res) => {
    try {
        const { aggregate_options, options } = getDataByPaginate(req, '');

        aggregate_options.push(
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

            // Lookup and unwind car info
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
            }
        );
      
        if (req.query.search) {
            aggregate_options.push({
                $match: {
                    $or: [
                        {"user.fullName": { $regex: req.query.search, $options: 'i' } },
                    ],
                },
            });
        }
        const aggregateQuery = booking.aggregate(aggregate_options);
        const bookingdetail = await booking.aggregatePaginate(aggregateQuery, options);
        return SuccessOk(res, "Booking get successfully.", bookingdetail)



    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }


}

const carBooking = async (req, res) => {
    try {
        const start = moment().utc();

        console.log("start", start)
        const bookingData = await booking.find({ status: "Pending", endDate: { $lte: start } })

        for (const element of bookingData) {
            element.status = "Completed";
            await element.save();
        }
    } catch (error) {
        console.log("err", error);
    }
}

module.exports = { addBooking, getBooking, getPastBooking, getAllBooking, carBooking };
