const { body } = require("express-validator");

exports.registerValidator = [
  body("username")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),

  body("email")
    .isEmail().withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

exports.loginValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.verifyEmailValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("code").isNumeric().withMessage("Verification code must be numeric"),
];

exports.forgetPasswordValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
];

exports.resetPasswordValidator = [
  body("newPassword")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];
