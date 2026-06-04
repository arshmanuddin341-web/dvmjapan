/**
 * Auction Routes
 * Defines all auction-related API endpoints
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auctionController = require('../controllers/auctionController');
const { protect, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

/**
 * Validation rules for creating an auction
 */
const createAuctionValidation = [
  body('car')
    .notEmpty()
    .withMessage('Car ID is required')
    .isMongoId()
    .withMessage('Invalid car ID'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 150 })
    .withMessage('Title cannot exceed 150 characters'),
  body('startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .isISO8601()
    .withMessage('Invalid start time format'),
  body('endTime')
    .notEmpty()
    .withMessage('End time is required')
    .isISO8601()
    .withMessage('Invalid end time format'),
  body('startingBid')
    .notEmpty()
    .withMessage('Starting bid is required')
    .isFloat({ min: 0 })
    .withMessage('Starting bid must be a positive number'),
  body('reservePrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Reserve price must be a positive number'),
  body('bidIncrement')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Bid increment must be at least 1'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
];

/**
 * Validation rules for updating an auction
 */
const updateAuctionValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Title cannot exceed 150 characters'),
  body('startTime')
    .optional()
    .isISO8601()
    .withMessage('Invalid start time format'),
  body('endTime')
    .optional()
    .isISO8601()
    .withMessage('Invalid end time format'),
  body('startingBid')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Starting bid must be a positive number'),
  body('status')
    .optional()
    .isIn(['draft', 'scheduled', 'live', 'ended', 'cancelled', 'sold'])
    .withMessage('Invalid status'),
];

// Public routes
router.get('/', auctionController.getAllAuctions);
router.get('/live', auctionController.getLiveAuctions);
router.get('/upcoming', auctionController.getUpcomingAuctions);
router.get('/stats', protect, authorize('admin'), auctionController.getAuctionStats);
router.get('/:id', auctionController.getAuctionById);

// Protected routes
router.post('/:id/watch', protect, auctionController.addToWatchlist);
router.delete('/:id/watch', protect, auctionController.removeFromWatchlist);

// Admin routes
router.post(
  '/',
  protect,
  authorize('admin'),
  createAuctionValidation,
  validate,
  auctionController.createAuction
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  updateAuctionValidation,
  validate,
  auctionController.updateAuction
);
router.put('/:id/close', protect, authorize('admin'), auctionController.closeAuction);
router.put('/:id/cancel', protect, authorize('admin'), auctionController.cancelAuction);

module.exports = router;
