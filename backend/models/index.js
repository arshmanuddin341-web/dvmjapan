/**
 * Models Index
 * Central export for all Mongoose models
 */

const User = require('./User');
const Car = require('./Car');
const Auction = require('./Auction');
const Bid = require('./Bid');

module.exports = {
  User,
  Car,
  Auction,
  Bid,
};
