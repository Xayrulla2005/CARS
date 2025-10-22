const CustomErrorHandler = require("../utils/custom.error.handler");

const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Server error",
  });
};

module.exports = errorMiddleware;
