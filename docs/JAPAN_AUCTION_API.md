# Japan Auction Live Data – Real API Integration

The Live Auctions page can show **real** Japan auction data when you connect an external API. Without configuration, it uses demo data and still refreshes every few seconds.

For **importing** auction vehicles into your inventory (sync), use **Admin → Japan Auctions** and set `JAPAN_AUCTION_API_URL` (and optional `JAPAN_AUCTION_API_KEY`). See **docs/JAPAN_AUCTION_DATA_SOURCES.md** for real data sources (USS, TAA, JU, ARAI, aggregators) and access types (paid, partner-only, not public).

## How It Works

- **Live / Upcoming / Listings** are fetched from your API when configured.
- The frontend **polls every 3 seconds** (live + listings) and **every 6 seconds** (upcoming) so data stays current.
- If no real API is set, the app uses demo data and your own backend/DB (if available).

## Option 1: Custom Japan Auction API (Recommended)

Use your own backend or a provider (e.g. JDMCARAPI, ShibuWeb, or your proxy) that exposes:

| Endpoint        | Method | Response |
|----------------|--------|----------|
| `{BASE}/live`      | GET    | JSON array of `{ id, name, timeRemaining, vehicles, status }` |
| `{BASE}/upcoming`  | GET    | JSON array of `{ id, name, date, time, location, vehicles, status }` |
| `{BASE}/listings`  | GET    | JSON array of `{ lot, make, model, year, auction, date, mileage, engine, startPrice, soldPrice, image, chassis?, grade? }` |

**`.env` / `.env.local`:**

```env
JAPAN_AUCTION_API_URL=https://your-backend.com/japan
JAPAN_AUCTION_API_KEY=your-secret-key
```

- `JAPAN_AUCTION_API_URL` must not have a trailing slash (e.g. `https://api.example.com/japan`).
- If your API uses Bearer token, set `JAPAN_AUCTION_API_KEY`; it is sent as `Authorization: Bearer <key>`. If the API expects a different header, we can add it (e.g. `X-API-Key`).

## Option 2: Avto.jp SQL API (Listings Only)

For **listings only**, you can use the Avto.jp (AJ System) SQL API. You need an API code from them (e.g. via [avto.jp/api](https://avto.jp/api)).

**`.env` / `.env.local`:**

```env
JAPAN_AUCTION_AVTOJP_CODE=your_avtojp_code
```

- The app runs a query against their `main` table and maps the result to our listing format.
- Live and upcoming still come from `JAPAN_AUCTION_API_URL` or demo/backend.

## Providers You Can Use

1. **JDMCARAPI** (jdmcarapi.com) – Paid; get API URL/key from them and set `JAPAN_AUCTION_API_URL` (and key if they provide one).
2. **ShibuWeb** – Export/auction system with API; point `JAPAN_AUCTION_API_URL` at their endpoints if they expose `/live`, `/upcoming`, `/listings`.
3. **Avto.jp** – Use `JAPAN_AUCTION_AVTOJP_CODE` for listings; combine with your own or another API for live/upcoming.
4. **Your own backend** – Implement the three endpoints above and set `JAPAN_AUCTION_API_URL` to your base URL.

## Polling (Live Updates)

- **Live auctions:** refreshed every **3 seconds**.
- **Listings:** refreshed every **3 seconds**.
- **Upcoming:** refreshed every **6 seconds**.

So as soon as your API returns new data, the page will show it within a few seconds. No demo data is used when your API returns valid responses.
