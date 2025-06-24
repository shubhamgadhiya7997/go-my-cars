const user = require("../../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SuccessCreated, SuccessOk, BadRequest, InternalServerError, NotFound } = require("../../Response/response");
const { getDataByPaginate } = require("../../common/common");
const { default: mongoose } = require("mongoose");
const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password } = req.body;
        if (!fullName || !email || !phoneNumber || !password) {
            return BadRequest(res, "All filed is required")

        }
        const existingUser = await user.findOne({
            $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }], isDeleted: false
        });
        console.log("existingUser", existingUser)
        if (existingUser) {
            const errorMessage =
                existingUser.email === req.body.email
                    ? 'Email already exists'
                    : 'Mobile number already exists';

            return BadRequest(res, errorMessage)
        }
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(req.body.password, salt);
        const newPassword = hasedPassword;

        const userdata = new user({ fullName, email, phoneNumber, password: newPassword })
        await userdata.save();
        return SuccessCreated(res, "User registration successfully", userdata)


    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const login = async (req, res) => {
    try {

        const { email, password, fcmToken } = req.body;
        if (!email || !password) {
            return BadRequest(res, "All filed is required")

        }
        const userDetails = await user.findOne({ email: req.body.email, isDeleted: false })
        if (!userDetails) {
            return NotFound(res, "User not found")
        }
        if (!userDetails.isActive) {
            return NotFound(res, "User not Activate contact to admin")
        }
        const validPassword = await bcrypt.compare(req.body.password, userDetails.password);
        if (!validPassword) {
            return BadRequest(res, "Invalid password")

        }
        const updateuser = await user.findOneAndUpdate(
            { email: req.body.email },
            { $set: { fcmToken: fcmToken } },
            { new: true }
        );
        const payload = {...userDetails.toObject(), userType: 'user'}
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
        // const payload = {
        //     userDetails,
        //     token: "Bearer " + tokendata,
        // }

        return SuccessOk(res, "User login successfully", { ...userDetails.toObject(), token: "Bearer " + tokendata })


    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }

}

const forget = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return BadRequest(res, "email filed is required")

        }
        const userDetails = await user.findOne({ email: req.body.email, isDeleted: false })
        if (!userDetails) {
            return NotFound(res, "User not found")

        }

        let Num = (1000 + Math.random() * 9000).toFixed(0);
        console.log(Num);
        const updateuser = await user.findOneAndUpdate(
            { email: req.body.email },
            { $set: { otp: Num } },
            { new: true }
        );
        return SuccessOk(res, "OTP sent successfully", updateuser)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }

}

const verify = async (req, res) => {
    try {

        const { email, otp } = req.body;
        if (!email || !otp) {
            return BadRequest(res, "All filed is required")

        }
        const userDetails = await user.findOne({ email: email, otp: otp, isDeleted: false });
        if (!userDetails) {
            return BadRequest(res, "OTP invalid")

        }
        return SuccessOk(res, "OTP verify successfully", userDetails)


    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return BadRequest(res, "All filed is required")
        }
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);
        const newPassword = hasedPassword;

        const updatePassword = await user.findOneAndUpdate(
            { email, isDeleted: false },
            { $set: { password: newPassword } },
            { new: true }
        );
        return SuccessOk(res, "Password update successfully", updatePassword)
    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}
const editProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, isActive } = req.body;
        if (email || phoneNumber) {

            const existingUser = await user.findOne({
                _id: { $ne:new mongoose.Types.ObjectId(req.user._id) }, isDeleted: false,
                $or: [
                    { email: email },
                    { phoneNumber: phoneNumber }
                ]
            });
            if (existingUser) {
                const errorMessage =
                    existingUser.email === email
                        ? 'Email already exists'
                        : 'Mobile number already exists';

                return BadRequest(res, errorMessage)
            }
        }
        const updateFields = { ...req.body };

        // Handle image upload
        if (req.file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

            if (allowedTypes.includes(req.file.mimetype)) {
                updateFields.profilePic = req.file.filename;
            } else {
                return BadRequest(res, "Unsupported file type. Only images are permitted.");
            }
        }

        console.log(" req.user._id ", req.user)
        const userdata = await user.findOneAndUpdate(
            { _id:new mongoose.Types.ObjectId(req.user._id) },
            { $set: updateFields },
            { new: true }
        )
        return SuccessOk(res, "User update successfully", userdata)


    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const changePassword = async (req, res) => {
    try {
        const { password, newPassword, confirmPassword } = req.body;
        if (!password || !newPassword || !confirmPassword) {
            return BadRequest(res, "All filed is required")
        }
        if (newPassword != confirmPassword) {
            return BadRequest(res, "New password and confirm new password not matched")
        }
        const validPassword = await bcrypt.compare(password, req.user.password);
        if (!validPassword) {
            return BadRequest(res, "Invalid current password")
        } else {
            const salt = await bcrypt.genSalt(10);
            const hasedPassword = await bcrypt.hash(newPassword, salt);
            const newUpdatedPassword = hasedPassword;
            const userdata = await user.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(req.user._id), isDeleted: false },
                { $set: { password: newUpdatedPassword } },
                { new: true }
            )
            const tokendata = await new Promise((resolve, reject) => {
                jwt.sign(
                    { userdata },
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
                userdata,
                token: "Bearer " + tokendata,
            }
            return SuccessOk(res, "User password updated successfully", payload)

        }

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const getUser = async (req, res) => {
    try {
        const { aggregate_options, options } = getDataByPaginate(req, '');
        console.log("req.query", req.query)
        console.log("req.query.isActive", req.query.isActive)
        aggregate_options.push({
            $match: { isDeleted: false }
        })
        if (req.query.isActive == "true") {
            aggregate_options.push({
                $match: { isActive: true }
            })
        }
        if (req.query.isActive == "false") {
            aggregate_options.push({
                $match: { isActive: false }
            })
        }
        console.log("aggregate_options", aggregate_options)
        if (req.query.fullName) {
            aggregate_options.push({
                $match: {
                    fullName: { $regex: req.query.fullName, $options: 'i' },
                },
            });
        }

        if (req.query.email) {
            aggregate_options.push({
                $match: {
                    email: { $regex: req.query.email, $options: 'i' },
                },
            });
        }

        if (req.query.phoneNumber) {
            aggregate_options.push({
                $match: {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$phoneNumber" },
                            regex: req.query.phoneNumber,
                            options: "i",
                        },
                    },
                },
            });
        }


        const aggregateQuery = user.aggregate(aggregate_options);
        const userdetail = await user.aggregatePaginate(aggregateQuery, options);
        return SuccessOk(res, "User get successfully.", userdetail)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const activateInactivateUser = async (req, res) => {
    try {
        const { isActive, userId } = req.body;
        const userdata = await user.findOneAndUpdate(
            { _id: userId, isDeleted: false },
            { $set: { isActive } },
            { new: true }
        )
        return SuccessOk(res, "User update successfully.", userdata)
    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const deleteUser = async (req, res) => {
    try {
        const userdata = await user.findOneAndUpdate(
            { _id: req.body.userId },
            { $set: { isDeleted: true } },
            { new: true }
        );
        return SuccessOk(res, "User deleted successfully.", userdata)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const getUserDetails = async (req,res) => {
    try{
        const userdata = await user.findById({_id : new mongoose.Types.ObjectId(req.user._id)});
        return SuccessOk(res, "user details find successfully", userdata)
    }catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

module.exports = { register, login, forget, verify, resetPassword, editProfile, changePassword, getUser,getUserDetails, activateInactivateUser, deleteUser }