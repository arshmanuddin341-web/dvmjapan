/**
 * Authentication Routes
 * Defines all auth-related API endpoints
 */

const express = require('express');
const passport = require('passport');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

/**
 * Validation rules for registration
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
];

/**
 * Validation rules for login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation rules for password update
 */
const passwordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

/**
 * Validation rules for resend verification
 */
const resendVerificationValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
];

// Public routes - Authentication
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);

// OAuth routes (Google, Facebook)
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_not_configured`);
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.oauthCallback);

router.get('/facebook', (req, res, next) => {
  if (!process.env.FACEBOOK_APP_ID) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=facebook_not_configured`);
  }
  passport.authenticate('facebook', { scope: ['email'], session: false })(req, res, next);
});
router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), authController.oauthCallback);

// Public routes - Email Verification
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', resendVerificationValidation, validate, authController.resendVerificationEmail);
router.get('/verification-status/:email', authController.checkVerificationStatus);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.put('/password', protect, passwordValidation, validate, authController.updatePassword);
router.post('/logout', protect, authController.logout);

module.exports = router;
