const { getDataByPaginate } = require("../../common/common");
const coupon = require("../../model/coupon");
const { SuccessOk, InternalServerError, SuccessCreated, BadRequest } = require("../../Response/response");

const getCoupon = async (req, res) => {
    try {
        const { aggregate_options, options } = getDataByPaginate(req, '');

            if (req.query.couponCode) {
  aggregate_options.push({
    $match: {
      couponCode: { $regex: req.query.couponCode, $options: 'i' },
    },
  });
}
if (req.query.amount) {
  aggregate_options.push({
    $match: {
      $expr: {
        $regexMatch: {
          input: { $toString: "$amount" },
          regex: req.query.amount,
          options: "i",
        },
      },
    },
  });
}
if (req.query.isActive === "true" || req.query.isActive === "false") {
  aggregate_options.push({
    $match: { isActive: req.query.isActive === "true" },
  });
}


  
       
        const aggregateQuery = coupon.aggregate(aggregate_options);
        const couponDetail = await coupon.aggregatePaginate(aggregateQuery, options);
        return SuccessOk(res, "Coupon get successfully.", couponDetail)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }


}

const postCoupon = async (req, res) => {
    try {
        const { couponCode, amount, isActive } = req.body;
        const couponData = coupon({ couponCode, amount, isActive });
        await couponData.save();
        return SuccessCreated(res, "Coupon added successfully.", couponData)

    } catch (error) {
        console.log("err", error);
        if (error?.code === 11000) {
            return InternalServerError(res, "couponCode aldready exist", error.message)

        }
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const updateCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        const { couponCode, amount, isActive } = req.body;
        console.log("couponId", couponId)
        console.log("req.body", req.body)
        const couponData = await coupon.findOneAndUpdate(
            { _id: couponId },
            { $set: { couponCode, amount, isActive } },
            { new: true }
        );
        return SuccessOk(res, "Coupon updated successfully", couponData);

    } catch (error) {
        console.log("err", error);
        if (error?.code === 11000) {
            return InternalServerError(res, "couponCode aldready exist", error.message)

        }
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

const deleteCoupon = async (req, res) => {
    try {

        const couponId = req.params.id;
        const couponData = await coupon.findByIdAndDelete({ _id: couponId });
        return SuccessOk(res, "Coupon deleted successfully", couponData);
    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}
const getCouponId = async (req, res) => {
    try {
        const id = req.params.id;
        const couponData = await coupon.findById(id)
        return SuccessOk(res, "Coupon get successfully.", couponData)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }


}

const checkCoupon = async (req, res) => {
    try {
        const { couponCode } = req.body;
        const couponData = await coupon.findOne({ couponCode, isActive: true });
        if (!couponData) {
            return BadRequest(res, "Invalid coupon code");
        }
        return SuccessOk(res, "Coupon discount successfully.", couponData)

    } catch (error) {
        console.log("err", error);
        return InternalServerError(res, "Internal Server Error", error.message)
    }
}

module.exports = { getCoupon, postCoupon, updateCoupon, deleteCoupon, getCouponId, checkCoupon };