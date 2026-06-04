/**
 * Content Routes
 * Site settings and editable content
 */

const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.get('/public/config', contentController.getPublicConfig);
router.get('/:key', contentController.getByKey);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', contentController.getAllSettings);
router.put('/:key', contentController.upsert);
router.post('/seed', contentController.seedDefaults);

module.exports = router;
