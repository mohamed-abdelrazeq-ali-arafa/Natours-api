class AppError extends Error {
  constructor(message, status_code) {
    super(message);
    this.status_code = this.status_code;
    //conver status code to string
    this.status = `${this.status_code}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
