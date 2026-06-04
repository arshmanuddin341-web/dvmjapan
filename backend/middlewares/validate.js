/**
 * Validation Middleware
 * Handles express-validator results
 */

const { validationResult } = require('express-validator');
const { AppError } = require('../utils/errorHandler');

/**
 * Check validation results from express-validator
 * Returns 400 with validation errors if any
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format errors for response
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    // Get first error message for main error
    const firstError = formattedErrors[0];

    return res.status(400).json({
      success: false,
      message: `Validation Error: ${firstError.message}`,
      errors: formattedErrors,
    });
  }

  next();
};

/**
 * Custom validation helper for MongoDB ObjectId
 */
exports.isValidObjectId = (value) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(value);
};

/**
 * Sanitize input - Basic XSS protection
 */
exports.sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Remove potential script tags
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<[^>]*>/g, '');
      }
    }
  }
  next();
};
