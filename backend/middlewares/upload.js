/**
 * Upload Middleware
 * Multer configuration for handling multipart/form-data
 */

const multer = require('multer');
const { AppError } = require('../utils/errorHandler');

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Allowed: JPEG, PNG, WebP, GIF', 400), false);
  }
};

/**
 * Multer instance for single file
 */
const uploadSingle = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
}).single('image');

/**
 * Multer instance for multiple files
 */
const uploadMultiple = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
}).array('images', 10);

/**
 * Wrapper to handle multer errors
 */
const handleUpload = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('File too large. Maximum size is 5MB', 400));
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return next(new AppError('Too many files. Maximum is 10', 400));
      }
    }
    if (err) return next(err);
    next();
  });
};

module.exports = {
  uploadSingle: handleUpload(uploadSingle),
  uploadMultiple: handleUpload(uploadMultiple),
};
