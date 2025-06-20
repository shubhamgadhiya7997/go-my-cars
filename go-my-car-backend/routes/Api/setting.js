const express = require("express");
const router = express.Router();
const {getSetting, PostTerms, PostPrivacy, AddFees} = require("../controller/setting");
const protected = require("../../middleware/protected");
const upload = require("../../multer/upload");

router.get("/getsetting",protected, getSetting);
router.post("/addterms",protected,upload.single('termsandcondition'), PostTerms);
router.post("/addprivacy",protected,upload.single('privacyPolicy'), PostPrivacy);
router.post("/addfees",protected, AddFees);
// router.post("/delete",protected, DeleteData);

module.exports = router;