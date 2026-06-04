# Car Auction Website - Complete Setup & Build Guide

## 1. JWT Secret – Kya Karna Hai?

Tumne jwtsecrets.com se jo key generate ki (`12178529db2e3c6cfd6ab6c95c120b3b`), use **backend ke `.env`** mein daalo:

```
backend/.env
```

Add/update this line:
```env
JWT_SECRET=12178529db2e3c6cfd6ab6c95c120b3b
```

⚠️ **Important:** Production ke liye alag, aur bada secret use karo (256+ bits).

---

## 2. Backend APIs – Jo Ab Ready Hai

### Auth APIs
| Method | Endpoint | Use |
|--------|----------|-----|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/verify-email/:token` | Email verification |
| POST | `/api/auth/resend-verification` | Resend verification email |
| GET | `/api/auth/me` | Current user profile |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/password` | Change password |
| POST | `/api/auth/logout` | Logout |

### Car APIs
| Method | Endpoint | Use |
|--------|----------|-----|
| GET | `/api/cars` | List cars (filters, search) |
| GET | `/api/cars/:id` | Car detail |
| POST | `/api/cars` | Create car |
| PUT | `/api/cars/:id` | Update car |
| DELETE | `/api/cars/:id` | Delete car |
| GET | `/api/cars/my-cars` | Current user’s cars |

### Auction APIs
| Method | Endpoint | Use |
|--------|----------|-----|
| GET | `/api/auctions` | List auctions |
| GET | `/api/auctions/live` | Live auctions |
| GET | `/api/auctions/upcoming` | Upcoming auctions |
| GET | `/api/auctions/:id` | Auction detail |
| POST | `/api/auctions` | Create auction (Admin) |
| PUT | `/api/auctions/:id` | Update auction (Admin) |
| PUT | `/api/auctions/:id/close` | Close auction (Admin) |
| PUT | `/api/auctions/:id/cancel` | Cancel auction (Admin) |
| POST | `/api/auctions/:id/watch` | Add to watchlist |
| DELETE | `/api/auctions/:id/watch` | Remove from watchlist |

### Bid APIs
| Method | Endpoint | Use |
|--------|----------|-----|
| POST | `/api/bids` | Place bid |
| GET | `/api/bids/auction/:auctionId` | Auction bid history |
| GET | `/api/bids/my-bids` | User’s bids |
| GET | `/api/bids/active` | Active winning bids |
| GET | `/api/bids/won` | Won auctions |

### Upload API
| Method | Endpoint | Use |
|--------|----------|-----|
| POST | `/api/upload/image` | Upload single image |
| POST | `/api/upload/images` | Upload multiple images |

### Admin APIs
| Method | Endpoint | Use |
|--------|----------|-----|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/analytics` | Analytics |
| GET | `/api/admin/users` | List users |
| POST | `/api/admin/users` | Create user |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/cars` | Admin car list |
| GET | `/api/admin/auctions` | Admin auction list |
| PUT | `/api/admin/cars/bulk-verify` | Bulk verify cars |
| PUT | `/api/admin/auctions/:id/extend` | Extend auction |
| GET | `/api/admin/export/:type` | Export data |

### Real-time (Socket.io)
- Join auction room, place bid, countdown
- Events: `auction:join`, `bid:place`, `auction:countdown`, etc.

---

## 3. Website – Jo Build Karna Hai

### Public Pages (Frontend)
| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Home | `/` | ✅ | Update with live auctions |
| Login | `/login` | ✅ | Connected to backend |
| Register | `/register` | ✅ | Email verification |
| Live Auctions | `/live-auctions` | ✅ | Connect to backend + Socket.io |
| Auction Detail | `/auctions/:id` | ❌ | Create – bid UI, countdown |
| Vehicle Detail | `/vehicles/:id` | ✅ | Connect to backend |
| Inventory/Cars | `/inventory` | ✅ | Connect to `/api/cars` |
| Verify Email | `/verify-email/:token` | ❌ | Create – handle verification link |
| Contact | `/contact` | ✅ | Optional: connect to API |
| FAQ, About, etc. | Various | ✅ | Static content |

### User Dashboard
| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Dashboard Home | `/dashboard` | ✅ | Stats, recent activity |
| Profile | `/dashboard/profile` | ✅ | Connect to `/api/auth/me`, profile update |
| Settings | `/dashboard/settings` | ✅ | Password change |
| My Cars | `/dashboard/my-cars` | ❌ | Create – list/create cars |
| My Bids | `/dashboard/my-bids` | ❌ | Create – connect `/api/bids/my-bids` |
| Won Auctions | `/dashboard/won` | ❌ | Create – connect `/api/bids/won` |
| Tracking | `/dashboard/tracking` | ✅ | As needed |

### Admin Panel
| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Admin Dashboard | `/admin` | ✅ | Connect `/api/admin/dashboard` |
| Users | `/admin/users` | ❌ | Create – CRUD users |
| Cars | `/admin/vehicles` | ✅ | Connect `/api/admin/cars` |
| Auctions | `/admin/auctions` | ❌ | Create – manage auctions |
| Create Auction | `/admin/auctions/create` | ❌ | Create |
| Analytics | `/admin/analytics` | ❌ | Create – connect `/api/admin/analytics` |
| Listings | `/admin/listings` | ✅ | Connect cars/auctions |
| Pricing | `/admin/pricing` | ✅ | As per design |
| Blog | `/admin/blog` | ✅ | If needed |
| Inquiries | `/admin/inquiries` | ✅ | If needed |
| SEO | `/admin/seo` | ✅ | As per design |

---

## 4. Admin Panel – Jo Specifically Banana Hai

### 4.1 Admin Dashboard (`/admin`)
- Overview cards: Total users, cars, auctions, revenue
- Recent users, auctions, bids
- Quick actions
- API: `GET /api/admin/dashboard`

### 4.2 User Management (`/admin/users`)
- User list (table) – search, filter (role, status)
- Create user
- Edit user (name, email, role, active/inactive)
- Delete user
- APIs: `GET/POST/PUT/DELETE /api/admin/users`

### 4.3 Car Management (`/admin/vehicles`)
- Car list – search, filter (brand, status)
- Add car form – images via Cloudinary
- Edit/Delete car
- Bulk verify
- APIs: `GET/POST/PUT/DELETE /api/admin/cars`, `POST /api/upload/image`

### 4.4 Auction Management (`/admin/auctions`)
- Auction list – filter by status
- Create auction – select car, dates, starting bid
- Edit/Extend/Close/Cancel
- APIs: `GET/POST/PUT /api/admin/auctions`, extend, close, cancel

### 4.5 Analytics (`/admin/analytics`)
- Charts (user growth, revenue, bids)
- Top sellers/bidders
- API: `GET /api/admin/analytics`

---

## 5. API Integration Checklist

### Frontend `.env`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### API Call Pattern (using `api()` from `lib/api-client.ts`)
```typescript
// Example: Get live auctions
const data = await api<{ data: Auction[] }>('/api/auctions/live');

// Example: Place bid (with auth)
await api('/api/bids', {
  method: 'POST',
  body: JSON.stringify({ auctionId, amount }),
});
```

### Protected Routes
Add header:
```
Authorization: Bearer <token>
```
`api-client.ts` yeh already handle karta hai via `getToken()`.

---

## 6. Build Order (Suggested)

1. **JWT Secret** – `backend/.env` mein daal do  
2. **Verify Email Page** – `/verify-email/[token]`  
3. **Live Auctions Page** – backend + Socket.io connect  
4. **Auction Detail Page** – bid UI + real-time  
5. **User: My Cars** – list + add car with image upload  
6. **User: My Bids** – list bids  
7. **Admin: Users** – user management  
8. **Admin: Auctions** – auction management  
9. **Admin: Analytics** – charts + stats  

---

## 7. Environment Variables Summary

### Root `.env` (Next.js)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend `backend/.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=12178529db2e3c6cfd6ab6c95c120b3b
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=...
CLOUDINARY_URL=cloudinary://...
```

---

## 8. Quick Reference – All APIs

| Category | Base | Endpoints |
|----------|------|-----------|
| Auth | `/api/auth` | register, login, verify-email, resend-verification, me, profile, password, logout |
| Cars | `/api/cars` | GET(all, :id), POST, PUT(:id), DELETE(:id), my-cars |
| Auctions | `/api/auctions` | GET(all, live, upcoming, :id), POST, PUT(:id), close, cancel, :id/watch |
| Bids | `/api/bids` | POST, auction/:id, my-bids, active, won |
| Upload | `/api/upload` | image, images |
| Admin | `/api/admin` | dashboard, analytics, users, cars, auctions, export |

---

**Summary:** JWT secret backend `.env` mein daalo. Baaki sab APIs ready hain – frontend pages ko in APIs se connect karna hai. Admin ke liye users, auctions, analytics pages banana hai.
