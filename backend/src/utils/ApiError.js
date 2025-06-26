class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    errorCode = null,
    stack = ""
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = Array.isArray(errors) ? errors.filter(Boolean) : [];
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      errorCode: this.errorCode,
      errors: this.errors,
      timestamp: this.timestamp,
    };
  }
}

class NotFoundError extends ApiError {
  constructor(
    message = "Resource not found",
    errors = [],
    errorCode = "RESOURCE_NOT_FOUND"
  ) {
    super(404, message, errors, errorCode);
  }
}

class ValidationError extends ApiError {
  constructor(
    message = "Validation failed",
    errors = [],
    errorCode = "VALIDATION_FAILED"
  ) {
    super(400, message, errors, errorCode);
  }
}

class AuthError extends ApiError {
  constructor(
    message = "Authentication failed",
    errors = [],
    errorCode = "AUTH_FAILED"
  ) {
    super(401, message, errors, errorCode);
  }
}

class ForbiddenError extends ApiError {
  constructor(
    message = "Access forbidden",
    errors = [],
    errorCode = "ACCESS_FORBIDDEN"
  ) {
    super(403, message, errors, errorCode);
  }
}

class ConflictError extends ApiError {
  constructor(message = "Conflict", errors = [], errorCode = "CONFLICT") {
    super(409, message, errors, errorCode);
  }
}

class DatabaseError extends ApiError {
  constructor(
    message = "Database operation failed",
    errors = [],
    errorCode = "DB_ERROR"
  ) {
    super(500, message, errors, errorCode);
  }
}

class RateLimitError extends ApiError {
  constructor(
    message = "Too many requests, please try again later",
    errors = [],
    errorCode = "RATE_LIMIT_EXCEEDED"
  ) {
    super(429, message, errors, errorCode);
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad request", errors = [], errorCode = "BAD_REQUEST") {
    super(400, message, errors, errorCode);
  }
}

class ServiceUnavailableError extends ApiError {
  constructor(
    message = "Service temporarily unavailable",
    errors = [],
    errorCode = "SERVICE_UNAVAILABLE"
  ) {
    super(503, message, errors, errorCode);
  }
}

// Export all error classes
export {
  ApiError,
  AuthError,
  BadRequestError,
  ConflictError,
  DatabaseError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  ValidationError,
};
