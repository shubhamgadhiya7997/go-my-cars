const express = require("express");
const router = express.Router();
const { register, login, forget, verify, resetPassword, editProfile, uploadImage, changePassword, getUser,getUserDetails, activateInactivateUser, deleteUser } = require("../controller/user");
const protected = require("../../middleware/protected");
const upload = require("../../multer/upload");
const validate = require("../../validation/validate");

router.post("/register", register)
router.post("/login", login)
router.post("/forget", forget)
router.post("/verify", verify)
router.post("/resetpassword", resetPassword)
router.post("/editprofile", protected, upload.single('profilePic'), editProfile)
router.post("/changepassword", protected, changePassword)
router.post("/deleteuser", protected, deleteUser)
router.get("/getuserdetails", protected, getUserDetails)
router.post("/uploadimage", upload.array('images'),validate, uploadImage)
//admin side
router.get("/getuser", protected, getUser)
router.post("/edituser", protected, activateInactivateUser)

module.exports = router;