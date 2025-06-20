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

const AddFees = async (req, res) => {
    try {
        const {convenienceFees, protectionFees} = req.body;
        const settingData = await setting.findOneAndUpdate(
            {},
            { $set: { convenienceFees, protectionFees } },
            { new: true, upsert: true }
        )
        return SuccessCreated(res, "Fees updated successfully", settingData)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }

}

module.exports = { PostTerms, getSetting, PostPrivacy, AddFees }