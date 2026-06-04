/**
 * Japan auction sync service.
 * Fetches data from one configured source, normalizes it, and returns vehicles for DB upsert.
 * Does NOT write to DB (no Prisma/Mongoose here); caller (Next.js) persists to Prisma.
 * Logs errors but does not throw (server-safe).
 */

const { normalizeAuctionVehicle } = require('./normalizeAuctionVehicle');
const configAdapter = require('./sourceAdapters/configAdapter');

const SOURCE_ADAPTERS = {
  config: configAdapter,
  jdmarapi: configAdapter,
  custom: configAdapter,
};

/**
 * Get the adapter for the configured source.
 * @returns {{ fetchListings: () => Promise<{ items: Array, sourceName: string, error?: string }> }}
 */
function getAdapter() {
  const name = (process.env.JAPAN_AUCTION_SOURCE || 'config').toLowerCase();
  return SOURCE_ADAPTERS[name] || configAdapter;
}

/**
 * Fetch raw listings from the active source.
 * @returns {Promise<{ items: Array<Object>, sourceName: string, error?: string }>}
 */
async function fetchFromSource() {
  const adapter = getAdapter();
  try {
    return await adapter.fetchListings();
  } catch (err) {
    const message = err?.message || 'Unknown error';
    if (process.env.NODE_ENV !== 'test') {
      console.error('[japanAuctions] fetchFromSource error:', message);
    }
    return { items: [], sourceName: 'Unknown', error: message };
  }
}

/**
 * Run sync: fetch from source, normalize all items.
 * @returns {Promise<{ vehicles: Array<Object>, sourceName: string, count: number, error?: string }>}
 */
async function runSync() {
  const result = await fetchFromSource();

  if (result.error) {
    return {
      vehicles: [],
      sourceName: result.sourceName,
      count: 0,
      error: result.error,
    };
  }

  const sourceId = (process.env.JAPAN_AUCTION_SOURCE || 'japan_sync').toLowerCase();
  const vehicles = (result.items || [])
    .map((raw) => normalizeAuctionVehicle(raw, sourceId))
    .filter(Boolean);

  return {
    vehicles,
    sourceName: result.sourceName || 'Japan Auction',
    count: vehicles.length,
  };
}

module.exports = {
  runSync,
  fetchFromSource,
  getAdapter,
  normalizeAuctionVehicle,
};
