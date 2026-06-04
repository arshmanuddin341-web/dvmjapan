/**
 * Bid Controller
 * Handles all bidding operations
 */

const Bid = require('../models/Bid');
const Auction = require('../models/Auction');
const { AppError } = require('../utils/errorHandler');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination } = require('../utils/pagination');
const { emitToAuction } = require('../socket');

/**
 * @desc    Place a bid on an auction
 * @route   POST /api/bids
 * @access  Private
 */
exports.placeBid = asyncHandler(async (req, res, next) => {
  const { auctionId, amount } = req.body;

  // Find auction
  const auction = await Auction.findById(auctionId).populate('car');

  if (!auction) {
    return next(new AppError('Auction not found', 404));
  }

  // Update auction status based on time
  auction.updateStatus();

  // Check if auction is live
  if (auction.status !== 'live') {
    return next(new AppError('This auction is not currently live', 400));
  }

  // Check time
  const now = new Date();
  if (now < auction.startTime) {
    return next(new AppError('Auction has not started yet', 400));
  }
  if (now > auction.endTime) {
    return next(new AppError('Auction has ended', 400));
  }

  // Check if user is the car seller
  if (auction.car && auction.car.seller.toString() === req.user.id) {
    return next(new AppError('You cannot bid on your own car', 400));
  }

  // Validate bid amount
  const minBid = auction.currentBid + auction.bidIncrement;
  if (amount < minBid) {
    return next(
      new AppError(
        `Minimum bid amount is $${minBid.toLocaleString()}. Current bid: $${auction.currentBid.toLocaleString()}, Increment: $${auction.bidIncrement.toLocaleString()}`,
        400
      )
    );
  }

  // Create bid record
  const bid = await Bid.create({
    auction: auctionId,
    bidder: req.user.id,
    amount,
    previousBid: auction.currentBid,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Update auction with new bid info
  auction.currentBid = amount;
  auction.bidCount += 1;
  auction.winner = req.user.id;

  // Check if reserve is met
  if (auction.reservePrice && amount >= auction.reservePrice) {
    auction.isReserveMet = true;
  }

  await auction.save({ validateBeforeSave: false });

  // Populate bidder info
  await bid.populate('bidder', 'name');

  // Prepare bid data for response and socket broadcast
  const bidData = {
    id: bid._id,
    amount: bid.amount,
    bidder: bid.bidder.name,
    bidderId: req.user.id,
    timestamp: bid.createdAt,
    auctionId,
    newCurrentBid: auction.currentBid,
    minimumNextBid: auction.currentBid + auction.bidIncrement,
    bidCount: auction.bidCount,
    isReserveMet: auction.isReserveMet,
  };

  // Emit real-time update to all clients watching this auction
  emitToAuction(auctionId, 'bid:new', bidData);

  res.status(201).json({
    success: true,
    message: 'Bid placed successfully',
    data: {
      bid: {
        id: bid._id,
        amount: bid.amount,
        bidder: bid.bidder.name,
        createdAt: bid.createdAt,
      },
      auction: {
        currentBid: auction.currentBid,
        bidCount: auction.bidCount,
        minimumNextBid: auction.currentBid + auction.bidIncrement,
        isReserveMet: auction.isReserveMet,
      },
    },
  });
});

/**
 * @desc    Get bid history for an auction
 * @route   GET /api/bids/auction/:auctionId
 * @access  Public
 */
exports.getAuctionBids = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req.query);
  const { auctionId } = req.params;

  // Check if auction exists
  const auction = await Auction.findById(auctionId);
  if (!auction) {
    return next(new AppError('Auction not found', 404));
  }

  const [bids, total] = await Promise.all([
    Bid.find({ auction: auctionId })
      .populate('bidder', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .select('amount bidder createdAt isWinning'),
    Bid.countDocuments({ auction: auctionId }),
  ]);

  res.status(200).json({
    success: true,
    count: bids.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: bids,
  });
});

/**
 * @desc    Get current user's bid history
 * @route   GET /api/bids/my-bids
 * @access  Private
 */
exports.getMyBids = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status } = req.query;

  // Build query
  const queryObj = { bidder: req.user.id };
  if (status) {
    queryObj.status = status;
  }

  const [bids, total] = await Promise.all([
    Bid.find(queryObj)
      .populate({
        path: 'auction',
        select: 'title status endTime currentBid car',
        populate: {
          path: 'car',
          select: 'title brand model primaryImage images',
        },
      })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Bid.countDocuments(queryObj),
  ]);

  res.status(200).json({
    success: true,
    count: bids.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: bids,
  });
});

/**
 * @desc    Get user's active bids (currently winning)
 * @route   GET /api/bids/active
 * @access  Private
 */
exports.getActiveBids = asyncHandler(async (req, res, next) => {
  const bids = await Bid.find({
    bidder: req.user.id,
    isWinning: true,
  })
    .populate({
      path: 'auction',
      match: { status: 'live' },
      select: 'title status endTime currentBid bidIncrement car',
      populate: {
        path: 'car',
        select: 'title brand model primaryImage images',
      },
    })
    .sort('-createdAt');

  // Filter out bids where auction didn't match (not live)
  const activeBids = bids.filter(bid => bid.auction !== null);

  res.status(200).json({
    success: true,
    count: activeBids.length,
    data: activeBids,
  });
});

/**
 * @desc    Get user's won auctions
 * @route   GET /api/bids/won
 * @access  Private
 */
exports.getWonBids = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req.query);

  const [wonAuctions, total] = await Promise.all([
    Auction.find({
      winner: req.user.id,
      status: { $in: ['sold', 'ended'] },
    })
      .populate({
        path: 'car',
        select: 'title brand model images primaryImage',
      })
      .sort('-endTime')
      .skip(skip)
      .limit(limit),
    Auction.countDocuments({
      winner: req.user.id,
      status: { $in: ['sold', 'ended'] },
    }),
  ]);

  res.status(200).json({
    success: true,
    count: wonAuctions.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: wonAuctions,
  });
});

/**
 * @desc    Get bid statistics (Admin)
 * @route   GET /api/bids/stats
 * @access  Private (Admin)
 */
exports.getBidStats = asyncHandler(async (req, res, next) => {
  const stats = await Bid.aggregate([
    {
      $group: {
        _id: null,
        totalBids: { $sum: 1 },
        avgBidAmount: { $avg: '$amount' },
        maxBid: { $max: '$amount' },
        minBid: { $min: '$amount' },
      },
    },
  ]);

  // Bids per day (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dailyBids = await Bid.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Top bidders
  const topBidders = await Bid.aggregate([
    {
      $group: {
        _id: '$bidder',
        totalBids: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
    { $sort: { totalBids: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'bidder',
      },
    },
    { $unwind: '$bidder' },
    {
      $project: {
        _id: 1,
        totalBids: 1,
        totalAmount: 1,
        'bidder.name': 1,
        'bidder.email': 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: stats[0] || {},
      dailyBids,
      topBidders,
    },
  });
});

/**
 * @desc    Get single bid details
 * @route   GET /api/bids/:id
 * @access  Private
 */
exports.getBidById = asyncHandler(async (req, res, next) => {
  const bid = await Bid.findById(req.params.id)
    .populate('bidder', 'name email')
    .populate({
      path: 'auction',
      select: 'title status currentBid car',
      populate: {
        path: 'car',
        select: 'title brand model',
      },
    });

  if (!bid) {
    return next(new AppError('Bid not found', 404));
  }

  // Check if user is authorized to view (own bid or admin)
  if (bid.bidder._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this bid', 403));
  }

  res.status(200).json({
    success: true,
    data: bid,
  });
});
