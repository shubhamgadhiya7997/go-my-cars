const express = require("express");
const router = express.Router();

const {
  getLocation,
  postLocation,
  updateLocation,
  deleteLocation,
  getLocationId,
  allLocation
} = require("../controller/location");

const protected = require("../../middleware/protected");

router.post("/addlocation", protected, postLocation);
router.get("/getlocation", protected, getLocation);
router.put("/updatelocation/:id", protected, updateLocation);
router.delete("/deletelocation/:id", protected, deleteLocation);
router.get("/getlocation/:id", protected, getLocationId);

router.get("/location", allLocation);
module.exports = router;
