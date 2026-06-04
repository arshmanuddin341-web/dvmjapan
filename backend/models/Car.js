/**
 * Car Model
 * Defines the schema for vehicles in the auction system
 */

const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a car title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide the car brand'],
      trim: true,
      maxlength: [50, 'Brand cannot exceed 50 characters'],
    },
    model: {
      type: String,
      required: [true, 'Please provide the car model'],
      trim: true,
      maxlength: [50, 'Model cannot exceed 50 characters'],
    },
    year: {
      type: Number,
      required: [true, 'Please provide the manufacturing year'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    mileage: {
      type: Number,
      required: [true, 'Please provide the mileage'],
      min: [0, 'Mileage cannot be negative'],
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid', 'other'],
      default: 'petrol',
    },
    transmission: {
      type: String,
      enum: ['automatic', 'manual', 'cvt', 'semi-automatic'],
      default: 'automatic',
    },
    engineCapacity: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    vin: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null values
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    features: [{
      type: String,
      trim: true,
    }],
    images: [{
      url: {
        type: String,
        required: true,
      },
      alt: {
        type: String,
        default: '',
      },
      isPrimary: {
        type: Boolean,
        default: false,
      },
    }],
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good',
    },
    location: {
      city: String,
      state: String,
      country: {
        type: String,
        default: 'USA',
      },
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'in_auction', 'sold', 'withdrawn'],
      default: 'available',
    },
    estimatedValue: {
      type: Number,
      min: [0, 'Estimated value cannot be negative'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ year: 1 });
carSchema.index({ status: 1 });
carSchema.index({ seller: 1 });
carSchema.index({ createdAt: -1 });
carSchema.index({ 
  title: 'text', 
  brand: 'text', 
  model: 'text', 
  description: 'text' 
});

/**
 * Virtual for primary image
 */
carSchema.virtual('primaryImage').get(function () {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0]?.url || null);
});

/**
 * Virtual for full car name
 */
carSchema.virtual('fullName').get(function () {
  return `${this.year} ${this.brand} ${this.model}`;
});

/**
 * Pre-save middleware to ensure only one primary image
 */
carSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

/**
 * Static method to find cars by status
 */
carSchema.statics.findByStatus = function (status) {
  return this.find({ status }).populate('seller', 'name email');
};

/**
 * Static method to search cars
 */
carSchema.statics.search = function (query) {
  return this.find({ $text: { $search: query } })
    .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Car', carSchema);
