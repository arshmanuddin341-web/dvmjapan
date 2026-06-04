/**
 * Pagination Utility
 * Provides consistent pagination across all list endpoints
 */

const config = require('../config');

/**
 * Get pagination parameters from query string
 * @param {Object} query - Express request query object
 * @returns {Object} Pagination parameters
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(
    config.pagination.maxLimit,
    Math.max(1, parseInt(query.limit, 10) || config.pagination.defaultLimit)
  );
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

/**
 * Format pagination response
 * @param {Object} params - Parameters object
 * @param {Array} params.data - Array of documents
 * @param {number} params.total - Total count of documents
 * @param {number} params.page - Current page
 * @param {number} params.limit - Items per page
 * @returns {Object} Formatted pagination response
 */
const formatPaginationResponse = ({ data, total, page, limit }) => {
  const pages = Math.ceil(total / limit);
  const hasNextPage = page < pages;
  const hasPrevPage = page > 1;

  return {
    data,
    pagination: {
      total,
      page,
      pages,
      limit,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    },
  };
};

module.exports = {
  getPagination,
  formatPaginationResponse,
};
