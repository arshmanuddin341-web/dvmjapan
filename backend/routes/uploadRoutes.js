/**
 * Upload Routes
 * Image upload endpoints
 */

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middlewares/auth');
const { uploadSingle, uploadMultiple } = require('../middlewares/upload');

// Protected routes - require authentication
router.post('/image', protect, uploadSingle, uploadController.uploadImage);
router.post('/images', protect, uploadMultiple, uploadController.uploadImages);

module.exports = router;
