# API Status: Kitni lagali, kitni baki, kitni buy hongi

---

## 1. Kitni API lag chuki hai (already implemented)

Yeh project me **apne code me** jo APIs maujood hain (Next.js + Express backend dono mila ke):

| Category   | Lag chuki (count) | Kahan hain |
|-----------|-------------------|------------|
| **Auth**  | **9**             | Backend (register, login, me, verify-email, resend, verification-status, profile, password, logout) + Google/Facebook OAuth. Next.js me login/register/me wrappers (file-based + proxy). |
| **Content** | **6+**          | Backend (public/config, :key, seed, put, get). Next.js: public config (fallback). |
| **Vehicles** | **6**          | Next.js: GET list, GET :id, PUT :id, DELETE :id. Backend: POST create, verify, my-cars, stats. |
| **Auctions** | **11+**        | Backend: list, live, upcoming, :id, create, update, close, cancel, watch, stats. Next.js: GET list (Prisma) + Japan live, upcoming, listings (3). |
| **Bids**  | **7**             | Backend: place bid, my-bids, active, won, stats, by id, auction bids. |
| **Inquiries** | **2**          | Next.js: POST submit, GET list. |
| **Admin** | **16+**           | Backend: users (CRUD, approve, toggle, role), cars (list, bulk-verify, bulk-status, delete), auctions (list, extend, force-close, bulk-cancel), dashboard, analytics, system, export. Next.js: admin users list + approve (proxy). |
| **Upload** | **2**            | Backend: image, images. |
| **Health/Docs** | **2**      | Backend: /api/health, /api (docs). |
| **Calculator**   | **1**      | Next.js: GET /api/calculator/config (destinations + fees for cost calculator). |
| **Japan Auctions (sync)** | **3** | Next.js: GET /api/japan-auctions/status, POST /api/japan-auctions/sync (admin). Backend: GET /api/japan-auctions/fetch (admin; returns normalized listings). |

**Total lag chuki: ~59+ APIs** (backend + Next.js mila ke; double count nahi ki – same endpoint ek hi baar).

---

## 2. Kitni lagana baki hai (MVP ke liye)

MVP list me **~40** APIs thi. Inme se **zyada tar already code me hain**.

| Kya baki hai | Detail |
|--------------|--------|
| **Frontend wiring** | Kuch pages abhi bhi static/data se chal rahe hain (e.g. vehicles list/detail kahi data/vehicles.ts se). Unko API se connect karna baki ho sakta hai. |
| **Next.js ↔ Backend** | Admin/content ke liye frontend abhi proxy use karta hai; agar backend off ho to kuch admin features band. Ye optional fix hai. |
| **Nayi API nahi** | MVP ke liye **koi nayi API likhni zaroori nahi** – sab required endpoints already hain. |

**Conclusion:**  
- **Nayi API banani baki: 0** (MVP ke liye).  
- **Kaam baki:** Frontend ko har jagah API se data lena (jahan abhi static use ho) aur testing.

---

## 3. Kitni “buy” hongi (paise se lena / third-party)

Yeh woh cheezein hain jo **khud ki API nahi** – service/plan **buy** karna padta hai ya **free tier** use karte hain:

| # | Cheez | Buy / Free? | Kitna / kaise |
|---|--------|-------------|----------------|
| 1 | **Japan auction real data** | **Buy (optional)** | Real Japan auction feed ke liye: JDMCARAPI (~$300/month), ShibuWeb, ya Avto.jp code. Bina buy ke demo/backend data chal raha hai. |
| 2 | **Email (verification, alerts)** | Free ya Buy | Gmail SMTP (free) ya SendGrid/Mailgun (free tier / paid). Abhi Nodemailer se ho sakta hai. |
| 3 | **Google / Facebook login** | Free | OAuth app banani hoti hai; API free hai, buy nahi. |
| 4 | **Payment (future)** | Buy | Agar payment add karo (Stripe, etc.) to unka fee + possible subscription. Abhi MVP me zaroori nahi. |
| 5 | **Hosting / DB** | Free ya Buy | Vercel (free tier), MongoDB Atlas (free tier), ya paid plans. |

**Short answer – “kitni buy hongi”:**

- **Zaroori buy:** **0** (MVP sirf apni + free services se chal sakta hai).
- **Optional buy:** **1–2**  
  - **1** = Japan auction **real** data ke liye (e.g. JDMCARAPI / Avto.jp code, etc.).  
  - **1** = Agar paid email service ya paid hosting/DB lo.

---

## Ek nazar me

| Sawal | Jawab |
|-------|--------|
| **Kitni API lagali hai?** | **~55+** (backend + Next.js, combined). |
| **Kitni lagana baki hai (MVP)?** | **0** nayi API; baki ka kaam sirf frontend wiring / testing. |
| **Kitni buy hongi is main?** | **0 zaroori.** Optional: **1** (Japan real auction API) ya **2** (+ email/hosting agar paid lo). |

---

## Japan Auctions (sync)

| # | Method | Endpoint | Kaam |
|---|--------|----------|------|
| 1 | GET | `/api/japan-auctions/status` | Last sync time, source name, imported count (admin). |
| 2 | POST | `/api/japan-auctions/sync` | Fetch from configured source, normalize, upsert vehicles (admin). |
| 3 | GET | Backend `/api/japan-auctions/fetch` | Returns normalized listings only (admin); used by cron or other clients. |

Configure `JAPAN_AUCTION_API_URL` (and optional `JAPAN_AUCTION_API_KEY`) for real data. See **docs/JAPAN_AUCTION_DATA_SOURCES.md**.

---

## Calculator ki API

Calculator pehle **sirf client-side** tha (koi API nahi). Ab yeh lag chuki hai:

| # | Method | Endpoint | Kaam |
|---|--------|----------|------|
| 1 | GET | `/api/calculator/config` | Destinations (ports, RORO/container shipping) + fees (service %, inspection, docs, insurance %, handling, etc.). Calculator is se rates le sakta hai. |

**Optional (baad me):** `POST /api/calculator/quote` – user quote save kare ya “Email me this quote” – inquiry/DB me save.

---

## Summary table

| Item | Count |
|------|--------|
| APIs already in project | **~59+** (calculator + Japan sync included) |
| New APIs needed for MVP | **0** |
| APIs/services to buy (optional) | **1–2** (Japan real data, optional email/hosting) |
