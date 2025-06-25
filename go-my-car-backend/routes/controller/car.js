const { getDataByPaginate } = require("../../common/common");
const car = require("../../model/car");
const fs = require('fs');
const path = require('path');
const moment = require("moment")
const { BadRequest, SuccessCreated, InternalServerError, NotFound, SuccessOk } = require("../../Response/response");
const booking = require("../../model/booking");
const { default: mongoose } = require("mongoose");
const setting = require("../../model/setting");

const addCar = async (req, res) => {
    try {

        let { carName, carModal, carGear,
            carType, carSeat, fastag, price,
            isAvailable, availableDates, unavailableDates,
            location, hostName, feature, chassicNo, engineNo, NumberPlate, insuranceExpiry, carColor } = req.body;
        console.log("req.body", req.body)
        console.log("req.body.price", req.body.price)


        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!req.files || req.files.length === 0) {
            return BadRequest(res, "No files uploaded.");
        }
        const invalidFiles = req.files.filter(file => !allowedTypes.includes(file.mimetype));

        if (invalidFiles.length > 0) {
            return BadRequest(res, "Unsupported file type(s). Only JPG and PNG images are allowed.");
        }

        const imagePaths = req.files.map(file => file.filename);
        console.log("imagePaths", imagePaths);

        price = JSON.parse(price);
        if (!carName || !carModal || !carGear ||
            !carType || !carSeat || !fastag || !price ||
            price.price1hr == null ||
            price.price8hr == null ||
            price.price12hr == null ||
            price.fullDay == null ||
            !isAvailable || !availableDates
            || !location || !hostName || !feature
            || !chassicNo || !engineNo || !NumberPlate
            || !insuranceExpiry || !carColor
        ) {
            return BadRequest(res, "All filed is required",)
        }
        const carModalDate = moment(carModal); // assumes carModal = 'YYYY-MM-DD'
        console.log("carModalDate", carModalDate)
        const sevenYearsAgo = moment().subtract(7, 'years');
        console.log("sevenYearsAgo", sevenYearsAgo)
        const carModalValid = carModalDate.isBefore(sevenYearsAgo)

        if (carModalValid) {
            return BadRequest(res, "Car model date not be more than 7 years old from today");
        }
        console.log("req.body.feature", req.body.feature)
        const featuredata = req.body.feature.split(",");
        console.log("featuredata", featuredata);

        // const start = moment(startDate);
        // const end = moment(endDate);
        availableDates = JSON.parse(availableDates); // ✅ Ensure this is parsed
        if (unavailableDates) {
            unavailableDates = JSON.parse(unavailableDates); // ✅ Ensure this is parsed

        }
        const cardata = new car({
            carName, carModal, carGear,
            carType, carSeat, fastag, price,
            isAvailable, availableDates, unavailableDates,
            location, hostName, feature: featuredata, carImage: imagePaths,
            chassicNo, engineNo, NumberPlate, insuranceExpiry, carColor
        })
        await cardata.save();
        return SuccessCreated(res, "Car added successfully.", cardata)


    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const getCar = async (req, res) => {
    try {
        const { aggregate_options, options } = getDataByPaginate(req, '');
        console.log("req.query", req.query.search)

        if (req.query.carName) {
            aggregate_options.push({
                $match: {
                    carName: { $regex: req.query.carName, $options: 'i' },
                },
            });
        }
        if (req.query.NumberPlate) {
            aggregate_options.push({
                $match: {
                    NumberPlate: { $regex: req.query.NumberPlate, $options: 'i' },
                },
            });
        }
        if (req.query.carGear) {
            aggregate_options.push({
                $match: {
                    carGear: req.query.carGear,
                },
            });
        }
        if (req.query.carType) {
            aggregate_options.push({
                $match: {
                    carType: req.query.carType,
                },
            });
        }
        if (req.query.isAvailable === "true" || req.query.isAvailable === "false") {
            aggregate_options.push({
                $match: { isAvailable: req.query.isAvailable === "true" },
            });
        }
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
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'carID',
                    as: 'review',
                },
            },
            {
                $unwind: {
                    path: '$review',
                    preserveNullAndEmptyArrays: true,
                },
            }
        );
        aggregate_options.push({
            $addFields: {
                averageRating: {
                    $cond: [
                        { $isArray: '$review.review' },
                        { $avg: '$review.review.rating' },
                        null
                    ]
                }
            }
        });

        const aggregateQuery = car.aggregate(aggregate_options);
        const cardetail = await car.aggregatePaginate(aggregateQuery, options);
        return SuccessOk(res, "Car get successfully.", cardetail)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const updateCar = async (req, res) => {
    try {
        const carId = req.params.id;

        let {
            carName, carModal, carGear, carType,
            carSeat, fastag, price, isAvailable,
            availableDates, unavailableDates, location, hostName,
            imageToRemove, feature, chassicNo, engineNo, NumberPlate, insuranceExpiry, carColor
        } = req.body;
        console.log("req.body", req.body)
        let featuredata = feature;
        if (feature) {
            const featuredata = req.body.feature.split(",");
            console.log("featuredata", featuredata);
        }
        if (price) {
            price = JSON.parse(price);
        }
        console.log("featuredata", featuredata)
        // const start = moment(startDate);
        // const end = moment(endDate);
        availableDates = JSON.parse(availableDates); // ✅ Ensure this is parsed
        if (unavailableDates) {
            unavailableDates = JSON.parse(unavailableDates); // ✅ Ensure this is parsed

        }
        let updateFields = {
            carName, carModal, carGear, carType,
            carSeat, fastag, price, isAvailable,
            availableDates, unavailableDates, location, hostName, feature: featuredata ?? feature,
            chassicNo, engineNo, NumberPlate, insuranceExpiry, carColor
        };
        if (carModal) {
            const carModalDate = moment(carModal); // assumes carModal = 'YYYY-MM-DD'
            console.log("carModalDate", carModalDate)
            const sevenYearsAgo = moment().subtract(7, 'years');
            console.log("sevenYearsAgo", sevenYearsAgo)
            const carModalValid = carModalDate.isBefore(sevenYearsAgo)

            if (carModalValid) {
                return BadRequest(res, "Car model date not be more than 7 years old from today");
            }
        }
        console.log("updateFields", updateFields)
        Object.keys(updateFields).forEach(key => {
            if (updateFields[key] === undefined || updateFields[key] === '') {
                delete updateFields[key];
            }
        });

        const existingCar = await car.findById(carId);
        if (!existingCar) {
            return NotFound(res, "Car not found",)
        }
        updateFields.feature = req?.body?.feature?.split(",");

        console.log("imageToRemove", imageToRemove)
        if (imageToRemove) {
            existingCar.carImage = existingCar.carImage.filter(img => img !== imageToRemove);


            if (imageToRemove) {
                const imagesToRemove = imageToRemove.split(','); // Convert string to array

                // Filter out the images from carImage array
                existingCar.carImage = existingCar.carImage.filter(
                    img => !imagesToRemove.includes(img)
                );

                // Delete each image from the filesystem
                imagesToRemove.forEach(img => {
                    const imgPath = path.join(__dirname, '../../uploads', img);
                    if (fs.existsSync(imgPath)) {
                        fs.unlinkSync(imgPath);
                        console.log("Deleted:", imgPath);
                    } else {
                        console.warn("Not found:", imgPath);
                    }
                });
            }

        }
        console.log("existingCar.carImage", existingCar.carImage)


        if (req.files && req.files.length > 0) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

            const invalidFiles = req.files.filter(file => !allowedTypes.includes(file.mimetype));
            if (invalidFiles.length > 0) {
                return BadRequest(res, "Unsupported file type(s). Only JPG and PNG images are allowed.");
            }

            const newImagePaths = req.files.map(file => file.filename);

            existingCar.carImage = [
                ...(existingCar.carImage || []),
                ...newImagePaths
            ];
        }

        Object.assign(existingCar, updateFields);
        console.log("existingCar", existingCar)
        console.log("updateFields", updateFields)
        const updatedCar = await existingCar.save();
        return SuccessOk(res, "Car updated successfully.", updatedCar)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
};

const deleteCar = async (req, res) => {
    try {
        const carId = req.params.id;
        const carToDelete = await car.findById(carId);

        if (!carToDelete) {
            return NotFound(res, "Car not found",)
        }
        console.log("carToDelete", carToDelete)
        if (carToDelete.carImage && Array.isArray(carToDelete.carImage)) {
            carToDelete.carImage.forEach(filename => {
                const imagePath = path.join(__dirname, '../../uploads', filename);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }
        const cardetail = await car.findByIdAndDelete(carId);
        return SuccessOk(res, "Car deleted successfully.", cardetail)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
};

const viewAllCar = async (req, res) => {

    try {
        const { aggregate_options, options } = getDataByPaginate(req, '');
        const { location, startDate, endDate } = req.body;
        console.log(" req.body", req.body)
        if (!startDate || !endDate || !location) {
            return BadRequest(res, "All filed is required")

        }
        const start = moment(startDate);
        const end = moment(endDate);

        console.log("start", start);
        console.log("end", end);

        if (!start.isValid() || !end.isValid()) {
            return BadRequest(res, "Invalid date format",)
        }
        if (end.isBefore(start)) {
            return BadRequest(res, "End date cannot be before start date");

        }
        const durationInMinutes = end.diff(start, 'minutes');

        if (durationInMinutes < 60) {
            return BadRequest(res, "Minimum duration must be at least 1 hour");
        }
        const durationInHours = end.diff(start, 'minutes') / 60;
        console.log("Duration (hours):", durationInHours);
        const bufferStart = moment(start).subtract(2, 'hours');
        const bufferEnd = moment(end).add(2, 'hours');

        const conflictingBookings = await booking.find({
            startDate: { $lte: bufferEnd.toDate() },
            endDate: { $gte: bufferStart.toDate() },
            status: { $ne: "Cancelled" }
        });


        const bookedCarIds = conflictingBookings.map(b => b.carID);
        console.log("bookedCarIds", bookedCarIds)

        aggregate_options.push({
            $match: {
                isAvailable: true,
                location,
                _id: { $nin: bookedCarIds },
                availableDates: {
                    $elemMatch: {
                        startDate: { $lt: new Date(startDate) },
                        endDate: { $gt: new Date(endDate) },
                    },
                },
                $nor: [
                    {
                        unavailableDates: {
                            $elemMatch: {
                                startDate: { $lte: new Date(endDate) },
                                endDate: { $gte: new Date(startDate) },
                            },
                        },
                    },
                ],
            },
        });
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
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'carID',
                    as: 'review',
                },
            },
            {
                $unwind: {
                    path: '$review',
                    preserveNullAndEmptyArrays: true,
                },
            }
        );
        aggregate_options.push({
            $addFields: {
                averageRating: {
                    $cond: [
                        { $isArray: '$review.review' },
                        { $avg: '$review.review.rating' },
                        null
                    ]
                }
            }
        });
        aggregate_options.push(
            {
                $lookup: {
                    from: 'favorites',
                    let: { carID: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$carID', '$$carID'] },
                                        { $eq: ['$userID', new mongoose.Types.ObjectId(req.user._id)] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'favorite',
                },
            },
            {
                $addFields: {
                    favorite: { $gt: [{ $size: '$favorite' }, 0] },
                },
            },
        )

        if (req.query.carName) {
            aggregate_options.push({
                $match: {
                    carName: { $regex: req.query.carName, $options: 'i' },
                },
            });
        }
        const aggregateQuery = car.aggregate(aggregate_options);
        const cardetail = await car.aggregatePaginate(aggregateQuery, options);

        const updatedCarList = cardetail.docs.map(car => {
            const price = car.price;

            let pricePerHour = 0;
            if (durationInHours < 8) {
                pricePerHour = price.price1hr;
            } else if (durationInHours < 12) {
                pricePerHour = price.price12hr;
            } else if (durationInHours < 24) {
                pricePerHour = price.fullDay;
            } else {
                pricePerHour = price.fullDay;
            }

            const totalPrice = Math.ceil(durationInHours) * pricePerHour;

            return {
                ...car,
                bookingDurationHours: durationInHours,
                pricePerHour,
                totalPrice,
            };
        });

        // Return updated car list
        return SuccessOk(res, "Car list with pricing", {
            ...cardetail,
            docs: updatedCarList
        });

        // return SuccessOk(res, "AllCar fetched successfully.", cardetail)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
};
const viewCar = async (req, res) => {
    try {
        const settingData = await setting.findOne(
            {},
            {
                _id: 0, // optional: exclude _id
                protectionFees: 1,
                convenienceFees: 1,
            }
        );
        console.log("settingData", settingData)
        const cardata = await car.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup: {
                    from: 'favorites',
                    let: { carID: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$carID', '$$carID'] },
                                        { $eq: ['$userID', new mongoose.Types.ObjectId(req.user._id)] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'favorite',
                },
            },

            {
                $addFields: {
                    favorite: { $gt: [{ $size: '$favorite' }, 0] },
                },
            },
        ]);
        const car1 = cardata[0] || {};
        const setting1 = settingData?.toObject?.() || {};

        const payload = {
            ...car1,
            ...setting1,
        };
        return SuccessOk(res, "Car found successfully.", payload);

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
}

const viewAvailableCar = async (req, res) => {
    try {
        const { aggregate_options, options } = getDataByPaginate(req, '');

        const { startDate, endDate, carID, location } = req.body;

        console.log(" req.body", req.body)
        if (!startDate || !endDate || !location) {
            return BadRequest(res, "All filed is required")

        }
        const start = moment(startDate);
        const end = moment(endDate);

        console.log("start", start);
        console.log("end", end);

        if (!start.isValid() || !end.isValid()) {
            return BadRequest(res, "Invalid date format",)
        }
        if (end.isBefore(start)) {
            return BadRequest(res, "End date cannot be before start date");

        }
        const durationInMinutes = end.diff(start, 'minutes');

        if (durationInMinutes < 60) {
            return BadRequest(res, "Minimum duration must be at least 1 hour");
        }
        const durationInHours = end.diff(start, 'minutes') / 60;
        console.log("Duration (hours):", durationInHours);
        const bufferStart = moment(start).subtract(2, 'hours');
        const bufferEnd = moment(end).add(2, 'hours');

        const conflictingBookings = await booking.find({
            startDate: { $lte: bufferEnd.toDate() },
            endDate: { $gte: bufferStart.toDate() },
            status: { $ne: "Cancelled" },
            carID: carID
        });

        const bookedCarIds = conflictingBookings.map(b => b.carID);
        console.log("bookedCarIds", bookedCarIds)

        aggregate_options.push({
            $match: {
                isAvailable: true,
                location,
                _id: new mongoose.Types.ObjectId(carID),
                _id: { $nin: bookedCarIds },
                availableDates: {
                    $elemMatch: {
                        startDate: { $lt: new Date(startDate) },
                        endDate: { $gt: new Date(endDate) },
                    },
                },
                $nor: [
                    {
                        unavailableDates: {
                            $elemMatch: {
                                startDate: { $lte: new Date(endDate) },
                                endDate: { $gte: new Date(startDate) },
                            },
                        },
                    },
                ],
            },
        });
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
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'carID',
                    as: 'review',
                },
            },
            {
                $unwind: {
                    path: '$review',
                    preserveNullAndEmptyArrays: true,
                },
            }
        );
        aggregate_options.push({
            $addFields: {
                averageRating: {
                    $cond: [
                        { $isArray: '$review.review' },
                        { $avg: '$review.review.rating' },
                        null
                    ]
                }
            }
        });
        aggregate_options.push(
            {
                $lookup: {
                    from: 'favorites',
                    let: { carID: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$carID', '$$carID'] },
                                        { $eq: ['$userID', new mongoose.Types.ObjectId(req.user._id)] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'favorite',
                },
            },
            {
                $addFields: {
                    favorite: { $gt: [{ $size: '$favorite' }, 0] },
                },
            },
        )

        const cardetail = await car.aggregate(aggregate_options);
        // const cardetail = await car.aggregatePaginate(aggregateQuery, options);
        if (cardetail.length === 0) {
            return NotFound(res, "Car not available for these date")
        }else{
            console.log("cardetail", cardetail)
            const price = cardetail[0].price;
           let pricePerHour = 0;
            if (durationInHours < 8) {
                pricePerHour = price.price1hr;
            } else if (durationInHours < 12) {
                pricePerHour = price.price12hr;
            } else if (durationInHours < 24) {
                pricePerHour = price.fullDay;
            } else {
                pricePerHour = price.fullDay;
            }

            const totalPrice = Math.ceil(durationInHours) * pricePerHour;
  const settingData = await setting.findOne(
            {},
            {
                _id: 0, // optional: exclude _id
                protectionFees: 1,
                convenienceFees: 1,
            }
        );
        console.log("settingData", settingData)
const cardata = {...cardetail[0], bookingDurationHours: durationInHours, pricePerHour,totalPrice}
const settingDetails = settingData?.toObject?.() || {};

const payload = {...cardata, settingDetails}
           
return SuccessOk(res, "Car get successfully.", payload)
        }


        // return SuccessOk(res, "Car get successfully.", cardetail)


    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
}

module.exports = { addCar, getCar, updateCar, deleteCar, viewAllCar, viewCar, viewAvailableCar }