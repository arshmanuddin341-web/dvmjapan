/**
 * Japan auction data routes.
 * Admin-only: fetch normalized listings (used by Next.js sync endpoint).
 * No breaking changes to existing vehicle/auction APIs.
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { asyncHandler } = require('../utils/asyncHandler');
const { runSync } = require('../services/japanAuctions/auctionSync.service');

/**
 * GET /api/japan-auctions/fetch
 * Fetches and normalizes listings from configured source. Does not write to DB.
 * Admin only. Used by Next.js POST /api/japan-auctions/sync.
 */
router.get(
  '/fetch',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const result = await runSync();
    res.status(200).json({
      success: true,
      sourceName: result.sourceName,
      count: result.count,
      vehicles: result.vehicles,
      ...(result.error ? { error: result.error } : {}),
    });
  })
);

module.exports = router;
