class CustomErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }

  static badRequest(message = "Bad Request") {
    return new CustomErrorHandler(400, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new CustomErrorHandler(401, message);
  }

  static notFound(message = "Not Found") {
    return new CustomErrorHandler(404, message);
  }

  static forbidden(message = "Forbidden") {
    return new CustomErrorHandler(403, message);
  }

  static serverError(message = "Internal Server Error") {
    return new CustomErrorHandler(500, message);
  }
}

module.exports = CustomErrorHandler;
