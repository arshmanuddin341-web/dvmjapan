# Admin Panel Audit – DVM JAPAN

Quick checklist so admin panel 100% kaam kare (specially on Vercel).

---

## 1. Admin Login

- **Route:** `/login` → after login redirect to `/admin`
- **Super admin (no DB):** Set in Vercel **Production** env:
  - `SUPER_ADMIN_EMAIL` = `AdminKarim@gmail.com`
  - `SUPER_ADMIN_PASSWORD` = your chosen password (e.g. `KarimAdwani6`)
- **Note:** Agar ye vars sirf **Development** pe hain to production site par login nahi hoga. Dono vars **Production** pe honi chahiye.

---

## 2. Picture Upload (Add Vehicle / Images)

- **Where:** Admin → Vehicles → Add Vehicle → “Select Images”
- **Flow:** Cloudinary widget opens. “Uploading 0 assets” = abhi koi file add nahi ki; popup mein **files add karo (drag/drop ya Browse)** phir upload start hoga.
- **Vercel env (Production):**
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` = your Cloudinary cloud name
  - `NEXT_PUBLIC_CLOUDINARY_API_KEY` = your Cloudinary API key
  - `CLOUDINARY_API_SECRET` = your Cloudinary API secret (for signed uploads)
- **Agar upload fail ho:** Signature API `/api/upload/sign` 503 dega if `CLOUDINARY_API_SECRET` missing. Sab tees vars **Production** pe set karo aur redeploy karo.

---

## 3. Add / Edit Vehicle (API)

- **Routes:** `POST /api/vehicles`, `PATCH /api/vehicles/[id]`
- **Auth:** Admin only (Bearer token with `role: admin`). Super admin login se milta hai.
- **DB:** `DATABASE_URL` (PostgreSQL on Vercel). Prisma use hota hai.
- **Agar “Unauthorized” aaye:** Login with super admin; token sahi bhejna (frontend automatically bhejta hai).

---

## 4. Other Admin APIs (sab admin-only)

| Feature        | API / Route                     | Needs                          |
|----------------|----------------------------------|--------------------------------|
| Users list     | GET /api/admin/users            | Admin token                    |
| Approve user   | PATCH /api/admin/users/[id]/approve | Admin token                |
| Inquiries list | GET /api/inquiries              | Admin token                    |
| Auctions       | /api/auctions/*                 | Admin for PATCH/settle         |
| Japan Auctions | /api/japan-auctions/status, sync| Admin token, optional DB       |
| Vehicles       | /api/vehicles, /api/vehicles/[id] | Admin token, DATABASE_URL   |

---

## 5. Admin Pages (sidebar)

- **Dashboard** `/admin` – overview
- **Users** `/admin/users` – list, approve (needs admin)
- **Vehicles** `/admin/vehicles`, `/admin/vehicles/add` – list, add (DB + Cloudinary for images)
- **Auctions** – create, manage (DB)
- **Japan Auctions** – status, sync (optional API keys)
- **Site Settings, Content, FAQ, Testimonials, SEO, Blog, Pricing** – config/content (depends on backend or DB)
- **Inquiries** – list from GET /api/inquiries

---

## 6. Vercel Checklist (Production)

- [ ] `SUPER_ADMIN_EMAIL` + `SUPER_ADMIN_PASSWORD` → **Production** pe set
- [ ] `DATABASE_URL` → PostgreSQL (Neon/Supabase/Vercel Postgres)
- [ ] `JWT_SECRET` set
- [ ] **Image upload ke liye:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` → **Production** pe set
- [ ] Redeploy after env changes

---

## 7. Picture Upload “0 assets” Summary

- **“Uploading 0 assets”** = Cloudinary widget open hai lekin abhi **0 files select** kiye. Popup mein **Add files** / drag & drop karo, phir upload karo.
- Agar **upload start karne ke baad** fail ho to usually **CLOUDINARY_API_SECRET** missing hota hai (Vercel Production). Add karo, redeploy karo.
