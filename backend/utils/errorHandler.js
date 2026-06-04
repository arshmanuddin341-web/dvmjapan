/**
 * Custom Error Handler Utility
 * Creates consistent error objects throughout the application
 */

/**
 * Custom Application Error class
 * Extends native Error with additional properties for API responses
 */
class AppError extends Error {
  /**
   * Create an AppError
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Indicates this is a known operational error

    // Capture stack trace (excluding constructor call from stack)
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Common error creators for convenience
 */
const Errors = {
  badRequest: (message = 'Bad request') => new AppError(message, 400),
  unauthorized: (message = 'Unauthorized access') => new AppError(message, 401),
  forbidden: (message = 'Access forbidden') => new AppError(message, 403),
  notFound: (message = 'Resource not found') => new AppError(message, 404),
  conflict: (message = 'Resource conflict') => new AppError(message, 409),
  validationError: (message = 'Validation failed') => new AppError(message, 422),
  internal: (message = 'Internal server error') => new AppError(message, 500),
};

module.exports = {
  AppError,
  Errors,
};
