/**
 * Admin Controller
 * Handles all admin-only operations for users, cars, auctions, and dashboard
 */

const User = require('../models/User');
const Car = require('../models/Car');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const { AppError } = require('../utils/errorHandler');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination } = require('../utils/pagination');
const { emitToAuction } = require('../socket');

// =============================================================================
// USER MANAGEMENT
// =============================================================================

/**
 * @desc    Get all users with filtering and pagination
 * @route   GET /api/admin/users
 * @access  Admin
 */
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req.query);
  const { role, isActive, search } = req.query;

  // Build query
  const queryObj = {};
  
  if (role) queryObj.role = role;
  if (isActive !== undefined) queryObj.isActive = isActive === 'true';
  
  // Search by name or email
  if (search) {
    queryObj.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(queryObj)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    User.countDocuments(queryObj),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users,
  });
});

/**
 * @desc    Get single user by ID
 * @route   GET /api/admin/users/:id
 * @access  Admin
 */
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Get user statistics
  const [carCount, bidCount, wonAuctions] = await Promise.all([
    Car.countDocuments({ seller: user._id }),
    Bid.countDocuments({ bidder: user._id }),
    Auction.countDocuments({ winner: user._id, status: 'sold' }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      user,
      stats: {
        carsListed: carCount,
        totalBids: bidCount,
        auctionsWon: wonAuctions,
      },
    },
  });
});

/**
 * @desc    Create new user (by admin)
 * @route   POST /api/admin/users
 * @access  Admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, phone, isActive } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User with this email already exists', 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    phone,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user.toPublicJSON(),
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/admin/users/:id
 * @access  Admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, role, phone, isActive, address } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Prevent admin from demoting themselves
  if (user._id.toString() === req.user.id && role && role !== 'admin') {
    return next(new AppError('You cannot change your own admin role', 400));
  }

  // Check email uniqueness if changing
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(new AppError('Email already in use', 400));
    }
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (phone !== undefined) user.phone = phone;
  if (isActive !== undefined) user.isActive = isActive;
  if (address) user.address = address;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user.toPublicJSON(),
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user.id) {
    return next(new AppError('You cannot delete your own account', 400));
  }

  // Check for active auctions or bids
  const activeAuctions = await Auction.countDocuments({
    createdBy: user._id,
    status: 'live',
  });

  if (activeAuctions > 0) {
    return next(new AppError('Cannot delete user with active auctions', 400));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: null,
  });
});

/**
 * @desc    Toggle user status (activate/deactivate)
 * @route   PUT /api/admin/users/:id/toggle-status
 * @access  Admin
 */
exports.toggleUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Prevent admin from deactivating themselves
  if (user._id.toString() === req.user.id) {
    return next(new AppError('You cannot deactivate your own account', 400));
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    data: user.toPublicJSON(),
  });
});

/**
 * @desc    Change user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Admin
 */
exports.changeUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    return next(new AppError('Invalid role. Must be "user" or "admin"', 400));
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Prevent admin from changing their own role
  if (user._id.toString() === req.user.id) {
    return next(new AppError('You cannot change your own role', 400));
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User role changed to ${role} successfully`,
    data: user.toPublicJSON(),
  });
});

// =============================================================================
// CAR MANAGEMENT
// =============================================================================

/**
 * @desc    Get all cars (admin view with more details)
 * @route   GET /api/admin/cars
 * @access  Admin
 */
exports.getAllCarsAdmin = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status, isVerified, search, brand } = req.query;

  // Build query
  const queryObj = {};
  
  if (status) queryObj.status = status;
  if (isVerified !== undefined) queryObj.isVerified = isVerified === 'true';
  if (brand) queryObj.brand = { $regex: brand, $options: 'i' };
  
  if (search) {
    queryObj.$or = [
      { title: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
      { vin: { $regex: search, $options: 'i' } },
    ];
  }

  const [cars, total] = await Promise.all([
    Car.find(queryObj)
      .populate('seller', 'name email')
      .populate('verifiedBy', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Car.countDocuments(queryObj),
  ]);

  res.status(200).json({
    success: true,
    count: cars.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: cars,
  });
});

/**
 * @desc    Bulk verify cars
 * @route   PUT /api/admin/cars/bulk-verify
 * @access  Admin
 */
exports.bulkVerifyCars = asyncHandler(async (req, res, next) => {
  const { carIds } = req.body;

  if (!carIds || !Array.isArray(carIds) || carIds.length === 0) {
    return next(new AppError('Please provide car IDs to verify', 400));
  }

  const result = await Car.updateMany(
    { _id: { $in: carIds }, isVerified: false },
    {
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: req.user.id,
    }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} cars verified successfully`,
    data: {
      verifiedCount: result.modifiedCount,
    },
  });
});

/**
 * @desc    Bulk update car status
 * @route   PUT /api/admin/cars/bulk-status
 * @access  Admin
 */
exports.bulkUpdateCarStatus = asyncHandler(async (req, res, next) => {
  const { carIds, status } = req.body;

  if (!carIds || !Array.isArray(carIds) || carIds.length === 0) {
    return next(new AppError('Please provide car IDs', 400));
  }

  if (!status || !['available', 'withdrawn'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  // Don't allow changing status of cars in auction
  const result = await Car.updateMany(
    { _id: { $in: carIds }, status: { $nin: ['in_auction', 'sold'] } },
    { status }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} cars updated successfully`,
    data: {
      updatedCount: result.modifiedCount,
    },
  });
});

/**
 * @desc    Delete car (admin override)
 * @route   DELETE /api/admin/cars/:id
 * @access  Admin
 */
exports.deleteCarAdmin = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  // Check for active auction
  const activeAuction = await Auction.findOne({
    car: car._id,
    status: 'live',
  });

  if (activeAuction) {
    return next(new AppError('Cannot delete car with active auction. Cancel the auction first.', 400));
  }

  await car.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Car deleted successfully',
    data: null,
  });
});

// =============================================================================
// AUCTION MANAGEMENT
// =============================================================================

/**
 * @desc    Get all auctions (admin view)
 * @route   GET /api/admin/auctions
 * @access  Admin
 */
exports.getAllAuctionsAdmin = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req.query);
  const { status, search } = req.query;

  // Build query
  const queryObj = {};
  if (status) queryObj.status = status;

  let query = Auction.find(queryObj)
    .populate({
      path: 'car',
      select: 'title brand model year images seller',
      populate: { path: 'seller', select: 'name email' },
    })
    .populate('createdBy', 'name email')
    .populate('winner', 'name email')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const [auctions, total] = await Promise.all([
    query,
    Auction.countDocuments(queryObj),
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
 * @desc    Extend auction end time
 * @route   PUT /api/admin/auctions/:id/extend
 * @access  Admin
 */
exports.extendAuction = asyncHandler(async (req, res, next) => {
  const { minutes } = req.body;

  if (!minutes || minutes < 1) {
    return next(new AppError('Please provide valid extension time in minutes', 400));
  }

  const auction = await Auction.findById(req.params.id);

  if (!auction) {
    return next(new AppError('Auction not found', 404));
  }

  if (!['live', 'scheduled'].includes(auction.status)) {
    return next(new AppError('Can only extend live or scheduled auctions', 400));
  }

  // Extend end time
  const newEndTime = new Date(auction.endTime);
  newEndTime.setMinutes(newEndTime.getMinutes() + parseInt(minutes));
  auction.endTime = newEndTime;

  await auction.save();

  // Emit real-time update
  emitToAuction(auction._id.toString(), 'auction:extended', {
    newEndTime: auction.endTime,
    reason: `Extended by admin (${minutes} minutes)`,
  });

  res.status(200).json({
    success: true,
    message: `Auction extended by ${minutes} minutes`,
    data: auction,
  });
});

/**
 * @desc    Force close auction with winner
 * @route   PUT /api/admin/auctions/:id/force-close
 * @access  Admin
 */
exports.forceCloseAuction = asyncHandler(async (req, res, next) => {
  const { winnerId, winningBid } = req.body;

  const auction = await Auction.findById(req.params.id).populate('car');

  if (!auction) {
    return next(new AppError('Auction not found', 404));
  }

  if (['sold', 'cancelled'].includes(auction.status)) {
    return next(new AppError('Auction is already closed', 400));
  }

  // Set winner if provided
  if (winnerId) {
    const winner = await User.findById(winnerId);
    if (!winner) {
      return next(new AppError('Winner user not found', 404));
    }
    auction.winner = winnerId;
    auction.winningBid = winningBid || auction.currentBid;
    auction.status = 'sold';

    // Update car status
    if (auction.car) {
      auction.car.status = 'sold';
      await auction.car.save();
    }
  } else {
    auction.status = 'ended';
    // Return car to available
    if (auction.car) {
      auction.car.status = 'available';
      await auction.car.save();
    }
  }

  auction.endTime = new Date();
  await auction.save();

  // Emit real-time update
  emitToAuction(auction._id.toString(), 'auction:ended', {
    status: auction.status,
    winner: winnerId ? { id: winnerId } : null,
    winningBid: auction.winningBid,
    reason: 'Closed by admin',
  });

  res.status(200).json({
    success: true,
    message: 'Auction closed successfully',
    data: auction,
  });
});

/**
 * @desc    Bulk cancel auctions
 * @route   PUT /api/admin/auctions/bulk-cancel
 * @access  Admin
 */
exports.bulkCancelAuctions = asyncHandler(async (req, res, next) => {
  const { auctionIds, reason } = req.body;

  if (!auctionIds || !Array.isArray(auctionIds) || auctionIds.length === 0) {
    return next(new AppError('Please provide auction IDs', 400));
  }

  // Get auctions to cancel
  const auctions = await Auction.find({
    _id: { $in: auctionIds },
    status: { $nin: ['sold', 'cancelled'] },
  }).populate('car');

  // Cancel each and update car status
  for (const auction of auctions) {
    auction.status = 'cancelled';
    if (auction.car) {
      auction.car.status = 'available';
      await auction.car.save();
    }
    await auction.save();
  }

  res.status(200).json({
    success: true,
    message: `${auctions.length} auctions cancelled`,
    data: {
      cancelledCount: auctions.length,
      reason,
    },
  });
});

// =============================================================================
// DASHBOARD & STATISTICS
// =============================================================================

/**
 * @desc    Get dashboard overview stats
 * @route   GET /api/admin/dashboard
 * @access  Admin
 */
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get counts
  const [
    totalUsers,
    activeUsers,
    totalCars,
    availableCars,
    totalAuctions,
    liveAuctions,
    totalBids,
    totalRevenue,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Car.countDocuments(),
    Car.countDocuments({ status: 'available' }),
    Auction.countDocuments(),
    Auction.countDocuments({ status: 'live' }),
    Bid.countDocuments(),
    Auction.aggregate([
      { $match: { status: 'sold' } },
      { $group: { _id: null, total: { $sum: '$winningBid' } } },
    ]),
  ]);

  // Get recent activity
  const [recentUsers, recentAuctions, recentBids] = await Promise.all([
    User.find().sort('-createdAt').limit(5).select('name email createdAt'),
    Auction.find()
      .sort('-createdAt')
      .limit(5)
      .populate('car', 'title brand')
      .select('title status currentBid createdAt'),
    Bid.find()
      .sort('-createdAt')
      .limit(10)
      .populate('bidder', 'name')
      .populate('auction', 'title')
      .select('amount createdAt'),
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        users: {
          total: totalUsers,
          active: activeUsers,
        },
        cars: {
          total: totalCars,
          available: availableCars,
        },
        auctions: {
          total: totalAuctions,
          live: liveAuctions,
        },
        bids: {
          total: totalBids,
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
        },
      },
      recentActivity: {
        users: recentUsers,
        auctions: recentAuctions,
        bids: recentBids,
      },
    },
  });
});

/**
 * @desc    Get detailed analytics
 * @route   GET /api/admin/analytics
 * @access  Admin
 */
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  const { period = '30' } = req.query; // days
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  // Users registered over time
  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Auctions by status
  const auctionsByStatus = await Auction.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Cars by brand
  const carsByBrand = await Car.aggregate([
    {
      $group: {
        _id: '$brand',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // Bids over time
  const bidsOverTime = await Bid.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Revenue over time
  const revenueOverTime = await Auction.aggregate([
    {
      $match: {
        status: 'sold',
        updatedAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
        revenue: { $sum: '$winningBid' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Top sellers
  const topSellers = await Car.aggregate([
    { $match: { status: 'sold' } },
    {
      $group: {
        _id: '$seller',
        carsSold: { $sum: 1 },
      },
    },
    { $sort: { carsSold: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'seller',
      },
    },
    { $unwind: '$seller' },
    {
      $project: {
        carsSold: 1,
        'seller.name': 1,
        'seller.email': 1,
      },
    },
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
      period: `${period} days`,
      userGrowth,
      auctionsByStatus,
      carsByBrand,
      bidsOverTime,
      revenueOverTime,
      topSellers,
      topBidders,
    },
  });
});

/**
 * @desc    Get system health and metrics
 * @route   GET /api/admin/system
 * @access  Admin
 */
exports.getSystemHealth = asyncHandler(async (req, res, next) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  // Database stats
  const dbStats = await Promise.all([
    User.collection.stats(),
    Car.collection.stats(),
    Auction.collection.stats(),
    Bid.collection.stats(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      server: {
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        uptimeSeconds: uptime,
        memory: {
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        },
        nodeVersion: process.version,
        platform: process.platform,
      },
      database: {
        users: {
          count: dbStats[0].count,
          size: `${Math.round(dbStats[0].size / 1024)}KB`,
        },
        cars: {
          count: dbStats[1].count,
          size: `${Math.round(dbStats[1].size / 1024)}KB`,
        },
        auctions: {
          count: dbStats[2].count,
          size: `${Math.round(dbStats[2].size / 1024)}KB`,
        },
        bids: {
          count: dbStats[3].count,
          size: `${Math.round(dbStats[3].size / 1024)}KB`,
        },
      },
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * @desc    Export data (users, cars, auctions)
 * @route   GET /api/admin/export/:type
 * @access  Admin
 */
exports.exportData = asyncHandler(async (req, res, next) => {
  const { type } = req.params;
  const { format = 'json' } = req.query;

  let data;
  
  switch (type) {
    case 'users':
      data = await User.find().select('-password').lean();
      break;
    case 'cars':
      data = await Car.find().populate('seller', 'name email').lean();
      break;
    case 'auctions':
      data = await Auction.find()
        .populate('car', 'title brand model')
        .populate('winner', 'name email')
        .lean();
      break;
    case 'bids':
      data = await Bid.find()
        .populate('bidder', 'name email')
        .populate('auction', 'title')
        .lean();
      break;
    default:
      return next(new AppError('Invalid export type. Use: users, cars, auctions, bids', 400));
  }

  res.status(200).json({
    success: true,
    type,
    count: data.length,
    exportedAt: new Date().toISOString(),
    data,
  });
});
