const express = require("express");
const router =express.Router();
const {register, login,forgetPassword, dashboard, getNotification, addNotification, sendnotificationCheck} = require("../controller/admin");
const protected = require("../../middleware/protected")

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword",protected, forgetPassword);
router.post("/dashboard",protected, dashboard);
router.get("/getnotification",protected, getNotification);
router.post("/addnotification",protected, addNotification);
router.get("/sendnotification",protected, sendnotificationCheck);



module.exports = router;