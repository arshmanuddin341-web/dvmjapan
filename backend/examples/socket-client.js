/**
 * Socket.io Client Example
 * Example implementation for connecting to the auction real-time server
 * 
 * Usage in browser:
 * <script src="https://cdn.socket.io/4.7.4/socket.io.min.js"></script>
 * <script src="socket-client.js"></script>
 * 
 * Usage in Node.js:
 * npm install socket.io-client
 * const { AuctionClient } = require('./socket-client');
 */

// For Node.js: const { io } = require('socket.io-client');
// For browser: io is available globally from socket.io CDN

class AuctionClient {
  constructor(serverUrl = 'http://localhost:5000', token = null) {
    this.serverUrl = serverUrl;
    this.token = token;
    this.socket = null;
    this.currentAuctionId = null;
    this.callbacks = {};
  }

  /**
   * Connect to the socket server
   */
  connect() {
    this.socket = io(this.serverUrl, {
      auth: { token: this.token },
      transports: ['websocket', 'polling'],
    });

    this.setupListeners();
    return this;
  }

  /**
   * Setup event listeners
   */
  setupListeners() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to auction server');
      this.emit('connected', { socketId: this.socket.id });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      this.emit('disconnected', { reason });
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });

    // Auction state
    this.socket.on('auction:state', (data) => {
      console.log('Auction state received:', data);
      this.emit('auctionState', data);
    });

    // New bid received
    this.socket.on('bid:new', (data) => {
      console.log('New bid:', data);
      this.emit('newBid', data);
    });

    // Bid placed successfully (for the bidder)
    this.socket.on('bid:success', (data) => {
      console.log('Bid success:', data);
      this.emit('bidSuccess', data);
    });

    // Bid error
    this.socket.on('bid:error', (data) => {
      console.error('Bid error:', data);
      this.emit('bidError', data);
    });

    // Countdown update
    this.socket.on('auction:countdown', (data) => {
      this.emit('countdown', data);
    });

    // Auction extended
    this.socket.on('auction:extended', (data) => {
      console.log('Auction extended:', data);
      this.emit('auctionExtended', data);
    });

    // Auction ended
    this.socket.on('auction:ended', (data) => {
      console.log('Auction ended:', data);
      this.emit('auctionEnded', data);
    });

    // Participant joined/left
    this.socket.on('auction:participant-joined', (data) => {
      this.emit('participantJoined', data);
    });

    this.socket.on('auction:participant-left', (data) => {
      this.emit('participantLeft', data);
    });

    // Time sync response
    this.socket.on('time:sync', (data) => {
      this.emit('timeSync', data);
    });
  }

  /**
   * Join an auction room
   */
  joinAuction(auctionId) {
    if (this.currentAuctionId) {
      this.leaveAuction();
    }
    this.currentAuctionId = auctionId;
    this.socket.emit('auction:join', auctionId);
    return this;
  }

  /**
   * Leave current auction room
   */
  leaveAuction() {
    if (this.currentAuctionId) {
      this.socket.emit('auction:leave', this.currentAuctionId);
      this.currentAuctionId = null;
    }
    return this;
  }

  /**
   * Place a bid
   */
  placeBid(amount) {
    if (!this.currentAuctionId) {
      console.error('Not in an auction room');
      return this;
    }
    this.socket.emit('bid:place', {
      auctionId: this.currentAuctionId,
      amount: parseFloat(amount),
    });
    return this;
  }

  /**
   * Request time sync from server
   */
  syncTime() {
    this.socket.emit('time:sync');
    return this;
  }

  /**
   * Register event callback
   */
  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
    return this;
  }

  /**
   * Remove event callback
   */
  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
    return this;
  }

  /**
   * Emit to registered callbacks
   */
  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    return this;
  }
}

// =============================================================================
// USAGE EXAMPLE
// =============================================================================

/*
// Initialize client with JWT token
const token = 'your_jwt_token_here';
const client = new AuctionClient('http://localhost:5000', token);

// Connect to server
client.connect();

// Register event handlers
client.on('connected', ({ socketId }) => {
  console.log('Connected with socket ID:', socketId);
});

client.on('auctionState', ({ auction, recentBids, participantCount }) => {
  console.log('Current bid:', auction.currentBid);
  console.log('Participants:', participantCount);
  console.log('Recent bids:', recentBids);
});

client.on('newBid', ({ amount, bidder, minimumNextBid }) => {
  console.log(`${bidder} bid $${amount}`);
  console.log('Next minimum bid:', minimumNextBid);
  // Update UI with new bid
});

client.on('countdown', ({ timeRemaining }) => {
  const seconds = Math.floor(timeRemaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  console.log(`Time remaining: ${hours}h ${minutes % 60}m ${seconds % 60}s`);
  // Update countdown timer in UI
});

client.on('auctionEnded', ({ status, winner, winningBid }) => {
  if (status === 'sold') {
    console.log(`Sold to ${winner.name} for $${winningBid}`);
  } else {
    console.log('Auction ended with no sale');
  }
});

client.on('bidSuccess', ({ message }) => {
  console.log(message);
  // Show success notification
});

client.on('bidError', ({ message }) => {
  console.error(message);
  // Show error notification
});

// Join an auction
client.joinAuction('auction_id_here');

// Place a bid
client.placeBid(55000);

// Leave auction when done
client.leaveAuction();

// Disconnect
client.disconnect();
*/

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuctionClient };
}
