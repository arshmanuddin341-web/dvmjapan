/**
 * Server Entry Point
 * Initializes database connection, Socket.io, and starts the Express server
 */

// Load environment variables FIRST (before any other imports)
require('dotenv').config();

const http = require('http');
const app = require('./app');
const { connectDB } = require('./config');
const { initializeSocket } = require('./socket');

// =============================================================================
// DATABASE CONNECTION
// =============================================================================

connectDB().catch(() => {
  // DB failed; server keeps running (auth/APIs may use fallbacks or return errors)
});

// =============================================================================
// HTTP & SOCKET.IO SERVER
// =============================================================================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create HTTP server from Express app
const httpServer = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(httpServer);

// =============================================================================
// SERVER STARTUP
// =============================================================================

const server = httpServer.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running in ${NODE_ENV} mode`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for real-time connections`);
  console.log(`📖 Documentation at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check at http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
});

// =============================================================================
// GRACEFUL SHUTDOWN
// =============================================================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated!');
  });
});

module.exports = server;
