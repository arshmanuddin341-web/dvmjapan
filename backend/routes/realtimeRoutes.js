/**
 * Real-time broadcast endpoint for Next.js to trigger Socket.io emits.
 * No DB writes; only broadcasts to auction rooms. Secured by shared secret.
 */

const express = require('express');
const router = express.Router();
const { broadcastToAuction, auctionRoom } = require('../services/realtimeAuction');

const BROADCAST_SECRET = process.env.REALTIME_BROADCAST_SECRET || process.env.JWT_SECRET || '';

/**
 * POST /api/realtime/broadcast
 * Body: { room: "auction:<id>" | or auctionId, event: string, payload: object }
 * Header: X-Broadcast-Secret (must match REALTIME_BROADCAST_SECRET or JWT_SECRET)
 */
router.post('/broadcast', (req, res) => {
  try {
    const secret = req.headers['x-broadcast-secret'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '');
    if (!BROADCAST_SECRET || secret !== BROADCAST_SECRET) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { room: roomOrId, auctionId, event, payload } = req.body || {};
    const room = roomOrId || (auctionId ? auctionRoom(auctionId) : null);
    if (!room || !event) {
      return res.status(400).json({ success: false, error: 'room (or auctionId) and event required' });
    }

    // Support both "auction:xyz" and raw auctionId
    const id = room.startsWith('auction:') ? room.slice(8) : room;
    const sent = broadcastToAuction(id, event, payload ?? {});
    return res.status(200).json({ success: true, sent });
  } catch (err) {
    console.error('[realtime] broadcast route error:', err?.message || err);
    return res.status(500).json({ success: false, error: 'Broadcast failed' });
  }
});

module.exports = router;
