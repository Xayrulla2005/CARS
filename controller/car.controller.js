const fs = require("fs");
const path = require("path");
const Car = require("../schema/car.schema");
const CustomErrorHandler = require("../utils/custom.error.handler");

///// ADD
exports.createCar = async (req, res, next) => {
  try {
    const { name, brand, price, category } = req.body;

    const images = req.files ? req.files.map((file) => file.filename) : [];

    const newCar = await Car.create({
      name,
      brand,
      price,
      category,
      createdBy: req.user.id,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      data: newCar,
    });
  } catch (err) {
    next(err);
  }
};

///// GET_ALL
exports.getAllCars = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      brand,
      category,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (brand) query.brand = brand;
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const cars = await Car.find(query)
      .populate("category", "name")
      .populate("createdBy", "username email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortOptions);

    const total = await Car.countDocuments(query);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: cars,
    });
  } catch (err) {
    next(err);
  }
};

///// GET_ONE
exports.getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "username email");

    if (!car) return next(CustomErrorHandler.notFound("Car not found"));

    res.json({ success: true, data: car });
  } catch (err) {
    next(err);
  }
};

///// UPDATE
exports.updateCar = async (req, res, next) => {
  try {
    const { name, brand, price, category } = req.body;

    const car = await Car.findById(req.params.id);
    if (!car) return next(CustomErrorHandler.notFound("Car not found"));

    if (String(car.createdBy) !== req.user.id && req.user.role !== "admin") {
      return next(CustomErrorHandler.unauthorized("You cannot edit this car"));
    }

    car.name = name || car.name;
    car.brand = brand || car.brand;
    car.price = price || car.price;
    car.category = category || car.category;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.filename);
      car.images = [...car.images, ...newImages]; // append mode
    }

    await car.save();

    res.json({
      success: true,
      message: "Car updated successfully",
      data: car,
    });
  } catch (err) {
    next(err);
  }
};

///// DELETE
exports.deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return next(CustomErrorHandler.notFound("Car not found"));

    if (String(car.createdBy) !== req.user.id && req.user.role !== "admin") {
      return next(CustomErrorHandler.unauthorized("You cannot delete this car"));
    }

    if (car.images && car.images.length > 0) {
      car.images.forEach((filename) => {
        const filePath = path.join(__dirname, "..", "uploads", filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await car.deleteOne();

    res.json({ success: true, message: "Car deleted successfully" });
  } catch (err) {
    next(err);
  }
};
