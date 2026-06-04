/**
 * React Hook for Auction Socket Connection
 * Custom hook for managing real-time auction connections in React
 * 
 * Installation:
 * npm install socket.io-client
 * 
 * Usage:
 * import { useAuction } from './hooks/useAuction';
 * 
 * function AuctionPage({ auctionId }) {
 *   const { auction, bids, placeBid, timeRemaining, isConnected } = useAuction(auctionId);
 *   ...
 * }
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Custom hook for auction real-time functionality
 */
export function useAuction(auctionId, token) {
  const [isConnected, setIsConnected] = useState(false);
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [error, setError] = useState(null);
  const [bidStatus, setBidStatus] = useState({ loading: false, error: null, success: false });
  
  const socketRef = useRef(null);

  // Connect to socket
  useEffect(() => {
    if (!auctionId) return;

    // Create socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      // Join auction room
      socket.emit('auction:join', auctionId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('error', (err) => {
      setError(err.message);
    });

    // Auction state
    socket.on('auction:state', (data) => {
      setAuction(data.auction);
      setBids(data.recentBids);
      setParticipantCount(data.participantCount);
      
      // Calculate initial time remaining
      const endTime = new Date(data.auction.endTime);
      const serverTime = new Date(data.serverTime);
      setTimeRemaining(Math.max(0, endTime - serverTime));
    });

    // New bid
    socket.on('bid:new', (data) => {
      setAuction(prev => prev ? {
        ...prev,
        currentBid: data.newCurrentBid,
        bidCount: data.bidCount,
        isReserveMet: data.isReserveMet,
      } : prev);

      setBids(prev => [{
        id: data.id,
        amount: data.amount,
        bidder: data.bidder,
        timestamp: data.timestamp,
      }, ...prev].slice(0, 20));
    });

    // Bid success
    socket.on('bid:success', (data) => {
      setBidStatus({ loading: false, error: null, success: true });
      setTimeout(() => setBidStatus(prev => ({ ...prev, success: false })), 3000);
    });

    // Bid error
    socket.on('bid:error', (data) => {
      setBidStatus({ loading: false, error: data.message, success: false });
    });

    // Countdown
    socket.on('auction:countdown', (data) => {
      setTimeRemaining(data.timeRemaining);
    });

    // Auction extended
    socket.on('auction:extended', (data) => {
      setAuction(prev => prev ? {
        ...prev,
        endTime: data.newEndTime,
      } : prev);
    });

    // Auction ended
    socket.on('auction:ended', (data) => {
      setAuction(prev => prev ? {
        ...prev,
        status: data.status,
        winner: data.winner,
        winningBid: data.winningBid,
      } : prev);
      setTimeRemaining(0);
    });

    // Participants
    socket.on('auction:participant-joined', (data) => {
      setParticipantCount(data.participantCount);
    });

    socket.on('auction:participant-left', (data) => {
      setParticipantCount(data.participantCount);
    });

    // Cleanup
    return () => {
      socket.emit('auction:leave', auctionId);
      socket.disconnect();
    };
  }, [auctionId, token]);

  // Place bid function
  const placeBid = useCallback((amount) => {
    if (!socketRef.current || !auctionId) return;
    
    setBidStatus({ loading: true, error: null, success: false });
    socketRef.current.emit('bid:place', {
      auctionId,
      amount: parseFloat(amount),
    });
  }, [auctionId]);

  // Sync time
  const syncTime = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('time:sync');
    }
  }, []);

  // Format time remaining
  const formatTimeRemaining = useCallback(() => {
    if (timeRemaining === null || timeRemaining <= 0) return '00:00:00';
    
    const totalSeconds = Math.floor(timeRemaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  return {
    // Connection state
    isConnected,
    error,
    
    // Auction data
    auction,
    bids,
    timeRemaining,
    formattedTime: formatTimeRemaining(),
    participantCount,
    
    // Actions
    placeBid,
    syncTime,
    
    // Bid status
    bidStatus,
    
    // Computed values
    minimumBid: auction ? auction.currentBid + auction.bidIncrement : 0,
    isAuctionLive: auction?.status === 'live' && timeRemaining > 0,
    isAuctionEnded: auction?.status === 'ended' || auction?.status === 'sold' || timeRemaining === 0,
  };
}

/**
 * Usage Example:
 * 
 * function AuctionPage({ auctionId }) {
 *   const token = useAuth().token; // Get from your auth context
 *   
 *   const {
 *     isConnected,
 *     auction,
 *     bids,
 *     formattedTime,
 *     participantCount,
 *     placeBid,
 *     bidStatus,
 *     minimumBid,
 *     isAuctionLive,
 *   } = useAuction(auctionId, token);
 *   
 *   const [bidAmount, setBidAmount] = useState('');
 *   
 *   const handleBid = () => {
 *     if (bidAmount >= minimumBid) {
 *       placeBid(bidAmount);
 *     }
 *   };
 *   
 *   if (!auction) return <div>Loading...</div>;
 *   
 *   return (
 *     <div>
 *       <h1>{auction.title}</h1>
 *       <p>Current Bid: ${auction.currentBid}</p>
 *       <p>Time Remaining: {formattedTime}</p>
 *       <p>Watching: {participantCount} people</p>
 *       
 *       {isAuctionLive && (
 *         <div>
 *           <input
 *             type="number"
 *             value={bidAmount}
 *             onChange={(e) => setBidAmount(e.target.value)}
 *             min={minimumBid}
 *             placeholder={`Min: $${minimumBid}`}
 *           />
 *           <button onClick={handleBid} disabled={bidStatus.loading}>
 *             {bidStatus.loading ? 'Placing...' : 'Place Bid'}
 *           </button>
 *           {bidStatus.error && <p style={{color:'red'}}>{bidStatus.error}</p>}
 *           {bidStatus.success && <p style={{color:'green'}}>Bid placed!</p>}
 *         </div>
 *       )}
 *       
 *       <h3>Recent Bids</h3>
 *       <ul>
 *         {bids.map(bid => (
 *           <li key={bid.id}>{bid.bidder}: ${bid.amount}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 */

export default useAuction;
