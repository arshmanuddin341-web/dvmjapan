/**
 * User Model
 * Defines the schema for user accounts with authentication
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    // Email verification fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false, // Don't return by default for security
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for role (email index is created by unique: true)
userSchema.index({ role: 1 });

/**
 * Pre-save middleware to hash password
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) {
    return next();
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare entered password with hashed password
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate JWT token for authentication
 * @returns {string} JWT token
 */
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email,
      role: this.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Get public profile (exclude sensitive data)
 * @returns {Object}
 */
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    phone: this.phone,
    address: this.address,
    isActive: this.isActive,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt,
  };
};

/**
 * Check if email verification token is valid and not expired
 * @param {string} hashedToken - Hashed token to verify
 * @returns {boolean}
 */
userSchema.methods.isVerificationTokenValid = function (hashedToken) {
  return (
    this.emailVerificationToken === hashedToken &&
    this.emailVerificationExpires > Date.now()
  );
};

/**
 * Clear email verification token
 */
userSchema.methods.clearVerificationToken = function () {
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;
};

module.exports = mongoose.model('User', userSchema);
