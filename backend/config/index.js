/**
 * Configuration Index
 * Centralized configuration exports
 */

const { connectDB, checkConnection } = require('./database');

module.exports = {
  connectDB,
  checkConnection,
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_me',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  
  // Pagination defaults
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
};
