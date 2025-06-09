const { getDataByPaginate } = require("../../common/common");
const Mail = require("../../mailer/mail");
const partner = require("../../model/partner");
const { SuccessCreated, InternalServerError, SuccessOk } = require("../../Response/response");

const getPartner = async (req, res) => {
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
           const aggregateQuery = partner.aggregate(aggregate_options);
           const userdetail = await partner.aggregatePaginate(aggregateQuery, options);
           return SuccessOk(res, "partner get successfully.", userdetail)
   
       } catch (error) {
           console.log("err", error);
           return InternalServerError(res, "Internal Server Error", error.message)
       }
   
    
}

const postPartner = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, detail } = req.body;
        const partnerData = partner({ fullName, email, phoneNumber, detail, userID: req.user._id });
        await partnerData.save();
        return SuccessCreated(res, "partner added successfully.", partnerData)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}
const getPartnerId = async (req, res) => {
    try {
        const partnerID = req.params.id;
        const partnerdata = await partner.findOne({ _id: partnerID });
        return SuccessOk(res, "partner find successfully.", partnerdata)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }
}

const updatePartner = async (req, res) => {
    try {
        const { reply, email } = req.body;
        console.log("req.params.id", req.params.id)

        const partnerData = await partner.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { reply: reply } },
            { new: true }
        )
     const sendmail = Mail.replySendMail(email, reply);

        return SuccessOk(res, "partner updated successfully.", partnerData)

    }
    catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message);
    }

}
module.exports = { getPartner, postPartner, getPartnerId, updatePartner };