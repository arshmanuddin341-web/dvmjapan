/**
 * Base contract for Japan auction source adapters.
 * Each adapter fetches raw listings from one source and returns an array of raw objects.
 * Normalization is done in normalizeAuctionVehicle().
 */

/**
 * @typedef {Object} AdapterResult
 * @property {Array<Object>} items - Raw listing items
 * @property {string} sourceName - Display name of the source
 * @property {string} [error] - Error message if fetch failed
 */

/**
 * Fetch raw listings from the source.
 * @returns {Promise<AdapterResult>}
 */
async function fetchListings() {
  throw new Error('Adapter must implement fetchListings()');
}

module.exports = {
  fetchListings,
};
