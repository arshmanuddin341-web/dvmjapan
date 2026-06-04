# Admin Panel – Kya Integrated Hai, Kya Nahi

Ye document batata hai: website mein jo cheezen hain, unmein se kya admin panel se change hota hai, kya backend use ho raha hai, aur pictures wagera kahan se aati hain.

---

## Admin se puri website – ek ek cheez (kya change kar sakte ho)

| # | Cheez | Admin mein kahan | Website pe kahan dikhega |
|---|--------|------------------|---------------------------|
| 1 | **Site ka naam, phone, email, address, social links, stats** | **Site Settings** | Footer, contact, CTA, har jahan ye data use ho |
| 2 | **Homepage Hero text** (title, subtitle, CTAs) | **Page Content** | Homepage hero – pehla slide ka copy |
| 3 | **Vehicles (cars)** – add/edit/delete, details, price | **Vehicles** → List / Add / Edit | **Inventory** page, **vehicle detail** page, home featured |
| 4 | **Vehicle images** | **Vehicles** → Add/Edit → Cloudinary upload | Same vehicle ki gallery + cards |
| 5 | **Users** – list, approve | **Users** | Dashboard stats, approval flow |
| 6 | **Auctions** | **Auctions** | Live auctions, auction detail pages |
| 7 | **FAQ** (sawal–jawab) | **FAQ** | FAQ section / page jahan FAQ load hota hai |
| 8 | **Testimonials** | **Testimonials** | Homepage / testimonials section |
| 9 | **SEO** (page-wise meta title, description) | **SEO** | Har page ka `<title>`, meta description |
| 10 | **Pricing rules / notes** | **Pricing** | Pricing section / table jahan API se aata hai |
| 11 | **Blog posts** – list, new, edit | **Blog** (+ Edit / New Post) | **/blog** listing, **/blog/[slug]** post |
| 12 | **Inquiries** – list, status update | **Inquiries** | Form submit → admin list + status |

**Abhi admin se change NAHI ho sakta (code mein fixed):**

- **Hero / promo / banner images** – slides ki background images, promo card images. Inke liye alag “Slides / Banners” admin add karna padega.

**Summary:** Haan – **admin panel se main puri website ki zaroori cheezen (content, vehicles, users, FAQ, testimonials, SEO, pricing, blog, inquiries, hero text, site settings)** ek ek karke change kar sakte ho. Sirf hero/promo **images** abhi code se fixed hain; baaki sab admin se.

---

## ✅ Jo Proper Integrate Hai (Admin Se Change Ho Sakta Hai)

### 1. **Vehicles (Cars) – Full**
- **Backend:** PostgreSQL (Prisma), APIs: `GET/POST /api/vehicles`, `GET/PATCH /api/vehicles/[id]`
- **Admin:** Vehicles list, Add Vehicle, Edit Vehicle – sab DB se
- **Pictures:** Admin → Add/Edit Vehicle pe **Cloudinary** se images upload kar sakte ho. Wo URLs DB mein save hoti hain. Website pe inventory aur vehicle detail pe yahi images dikhti hain.
- **Requirement:** `DATABASE_URL` (PostgreSQL), Cloudinary env vars (`NEXT_PUBLIC_CLOUDINARY_*`, `CLOUDINARY_API_SECRET`)

### 2. **Users**
- **Backend:** Login (MongoDB agar `MONGODB_URI` set hai, warna file-based). Admin users list aur “approve” Prisma `User` table se bhi use ho sakta hai (dashboard API Prisma use karta hai).
- **Admin:** Dashboard pe user count, recent users, Admin → Users pe list + approve
- **APIs:** `GET /api/admin/users`, `PATCH /api/admin/users/[id]/approve`, `GET /api/admin/dashboard`

### 3. **Site Settings (Name, Contact, Social, Stats) – Full (Prisma)**
- **Admin:** Admin → **Site Settings** se company name, phone, email, address, social links, stats edit kar sakte ho → **Prisma** mein save hota hai (koi external backend nahi).
- **Website:** Footer, CTA – sab **/api/content/public/config** se (DB se ya default). Admin se save = site pe reflect.

### 4. **Inquiries**
- **Backend:** Form submit → `POST /api/inquiries`, store (e.g. DB). Admin → Inquiries se list dekh sakte ho.

### 5. **Auctions**
- **Backend:** Prisma `AuctionListing`, bids, etc. Admin se create/manage auctions.

### 6. **Dashboard Stats**
- **Backend:** Prisma – users count, vehicles count, auctions count, recent users, recent activity. Sab admin dashboard pe dikhta hai.

---

## ⚠️ Jo Abhi Partial / Optional Hai

### 1. **Homepage Hero – Text (Done)**
- **Admin → Page Content** se hero (title, subtitle, etc.) save hota hai → **Prisma**. Website ka **HeroSlide** pehla slide ka title/subtitle **GET /api/content/hero** se leta hai. Admin se jo save karo wahi first slide pe dikhega.
- **Hero images:** Slides ki images abhi code mein fixed; admin se change ka option nahi.

### 2. **Promo / Banners / Other Images**
- **Abhi:** Promo cards, hero background images – sab code mein fixed URLs. Inko admin se change karne ka koi UI nahi.

### 4. **FAQ, Testimonials, SEO, Pricing – Full (Prisma)**
- Admin → FAQ, Testimonials, SEO, Pricing – sab **GET/PUT /api/content/[key]** se load/save (Prisma `Content`). Website inhi values se chalti hai.

### 5. **Blog – Full (Prisma)**
- **Admin → Blog:** List GET /api/content/blog se; Seed from defaults se `data/blog` wale posts Content mein save ho jate hain. New Post / Edit → full form, PUT blog = full array.
- **Public /blog:** Listing aur /blog/[slug] dono API se; empty ho to fallback `data/blog`. **Seed (Site):** POST /api/content/seed Prisma se site_config + hero seed (PostgreSQL zaroori).
---

## Backend Summary

| Cheez           | Kahan store / kaun backend      |
|-----------------|----------------------------------|
| Vehicles        | **PostgreSQL (Prisma)** – same Next.js app |
| Vehicle images  | **Cloudinary** (URLs in DB)     |
| Users (login)   | **MongoDB** (if `MONGODB_URI`) else file  |
| Dashboard stats | **Prisma** (PostgreSQL)         |
| Site config     | **Prisma** `Content` – Admin Site Settings; site `/api/content/public/config` se padhti hai |
| Hero content    | **Prisma** `Content` – Admin Page Content; HeroSlide first slide API se leta hai |
| Inquiries       | API se (DB/store)               |

---

## Short Answer (Aapke Sawal Ke Hisaab Se)

- **“Admin panel proper bana hua hai?”**  
  Haan, structure proper hai: Dashboard, Users, Vehicles, Auctions, Site Settings, Content, FAQ, Blog, etc. sab pages hain.

- **“Ek ek cheez apas mein integrate hai?”**  
  **Vehicles** (DB + Cloudinary), **Users**, **Dashboard**, **Site Settings** (Prisma), **Hero text** (Prisma) – sab integrate. **Hero/promo images** abhi code mein fixed.

- **“Backend bana hua hai?”**  
  **Haan:** Sab Next.js + Prisma (PostgreSQL). Site config aur hero bhi Prisma `Content` table se; koi external backend zaroori nahi.

- **“Website ki pictures admin se change kar sakun?”**  
  **Vehicle images** – **haan**: Admin → Vehicles → Add/Edit Vehicle → Cloudinary se pictures laga sakte ho, wo site pe dikhengi.  
  **Hero / promo / banner images** – **abhi nahi**: ye code mein fixed hain; admin se change karne ka option nahi.

- **“Ek ek cheez admin se change kar sakun?”**  
  **Haan:** Vehicles (detail + images), Users, Auctions, Inquiries, **Site Settings** (Prisma), **Hero text** (Prisma – first slide). **Abhi nahi:** Hero/promo **images** (no admin UI).

---

## Optional: Hero / Promo Images

- Hero + Site config ab Prisma se chal rahe hain (see section below).
- Optional: Admin mein slides/banners manage karke hero/promo image URLs set karne ka option add kiya ja sakta hai.

---

## Hero + Site Config – Prisma (No External Backend)

- **Prisma:** `Content` model add kiya (key, value JSON). Keys: `site_config`, `hero`.
- **GET /api/content/public/config:** Ab DB se `site_config` padhta hai; nahi mila to `lib/site-config` default.
- **GET/PUT /api/content/site_config:** Admin Site Settings load/save – Prisma. PUT admin-only.
- **GET/PUT /api/content/hero:** Admin Page Content (hero) load/save – Prisma. PUT admin-only. Homepage HeroSlide GET /api/content/hero se first slide ka title/subtitle leta hai.
- **Content keys:** `site_config`, `hero`, `faq`, `testimonials`, `seo`, `pricing`, `blog` – sab Prisma `Content`; GET public, PUT admin-only.
- **POST /api/content/seed:** Admin-only. PostgreSQL ho to Prisma se default `site_config` + `hero` seed karta hai; external backend nahi.
- **Migration (ek bar):** `npx prisma migrate dev --name add_content`. Production: `npx prisma migrate deploy`.
