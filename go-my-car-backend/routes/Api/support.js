const express = require("express");
const router = express.Router();
const {getSupport, postSupport,updateSupport, getSupportId} = require("../controller/support");
const protected = require("../../middleware/protected");

router.get("/getsupport",protected, getSupport);
router.post("/addsupport",protected, postSupport);
router.put("/updatesuppport/:id",protected, updateSupport);
router.get("/viewsupport/:id",protected, getSupportId);

module.exports = router;