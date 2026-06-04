/**
 * Database Configuration
 * Handles MongoDB/MongoDB Atlas connection using Mongoose
 */

const mongoose = require('mongoose');

/**
 * MongoDB connection options optimized for Atlas
 */
const connectionOptions = {
  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 2,
  
  // Timeout settings
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  
  // Write concern
  retryWrites: true,
  w: 'majority',
};

/**
 * Connect to MongoDB/MongoDB Atlas database.
 * Uses MONGO_URI (or MONGODB_URI) - single config for consistency.
 * Server keeps running if MongoDB is unavailable (APIs that need DB will return errors).
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  try {
    if (!uri) {
      throw new Error('MONGO_URI (or MONGODB_URI) environment variable is not defined');
    }

    const conn = await mongoose.connect(uri, connectionOptions);

    const isAtlas = uri.includes('mongodb+srv') || uri.includes('mongodb.net');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Connection Type: ${isAtlas ? 'MongoDB Atlas' : 'Local MongoDB'}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('='.repeat(50));
    console.error('MongoDB Connection Error (server will keep running)');
    console.error('='.repeat(50));
    console.error(`Error: ${error.message}`);
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo') || error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.error('\nTip: Check internet, Atlas IP whitelist, or use frontend-only auth.');
    } else if (error.message.includes('authentication failed')) {
      console.error('\nTip: Check MongoDB username/password in .env');
    }
    console.error('='.repeat(50));
    // Do NOT exit - let server run; APIs that need DB will return errors
  }
};

/**
 * Check database connection health
 * @returns {Promise<Object>} Connection status
 */
const checkConnection = async () => {
  const state = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    status: states[state] || 'unknown',
    host: mongoose.connection.host,
    database: mongoose.connection.name,
    isConnected: state === 1,
  };
};

module.exports = { connectDB, checkConnection };
