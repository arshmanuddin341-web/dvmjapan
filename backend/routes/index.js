/**
 * Routes Index
 * Central router that combines all route modules
 */

const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const carRoutes = require('./carRoutes');
const auctionRoutes = require('./auctionRoutes');
const bidRoutes = require('./bidRoutes');
const adminRoutes = require('./adminRoutes');
const uploadRoutes = require('./uploadRoutes');
const contentRoutes = require('./contentRoutes');
const japanAuctionsRoutes = require('./japanAuctionsRoutes');
const realtimeRoutes = require('./realtimeRoutes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/auctions', auctionRoutes);
router.use('/bids', bidRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/content', contentRoutes);
router.use('/japan-auctions', japanAuctionsRoutes);
router.use('/realtime', realtimeRoutes);

// API documentation endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Car Auction API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user (sends verification email)',
        'POST /api/auth/login': 'Login user (requires verified email)',
        'GET /api/auth/verify-email/:token': 'Verify email address',
        'POST /api/auth/resend-verification': 'Resend verification email',
        'GET /api/auth/verification-status/:email': 'Check email verification status',
        'GET /api/auth/me': 'Get current user profile',
        'PUT /api/auth/profile': 'Update user profile',
        'PUT /api/auth/password': 'Update password',
        'POST /api/auth/logout': 'Logout user',
      },
      cars: {
        'GET /api/cars': 'Get all cars (with filtering & pagination)',
        'GET /api/cars/:id': 'Get car by ID',
        'POST /api/cars': 'Create new car listing',
        'PUT /api/cars/:id': 'Update car listing',
        'DELETE /api/cars/:id': 'Delete car listing',
        'GET /api/cars/my-cars': 'Get current user cars',
        'PUT /api/cars/:id/verify': 'Verify car (Admin)',
        'GET /api/cars/stats': 'Get car statistics (Admin)',
      },
      auctions: {
        'GET /api/auctions': 'Get all auctions',
        'GET /api/auctions/live': 'Get live auctions',
        'GET /api/auctions/upcoming': 'Get upcoming auctions',
        'GET /api/auctions/:id': 'Get auction by ID',
        'POST /api/auctions': 'Create new auction (Admin)',
        'PUT /api/auctions/:id': 'Update auction (Admin)',
        'PUT /api/auctions/:id/close': 'Close auction (Admin)',
        'PUT /api/auctions/:id/cancel': 'Cancel auction (Admin)',
        'POST /api/auctions/:id/watch': 'Add to watchlist',
        'DELETE /api/auctions/:id/watch': 'Remove from watchlist',
        'GET /api/auctions/stats': 'Get auction statistics (Admin)',
      },
      bids: {
        'POST /api/bids': 'Place a bid',
        'GET /api/bids/auction/:auctionId': 'Get auction bid history',
        'GET /api/bids/my-bids': 'Get current user bids',
        'GET /api/bids/active': 'Get active winning bids',
        'GET /api/bids/won': 'Get won auctions',
        'GET /api/bids/:id': 'Get bid details',
        'GET /api/bids/stats': 'Get bid statistics (Admin)',
      },
      admin: {
        users: {
          'GET /api/admin/users': 'Get all users',
          'GET /api/admin/users/:id': 'Get user by ID',
          'POST /api/admin/users': 'Create new user',
          'PUT /api/admin/users/:id': 'Update user',
          'DELETE /api/admin/users/:id': 'Delete user',
          'PUT /api/admin/users/:id/toggle-status': 'Activate/deactivate user',
          'PUT /api/admin/users/:id/role': 'Change user role',
        },
        cars: {
          'GET /api/admin/cars': 'Get all cars (admin view)',
          'PUT /api/admin/cars/bulk-verify': 'Bulk verify cars',
          'PUT /api/admin/cars/bulk-status': 'Bulk update car status',
          'DELETE /api/admin/cars/:id': 'Delete car (admin)',
        },
        auctions: {
          'GET /api/admin/auctions': 'Get all auctions (admin view)',
          'PUT /api/admin/auctions/:id/extend': 'Extend auction time',
          'PUT /api/admin/auctions/:id/force-close': 'Force close auction',
          'PUT /api/admin/auctions/bulk-cancel': 'Bulk cancel auctions',
        },
        upload: {
          'POST /api/upload/image': 'Upload single image (auth required)',
          'POST /api/upload/images': 'Upload multiple images (auth required)',
        },
        dashboard: {
          'GET /api/admin/dashboard': 'Get dashboard overview',
          'GET /api/admin/analytics': 'Get detailed analytics',
          'GET /api/admin/system': 'Get system health',
          'GET /api/admin/export/:type': 'Export data (users/cars/auctions/bids)',
        },
      },
      japanAuctions: {
        'GET /api/japan-auctions/fetch': 'Fetch normalized Japan auction listings (Admin only; no DB write)',
      },
    },
  });
});

module.exports = router;
