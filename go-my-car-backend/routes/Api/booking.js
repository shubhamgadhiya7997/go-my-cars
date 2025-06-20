const express = require("express");
const router = express.Router();
const {addBooking, getBooking, editBooking, getPastBooking, getAllBooking, deleteBooking} = require("../controller/booking");
const protected = require("../../middleware/protected")

//app side
router.post("/addbooking",protected, addBooking);
router.get("/getBooking",protected, getBooking);
router.post("/editbooking",protected, editBooking);
router.get("/getPastBooking",protected, getPastBooking);
router.get("/cancelbooking/:id",protected, deleteBooking);

//admin side
router.get("/getAllBooking",protected, getAllBooking);

module.exports = router;