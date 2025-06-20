const express = require("express");
const router = express.Router();
const {getReview, postReview} = require("../controller/review");
const protected = require("../../middleware/protected");

router.post("/addreview",protected, postReview);

module.exports = router;