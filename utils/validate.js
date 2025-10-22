const { validationResult } = require("express-validator");
const CustomErrorHandler = require("../utils/custom.error.handler");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   
    const first = errors.array()[0].msg;
    return next(CustomErrorHandler.badRequest(first));
  }
  next();
};
