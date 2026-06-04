/**
 * Cloudinary Utility
 * Handles image uploads for cars, auctions, etc.
 */

const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary from CLOUDINARY_URL env variable
 */
const configure = () => {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
    return true;
  }
  return false;
};

/**
 * Upload image to Cloudinary
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {Object} options - Upload options
 * @param {string} options.folder - Cloudinary folder (e.g. 'cars', 'auctions')
 * @param {string} options.publicId - Optional custom public_id
 * @returns {Promise<Object>} { url, publicId, secureUrl }
 */
const uploadImage = async (file, options = {}) => {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error('CLOUDINARY_URL is not configured');
  }

  configure();

  const { folder = 'car_auction', publicId } = options;

  const uploadOptions = {
    folder,
    resource_type: 'image',
  };
  if (publicId) uploadOptions.public_id = publicId;

  let result;
  if (Buffer.isBuffer(file)) {
    result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (err, res) => (err ? reject(err) : resolve(res))
      );
      uploadStream.end(file);
    });
  } else {
    result = await cloudinary.uploader.upload(file, uploadOptions);
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
};

/**
 * Delete image from Cloudinary by public_id
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<Object>}
 */
const deleteImage = async (publicId) => {
  if (!process.env.CLOUDINARY_URL) {
    throw new Error('CLOUDINARY_URL is not configured');
  }
  configure();
  return cloudinary.uploader.destroy(publicId);
};

/**
 * Check if Cloudinary is configured
 */
const isConfigured = () => !!process.env.CLOUDINARY_URL;

module.exports = {
  cloudinary,
  configure,
  uploadImage,
  deleteImage,
  isConfigured,
};
