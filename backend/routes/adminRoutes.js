/**
 * Admin Routes
 * Defines all admin-only API endpoints
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// =============================================================================
// USER MANAGEMENT ROUTES
// =============================================================================

/**
 * Validation rules for creating a user
 */
const createUserValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Invalid role'),
];

/**
 * Validation rules for updating a user
 */
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Invalid role'),
];

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', createUserValidation, validate, adminController.createUser);
router.put('/users/:id', updateUserValidation, validate, adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/toggle-status', adminController.toggleUserStatus);
router.put('/users/:id/role', adminController.changeUserRole);

// =============================================================================
// CAR MANAGEMENT ROUTES
// =============================================================================

/**
 * Validation for bulk operations
 */
const bulkCarValidation = [
  body('carIds')
    .isArray({ min: 1 })
    .withMessage('Please provide at least one car ID'),
  body('carIds.*')
    .isMongoId()
    .withMessage('Invalid car ID'),
];

// Car management routes
router.get('/cars', adminController.getAllCarsAdmin);
router.put('/cars/bulk-verify', bulkCarValidation, validate, adminController.bulkVerifyCars);
router.put('/cars/bulk-status', bulkCarValidation, validate, adminController.bulkUpdateCarStatus);
router.delete('/cars/:id', adminController.deleteCarAdmin);

// =============================================================================
// AUCTION MANAGEMENT ROUTES
// =============================================================================

/**
 * Validation for extending auction
 */
const extendAuctionValidation = [
  body('minutes')
    .notEmpty()
    .withMessage('Extension time is required')
    .isInt({ min: 1 })
    .withMessage('Extension time must be at least 1 minute'),
];

/**
 * Validation for bulk cancel
 */
const bulkCancelValidation = [
  body('auctionIds')
    .isArray({ min: 1 })
    .withMessage('Please provide at least one auction ID'),
  body('auctionIds.*')
    .isMongoId()
    .withMessage('Invalid auction ID'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),
];

// Auction management routes
router.get('/auctions', adminController.getAllAuctionsAdmin);
router.put('/auctions/:id/extend', extendAuctionValidation, validate, adminController.extendAuction);
router.put('/auctions/:id/force-close', adminController.forceCloseAuction);
router.put('/auctions/bulk-cancel', bulkCancelValidation, validate, adminController.bulkCancelAuctions);

// =============================================================================
// DASHBOARD & ANALYTICS ROUTES
// =============================================================================

router.get('/dashboard', adminController.getDashboardStats);
router.get('/analytics', adminController.getAnalytics);
router.get('/system', adminController.getSystemHealth);
router.get('/export/:type', adminController.exportData);

module.exports = router;
