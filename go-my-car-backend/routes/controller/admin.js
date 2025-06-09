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

        const tokendata = await new Promise((resolve, reject) => {
            jwt.sign(
                { adminDetails },
                process.env.secretKey,
                { expiresIn: '120h' },
                (err, token) => {
                    if (err)
                        return BadRequest(res, "Token not generated")
                    resolve(token);
                }
            );
        });
        const payload = {
            adminDetails,
            token: "Bearer " + tokendata,
        }
        return SuccessOk(res, "Admin login successfully", payload)


    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }

}

const dashboard = async (req, res) => {
    try {

        const { fromDate, toDate } = req.body || {};
        console.log("req.body", req.body)
        let filter = {};
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
        if (fromDate && toDate) {
            carFilter.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        } else if (fromDate) {
            carFilter.createdAt = { $gte: new Date(fromDate) };
        } else if (toDate) {
            carFilter.createdAt = { $lte: new Date(toDate) };
        }
        const totalCar = await car.find(filter);

        let carAvailableFilter = {};

        if (fromDate && toDate) {
            carAvailableFilter.startDate = { $gte: new Date(fromDate) };
            carAvailableFilter.endDate = { $lte: new Date(toDate) };
        } else if (fromDate) {
            carAvailableFilter.startDate = { $gte: new Date(fromDate) };
        } else if (toDate) {
            carAvailableFilter.endDate = { $lte: new Date(toDate) };
        }

        const totalAvailableCar = await car.find(carAvailableFilter);

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



        const payload = {
            totalUser: totalUser.length,
            activeUser: activeUser.length,
            inactiveUser: inactiveUser.length,
            totalCar: totalCar.length,
            totalAvailableCar: totalAvailableCar.length,
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
        sendNotification("dz9HGiqwQ5uLUx8mgsaerb:APA91bEb-9ZBHp-OPNbGO77a04E-QX2lEb2ToZ4a_hUwVQyvfnl-GFvEgdm1bjj1zE2uQtEAP8RTXgXaAp67CqKzRNJ7ytbkOgLqsgGjcClkYo3qsHskG9s", 'Test', 'Hello');

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

module.exports = { register, login, forgetPassword, dashboard, getNotification, addNotification, sendnotificationCheck }