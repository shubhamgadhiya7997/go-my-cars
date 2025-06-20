const moment = require("moment");
const booking = require("../../model/booking");
const { SuccessCreated, InternalServerError, SuccessOk, BadRequest } = require("../../Response/response");
const { getDataByPaginate } = require("../../common/common");
const Mail = require("../../mailer/mail");
const { default: mongoose } = require("mongoose");
const car = require("../../model/car");

const addBooking = async (req, res) => {
    try {
        const { carID, location, startDate, endDate, couponCode } = req.body;
        const start = moment(startDate);
        const end = moment(endDate);
        if (!start.isValid() || !end.isValid()) {
            return BadRequest(res, "Invalid date format",)
        }

        const bufferStart = moment(start).subtract(2, 'hours');
        const bufferEnd = moment(end).add(2, 'hours');

        const conflictingBookings = await booking.find({
            carID: carID,
            startDate: { $lte: bufferEnd.toDate() },
            endDate: { $gte: bufferStart.toDate() },
            status: { $ne: "Cancelled" }
        });
        console.log("conflictingBookings", conflictingBookings)
        if (conflictingBookings.length > 0) {
            return BadRequest(res, "Car already booked.");

        }
        console.log("req.user", req.user)
        const carbookingdata = new booking({
            userID: req.user._id, carID, startDate: startDate, endDate: endDate, location, couponCode
        })
        await carbookingdata.save();
        const sendmail = Mail.SendBooking(req.user.email, req.user.fullName, startDate, endDate, location);

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
            $match: { userID: req.user._id, status: "Confirmed" }
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
        if (req.query.status == "Cancelled") {
            aggregate_options.push({
                $match: {
                    status: req.query.status,
                },
            });
        }
        if (req.query.status === "Confirmed") {
            const now = new Date();

            aggregate_options.push({
                $match: {
                    status: "Confirmed",
                    startDate: { $gt: now }, // starts in the future
                    endDate: { $gt: now },   // ends in the future
                },
            });
        }

        if (req.query.status === "Ongoing") {
            const now = new Date();

            aggregate_options.push({
                $match: {
                    status: "Confirmed",
                    startDate: { $lte: now },
                    endDate: { $gte: now },
                },
            });
        }
        if (req.query.status === "Completed") {
            const now = new Date();

            aggregate_options.push({
                $match: {
                    status: "Confirmed",
                    endDate: { $lt: now },
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
        const bookingData = await booking.find({ status: "Confirmed", endDate: { $lte: start } })

        for (const element of bookingData) {
            element.status = "Completed";
            await element.save();
        }
    } catch (error) {
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const bookingData = await booking.findByIdAndUpdate(
            { _id: bookingId },
            { $set: { status: "Cancelled" } },
            { new: true }
        )
        return SuccessOk(res, "Booking cancelled successfully.", bookingData)
    } catch (error) {
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const editBooking = async (req, res) => {
    try {
        const { bookingId, carID, startDate, endDate } = req.body;
        const start = moment(startDate);
        const end = moment(endDate);

        console.log("start", start);
        console.log("end", end);

        if (!start.isValid() || !end.isValid()) {
            return BadRequest(res, "Invalid date format",)
        }

        const bufferStart = moment(start).subtract(2, 'hours');
        const bufferEnd = moment(end).add(2, 'hours');

        const conflictingBookings = await booking.find({
            _id: { $ne: bookingId },
            carID: carID,
            startDate: { $lte: bufferEnd.toDate() },
            endDate: { $gte: bufferStart.toDate() },
        });
        if (conflictingBookings.length > 0) {
            return BadRequest(res, "Car already booked for these date.");
        }
        const aggregate_options = [];
        const options = {
            page: 1,
            limit: 1,
        };
        aggregate_options.push({
            $match: {
                _id: new mongoose.Types.ObjectId(carID),
                availableDates: {
                    $elemMatch: {
                        startDate: { $lte: new Date(startDate) },
                        endDate: { $gte: new Date(endDate) },
                    },
                },
                $nor: [
                    {
                        unavailableDates: {
                            $elemMatch: {
                                startDate: { $lt: new Date(endDate) },
                                endDate: { $gt: new Date(startDate) },
                            },
                        },
                    },
                ],
            },
        });

        const aggregateQuery = car.aggregate(aggregate_options);
        const cardetail = await car.aggregatePaginate(aggregateQuery, options);

        if (cardetail.docs.length === 0) {
            return BadRequest(res, "Car not available for these dates.");
        }
        const bookingData = await booking.findOneAndUpdate(
            { _id: bookingId },
            { $set: { startDate, endDate } },
            { new: true }
        )
        return SuccessOk(res, "Booking updated successfully", bookingData);

    } catch (error) {
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

module.exports = { addBooking, getBooking, getPastBooking, editBooking, getAllBooking, deleteBooking, carBooking };
