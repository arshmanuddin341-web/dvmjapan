/**
 * Bid Routes
 * Defines all bid-related API endpoints
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bidController = require('../controllers/bidController');
const { protect, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

/**
 * Validation rules for placing a bid
 */
const placeBidValidation = [
  body('auctionId')
    .notEmpty()
    .withMessage('Auction ID is required')
    .isMongoId()
    .withMessage('Invalid auction ID'),
  body('amount')
    .notEmpty()
    .withMessage('Bid amount is required')
    .isFloat({ min: 0 })
    .withMessage('Bid amount must be a positive number'),
];

// Protected routes (require authentication)
router.post('/', protect, placeBidValidation, validate, bidController.placeBid);
router.get('/my-bids', protect, bidController.getMyBids);
router.get('/active', protect, bidController.getActiveBids);
router.get('/won', protect, bidController.getWonBids);
router.get('/stats', protect, authorize('admin'), bidController.getBidStats);
router.get('/:id', protect, bidController.getBidById);

// Public route for auction bid history
router.get('/auction/:auctionId', bidController.getAuctionBids);

module.exports = router;
