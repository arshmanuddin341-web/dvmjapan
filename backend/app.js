/**
 * Express Application Configuration
 * Sets up middleware, routes, and error handling
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const config = require('./config');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

// Load OAuth config only if packages installed (optional)
try {
  require('./config/passport');
} catch (err) {
  console.warn('OAuth (Google/Facebook) skipped:', err.message);
}

// Create Express app
const app = express();

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Enable CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Passport (OAuth)
app.use(passport.initialize());

// HTTP request logger (only in development)
if (config.server.env === 'development') {
  app.use(morgan('dev'));
}

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// =============================================================================
// ROUTES
// =============================================================================

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Car Auction API',
    documentation: '/api',
    health: '/api/health',
  });
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

// Handle 404 - Route not found
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
