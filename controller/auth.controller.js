const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../schema/user.schema");
const CustomErrorHandler = require("../utils/custom.error.handler");
const { sendEmail } = require("../utils/sendEmail");
const { generateToken } = require("../utils/token");

///// REGISTER
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) return next(CustomErrorHandler.badRequest("Email already exists"));

    const hashedPass = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const newUser = await User.create({
      username,
      email, 
      password: hashedPass,
      verificationCode,
      isVerified: false
    });

    await sendEmail(
      newUser.email,
      "Email Verification",
      `Your verification code is: ${verificationCode}`
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email for verification code."
    });
  } catch (err) {
    next(err);
  }
};

///// VERIFY EMAIL 
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) return next(CustomErrorHandler.notFound("User not found"));
    if (user.isVerified) return next(CustomErrorHandler.badRequest("User already verified"));

    if (user.verificationCode !== Number(code))
      return next(CustomErrorHandler.badRequest("Invalid verification code"));

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    next(err);
  }
};

/////  LOGIN 
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(CustomErrorHandler.notFound("User not found"));

    if (!user.isVerified)
      return next(CustomErrorHandler.unauthorized("Please verify your email before login"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(CustomErrorHandler.unauthorized("Invalid credentials"));

    const token = generateToken(user);
    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

///// ADD ADMIN
exports.addAdmin = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(CustomErrorHandler.notFound("User not found"));

    user.role = "admin";
    await user.save();

    res.json({ success: true, message: "User promoted to admin" });
  } catch (err) {
    next(err);
  }
};

///// FORGET PASSWORD 
exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(CustomErrorHandler.notFound("User not found"));

    const resetToken = generateToken(user);
    const resetLink = `http://localhost:4001/api/auth/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Password Reset",
      `Click the following link to reset your password: ${resetLink}`
    );

    res.json({ success: true, message: "Password reset link sent to your email" });
  } catch (err) {
    next(err);
  }
};

/////  RESET PASSWORD 
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(CustomErrorHandler.notFound("User not found"));

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
};

/////  PROFILE 
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return next(CustomErrorHandler.notFound("User not found"));
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
