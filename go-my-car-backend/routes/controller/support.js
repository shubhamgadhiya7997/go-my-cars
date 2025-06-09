const { getDataByPaginate } = require("../../common/common");
const support = require("../../model/support");
const { SuccessCreated, InternalServerError, SuccessOk } = require("../../Response/response");
const Mail = require("../../mailer/mail");
const getSupport = async (req, res) => {
    try {
        const { aggregate_options, options } = getDataByPaginate(req, '');

        if (req.query.search) {
            aggregate_options.push({
                $match: {
                    $or: [
                        { email: { $regex: req.query.search, $options: 'i' } },
                    ],
                },
            });
        }
        const aggregateQuery = support.aggregate(aggregate_options);
        const userdetail = await support.aggregatePaginate(aggregateQuery, options);
        return SuccessOk(res, "support get successfully.", userdetail)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }

}

const postSupport = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, comment } = req.body;
        const supportData = support({ fullName, email, phoneNumber, comment, userID: req.user._id });
        await supportData.save();
        return SuccessCreated(res, "Support added successfully.", supportData)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}
const getSupportId = async (req, res) => {
    try {
        const supportID = req.params.id;
        const supportdata = await support.findOne({ _id: supportID });
        return SuccessOk(res, "Support find successfully.", supportdata)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
}

const updateSupport = async (req, res) => {
    try {
        const { reply, email } = req.body;
        console.log("req.params.id", req.params.id)
        console.log("req.body", req.body)
        const supportData = await support.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { reply: reply } },
            { new: true }
        )
     const sendmail = Mail.replySendMail(email, reply);

        return SuccessOk(res, "support updated successfully.", supportData)

    }
    catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }

}

module.exports = { getSupport, postSupport, updateSupport, getSupportId };