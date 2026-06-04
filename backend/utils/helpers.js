/**
 * General Helper Utilities
 * Common utility functions used across the application
 */

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Calculate time difference in human readable format
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date (default: now)
 * @returns {string} Human readable time difference
 */
const getTimeDifference = (startDate, endDate = new Date()) => {
  const diff = Math.abs(endDate - startDate);
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
};

/**
 * Slugify a string
 * @param {string} text - Text to slugify
 * @returns {string} Slugified string
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Remove undefined/null values from object
 * @param {Object} obj - Object to clean
 * @returns {Object} Cleaned object
 */
const cleanObject = (obj) => {
  const cleaned = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if a date is in the past
 * @param {Date} date - Date to check
 * @returns {boolean}
 */
const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Check if a date is in the future
 * @param {Date} date - Date to check
 * @returns {boolean}
 */
const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

module.exports = {
  generateRandomString,
  formatCurrency,
  getTimeDifference,
  slugify,
  cleanObject,
  deepClone,
  isPastDate,
  isFutureDate,
};
