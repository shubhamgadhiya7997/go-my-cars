const express = require("express");
const router =express.Router();
const {register, login, forget, verify, resetPassword, editProfile, changePassword, getUser, editUser} = require("../controller/user");
const protected = require("../../middleware/protected");
const upload = require("../../multer/upload");

router.post("/register", register)
router.post("/login", login)
router.post("/forget", forget)
router.post("/verify", verify)
router.post("/resetpassword", resetPassword)
router.post("/editprofile",protected,upload.single('profilePic'), editProfile)
router.post("/changepassword",protected, changePassword)

//admin side
router.get("/getuser",protected,getUser)
router.post("/edituser",protected, editUser)

module.exports = router;