const express = require("express");
const router = express.Router();
const {getCoupon, postCoupon, updateCoupon, deleteCoupon, getCouponId, checkCoupon} = require("../controller/coupon")
const protected = require("../../middleware/protected")

router.get("/getcoupon",protected, getCoupon);
router.post("/addcoupon", postCoupon);
router.put("/updatecoupon/:id", updateCoupon);
router.delete("/deletecoupon/:id", deleteCoupon);
router.get("/getcoupon/:id", getCouponId);

router.post("/checkcoupon", checkCoupon);
module.exports = router;