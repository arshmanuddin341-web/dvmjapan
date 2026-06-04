# Real-time auction – Socket events

Used by the **auction room** (`/auction/[id]`) and backend broadcast. No payments; bids are stored in Prisma and broadcast via Express Socket.io.

---

## Client → Server (emit)

| Event | Payload | Description |
|-------|---------|-------------|
| `auction:join-room` | `auctionId` (string) | Join room for live updates. State is loaded from GET /api/auctions/[id]. |
| `auction:leave` | `auctionId` (string) | Leave room. |

---

## Server → Client (on)

| Event | Payload | Description |
|-------|---------|-------------|
| `auction:joined` | `{ auctionId }` | Confirmation after joining room. |
| `bid:new` | `{ id, amount, bidderId, bidderName, createdAt, auctionId, currentBid }` | New bid placed (broadcast to room). |
| `auction:status` | `{ status, endTime?, startTime? }` | Admin changed status (active / paused / ended). |
| `auction:ended` | `{ status, finalPrice, winner: { id, name } \| null, noWinner, bidCount }` | Auction closed; winner set (or no bids). |
| `error` | `{ message }` | Error (e.g. invalid join). |

---

## Backend broadcast (HTTP)

Next.js calls Express to broadcast after saving a bid or updating status:

**POST** `{BACKEND_URL}/api/realtime/broadcast`  
Headers: `X-Broadcast-Secret: <REALTIME_BROADCAST_SECRET or JWT_SECRET>`  
Body: `{ "auctionId": "<id>", "event": "bid:new" | "auction:status" | "auction:ended", "payload": { ... } }`

- After placing a bid: Next.js saves to Prisma, then POSTs with `event: "bid:new"` and bid payload.
- After admin status change: Next.js updates Prisma, then POSTs with `event: "auction:status"` and status payload.
- When auction ends (PATCH status=ended or POST settle): Next.js runs settle (winner selection), then POSTs `event: "auction:ended"` with finalPrice, winner (or noWinner), bidCount.

---

## Flow

1. User opens `/auction/[id]` → page fetches GET /api/auctions/[id], connects Socket, emits `auction:join-room` with id.
2. User places bid → POST /api/auctions/[id] with `{ amount }` → Next.js validates, saves Bid in Prisma, POSTs to backend /api/realtime/broadcast → backend emits `bid:new` to room.
3. All clients in room receive `bid:new` and update UI (e.g. current bid, bid history).
4. Admin starts/pauses/ends → PATCH /api/auctions/[id] with `{ status }` → Next.js updates AuctionListing, POSTs broadcast → clients receive `auction:status`.

---

## Safety

- No fake users: bids require logged-in user (JWT); userId is Prisma User id.
- No auto-bidding: only explicit user bid submission.
- No payments: amount is stored for display only.
- If Socket or broadcast fails, the app does not crash; bid still saved in Prisma.
