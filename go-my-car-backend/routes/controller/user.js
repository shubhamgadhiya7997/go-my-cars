const user = require("../../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SuccessCreated, SuccessOk, BadRequest, InternalServerError, NotFound } = require("../../Response/response");
const { getDataByPaginate } = require("../../common/common");

const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password } = req.body;
        if (!fullName || !email || !phoneNumber || !password) {
            return BadRequest(res, "All filed is required")

        }
        const existingUser = await user.findOne({
            $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
        });

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

        const { email, password,fcmToken } = req.body;
        if (!email || !password) {
            return BadRequest(res, "All filed is required")

        }
        const userDetails = await user.findOne({ email: req.body.email })
        if (!userDetails) {
            return NotFound(res, "User not found")
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

        const tokendata = await new Promise((resolve, reject) => {
            jwt.sign(
                { userDetails },
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
            userDetails,
            token: "Bearer " + tokendata,
        }
        return SuccessOk(res, "User login successfully", payload)


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
        const userDetails = await user.findOne({ email: req.body.email })
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
        const userDetails = await user.findOne({ email: email, otp: otp });
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
            { email },
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
                _id: { $ne: req.user._id },
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
            { _id: req.user._id },
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
                { _id: req.user._id },
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
           console.log("req.query", req.query.search)
           if (req.query.search) {
               aggregate_options.push({
                   $match: {
                       $or: [
                           { fullName: { $regex: req.query.search, $options: 'i' } },
                       ],
                   },
               });
           }
           const aggregateQuery = user.aggregate(aggregate_options);
           const userdetail = await user.aggregatePaginate(aggregateQuery, options);
           return SuccessOk(res, "User get successfully.", userdetail)
   
       }catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const editUser = async (req,res) =>{
    try{
        const {isActive, userId} = req.body;
        const userdata = await user.findOneAndUpdate(
            {_id:userId},
            {$set: {isActive}},
            {new: true}
        )
        return SuccessOk(res, "User update successfully.", userdata)
       }catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}
module.exports = { register, login, forget, verify, resetPassword, editProfile, changePassword, getUser, editUser }