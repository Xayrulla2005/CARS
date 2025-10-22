const express = require("express");
const router= express.Router();
const {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
} = require("../controller/car.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminCheck = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");
const { addCarValidator, updateCarValidator, getAllCarsValidator } = require("../validators/car.validator");
const validate = require("../utils/validate");

router.get("/", getAllCarsValidator, validate, getAllCars);
router.get("/:id", getCarById);
router.post("/", authMiddleware, upload.array("images", 10), addCarValidator, validate, createCar);
router.put("/:id", authMiddleware, upload.array("images", 10), updateCarValidator, validate, updateCar);
router.delete("/:id", authMiddleware, deleteCar);

module.exports = router;
