/**
 * Async Handler Utility
 * Wraps async route handlers to catch errors automatically
 */

/**
 * Wraps an async function and passes errors to Express error handler
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Instead of:
 * exports.getUser = async (req, res, next) => {
 *   try {
 *     const user = await User.findById(req.params.id);
 *     res.json(user);
 *   } catch (error) {
 *     next(error);
 *   }
 * };
 * 
 * // Use:
 * exports.getUser = asyncHandler(async (req, res, next) => {
 *   const user = await User.findById(req.params.id);
 *   res.json(user);
 * });
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { asyncHandler };
