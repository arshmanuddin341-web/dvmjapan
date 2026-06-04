/**
 * Token Generator Utility
 * Generates and hashes secure tokens for email verification and password reset
 */

const crypto = require('crypto');

/**
 * Generate a random token
 * @param {number} bytes - Number of random bytes (default: 32)
 * @returns {string} Random hex string
 */
const generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hash a token using SHA-256
 * @param {string} token - Plain text token
 * @returns {string} Hashed token
 */
const hashToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

/**
 * Generate verification token with expiry
 * @param {number} expiryHours - Hours until token expires (default: 24)
 * @returns {Object} Object containing plainToken, hashedToken, and expiresAt
 */
const generateVerificationToken = (expiryHours = 24) => {
  const plainToken = generateToken();
  const hashedToken = hashToken(plainToken);
  const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

  return {
    plainToken,    // Send this in the email URL
    hashedToken,   // Store this in the database
    expiresAt,     // Store this as the expiration time
  };
};

/**
 * Verify a token against its hash
 * @param {string} plainToken - Token from user
 * @param {string} hashedToken - Hashed token from database
 * @returns {boolean} Whether tokens match
 */
const verifyToken = (plainToken, hashedToken) => {
  const hashedInput = hashToken(plainToken);
  return hashedInput === hashedToken;
};

module.exports = {
  generateToken,
  hashToken,
  generateVerificationToken,
  verifyToken,
};
