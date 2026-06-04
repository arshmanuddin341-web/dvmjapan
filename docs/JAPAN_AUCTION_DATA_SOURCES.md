# Japan Car Auction Data Sources – Real APIs & Access

This document describes **real** Japan car auction data sources for integration. No fake or demo data is used in the sync flow; when no source is configured, sync returns a clear "no source configured" state.

---

## Setup (first time)

1. **Prisma:** Ensure `DATABASE_URL` is set in `.env` (e.g. `DATABASE_URL="file:./dev.db"`). Then run:
   ```bash
   npx prisma migrate dev --name japan_auction_sync
   npx prisma generate
   ```
   This adds the `Vehicle` optional fields (`auctionHouse`, `lotNumber`, `auctionDate`, `chassis`, `source`) and the `JapanSyncLog` table. If `prisma generate` fails with EPERM (file in use), close any running dev server or Node process and run `npx prisma generate` again.

2. **Env (optional):** Set `JAPAN_AUCTION_API_URL` (and `JAPAN_AUCTION_API_KEY` if required by your provider) to enable sync. Without these, Admin → Japan Auctions will show "no source configured" when you run Sync.

---

## 1. Major auction houses (direct)

| House | Full name / notes | API / data access | Access type |
|-------|-------------------|-------------------|-------------|
| **USS** | USS Tokyo Auto Auction (ussnet.co.jp). Japan’s largest operator, 19 sites. | No public API. Dealers use **USS Ninja** (ninja-cartrade.jp / easycars.jp/ninja) for listings. Monthly aggregate stats (PDF) via USS IR. | **Partner / member only**. Free for USS members and auction agents. Not publicly accessible. |
| **TAA** | Tokyo Auto Auction (TAA). Major operator. | No public API. Access via dealer membership and partner portals. | **Partner-only**. Not publicly accessible. |
| **JU** | Japan Used Car Institute (JU). | No public API. Dealer/partner access only. | **Partner-only**. Not publicly accessible. |
| **ARAI** | ARAI Auction. | No public API. Dealer/partner access only. | **Partner-only**. Not publicly accessible. |
| **JAA** | Japan Auto Auction. | No public API. Member/dealer access. | **Partner-only**. Not publicly accessible. |
| **AUCNET** | AUCNET. | No public API. B2B/dealer access. | **Partner-only**. Not publicly accessible. |

**Summary:** Direct public APIs from USS, TAA, JU, ARAI, JAA, or AUCNET are **not** available. Integration requires membership, partnership, or an aggregator.

---

## 2. Aggregator / third‑party APIs (paid or partner)

| Provider | What it offers | Access type | Notes |
|----------|----------------|------------|--------|
| **JDMCARAPI** (jdmcarapi.com) | API for auction/listings data, car details, photos. Used by dealers for websites. | **Paid**. From ~$300/month (API) to $5,000+ for custom solutions. | Integrate via their base URL + API key. Set `JAPAN_AUCTION_API_URL` (and key if required). |
| **Auction Sheet JP** (auctionsheetjp.com) | True reports, verification, 140+ venues, 70,000+ daily listings, API, multilingual. | **Paid / partner**. API access available. | Suited for verification and listing data. |
| **Carapis** (carapis.com) | BeForward.jp parser API; 500k+ listings, vehicle details, pricing, export info. | **Paid**. | BeForward is export marketplace; not raw auction-house feed. |
| **Avto.jp** (avto.jp/api) | SQL-style API for listings (e.g. “main” table). | **Partner / paid**. API code required. | Listings-focused; use `JAPAN_AUCTION_AVTOJP_CODE` if you have a contract. |
| **ShibuWeb** | Export/auction system with API. | **Partner / paid**. | Use if you have an agreement; point `JAPAN_AUCTION_API_URL` at their endpoints. |

---

## 3. Data ingestion strategy (when no direct public API)

1. **Preferred: partner or paid aggregator**  
   - Use one provider (e.g. JDMCARAPI, Auction Sheet JP, Avto.jp) and configure:
     - `JAPAN_AUCTION_API_URL` – base URL for listings (and live/upcoming if supported).
     - `JAPAN_AUCTION_API_KEY` or provider-specific key (Bearer or header).
     - Optional: `JAPAN_AUCTION_AVTOJP_CODE` for Avto.jp SQL API.
   - Sync service calls this API, normalizes responses, and writes to your DB (no fake data).

2. **Partner-only house access (e.g. USS Ninja)**  
   - If you have dealer/member access, you typically get a portal or private API.
   - Backend can integrate via a **source adapter** that talks to that portal/API (custom per partner).
   - Add an adapter in `backend/services/japanAuctions/sourceAdapters/` and select it via config.

3. **Scraping-ready architecture (not implemented in MVP)**  
   - For houses with no API: design adapters that receive **pre-fetched** data (e.g. from a separate scraper job) in a fixed JSON shape.
   - Sync service would then normalize and import that file/queue; no scraping inside this codebase.

---

## 4. Configuration (this project)

- **Single source, config-based:** One active source at a time, chosen by env.
- **Env vars (see .env.example):**
  - `JAPAN_AUCTION_API_URL` – base URL for the chosen provider (e.g. JDMCARAPI, your own proxy).
  - `JAPAN_AUCTION_API_KEY` – optional; sent as `Authorization: Bearer <key>` or provider-specific header.
  - `JAPAN_AUCTION_SOURCE` – optional; e.g. `jdmarapi` | `avtojp` | `custom` for adapter selection.
- **When none are set:** Sync endpoint does not call any external API and returns a clear “no source configured” (no fake data).

---

## 5. Summary table

| Source type | Examples | Public API? | Use in this MVP |
|------------|----------|-------------|------------------|
| **Paid** | JDMCARAPI, Auction Sheet JP, Carapis | Yes (with key) | Yes – set URL + key and use sync. |
| **Partner-only** | USS Ninja, TAA/JU/ARAI dealer portals | No (member access) | Yes – custom adapter when you have access. |
| **Not publicly accessible** | Direct USS, TAA, JU, ARAI | No | No – use aggregator or partner feed. |

---

*Last updated for MVP. Extend this doc when adding new adapters or sources.*
