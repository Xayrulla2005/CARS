const express = require("express");
const router = express.Router();
const {
  register,
  verifyEmail,
  login,
  addAdmin,
  forgetPassword,
  resetPassword,
  getProfile
} = require("../controller/auth.controller");
const { registerValidator, loginValidator, verifyEmailValidator, forgetPasswordValidator, resetPasswordValidator } = require("../validators/auth.validator");
const validate = require("../utils/validate");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

router.post("/register", registerValidator, validate, register);
router.post("/verify", verifyEmailValidator, validate, verifyEmail);
router.post("/login", loginValidator, validate, login);
router.post("/forget-password", forgetPasswordValidator, validate, forgetPassword);
router.post("/reset-password/:token", resetPasswordValidator, validate, resetPassword);
router.get("/profile", authMiddleware, getProfile);
router.post("/add-admin", authMiddleware, adminMiddleware, addAdmin);

module.exports = router;
