const admin = require("../../model/admin");
const { BadRequest, SuccessCreated, InternalServerError, NotFound, SuccessOk } = require("../../Response/response");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const user = require("../../model/user");
const car = require("../../model/car");
const booking = require("../../model/booking");
const notification = require("../../model/notification");
const { getDataByPaginate } = require("../../common/common");
const sendNotification = require("../../firebase/sendNotification");

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return BadRequest(res, "All filed is required")

        }
        const existingUser = await admin.findOne({
            $or: [{ email: req.body.email }],
        });

        if (existingUser) {

            return BadRequest(res, "Email already exists")
        }
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(req.body.password, salt);
        const newPassword = hasedPassword;

        const admindata = new admin({ email, password: newPassword })
        await admindata.save();
        return SuccessCreated(res, "Admin registration successfully", admindata)


    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return BadRequest(res, "All filed is required")

        }
        const adminDetails = await admin.findOne({ email: req.body.email })
        if (!adminDetails) {
            return NotFound(res, "Admin not found")
        }
        const validPassword = await bcrypt.compare(req.body.password, adminDetails.password);
        if (!validPassword) {
            return BadRequest(res, "Invalid password")

        }
        const payload = { ...adminDetails.toObject(), userType: 'admin' }
        console.log("payload", payload)

        const tokendata = await new Promise((resolve, reject) => {
            jwt.sign(
                { payload },
                process.env.secretKey,
                { expiresIn: '120h' },
                (err, token) => {
                    if (err)
                        return BadRequest(res, "Token not generated")
                    resolve(token);
                }
            );
        });
        const payloaddata = {
            adminDetails,
            token: "Bearer " + tokendata,
        }
        return SuccessOk(res, "Admin login successfully", payloaddata)


    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }

}

const dashboard = async (req, res) => {
    try {

        const { fromDate, toDate } = req.body || {};
        console.log("req.body", req.body)
        let filter = { isDeleted: false };
        if (fromDate && toDate) {
            filter.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        } else if (fromDate) {
            filter.createdAt = { $gte: new Date(fromDate) };
        } else if (toDate) {
            filter.createdAt = { $lte: new Date(toDate) };
        }

        const totalUser = await user.find(filter);

        const activeUser = totalUser.filter(user => user.isActive === true);
        const inactiveUser = totalUser.filter(user => user.isActive === false);

        console.log("totalUser", totalUser.length);
        console.log("activeUser", activeUser.length);
        console.log("inactiveUser", inactiveUser.length);

        let carFilter = {};
        let totalCar
        if (fromDate && toDate) {
            totalCar = await car.find({
                availableDates: {
                    $elemMatch: {
                        startDate: { $lte: new Date(fromDate) },
                        endDate: { $gte: new Date(toDate) },
                    },
                },
            });


        } else if (fromDate) {
             totalCar = await car.find({
                availableDates: {
                    $elemMatch: {
                        startDate: { $lte: new Date(fromDate) },
                    },
                },
            });
        } else if (toDate) {
  totalCar = await car.find({
    availableDates: {
      $elemMatch: {
        startDate: { $lte: new Date(toDate) },
        endDate: { $gte: new Date(toDate) },
      },
    },
  });


        } else {
            totalCar = await car.find()
        }

        // const totalCar = await car.find(carFilter);

        // let carAvailableFilter = {};

        // if (fromDate && toDate) {
        //     carAvailableFilter.startDate = { $gte: new Date(fromDate) };
        //     carAvailableFilter.endDate = { $lte: new Date(toDate) };
        // } else if (fromDate) {
        //     carAvailableFilter.startDate = { $gte: new Date(fromDate) };
        // } else if (toDate) {
        //     carAvailableFilter.endDate = { $lte: new Date(toDate) };
        // }

        // const totalAvailableCar = await car.find(carAvailableFilter);

        let bookingfilter = {};
        if (fromDate && toDate) {
            bookingfilter.startDate = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        } else if (fromDate) {
            bookingfilter.startDate = { $gte: new Date(fromDate) };
        } else if (toDate) {
            bookingfilter.endDate = { $lte: new Date(toDate) };
        }

        const totalBooking = await booking.find(bookingfilter);


        console.log("totalCar.length", totalCar.length)
        const payload = {
            totalUser: totalUser.length,
            activeUser: activeUser.length,
            inactiveUser: inactiveUser.length,
            totalCar: totalCar ? totalCar.length : 0,
            // totalAvailableCar: totalAvailableCar.length,
            totalBooking: totalBooking.length
        };

        return SuccessOk(res, "User found successfully", payload);




    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}
const forgetPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const admindata = await admin.findOne();
        const validPassword = await bcrypt.compare(oldPassword, admindata.password);
        if (!validPassword) {
            return BadRequest(res, "Invalid password")
        }
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(newPassword, salt);
        const newPasswordsave = hasedPassword;
        const updatePassword = await admin.findOneAndUpdate(
            {},
            { $set: { password: newPasswordsave } },
            { new: true }
        );
        return SuccessOk(res, "Password update successfully", updatePassword)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const getNotification = async (req, res) => {
    try {
        const { aggregate_options, options } = getDataByPaginate(req, '');
        console.log("req.query", req.query)
        if (req.query.title) {
            aggregate_options.push({
                $match: {
                    title: { $regex: req.query.title, $options: 'i' },
                },
            });
        }

        if (req.query.description) {
            aggregate_options.push({
                $match: {
                    description: { $regex: req.query.description, $options: 'i' },
                },
            });
        }

        const aggregateQuery = notification.aggregate(aggregate_options);
        const cardetail = await notification.aggregatePaginate(aggregateQuery, options);
        return SuccessOk(res, "Notification get successfully.", cardetail)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}
const addNotification = async (req, res) => {
    try {
        const { title, body } = req.body;
        const notificationdata = new notification({ title, description: body })
        await notificationdata.save();


        const usersWithTokens = await user.find({
            fcmToken: { $exists: true, $ne: null, $ne: "" }
        });
        await Promise.all(usersWithTokens.map(u => sendNotification(u.fcmToken, title, body)));

        return SuccessCreated(res, "Notification added successfully.", notificationdata)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const sendnotificationCheck = async (req, res) => {
    try {
        const notificationdata = req.query.notification;
        sendNotification(notificationdata);
        return SuccessOk(res, "Notification sent successfully", notificationdata)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

module.exports = { register, login, forgetPassword, dashboard, getNotification, addNotification, sendnotificationCheck }