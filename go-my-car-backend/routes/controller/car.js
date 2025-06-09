const { getDataByPaginate } = require("../../common/common");
const car = require("../../model/car");
const fs = require('fs');
const path = require('path');
const moment = require("moment")
const { BadRequest, SuccessCreated, InternalServerError, NotFound, SuccessOk } = require("../../Response/response");
const booking = require("../../model/booking");

const addCar = async (req, res) => {
    try {

        const { carName, carModal, carGear,
            carType, carSheet, fastag, carPrice,
            isAvailable, startDate, endDate,
            location, hostName, feature } = req.body;
        console.log("req.body", req.body)
        console.log("req.body.feature", req.body.feature)


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

        if (!carName || !carModal || !carGear ||
            !carType || !carSheet || !fastag || !carPrice ||
            !isAvailable || !startDate || !endDate
            || !location || !hostName || !feature
        ) {
            return BadRequest(res, "All filed is required",)
        }
        console.log("req.body.feature", req.body.feature)
        const featuredata = req.body.feature.split(",");
        console.log("featuredata", featuredata);

        const start = moment(startDate);
        const end = moment(endDate);
        const cardata = new car({
            carName, carModal, carGear,
            carType, carSheet, fastag, carPrice,
            isAvailable, startDate: start, endDate: end,
            location, hostName, feature: featuredata, carImage: imagePaths
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
        if (req.query.search) {
            aggregate_options.push({
                $match: {
                    $or: [
                        { carName: { $regex: req.query.search, $options: 'i' } },
                    ],
                },
            });
        }
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

        const {
            carName, carModal, carGear, carType,
            carSheet, fastag, carPrice, isAvailable,
            startDate, endDate, location, hostName,
            imageToRemove, feature
        } = req.body;
        console.log("req.body", req.body)
        let featuredata = feature;
        if (feature) {
            const featuredata = req.body.feature.split(",");
            console.log("featuredata", featuredata);
        }

        console.log("featuredata", featuredata)
        const start = moment(startDate);
        const end = moment(endDate);
        const updateFields = {
            carName, carModal, carGear, carType,
            carSheet, fastag, carPrice, isAvailable,
            startDate: start, endDate: end, location, hostName, feature: featuredata ?? feature
        };

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
        updateFields.feature = req.body.feature.split(",");

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
        const start = moment(startDate);
        const end = moment(endDate);

        console.log("start", start);
        console.log("end", end);

        if (!start.isValid() || !end.isValid()) {
            return BadRequest(res, "Invalid date format",)
        }
        const conflictingBookings = await booking.find({
            $or: [
                {
                    startDate: { $lte: end.toDate() },
                    endDate: { $gte: start.toDate() },
                }
            ]
        });

        const bookedCarIds = conflictingBookings.map(b => b.carID);
        console.log("bookedCarIds", bookedCarIds)

        aggregate_options.push({
            $match: {
                isAvailable: true,
                startDate: { $lte: start.toDate() },
                endDate: { $gte: end.toDate() },
                location,
                _id: { $nin: bookedCarIds },
            },
        },


        );
        const aggregateQuery = car.aggregate(aggregate_options);
        const cardetail = await car.aggregatePaginate(aggregateQuery, options);


        return SuccessOk(res, "AllCar fetched successfully.", cardetail)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
};
const viewCar = async (req, res) => {
    try {
        const carID = req.params.id;
        const cardata = await car.findOne({ _id: carID });
        return SuccessOk(res, "Car find successfully.", cardata)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
}

module.exports = { addCar, getCar, updateCar, deleteCar, viewAllCar, viewCar }