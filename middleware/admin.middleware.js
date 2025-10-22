const CustomErrorHandler = require("../utils/custom.error.handler");

const adminCheck = (req, res, next) => {
  if (req.user.role !== "admin")
    return next(CustomErrorHandler.forbidden("Access denied: Admins only"));
  next();
};

module.exports = adminCheck;
