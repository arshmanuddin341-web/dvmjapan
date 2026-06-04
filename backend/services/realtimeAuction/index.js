/**
 * Real-time auction service (isolated).
 * Room-based broadcast only. No DB writes here; bids/state live in Next.js (Prisma).
 * Use getIO() to broadcast after Next.js saves a bid or updates status.
 */

/**
 * Get Socket.io server instance (set by socket/index.js).
 * @returns {Object|undefined} io or undefined if not ready
 */
function getIO() {
  return typeof global !== 'undefined' ? global.io : undefined;
}

/**
 * Room name for an auction (must match client join).
 * @param {string} auctionId - Prisma auction listing id
 * @returns {string}
 */
function auctionRoom(auctionId) {
  return `auction:${auctionId}`;
}

/**
 * Broadcast an event to an auction room. Safe if Socket is down.
 * @param {string} auctionId - Prisma auction listing id
 * @param {string} event - Event name (e.g. 'bid:new', 'auction:status')
 * @param {Object} payload - Data to send
 * @returns {boolean} true if broadcast sent
 */
function broadcastToAuction(auctionId, event, payload) {
  try {
    const io = getIO();
    if (!io) return false;
    const room = auctionRoom(auctionId);
    io.to(room).emit(event, payload);
    return true;
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('[realtimeAuction] broadcast error:', err?.message || err);
    }
    return false;
  }
}

module.exports = {
  getIO,
  auctionRoom,
  broadcastToAuction,
};
