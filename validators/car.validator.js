const { body, query } = require("express-validator");

exports.addCarValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("brand").notEmpty().withMessage("Brand is required"),
  body("price")
    .notEmpty().withMessage("Price is required")
    .isNumeric().withMessage("Price must be a number")
    .custom((v) => v > 0).withMessage("Price must be positive"),
  body("category")
    .notEmpty().withMessage("Category is required")
    .isMongoId().withMessage("Category must be a valid id"),
];

exports.updateCarValidator = [
  body("name").optional().notEmpty().withMessage("If provided, name must not be empty"),
  body("brand").optional().notEmpty().withMessage("If provided, brand must not be empty"),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("category").optional().isMongoId().withMessage("Category must be a valid id"),
];

exports.getAllCarsValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be >= 1"),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be >= 1"),
  query("sortOrder").optional().isIn(["asc", "desc"]).withMessage("sortOrder must be 'asc' or 'desc'"),
];
