# Backend Audit – DVM JAPAN UI

Audit date: Feb 2025. Summary of findings and fixes applied.

---

## 1. Auth & JWT

### 1.1 JWT secret consistency
- **Issue:** `lib/auth.ts` used default `"DVM JAPAN-dev-secret"` while `auth-store` and `mongo-auth` use `"fallback-secret"`. Without `JWT_SECRET` in `.env`, tokens from login would fail verification in API routes.
- **Fix:** `lib/auth.ts` now uses the same default: `process.env.JWT_SECRET || "fallback-secret"`.
- **Recommendation:** In production, always set `JWT_SECRET` in `.env` (strong random value).

### 1.2 JWT payload: `sub` vs `id`
- **Issue:** Login/register (auth-store, mongo-auth) issue tokens with `id`, while API routes using `lib/auth` expect `payload.sub`. So `payload.sub` was undefined for file-based users; inquiries were not linked to user, and any logic using `payload.sub` (e.g. bids) would break.
- **Fix:** `verifyToken()` in `lib/auth.ts` now normalizes the decoded payload: `sub = decoded.sub ?? decoded.id`, and returns a consistent `JwtPayload` with `sub` set. All routes that use `payload.sub` (inquiries, vehicles admin, auctions) now work for both file-based and MongoDB tokens.

### 1.3 Auth sources
- **Current:** Login/register can use **file-based** (`lib/auth-store.ts`, `data/auth-users.json`) or **MongoDB** (`lib/mongo-auth.ts`). `/api/auth/me` uses `getMeFromToken` (mongo-auth) + `getStatusById` (auth-store). Admin approve uses auth-store.
- **Note:** Auction **bidding** (`POST /api/auctions/[id]`) requires a **Prisma User** (FK on `Bid`). File-based users are not in Prisma, so they cannot place bids unless you add a sync step (e.g. create/update Prisma User on login from file-store) or relax the schema. Inquiry creation works for file-based users (optional `userId` from token).

---

## 2. API security

### 2.1 POST /api/vehicles – was unauthenticated
- **Issue:** Anyone could create vehicles; no admin check.
- **Fix:** POST now requires `Authorization: Bearer <token>` and `payload.role === "admin"`. Same pattern as PUT/DELETE on `/api/vehicles/[id]`.

### 2.2 GET /api/vehicles – pagination
- **Issue:** `page`/`limit` from query could be NaN (e.g. `?page=abc`), leading to invalid `skip`/`take`.
- **Fix:** `page` and `limit` are parsed and then validated with `Number.isFinite()`; fallbacks are 1 and 12, with `limit` capped at 50.

### 2.3 Other routes (checked)
- **Inquiries:** POST allows optional auth (userId from token); GET list is admin-only. Zod + Prisma used; OK.
- **Vehicles [id]:** GET public; PUT/DELETE admin-only via `lib/auth` – OK.
- **Admin users:** List and approve use token + role check (getMeFromToken + admin) – OK.
- **Japan sync:** POST admin-only – OK.
- **Content seed / content [key]:** Proxies to backend; auth forwarded if present. Backend is responsible for enforcing auth.
- **Upload sign:** `GET /api/upload/sign` returns Cloudinary signature; no auth. Anyone with the frontend can get a signature. Acceptable if uploads are limited by Cloudinary config (e.g. folder/unsigned preset); for stricter control, consider requiring auth for this endpoint.

---

## 3. Summary of code changes

| File | Change |
|------|--------|
| `lib/auth.ts` | JWT default secret aligned to `"fallback-secret"`; `verifyToken()` normalizes payload so `sub = decoded.sub ?? decoded.id` and returns typed `JwtPayload`. |
| `app/api/vehicles/route.ts` | POST requires admin (getAuthFromRequest + verifyToken + role check). GET pagination uses `Number.isFinite()` and safe defaults for page/limit. |

---

## 4. Recommendations

1. **Production:** Set `JWT_SECRET` (and optionally `JWT_EXPIRE`) in `.env`; do not rely on defaults.
2. **Auction bids + file-based users:** If you want file-based users to bid, either (a) sync file-based users into Prisma (e.g. on login), or (b) introduce a “guest” or “system” user in Prisma and document the limitation.
3. **Upload sign:** If uploads must be restricted to logged-in (or admin) users, add auth to `GET /api/upload/sign`.
4. **Content seed:** Backend should enforce admin (or equivalent) for `POST /api/content/seed`; this repo only proxies the request.
5. **Validation:** Consider adding Zod (or similar) for POST body validation on vehicles and other mutable endpoints if not already present.

---

## 5. Status

- **Critical:** JWT compatibility and Vehicles POST auth are fixed.
- **Pagination:** Vehicles GET is hardened.
- **Documented:** Auth duality (file vs Mongo), upload/content behavior, and bid vs Prisma user limitation are documented above.

Backend is in a good state for normal use; production should set `JWT_SECRET` and consider the optional recommendations above.
