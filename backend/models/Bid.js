/**
 * Bid Model
 * Defines the schema for auction bids
 */

const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction',
      required: [true, 'Bid must belong to an auction'],
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Bid must have a bidder'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide bid amount'],
      min: [0, 'Bid amount cannot be negative'],
    },
    previousBid: {
      type: Number,
      default: 0,
    },
    isWinning: {
      type: Boolean,
      default: false,
    },
    isAutoBid: {
      type: Boolean,
      default: false,
    },
    maxAutoBid: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['active', 'outbid', 'won', 'lost', 'cancelled'],
      default: 'active',
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
bidSchema.index({ auction: 1, createdAt: -1 });
bidSchema.index({ bidder: 1 });
bidSchema.index({ auction: 1, bidder: 1 });
bidSchema.index({ auction: 1, amount: -1 });

/**
 * Static method to get bid history for an auction
 */
bidSchema.statics.getAuctionHistory = function (auctionId, limit = 50) {
  return this.find({ auction: auctionId })
    .populate('bidder', 'name')
    .sort('-createdAt')
    .limit(limit);
};

/**
 * Static method to get highest bid for an auction
 */
bidSchema.statics.getHighestBid = function (auctionId) {
  return this.findOne({ auction: auctionId })
    .sort('-amount')
    .populate('bidder', 'name email');
};

/**
 * Static method to get user's bids
 */
bidSchema.statics.getUserBids = function (userId) {
  return this.find({ bidder: userId })
    .populate({
      path: 'auction',
      select: 'title status endTime currentBid',
      populate: {
        path: 'car',
        select: 'title brand model images',
      },
    })
    .sort('-createdAt');
};

/**
 * Static method to count unique bidders for an auction
 */
bidSchema.statics.getUniqueBiddersCount = async function (auctionId) {
  const result = await this.aggregate([
    { $match: { auction: mongoose.Types.ObjectId(auctionId) } },
    { $group: { _id: '$bidder' } },
    { $count: 'uniqueBidders' },
  ]);
  return result.length > 0 ? result[0].uniqueBidders : 0;
};

/**
 * Pre-save middleware to set isWinning
 */
bidSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Mark this bid as winning, previous winning bid as outbid
    await this.constructor.updateMany(
      { auction: this.auction, isWinning: true },
      { isWinning: false, status: 'outbid' }
    );
    this.isWinning = true;
    this.status = 'active';
  }
  next();
});

module.exports = mongoose.model('Bid', bidSchema);
