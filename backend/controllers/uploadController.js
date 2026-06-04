/**
 * Upload Controller
 * Handles image uploads to Cloudinary
 */

const { uploadImage, isConfigured } = require('../utils/cloudinary');
const { AppError } = require('../utils/errorHandler');
const { asyncHandler } = require('../utils/asyncHandler');

/**
 * @desc    Upload single image to Cloudinary
 * @route   POST /api/upload/image
 * @access  Private
 */
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!isConfigured()) {
    return next(new AppError('Image upload is not configured', 503));
  }

  if (!req.file || !req.file.buffer) {
    return next(new AppError('No image file provided', 400));
  }

  const folder = req.body.folder || 'cars';
  const allowedFolders = ['cars', 'auctions', 'avatars'];
  if (!allowedFolders.includes(folder)) {
    return next(new AppError('Invalid folder. Use: cars, auctions, or avatars', 400));
  }

  const result = await uploadImage(req.file.buffer, { folder });

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    },
  });
});

/**
 * @desc    Upload multiple images
 * @route   POST /api/upload/images
 * @access  Private
 */
exports.uploadImages = asyncHandler(async (req, res, next) => {
  if (!isConfigured()) {
    return next(new AppError('Image upload is not configured', 503));
  }

  const files = req.files;
  if (!files || files.length === 0) {
    return next(new AppError('No image files provided', 400));
  }

  if (files.length > 10) {
    return next(new AppError('Maximum 10 images per upload', 400));
  }

  const folder = req.body.folder || 'cars';
  const allowedFolders = ['cars', 'auctions', 'avatars'];
  if (!allowedFolders.includes(folder)) {
    return next(new AppError('Invalid folder. Use: cars, auctions, or avatars', 400));
  }

  const results = [];
  for (const file of files) {
    if (file.buffer) {
      const result = await uploadImage(file.buffer, { folder });
      results.push({
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
      });
    }
  }

  res.status(200).json({
    success: true,
    message: `${results.length} image(s) uploaded successfully`,
    data: results,
  });
});
