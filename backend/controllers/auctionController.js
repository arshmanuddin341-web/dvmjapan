/**
 * Auction Controller
 * Handles all auction-related operations
 */

const Auction = require('../models/Auction');
const Car = require('../models/Car');
const { AppError } = require('../utils/errorHandler');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination } = require('../utils/pagination');

/**
 * @desc    Get all auctions with filtering
 * @route   GET /api/auctions
 * @access  Public
 */
exports.getAllAuctions = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req.query);
  
  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'limit', 'sort'];
  excludedFields.forEach(field => delete queryObj[field]);

  let query = Auction.find(queryObj)
    .populate({
      path: 'car',
      select: 'title brand model year images primaryImage',
    })
    .populate('createdBy', 'name');

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  query = query.skip(skip).limit(limit);

  const [auctions, total] = await Promise.all([
    query,
    Auction.countDocuments(queryObj),
  ]);

  // Update status for each auction
  auctions.forEach(auction => auction.updateStatus());

  res.status(200).json({
    success: true,
    count: auctions.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: auctions,
  });
});

/**
 * @desc    Get live auctions
 * @route   GET /api/auctions/live
 * @access  Public
 */
exports.getLiveAuctions = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req.query);

  const now = new Date();
  
  const [auctions, total] = await Promise.all([
    Auction.find({
      status: 'live',
      startTime: { $lte: now },
      endTime: { $gte: now },
    })
      .populate({
        path: 'car',
        select: 'title brand model year images primaryImage mileage',
      })
      .sort('endTime')
      .skip(skip)
      .limit(limit),
    Auction.countDocuments({
      status: 'live',
      startTime: { $lte: now },
      endTime: { $gte: now },
    }),
  ]);

  res.status(200).json({
    success: true,
    count: auctions.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: auctions,
  });
});

/**
 * @desc    Get upcoming auctions
 * @route   GET /api/auctions/upcoming
 * @access  Public
 */
exports.getUpcomingAuctions = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req.query);
  
  const now = new Date();

  const [auctions, total] = await Promise.all([
    Auction.find({
      status: 'scheduled',
      startTime: { $gt: now },
    })
      .populate({
        path: 'car',
        select: 'title brand model year images primaryImage',
      })
      .sort('startTime')
      .skip(skip)
      .limit(limit),
    Auction.countDocuments({
      status: 'scheduled',
      startTime: { $gt: now },
    }),
  ]);

  res.status(200).json({
    success: true,
    count: auctions.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: auctions,
  });
});

/**
 * @desc    Get single auction by ID
 * @route   GET /api/auctions/:id
 * @access  Public
 */
exports.getAuctionById = asyncHandler(async (req, res, next) => {
  const auction = await Auction.findById(req.params.id)
    .populate({
      path: 'car',
      populate: {
        path: 'seller',
        select: 'name',
      },
    })
    .populate('createdBy', 'name')
    .populate('winner', 'name');

  if (!auction) {
    return next(new AppError('Auction not found', 404));
  }

  // Update status based on current time
  auction.updateStatus();
  
  // Increment view count
  auction.viewCount += 1;
  await auction.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: auction,
  });
});

/**
 * @desc    Create a new auction
 * @route   POST /api/auctions
 * @access  Private (Admin)
 */
exports.createAuction = asyncHandler(async (req, res, next) => {
  const { car: carId, startTime, endTime } = req.body;

  // Check if car exists
  const car = await Car.findById(carId);
  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  // Check if car is available
  if (car.status !== 'available') {
    return next(new AppError('Car is not available for auction', 400));
  }

  // Validate dates
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  if (start < now) {
    return next(new AppError('Start time cannot be in the past', 400));
  }

  if (end <= start) {
    return next(new AppError('End time must be after start time', 400));
  }

  // Set auction creator and featured image
  req.body.createdBy = req.user.id;
  if (!req.body.featuredImage && car.images && car.images.length > 0) {
    req.body.featuredImage = car.primaryImage || car.images[0].url;
  }

  // Set initial status
  req.body.status = start > now ? 'scheduled' : 'live';

  // Create auction
  const auction = await Auction.create(req.body);

  // Update car status
  car.status = 'in_auction';
  await car.save();

  res.status(201).json({
    success: true,
    message: 'Auction created successfully',
    data: auction,
  });
});

/**
 * @desc    Update auction
 * @route   PUT /api/auctions/:id
 * @access  Private (Admin)
 */
exports.updateAuction = asyncHandler(async (req, res, next) => {
  let auction = await Auction.findById(req.params.id);

  if (!auction) {
    return next(new AppError('Auction not found', 404));
  }

  // Prevent updating live or ended auctions (except status)
  if (['live', 'ended', 'sold'].includes(auction.status)) {
    const allowedUpdates = ['status'];
    const updates = Object.keys(req.body);
    const isAllowed = updates.every(update => allowedUpdates.includes(update));
    
    if (!isAllowed) {
      return next(new AppError('Cannot update a live or ended auction', 400));
    }
  }

  // Prevent changing car
  delete req.body.car;
  delete req.body.createdBy;

  auction = await Auction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('car');

  res.status(200).json({
    success: true,
    message: 'Auction updated successfully',
    data: auction,
  });
});

/**
 * @desc    Close/End auction manually
 * @route   PUT /api/auctions/:id/close
 * @access  Private (Admin)
 */
exports.closeAuction = asyncHandler(async (req, res, next) => {
  const auction = await Auction.findById(req.params.id).populate('car');

  if (!auction) {
    return next(new AppError('Auction not found', 404));
  }

  if (auction.status === 'sold' || auction.status === 'cancelled') {
    return next(new AppError('Auction is already closed', 400));
  }

  // Determine final status
  let finalStatus = 'ended';
  
  if (auction.bidCount > 0 && auction.winner) {
    // Check if reserve is met (if applicable)
    if (!auction.reservePrice || auction.isReserveMet) {
      finalStatus = 'sold';
      auction.winningBid = auction.currentBid;
      
      // Update car status
      if (auction.car) {
        auction.car.status = 'sold';
        await auction.car.save();
      }
    }
  } else {
    // No bids - return car to available
    if (auction.car) {
      auction.car.status = 'available';
      await auction.car.save();
    }
  }

  auction.status = finalStatus;
  auction.endTime = new Date(); // Set end time to now
  await auction.save();

  res.status(200).json({
    success: true,
    message: `Auction ${finalStatus === 'sold' ? 'sold' : 'ended'} successfully`,
    data: auction,
  });
});

/**
 * @desc    Cancel auction
 * @route   PUT /api/auctions/:id/cancel
 * @access  Private (Admin)
 */
exports.cancelAuction = asyncHandler(async (req, res, next) => {
  const auction = await Auction.findById(req.params.id).populate('car');

  if (!auction) {
    return next(new AppError('Auction not found', 404));
  }

  if (['sold', 'cancelled'].includes(auction.status)) {
    return next(new AppError('Cannot cancel this auction', 400));
  }

  // Return car to available status
  if (auction.car) {
    auction.car.status = 'available';
    await auction.car.save();
  }

  auction.status = 'cancelled';
  await auction.save();

  res.status(200).json({
    success: true,
    message: 'Auction cancelled successfully',
    data: auction,
  });
});

/**
 * @desc    Add auction to watchlist
 * @route   POST /api/auctions/:id/watch
 * @access  Private
 */
exports.addToWatchlist = asyncHandler(async (req, res, next) => {
  const auction = await Auction.findById(req.params.id);

  if (!auction) {
    return next(new AppError('Auction not found', 404));
  }

  // Check if already in watchlist
  if (auction.watchlist.includes(req.user.id)) {
    return next(new AppError('Already in watchlist', 400));
  }

  auction.watchlist.push(req.user.id);
  await auction.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Added to watchlist',
    data: null,
  });
});

/**
 * @desc    Remove from watchlist
 * @route   DELETE /api/auctions/:id/watch
 * @access  Private
 */
exports.removeFromWatchlist = asyncHandler(async (req, res, next) => {
  const auction = await Auction.findById(req.params.id);

  if (!auction) {
    return next(new AppError('Auction not found', 404));
  }

  auction.watchlist = auction.watchlist.filter(
    userId => userId.toString() !== req.user.id
  );
  await auction.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Removed from watchlist',
    data: null,
  });
});

/**
 * @desc    Get auction statistics (Admin)
 * @route   GET /api/auctions/stats
 * @access  Private (Admin)
 */
exports.getAuctionStats = asyncHandler(async (req, res, next) => {
  const stats = await Auction.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalBids: { $sum: '$bidCount' },
        avgBidCount: { $avg: '$bidCount' },
        totalRevenue: {
          $sum: {
            $cond: [
              { $eq: ['$status', 'sold'] },
              '$winningBid',
              0,
            ],
          },
        },
      },
    },
  ]);

  const recentSales = await Auction.find({ status: 'sold' })
    .populate('car', 'title brand model')
    .sort('-updatedAt')
    .limit(5)
    .select('title winningBid car updatedAt');

  res.status(200).json({
    success: true,
    data: {
      statusStats: stats,
      recentSales,
    },
  });
});
