const express = require("express");
const router = express.Router();
const {getPartner, postPartner, getPartnerId, updatePartner} = require("../controller/partner");
const protected = require("../../middleware/protected");

router.get("/getpartner",protected, getPartner);
router.post("/addpartner", postPartner);
router.put("/updatepartner/:id",protected, updatePartner);
router.get("/viewpartner/:id",protected, getPartnerId);
module.exports = router;