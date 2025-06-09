const express = require("express");
const router = express.Router();
const {addBooking, getBooking, getPastBooking, getAllBooking} = require("../controller/booking");
const protected = require("../../middleware/protected")

//app side
router.post("/addbooking",protected, addBooking);
router.get("/getBooking",protected, getBooking);
router.get("/getPastBooking",protected, getPastBooking);

//admin side
router.get("/getAllBooking",protected, getAllBooking);

module.exports = router;