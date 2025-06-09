const express = require("express");
const router =express.Router();
const {register, login,forgetPassword, dashboard, getNotification, addNotification} = require("../controller/admin");

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgetPassword);
router.post("/dashboard", dashboard);
router.get("/getnotification", getNotification);
router.post("/addnotification", addNotification);



module.exports = router;