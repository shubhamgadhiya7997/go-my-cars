const setting = require("../../model/setting");
const { SuccessCreated, InternalServerError, BadRequest, SuccessOk } = require("../../Response/response");
const fs = require('fs');
const path = require('path');
const getSetting = async (req, res) => {
 try {
       
        const settingData = await setting.findOne();
        return SuccessOk(res, "setting data find successfully.", settingData)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
}
const PostTerms = async (req, res) => {
    try {
        console.log("req.file", req.file)
        let termsAndCondition;
        if (req.file && req.file.mimetype == "application/pdf") {
            termsAndCondition = req.file.filename;
        } else {
            return BadRequest(res, "Only PDF files are allowed")
        }
        const settingData = await setting.findOneAndUpdate(
            {},
            { $set: { termsAndCondition: termsAndCondition } },
            { new: true, upsert: true }
        )
        return SuccessCreated(res, "Termsandcondition added successfully", settingData)
    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}
// const DeleteData = async (req, res) => {
//     try {
//         const { termsandcondition, privacyPolicy } = req.body;
//         const settingview = await setting.findOne();
//         if (termsandcondition) {
//             if (settingview.termsAndCondition) {
//                 const imagePath = path.join(__dirname, '../../uploads', settingview.termsAndCondition);
//                 if (fs.existsSync(imagePath)) {
//                     fs.unlinkSync(imagePath);
//                 }

//             }
//             const settingData = await setting.findOneAndUpdate(
//                 {},
//                 { $set: { termsAndCondition: null } },
//                 { new: true }
//             )
//             return SuccessOk(res, "Termsandcondition deleted successfully", settingData)
//         } else if (privacyPolicy) {
//             if (settingview.privacyPolicy) {
//                 const imagePath = path.join(__dirname, '../../uploads', settingview.privacyPolicy);
//                 if (fs.existsSync(imagePath)) {
//                     fs.unlinkSync(imagePath);
//                 }

//             }
//             const settingData = await setting.findOneAndUpdate(
//                 {},
//                 { $set: { privacyPolicy: null } },
//                 { new: true }
//             )
//             return SuccessOk(res, "privacypolicy deleted successfully", settingData)
//         } else {
//             return BadRequest(res, "Only 'termsandcondition' and 'privacypolicy' files can be deleted.");
//         }
//     } catch (error) {
//         console.log("err", error);
//         return InternalServerError(res, "Internal Server Error", error.message)
//     }
// }

const PostPrivacy = async (req, res) => {
    try {
        console.log("req.file", req.file)
        let privacyPolicy;
        if (req.file && req.file.mimetype == "application/pdf") {
            privacyPolicy = req.file.filename;
        } else {
            return BadRequest(res, "Only PDF files are allowed")
        }
        const settingData = await setting.findOneAndUpdate(
            {},
            { $set: { privacyPolicy: privacyPolicy } },
            { new: true, upsert: true }
        )
        return SuccessCreated(res, "privacypolicy added successfully", settingData)
    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

module.exports = { PostTerms, getSetting, PostPrivacy }