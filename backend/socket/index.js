/**
 * Socket.io Configuration and Handlers
 * Manages real-time communication for live auctions
 */

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const User = require('../models/User');

// Store active auction rooms and their data
const auctionRooms = new Map();

// Store countdown intervals
const countdownIntervals = new Map();

/**
 * Initialize Socket.io server
 * @param {Object} httpServer - HTTP server instance
 * @returns {Object} Socket.io server instance
 */
const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('name email role');
        
        if (user && user.isActive !== false) {
          socket.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
      }
      
      // Allow connection even without auth (for viewing)
      next();
    } catch (error) {
      // Allow connection but without user data
      next();
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}${socket.user ? ` (User: ${socket.user.name})` : ' (Guest)'}`);

    // ==========================================================================
    // AUCTION ROOM MANAGEMENT
    // ==========================================================================

    /**
     * Join an auction room
     */
    socket.on('auction:join', async (auctionId) => {
      try {
        const auction = await Auction.findById(auctionId)
          .populate('car', 'title brand model year images')
          .lean();

        if (!auction) {
          socket.emit('error', { message: 'Auction not found' });
          return;
        }

        // Join the room
        socket.join(`auction:${auctionId}`);
        
        // Initialize room data if not exists
        if (!auctionRooms.has(auctionId)) {
          auctionRooms.set(auctionId, {
            participants: new Set(),
            currentBid: auction.currentBid,
            bidCount: auction.bidCount,
            endTime: auction.endTime,
            status: auction.status,
          });
        }

        const roomData = auctionRooms.get(auctionId);
        roomData.participants.add(socket.id);

        // Get recent bids
        const recentBids = await Bid.find({ auction: auctionId })
          .populate('bidder', 'name')
          .sort('-createdAt')
          .limit(10)
          .lean();

        // Send auction state to the joining user
        socket.emit('auction:state', {
          auction: {
            id: auction._id,
            title: auction.title,
            car: auction.car,
            currentBid: roomData.currentBid,
            startingBid: auction.startingBid,
            bidIncrement: auction.bidIncrement,
            bidCount: roomData.bidCount,
            endTime: roomData.endTime,
            status: roomData.status,
            reservePrice: auction.reservePrice,
            isReserveMet: auction.isReserveMet,
          },
          recentBids: recentBids.map(bid => ({
            id: bid._id,
            amount: bid.amount,
            bidder: bid.bidder?.name || 'Anonymous',
            timestamp: bid.createdAt,
          })),
          participantCount: roomData.participants.size,
          serverTime: new Date(),
        });

        // Notify others about new participant
        socket.to(`auction:${auctionId}`).emit('auction:participant-joined', {
          participantCount: roomData.participants.size,
        });

        // Start countdown sync if auction is live
        startCountdownSync(io, auctionId, auction);

        console.log(`User joined auction ${auctionId}. Participants: ${roomData.participants.size}`);
      } catch (error) {
        console.error('Error joining auction:', error);
        socket.emit('error', { message: 'Failed to join auction' });
      }
    });

    /**
     * Join auction room by id only (Prisma/Next.js flow: state from API, socket for live updates).
     * Does not touch DB; use for /auction/[id] page.
     */
    socket.on('auction:join-room', (auctionId) => {
      const id = typeof auctionId === 'string' ? auctionId : String(auctionId || '');
      if (!id) {
        socket.emit('error', { message: 'auctionId required' });
        return;
      }
      const room = `auction:${id}`;
      socket.join(room);
      socket.emit('auction:joined', { auctionId: id });
    });

    /**
     * Leave an auction room
     */
    socket.on('auction:leave', (auctionId) => {
      leaveAuctionRoom(socket, auctionId);
    });

    // ==========================================================================
    // BIDDING
    // ==========================================================================

    /**
     * Place a bid via socket
     */
    socket.on('bid:place', async (data) => {
      try {
        const { auctionId, amount } = data;

        // Check if user is authenticated
        if (!socket.user) {
          socket.emit('bid:error', { message: 'Please login to place a bid' });
          return;
        }

        // Validate input
        if (!auctionId || !amount || isNaN(amount)) {
          socket.emit('bid:error', { message: 'Invalid bid data' });
          return;
        }

        // Get auction
        const auction = await Auction.findById(auctionId).populate('car');
        
        if (!auction) {
          socket.emit('bid:error', { message: 'Auction not found' });
          return;
        }

        // Update auction status
        auction.updateStatus();

        // Validate auction is live
        if (auction.status !== 'live') {
          socket.emit('bid:error', { message: 'This auction is not currently live' });
          return;
        }

        // Check time
        const now = new Date();
        if (now > auction.endTime) {
          socket.emit('bid:error', { message: 'Auction has ended' });
          return;
        }

        // Check if user is the seller
        if (auction.car && auction.car.seller.toString() === socket.user.id) {
          socket.emit('bid:error', { message: 'You cannot bid on your own car' });
          return;
        }

        // Validate bid amount
        const minBid = auction.currentBid + auction.bidIncrement;
        if (amount < minBid) {
          socket.emit('bid:error', { 
            message: `Minimum bid is $${minBid.toLocaleString()}`,
            minimumBid: minBid,
          });
          return;
        }

        // Create bid record
        const bid = await Bid.create({
          auction: auctionId,
          bidder: socket.user.id,
          amount,
          previousBid: auction.currentBid,
        });

        // Update auction
        auction.currentBid = amount;
        auction.bidCount += 1;
        auction.winner = socket.user.id;

        // Check reserve
        if (auction.reservePrice && amount >= auction.reservePrice) {
          auction.isReserveMet = true;
        }

        // Anti-snipe: Extend auction if bid placed in last 2 minutes
        const timeRemaining = auction.endTime - now;
        const extendThreshold = 2 * 60 * 1000; // 2 minutes
        const extendTime = 2 * 60 * 1000; // Extend by 2 minutes
        
        let timeExtended = false;
        if (timeRemaining < extendThreshold) {
          auction.endTime = new Date(auction.endTime.getTime() + extendTime);
          timeExtended = true;
        }

        await auction.save({ validateBeforeSave: false });

        // Update room data
        const roomData = auctionRooms.get(auctionId);
        if (roomData) {
          roomData.currentBid = amount;
          roomData.bidCount = auction.bidCount;
          roomData.endTime = auction.endTime;
        }

        // Prepare bid data for broadcast
        const bidData = {
          id: bid._id,
          amount: bid.amount,
          bidder: socket.user.name,
          bidderId: socket.user.id,
          timestamp: bid.createdAt,
          auctionId,
          newCurrentBid: auction.currentBid,
          minimumNextBid: auction.currentBid + auction.bidIncrement,
          bidCount: auction.bidCount,
          isReserveMet: auction.isReserveMet,
          timeExtended,
          newEndTime: timeExtended ? auction.endTime : null,
        };

        // Send success to bidder
        socket.emit('bid:success', {
          message: 'Bid placed successfully!',
          bid: bidData,
        });

        // Broadcast to all in auction room
        io.to(`auction:${auctionId}`).emit('bid:new', bidData);

        // If time was extended, broadcast new end time
        if (timeExtended) {
          io.to(`auction:${auctionId}`).emit('auction:extended', {
            newEndTime: auction.endTime,
            reason: 'Anti-snipe protection',
          });
        }

        console.log(`Bid placed: $${amount} on auction ${auctionId} by ${socket.user.name}`);
      } catch (error) {
        console.error('Error placing bid:', error);
        socket.emit('bid:error', { message: 'Failed to place bid. Please try again.' });
      }
    });

    // ==========================================================================
    // COUNTDOWN SYNC
    // ==========================================================================

    /**
     * Request time sync
     */
    socket.on('time:sync', () => {
      socket.emit('time:sync', { serverTime: new Date() });
    });

    // ==========================================================================
    // DISCONNECT
    // ==========================================================================

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      // Remove from all auction rooms
      auctionRooms.forEach((roomData, auctionId) => {
        if (roomData.participants.has(socket.id)) {
          leaveAuctionRoom(socket, auctionId);
        }
      });
    });
  });

  // Store io instance for use in other modules
  global.io = io;

  return io;
};

/**
 * Leave auction room helper
 */
const leaveAuctionRoom = (socket, auctionId) => {
  socket.leave(`auction:${auctionId}`);
  
  const roomData = auctionRooms.get(auctionId);
  if (roomData) {
    roomData.participants.delete(socket.id);
    
    // Notify others
    socket.to(`auction:${auctionId}`).emit('auction:participant-left', {
      participantCount: roomData.participants.size,
    });

    // Clean up empty rooms
    if (roomData.participants.size === 0) {
      auctionRooms.delete(auctionId);
      stopCountdownSync(auctionId);
    }
  }
};

/**
 * Start countdown sync for an auction
 */
const startCountdownSync = (io, auctionId, auction) => {
  // Don't start if already running or auction not live
  if (countdownIntervals.has(auctionId) || auction.status !== 'live') {
    return;
  }

  const interval = setInterval(async () => {
    try {
      const now = new Date();
      const roomData = auctionRooms.get(auctionId);
      
      if (!roomData) {
        stopCountdownSync(auctionId);
        return;
      }

      const endTime = new Date(roomData.endTime);
      const timeRemaining = Math.max(0, endTime - now);

      // Broadcast countdown
      io.to(`auction:${auctionId}`).emit('auction:countdown', {
        timeRemaining,
        endTime: roomData.endTime,
        serverTime: now,
      });

      // Check if auction ended
      if (timeRemaining <= 0) {
        stopCountdownSync(auctionId);
        
        // Update auction status
        const updatedAuction = await Auction.findById(auctionId).populate('car winner');
        if (updatedAuction && updatedAuction.status === 'live') {
          updatedAuction.status = 'ended';
          
          // Determine if sold
          if (updatedAuction.bidCount > 0 && updatedAuction.winner) {
            if (!updatedAuction.reservePrice || updatedAuction.isReserveMet) {
              updatedAuction.status = 'sold';
              updatedAuction.winningBid = updatedAuction.currentBid;
              
              if (updatedAuction.car) {
                updatedAuction.car.status = 'sold';
                await updatedAuction.car.save();
              }
            }
          } else if (updatedAuction.car) {
            updatedAuction.car.status = 'available';
            await updatedAuction.car.save();
          }
          
          await updatedAuction.save();

          // Broadcast auction ended
          io.to(`auction:${auctionId}`).emit('auction:ended', {
            status: updatedAuction.status,
            winner: updatedAuction.winner ? {
              id: updatedAuction.winner._id,
              name: updatedAuction.winner.name,
            } : null,
            winningBid: updatedAuction.winningBid || updatedAuction.currentBid,
            bidCount: updatedAuction.bidCount,
            isReserveMet: updatedAuction.isReserveMet,
          });
        }

        // Update room status
        if (roomData) {
          roomData.status = 'ended';
        }
      }
    } catch (error) {
      console.error('Countdown sync error:', error);
    }
  }, 1000); // Every second

  countdownIntervals.set(auctionId, interval);
};

/**
 * Stop countdown sync for an auction
 */
const stopCountdownSync = (auctionId) => {
  const interval = countdownIntervals.get(auctionId);
  if (interval) {
    clearInterval(interval);
    countdownIntervals.delete(auctionId);
  }
};

/**
 * Emit event to auction room (for use in controllers)
 */
const emitToAuction = (auctionId, event, data) => {
  if (global.io) {
    global.io.to(`auction:${auctionId}`).emit(event, data);
  }
};

/**
 * Get auction room stats
 */
const getAuctionRoomStats = (auctionId) => {
  const roomData = auctionRooms.get(auctionId);
  return roomData ? {
    participants: roomData.participants.size,
    currentBid: roomData.currentBid,
    bidCount: roomData.bidCount,
  } : null;
};

module.exports = {
  initializeSocket,
  emitToAuction,
  getAuctionRoomStats,
};
