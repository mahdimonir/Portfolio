import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  // Log error for debugging (consider using a proper logging service in production)
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  // Set default values
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors = [];
  let stack = process.env.NODE_ENV === "production" ? null : err.stack;

  // Handle specific error types
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // Handle Mongoose validation errors
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((e) => e.message);
  }
  // Handle Mongoose cast errors (invalid IDs)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  // Handle Mongoose duplicate key errors
  else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value error";
    const field = Object.keys(err.keyValue)[0];
    errors = [`${field} already exists with value: ${err.keyValue[field]}`];
  }
  // Handle file upload errors
  else if (err.message && err.message.includes("images are allowed")) {
    statusCode = 400;
    message = err.message;
  }
  // Handle JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Send error response
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    stack,
    requestId: req.id, // Consider adding a request ID for tracking
    timestamp: new Date().toISOString(),
  });
};

export { errorHandler };
