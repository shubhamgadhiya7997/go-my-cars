const express = require("express");
const { addCar, getCar, updateCar, deleteCar, viewAllCar, viewCar } = require("../controller/car");
const upload = require("../../multer/upload");
const router = express.Router();
const protected = require("../../middleware/protected")

//admin side
router.post("/addcar",protected,  upload.array('images'), addCar);
router.get("/getcar",protected, getCar);

router.put("/updatecar/:id",protected,upload.array('images'), updateCar);
router.delete("/deletecar/:id",protected,deleteCar);

//app side
router.post("/viewallcar", protected,viewAllCar);
router.get("/viewcar/:id",protected, viewCar);

module.exports = router