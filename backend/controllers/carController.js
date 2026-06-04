/**
 * Car Controller
 * Handles all car-related CRUD operations
 */

const Car = require('../models/Car');
const { AppError } = require('../utils/errorHandler');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination } = require('../utils/pagination');

/**
 * @desc    Get all cars with filtering, sorting, and pagination
 * @route   GET /api/cars
 * @access  Public
 */
exports.getAllCars = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req.query);
  
  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
  excludedFields.forEach(field => delete queryObj[field]);

  // Filter by status (default to available)
  if (!queryObj.status) {
    queryObj.status = { $in: ['available', 'in_auction'] };
  }

  // Advanced filtering (gte, gt, lte, lt)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
  let query = Car.find(JSON.parse(queryStr));

  // Search functionality
  if (req.query.search) {
    query = Car.find({
      ...JSON.parse(queryStr),
      $text: { $search: req.query.search }
    });
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  }

  // Pagination
  query = query.skip(skip).limit(limit);

  // Populate seller info
  query = query.populate('seller', 'name');

  // Execute query
  const [cars, total] = await Promise.all([
    query,
    Car.countDocuments(JSON.parse(queryStr)),
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
 * @desc    Get single car by ID
 * @route   GET /api/cars/:id
 * @access  Public
 */
exports.getCarById = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id)
    .populate('seller', 'name email phone');

  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  res.status(200).json({
    success: true,
    data: car,
  });
});

/**
 * @desc    Create a new car listing
 * @route   POST /api/cars
 * @access  Private (Admin/User)
 */
exports.createCar = asyncHandler(async (req, res, next) => {
  // Set seller to current user
  req.body.seller = req.user.id;

  const car = await Car.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Car listing created successfully',
    data: car,
  });
});

/**
 * @desc    Update car listing
 * @route   PUT /api/cars/:id
 * @access  Private (Owner/Admin)
 */
exports.updateCar = asyncHandler(async (req, res, next) => {
  let car = await Car.findById(req.params.id);

  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  // Check ownership (unless admin)
  if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this car', 403));
  }

  // Prevent updating seller
  delete req.body.seller;

  // Prevent status change to sold (use auction process)
  if (req.body.status === 'sold' && req.user.role !== 'admin') {
    return next(new AppError('Cannot manually mark car as sold', 400));
  }

  car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Car updated successfully',
    data: car,
  });
});

/**
 * @desc    Delete car listing
 * @route   DELETE /api/cars/:id
 * @access  Private (Owner/Admin)
 */
exports.deleteCar = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  // Check ownership (unless admin)
  if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this car', 403));
  }

  // Check if car is in active auction
  if (car.status === 'in_auction') {
    return next(new AppError('Cannot delete car while in active auction', 400));
  }

  await car.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Car deleted successfully',
    data: null,
  });
});

/**
 * @desc    Get cars by current user
 * @route   GET /api/cars/my-cars
 * @access  Private
 */
exports.getMyCars = asyncHandler(async (req, res, next) => {
  const { page, limit, skip } = getPagination(req.query);

  const [cars, total] = await Promise.all([
    Car.find({ seller: req.user.id })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit),
    Car.countDocuments({ seller: req.user.id }),
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
 * @desc    Verify a car listing (Admin only)
 * @route   PUT /api/cars/:id/verify
 * @access  Private (Admin)
 */
exports.verifyCar = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  car.isVerified = true;
  car.verifiedAt = new Date();
  car.verifiedBy = req.user.id;
  await car.save();

  res.status(200).json({
    success: true,
    message: 'Car verified successfully',
    data: car,
  });
});

/**
 * @desc    Get car statistics (Admin)
 * @route   GET /api/cars/stats
 * @access  Private (Admin)
 */
exports.getCarStats = asyncHandler(async (req, res, next) => {
  const stats = await Car.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgEstimatedValue: { $avg: '$estimatedValue' },
      },
    },
  ]);

  const brandStats = await Car.aggregate([
    {
      $group: {
        _id: '$brand',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  res.status(200).json({
    success: true,
    data: {
      statusStats: stats,
      topBrands: brandStats,
    },
  });
});
