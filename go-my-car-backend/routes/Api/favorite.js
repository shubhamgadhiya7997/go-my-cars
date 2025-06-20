const express = require("express");
const router = express.Router();
const {getFavorite, postFavorite} = require("../controller/favorite");
const protected = require("../../middleware/protected");

router.post("/addfavorite",protected, postFavorite);
router.get("/getfavorite",protected, getFavorite);

module.exports = router;