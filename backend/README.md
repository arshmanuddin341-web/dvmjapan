# Car Auction Backend API

A production-ready RESTful API for a car auction platform built with Node.js, Express.js, and MongoDB.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **Car Management**: Full CRUD operations for car listings
- **Auction System**: Create, manage, and track live auctions
- **Real-time Bidding**: Socket.io powered live bid updates
- **Countdown Sync**: Server-synced auction timers across all clients
- **User Management**: User registration, profiles, and roles
- **Admin Dashboard**: Comprehensive statistics and management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing

## Project Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection
│   └── index.js         # Configuration exports
├── controllers/
│   ├── authController.js
│   ├── carController.js
│   ├── auctionController.js
│   └── bidController.js
├── middlewares/
│   ├── auth.js          # JWT verification & role authorization
│   ├── validate.js      # Request validation
│   └── errorMiddleware.js
├── models/
│   ├── User.js
│   ├── Car.js
│   ├── Auction.js
│   ├── Bid.js
│   └── index.js
├── routes/
│   ├── authRoutes.js
│   ├── carRoutes.js
│   ├── auctionRoutes.js
│   ├── bidRoutes.js
│   └── index.js
├── utils/
│   ├── asyncHandler.js  # Async error wrapper
│   ├── errorHandler.js  # Custom error class
│   ├── pagination.js    # Pagination helpers
│   └── helpers.js       # General utilities
├── socket/
│   ├── index.js         # Socket.io configuration
│   └── events.js        # Event constants
├── examples/
│   ├── socket-client.js     # Vanilla JS client example
│   └── socket-react-hook.js # React hook example
├── app.js               # Express app configuration
├── server.js            # Server entry point
├── package.json
├── .env.example
└── README.md
```

## Quick Start

### Prerequisites

- Node.js v16 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example env file
   cp .env.example .env

   # Edit .env with your settings
   ```

4. **Configure your `.env` file**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/car_auction_db
   JWT_SECRET=your_super_secret_key_here
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the server**
   ```bash
   # Development (with hot reload)
   npm run dev

   # Production
   npm start
   ```

6. **Verify the server is running**
   ```
   Open http://localhost:5000/api/health in your browser
   ```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Endpoints

#### Register User
```http
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```
**Note:** Sends verification email. User must verify email before logging in.

#### Login
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Note:** Returns 403 if email is not verified.

#### Verify Email
```http
GET /api/auth/verify-email/:token
```
Verifies the user's email address using the token from the verification email.

#### Resend Verification Email
```http
POST /api/auth/resend-verification
```
**Body:**
```json
{
  "email": "john@example.com"
}
```
**Rate Limited:** 1 request per minute.

#### Check Verification Status
```http
GET /api/auth/verification-status/:email
```
Returns whether the email exists and is verified (for UI feedback).

#### Get Current User
```http
GET /api/auth/me
```
**Access:** Protected

#### Update Profile
```http
PUT /api/auth/profile
```
**Access:** Protected
**Body:**
```json
{
  "name": "John Smith",
  "phone": "+1987654321",
  "address": {
    "city": "New York",
    "state": "NY",
    "country": "USA"
  }
}
```

#### Update Password
```http
PUT /api/auth/password
```
**Access:** Protected
**Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

---

### Car Endpoints

#### Get All Cars
```http
GET /api/cars
```
**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field (e.g., `-createdAt`, `year`)
- `brand` - Filter by brand
- `year` - Filter by year
- `status` - Filter by status
- `search` - Search in title, brand, model

#### Get Car by ID
```http
GET /api/cars/:id
```

#### Create Car
```http
POST /api/cars
```
**Access:** Protected
**Body:**
```json
{
  "title": "2023 Tesla Model S",
  "brand": "Tesla",
  "model": "Model S",
  "year": 2023,
  "mileage": 5000,
  "fuelType": "electric",
  "transmission": "automatic",
  "description": "Excellent condition, full self-driving capable",
  "images": [
    { "url": "https://example.com/image1.jpg", "isPrimary": true }
  ],
  "condition": "excellent",
  "location": { "city": "Los Angeles", "state": "CA" }
}
```

#### Update Car
```http
PUT /api/cars/:id
```
**Access:** Protected (Owner or Admin)

#### Delete Car
```http
DELETE /api/cars/:id
```
**Access:** Protected (Owner or Admin)

#### Get My Cars
```http
GET /api/cars/my-cars
```
**Access:** Protected

#### Verify Car (Admin)
```http
PUT /api/cars/:id/verify
```
**Access:** Admin only

---

### Auction Endpoints

#### Get All Auctions
```http
GET /api/auctions
```

#### Get Live Auctions
```http
GET /api/auctions/live
```

#### Get Upcoming Auctions
```http
GET /api/auctions/upcoming
```

#### Get Auction by ID
```http
GET /api/auctions/:id
```

#### Create Auction (Admin)
```http
POST /api/auctions
```
**Access:** Admin only
**Body:**
```json
{
  "car": "car_object_id",
  "title": "Rare Tesla Model S Auction",
  "description": "Premium electric vehicle",
  "startTime": "2025-02-10T10:00:00.000Z",
  "endTime": "2025-02-15T18:00:00.000Z",
  "startingBid": 50000,
  "reservePrice": 75000,
  "bidIncrement": 500
}
```

#### Update Auction (Admin)
```http
PUT /api/auctions/:id
```
**Access:** Admin only

#### Close Auction (Admin)
```http
PUT /api/auctions/:id/close
```
**Access:** Admin only

#### Cancel Auction (Admin)
```http
PUT /api/auctions/:id/cancel
```
**Access:** Admin only

#### Add to Watchlist
```http
POST /api/auctions/:id/watch
```
**Access:** Protected

#### Remove from Watchlist
```http
DELETE /api/auctions/:id/watch
```
**Access:** Protected

---

### Bid Endpoints

#### Place Bid
```http
POST /api/bids
```
**Access:** Protected
**Body:**
```json
{
  "auctionId": "auction_object_id",
  "amount": 55000
}
```

#### Get Auction Bid History
```http
GET /api/bids/auction/:auctionId
```

#### Get My Bids
```http
GET /api/bids/my-bids
```
**Access:** Protected

#### Get Active Bids
```http
GET /api/bids/active
```
**Access:** Protected

#### Get Won Auctions
```http
GET /api/bids/won
```
**Access:** Protected

---

### Admin Endpoints (Admin Only)

All admin endpoints require authentication and admin role.

#### User Management

##### Get All Users
```http
GET /api/admin/users
```
**Query Parameters:**
- `page`, `limit` - Pagination
- `role` - Filter by role (user/admin)
- `isActive` - Filter by status (true/false)
- `search` - Search by name or email

##### Get User by ID
```http
GET /api/admin/users/:id
```

##### Create User
```http
POST /api/admin/users
```
**Body:**
```json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123",
  "role": "user",
  "isActive": true
}
```

##### Update User
```http
PUT /api/admin/users/:id
```

##### Delete User
```http
DELETE /api/admin/users/:id
```

##### Toggle User Status
```http
PUT /api/admin/users/:id/toggle-status
```

##### Change User Role
```http
PUT /api/admin/users/:id/role
```
**Body:**
```json
{
  "role": "admin"
}
```

#### Car Management

##### Get All Cars (Admin View)
```http
GET /api/admin/cars
```
**Query Parameters:**
- `status` - Filter by status
- `isVerified` - Filter by verification status
- `brand` - Filter by brand
- `search` - Search in title, brand, model, VIN

##### Bulk Verify Cars
```http
PUT /api/admin/cars/bulk-verify
```
**Body:**
```json
{
  "carIds": ["car_id_1", "car_id_2"]
}
```

##### Bulk Update Car Status
```http
PUT /api/admin/cars/bulk-status
```
**Body:**
```json
{
  "carIds": ["car_id_1", "car_id_2"],
  "status": "available"
}
```

##### Delete Car (Admin)
```http
DELETE /api/admin/cars/:id
```

#### Auction Management

##### Get All Auctions (Admin View)
```http
GET /api/admin/auctions
```

##### Extend Auction Time
```http
PUT /api/admin/auctions/:id/extend
```
**Body:**
```json
{
  "minutes": 30
}
```

##### Force Close Auction
```http
PUT /api/admin/auctions/:id/force-close
```
**Body (optional):**
```json
{
  "winnerId": "user_id",
  "winningBid": 50000
}
```

##### Bulk Cancel Auctions
```http
PUT /api/admin/auctions/bulk-cancel
```
**Body:**
```json
{
  "auctionIds": ["auction_id_1", "auction_id_2"],
  "reason": "System maintenance"
}
```

#### Dashboard & Analytics

##### Get Dashboard Overview
```http
GET /api/admin/dashboard
```
Returns:
- User statistics (total, active)
- Car statistics (total, available)
- Auction statistics (total, live)
- Total bids and revenue
- Recent activity (users, auctions, bids)

##### Get Detailed Analytics
```http
GET /api/admin/analytics?period=30
```
**Query Parameters:**
- `period` - Number of days (default: 30)

Returns:
- User growth over time
- Auctions by status
- Cars by brand
- Bids over time
- Revenue over time
- Top sellers
- Top bidders

##### Get System Health
```http
GET /api/admin/system
```
Returns:
- Server uptime
- Memory usage
- Node.js version
- Database collection stats

##### Export Data
```http
GET /api/admin/export/:type
```
**Parameters:**
- `type` - users, cars, auctions, or bids

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

### Paginated Response
```json
{
  "success": true,
  "count": 10,
  "total": 100,
  "page": 1,
  "pages": 10,
  "data": [ ... ]
}
```

## User Roles

| Role | Permissions |
|------|-------------|
| `user` | Register, login, create cars, place bids, watchlist |
| `admin` | All user permissions + full admin panel access |

### Admin Capabilities

- **User Management**: Create, update, delete, activate/deactivate users, change roles
- **Car Management**: View all cars, bulk verify, bulk status update, delete any car
- **Auction Management**: View all auctions, extend time, force close, bulk cancel
- **Dashboard**: View comprehensive statistics and analytics
- **System**: Monitor server health, export data

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal server error |

## Development

### Run in Development Mode
```bash
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGO_URI` (or `MONGODB_URI`) | MongoDB/Atlas connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | Token expiration | 7d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `FRONTEND_URL` | Frontend URL for email links | http://localhost:3000 |
| `GMAIL_USER` | Gmail address (full email) | - |
| `GMAIL_APP_PASSWORD` | Gmail App Password (16 chars) | - |
| `SMTP_HOST` | Override host (default: smtp.gmail.com) | - |
| `SMTP_PORT` | Override port (default: 587) | - |
| `EMAIL_FROM_NAME` | Sender name | Car Auction |
| `EMAIL_FROM_ADDRESS` | Sender email (defaults to GMAIL_USER) | - |

### MongoDB Atlas Setup

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write access
3. Whitelist your IP address (or use 0.0.0.0/0 for development)
4. Get your connection string and add to `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/car_auction_db?retryWrites=true&w=majority
```

### Gmail SMTP with App Password

Email is sent via Gmail SMTP using an **App Password** (not your normal Gmail password).

1. **Enable 2-Step Verification**  
   Google Account → Security → 2-Step Verification → Turn on.

2. **Create App Password**  
   Google Account → Security → App passwords → Select app: **Mail**, Device: **Other** (e.g. "Car Auction") → Generate. Copy the 16-character password (spaces optional).

3. **Configure `.env`**:

```env
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

Use the 16-character App Password only. Do not use your regular Gmail password.

## Testing with Postman

1. Import the API endpoints into Postman
2. Create an environment with `baseUrl` = `http://localhost:5000/api`
3. Register a user and save the token
4. Add `Authorization: Bearer {{token}}` header for protected routes

## Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Security headers (XSS, CSRF protection)
- Email verification with hashed tokens
- Token expiration enforcement

---

## Email Verification Flow

### How It Works

1. **User Registers** → Verification email sent with unique token
2. **User Clicks Link** → Token verified, email marked as verified
3. **User Can Login** → Only after email verification

### Registration Response
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "isEmailVerified": false
    }
  }
}
```

### Login Blocked (Unverified)
```json
{
  "success": false,
  "message": "Please verify your email address before logging in. Check your inbox for the verification link."
}
```

### Verification Email Content

The verification email includes:
- Personalized greeting
- Clickable verification button
- Plain text link for email clients that block buttons
- 24-hour expiration warning
- Professional HTML design

### Security Measures

- **Hashed Tokens**: Verification tokens stored as SHA-256 hashes
- **Token Expiry**: 24-hour expiration enforced
- **Rate Limiting**: 1 resend request per minute
- **No Info Leakage**: Resend endpoint doesn't reveal if user exists

---

## Real-time Socket.io Integration

The server includes Socket.io for real-time auction functionality.

### Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: 'your_jwt_token' }, // Optional for viewing, required for bidding
});
```

### Socket Events

#### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `auction:join` | `auctionId` | Join an auction room |
| `auction:leave` | `auctionId` | Leave an auction room |
| `bid:place` | `{ auctionId, amount }` | Place a bid |
| `time:sync` | - | Request server time |

#### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `auction:state` | `{ auction, recentBids, participantCount, serverTime }` | Initial auction state |
| `bid:new` | `{ id, amount, bidder, timestamp, newCurrentBid, minimumNextBid }` | New bid placed |
| `bid:success` | `{ message, bid }` | Your bid was successful |
| `bid:error` | `{ message }` | Bid failed |
| `auction:countdown` | `{ timeRemaining, endTime, serverTime }` | Countdown tick (every second) |
| `auction:extended` | `{ newEndTime, reason }` | Auction time extended |
| `auction:ended` | `{ status, winner, winningBid }` | Auction has ended |
| `auction:participant-joined` | `{ participantCount }` | User joined auction |
| `auction:participant-left` | `{ participantCount }` | User left auction |
| `time:sync` | `{ serverTime }` | Server time response |
| `error` | `{ message }` | Error occurred |

### Example Usage (Vanilla JS)

```javascript
// Connect
const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') }
});

// Join auction
socket.emit('auction:join', 'auction_id_here');

// Listen for auction state
socket.on('auction:state', (data) => {
  console.log('Current bid:', data.auction.currentBid);
  console.log('Participants:', data.participantCount);
});

// Listen for new bids
socket.on('bid:new', (data) => {
  console.log(`${data.bidder} bid $${data.amount}`);
  updateUI(data.newCurrentBid, data.minimumNextBid);
});

// Listen for countdown
socket.on('auction:countdown', ({ timeRemaining }) => {
  updateTimer(timeRemaining);
});

// Place a bid
socket.emit('bid:place', {
  auctionId: 'auction_id_here',
  amount: 55000
});

// Listen for bid result
socket.on('bid:success', (data) => showSuccess(data.message));
socket.on('bid:error', (data) => showError(data.message));

// Listen for auction end
socket.on('auction:ended', (data) => {
  if (data.status === 'sold') {
    alert(`Sold to ${data.winner.name} for $${data.winningBid}`);
  }
});
```

### React Hook Example

See `examples/socket-react-hook.js` for a complete React hook implementation.

```javascript
import { useAuction } from './hooks/useAuction';

function AuctionPage({ auctionId }) {
  const {
    auction,
    bids,
    formattedTime,
    participantCount,
    placeBid,
    minimumBid,
    isAuctionLive,
  } = useAuction(auctionId, token);

  return (
    <div>
      <h1>{auction?.title}</h1>
      <p>Current Bid: ${auction?.currentBid}</p>
      <p>Time: {formattedTime}</p>
      <p>Watching: {participantCount}</p>
      
      {isAuctionLive && (
        <button onClick={() => placeBid(minimumBid)}>
          Bid ${minimumBid}
        </button>
      )}
    </div>
  );
}
```

### Features

- **Live Bid Updates**: All connected users see bids instantly
- **Countdown Sync**: Server-synchronized timers prevent time manipulation
- **Anti-Snipe Protection**: Auctions extend by 2 minutes if bid placed in final 2 minutes
- **Participant Count**: See how many users are watching
- **Automatic Auction Closing**: Server automatically ends auctions and determines winners
- **Reconnection Handling**: Automatic reconnection with state recovery

## License

ISC
