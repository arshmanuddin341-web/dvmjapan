/**
 * Config-based adapter: fetches from a URL set in env (JAPAN_AUCTION_API_URL).
 * Works with any provider that returns a JSON array of listings (or { listings } / { data }).
 * No fake data: if URL is missing or request fails, returns empty items and logs.
 */

const BASE_URL = process.env.JAPAN_AUCTION_API_URL || process.env.JAPAN_AUCTION_API_BASE_URL || '';
const API_KEY = process.env.JAPAN_AUCTION_API_KEY || '';

/**
 * Fetch listings from configured URL.
 * Expects: GET {BASE_URL}/listings or GET {BASE_URL} returning array or { listings } or { data }.
 * @returns {Promise<{ items: Array<Object>, sourceName: string, error?: string }>}
 */
async function fetchListings() {
  const sourceName = 'Japan Auction (config)';

  if (!BASE_URL || !BASE_URL.startsWith('http')) {
    return {
      items: [],
      sourceName,
      error: 'JAPAN_AUCTION_API_URL not set or invalid',
    };
  }

  const url = `${BASE_URL.replace(/\/$/, '')}/listings`;
  const headers = {
    'Content-Type': 'application/json',
    ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
  };

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(30000),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        items: [],
        sourceName,
        error: data?.message || data?.error || `HTTP ${res.status}`,
      };
    }

    let items = Array.isArray(data) ? data : (data.listings ?? data.data ?? data.items ?? []);
    if (!Array.isArray(items)) items = [];

    return { items, sourceName };
  } catch (err) {
    const message = err?.message || 'Request failed';
    return {
      items: [],
      sourceName,
      error: message,
    };
  }
}

module.exports = {
  fetchListings,
};
