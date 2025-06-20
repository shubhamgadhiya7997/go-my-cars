const express = require("express");
const router = express.Router();
const {getCoupon, postCoupon, updateCoupon, deleteCoupon, getCouponId, checkCoupon} = require("../controller/coupon")

router.get("/getcoupon", getCoupon);
router.post("/addcoupon", postCoupon);
router.put("/updatecoupon/:id", updateCoupon);
router.delete("/deletecoupon/:id", deleteCoupon);
router.get("/getcoupon/:id", getCouponId);

router.post("/checkcoupon", checkCoupon);
module.exports = router;