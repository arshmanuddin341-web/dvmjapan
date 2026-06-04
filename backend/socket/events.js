/**
 * Socket Event Constants
 * Centralized event names for client-server communication
 */

module.exports = {
  // Connection events
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Auction room events
  AUCTION_JOIN: 'auction:join',
  AUCTION_LEAVE: 'auction:leave',
  AUCTION_STATE: 'auction:state',
  AUCTION_COUNTDOWN: 'auction:countdown',
  AUCTION_EXTENDED: 'auction:extended',
  AUCTION_ENDED: 'auction:ended',
  AUCTION_PARTICIPANT_JOINED: 'auction:participant-joined',
  AUCTION_PARTICIPANT_LEFT: 'auction:participant-left',

  // Bid events
  BID_PLACE: 'bid:place',
  BID_NEW: 'bid:new',
  BID_SUCCESS: 'bid:success',
  BID_ERROR: 'bid:error',

  // Time sync events
  TIME_SYNC: 'time:sync',

  // Admin events
  ADMIN_AUCTION_UPDATE: 'admin:auction-update',
  ADMIN_AUCTION_CLOSE: 'admin:auction-close',
  ADMIN_AUCTION_EXTEND: 'admin:auction-extend',
};
