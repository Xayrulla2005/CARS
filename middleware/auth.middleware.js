const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../utils/custom.error.handler");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(CustomErrorHandler.unauthorized("No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(CustomErrorHandler.unauthorized("Invalid or expired token"));
  }
};

module.exports = authMiddleware;
