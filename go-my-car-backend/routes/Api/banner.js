const express = require("express");
const { addCarImage, getCarImageList,getCarImage,getCarImageId, updateCarImage, deleteCarImage } = require("../controller/banner");
const upload = require("../../multer/upload");
const router = express.Router();
const protected = require("../../middleware/protected")

//app side
router.post("/addcarbanner",  upload.array('images'), addCarImage);
router.get("/getcarbannerlist",protected, getCarImageList);
router.put("/updatecarbanner/:id",upload.array('images'), updateCarImage);
router.delete("/deletecarbanner/:id",deleteCarImage);

//admin side
router.get("/getcarbanner",protected, getCarImage);
router.get("/getcarbanner/:id",protected, getCarImageId);
module.exports = router