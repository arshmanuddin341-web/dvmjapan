/**
 * Authentication Controller
 * Handles user registration, login, profile management, and email verification
 */

const User = require('../models/User');
const { AppError } = require('../utils/errorHandler');
const { asyncHandler } = require('../utils/asyncHandler');
const { generateVerificationToken, hashToken } = require('../utils/tokenGenerator');
const { sendVerificationEmail, sendWelcomeEmail } = require('../utils/email');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User with this email already exists', 400));
  }

  // Generate email verification token
  const { plainToken, hashedToken, expiresAt } = generateVerificationToken(24); // 24 hours

  // Create user with verification token
  const user = await User.create({
    name,
    email,
    password,
    phone,
    isEmailVerified: false,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: expiresAt,
  });

  // Build verification URL
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${plainToken}`;

  // Send verification email
  try {
    await sendVerificationEmail(email, name, verificationUrl);
  } catch (emailError) {
    // Log error but don't fail registration
    console.error('Failed to send verification email:', emailError);
  }

  // Respond with success (no token until verified)
  res.status(201).json({
    success: true,
    message: 'Registration successful! Please check your email to verify your account.',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Check if account is active
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated', 401));
  }

  // Check if email is verified
  if (!user.isEmailVerified) {
    return next(new AppError('Please verify your email address before logging in. Check your inbox for the verification link.', 403));
  }

  // Verify password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate token and send response
  sendTokenResponse(user, 200, res, 'Login successful');
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user.toPublicJSON(),
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const allowedFields = ['name', 'phone', 'address'];
  const updates = {};

  // Filter allowed fields
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user.toPublicJSON(),
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/password
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide current and new password', 400));
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});

// =============================================================================
// EMAIL VERIFICATION
// =============================================================================

/**
 * @desc    Verify email address
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return next(new AppError('Verification token is required', 400));
  }

  // Hash the token from URL to compare with stored hash
  const hashedToken = hashToken(token);

  // Find user with matching token that hasn't expired
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    return next(new AppError('Invalid or expired verification token. Please request a new verification email.', 400));
  }

  // Check if already verified
  if (user.isEmailVerified) {
    return res.status(200).json({
      success: true,
      message: 'Email is already verified. You can login.',
      data: null,
    });
  }

  // Mark email as verified and clear token
  user.isEmailVerified = true;
  user.clearVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.name);
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
  }

  res.status(200).json({
    success: true,
    message: 'Email verified successfully! You can now login.',
    data: {
      user: user.toPublicJSON(),
    },
  });
});

/**
 * @desc    Resend verification email
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
exports.resendVerificationEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide your email address', 400));
  }

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if user exists or not for security
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a verification email has been sent.',
      data: null,
    });
  }

  // Check if already verified
  if (user.isEmailVerified) {
    return next(new AppError('This email is already verified. Please login.', 400));
  }

  // Check rate limiting - don't allow resend within 1 minute
  if (user.emailVerificationExpires) {
    const tokenAge = Date.now() - (user.emailVerificationExpires - 24 * 60 * 60 * 1000);
    const minWait = 60 * 1000; // 1 minute
    
    if (tokenAge < minWait) {
      const waitSeconds = Math.ceil((minWait - tokenAge) / 1000);
      return next(new AppError(`Please wait ${waitSeconds} seconds before requesting another verification email.`, 429));
    }
  }

  // Generate new verification token
  const { plainToken, hashedToken, expiresAt } = generateVerificationToken(24);

  // Update user with new token
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = expiresAt;
  await user.save({ validateBeforeSave: false });

  // Build verification URL
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${plainToken}`;

  // Send verification email
  try {
    await sendVerificationEmail(user.email, user.name, verificationUrl);
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    return next(new AppError('Failed to send verification email. Please try again later.', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Verification email sent! Please check your inbox.',
    data: null,
  });
});

/**
 * @desc    OAuth callback - redirect to frontend with token
 * @access  Public (used internally by passport)
 */
exports.oauthCallback = (req, res, next) => {
  if (!req.user) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`);
  }
  const token = req.user.generateAuthToken();
  const frontendUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`;
  res.redirect(`${frontendUrl}?token=${token}`);
};

/**
 * @desc    Check verification status
 * @route   GET /api/auth/verification-status/:email
 * @access  Public
 */
exports.checkVerificationStatus = asyncHandler(async (req, res, next) => {
  const { email } = req.params;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  // Don't reveal if user exists or not
  if (!user) {
    return res.status(200).json({
      success: true,
      data: {
        exists: false,
        isVerified: false,
      },
    });
  }

  res.status(200).json({
    success: true,
    data: {
      exists: true,
      isVerified: user.isEmailVerified,
    },
  });
});

/**
 * Helper function to send token response
 * @param {Object} user - User document
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 * @param {string} message - Response message
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.generateAuthToken();

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: user.toPublicJSON(),
      token,
    },
  });
};
