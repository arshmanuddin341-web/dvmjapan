/**
 * Auction Model
 * Defines the schema for car auctions
 */

const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Auction must have a car'],
    },
    title: {
      type: String,
      required: [true, 'Please provide an auction title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    startTime: {
      type: Date,
      required: [true, 'Please provide auction start time'],
    },
    endTime: {
      type: Date,
      required: [true, 'Please provide auction end time'],
    },
    startingBid: {
      type: Number,
      required: [true, 'Please provide a starting bid amount'],
      min: [0, 'Starting bid cannot be negative'],
    },
    currentBid: {
      type: Number,
      default: 0,
    },
    reservePrice: {
      type: Number,
      min: [0, 'Reserve price cannot be negative'],
    },
    bidIncrement: {
      type: Number,
      default: 100,
      min: [1, 'Bid increment must be at least 1'],
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'live', 'ended', 'cancelled', 'sold'],
      default: 'draft',
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    winningBid: {
      type: Number,
    },
    bidCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    watchlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    featuredImage: {
      type: String,
    },
    terms: {
      type: String,
    },
    isReserveMet: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
auctionSchema.index({ status: 1 });
auctionSchema.index({ startTime: 1 });
auctionSchema.index({ endTime: 1 });
auctionSchema.index({ car: 1 });
auctionSchema.index({ createdBy: 1 });
auctionSchema.index({ status: 1, startTime: 1, endTime: 1 });

/**
 * Virtual for time remaining
 */
auctionSchema.virtual('timeRemaining').get(function () {
  if (this.status !== 'live') return null;
  const remaining = new Date(this.endTime) - new Date();
  return remaining > 0 ? remaining : 0;
});

/**
 * Virtual for checking if auction is active
 */
auctionSchema.virtual('isActive').get(function () {
  const now = new Date();
  return this.status === 'live' && 
         now >= this.startTime && 
         now <= this.endTime;
});

/**
 * Pre-save validation
 */
auctionSchema.pre('save', function (next) {
  // Ensure end time is after start time
  if (this.endTime <= this.startTime) {
    const error = new Error('End time must be after start time');
    return next(error);
  }

  // Set current bid to starting bid if not set
  if (this.isNew && this.currentBid === 0) {
    this.currentBid = this.startingBid;
  }

  // Check if reserve is met
  if (this.reservePrice && this.currentBid >= this.reservePrice) {
    this.isReserveMet = true;
  }

  next();
});

/**
 * Update auction status based on time
 */
auctionSchema.methods.updateStatus = function () {
  const now = new Date();
  
  if (this.status === 'cancelled' || this.status === 'sold') {
    return this.status;
  }

  if (now < this.startTime) {
    this.status = 'scheduled';
  } else if (now >= this.startTime && now <= this.endTime) {
    this.status = 'live';
  } else if (now > this.endTime) {
    this.status = 'ended';
  }

  return this.status;
};

/**
 * Check if bid is valid
 */
auctionSchema.methods.isValidBid = function (amount, userId) {
  // Check if auction is live
  if (this.status !== 'live') {
    return { valid: false, message: 'Auction is not live' };
  }

  // Check if auction has ended
  const now = new Date();
  if (now > this.endTime) {
    return { valid: false, message: 'Auction has ended' };
  }

  // Check minimum bid amount
  const minBid = this.currentBid + this.bidIncrement;
  if (amount < minBid) {
    return { 
      valid: false, 
      message: `Bid must be at least ${minBid}` 
    };
  }

  return { valid: true };
};

/**
 * Static method to find live auctions
 */
auctionSchema.statics.findLive = function () {
  const now = new Date();
  return this.find({
    status: 'live',
    startTime: { $lte: now },
    endTime: { $gte: now },
  }).populate('car');
};

/**
 * Static method to find upcoming auctions
 */
auctionSchema.statics.findUpcoming = function () {
  const now = new Date();
  return this.find({
    status: 'scheduled',
    startTime: { $gt: now },
  }).populate('car').sort('startTime');
};

/**
 * Static method to find ended auctions
 */
auctionSchema.statics.findEnded = function () {
  return this.find({
    status: { $in: ['ended', 'sold'] },
  }).populate('car winner').sort('-endTime');
};

module.exports = mongoose.model('Auction', auctionSchema);
