# Database & Cloudinary Setup

## Best database options (recommended order)

Your app uses **Prisma** with **SQLite** for local dev. For production, use a **managed PostgreSQL** service — same Prisma schema, just change `provider` and `DATABASE_URL`.

### 1. **Neon** (recommended)
- **Why:** Serverless PostgreSQL, generous free tier, works great with Vercel/Next.js, no credit card for signup.
- **URL format:** `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
- **Steps:** [neon.tech](https://neon.tech) → Create project → Copy connection string → set `DATABASE_URL` in `.env`.

### 2. **Supabase**
- **Why:** PostgreSQL + optional Auth/Storage, free tier, dashboard, backups.
- **URL:** From Supabase project → Settings → Database → Connection string (URI).
- **Steps:** [supabase.com](https://supabase.com) → New project → use connection string in `DATABASE_URL`.

### 3. **Vercel Postgres** (if you deploy on Vercel)
- **Why:** One-click if app is on Vercel, powered by Neon.
- **Steps:** Vercel project → Storage → Create Database → Postgres → env vars auto-added.

### 4. **Railway**
- **Why:** Simple PostgreSQL (and Redis), pay-as-you-go after free credit.
- **Steps:** [railway.app](https://railway.app) → New → PostgreSQL → Connect → copy `DATABASE_URL`.

### Switching to PostgreSQL

1. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"   # was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `.env`: `DATABASE_URL="postgresql://..."` (from Neon/Supabase/Vercel).
3. Run: `npx prisma migrate dev` (or `prisma db push` for quick sync).
4. Re-seed if needed: `npm run db:seed`.

**Note:** SQLite and PostgreSQL are both supported by this schema. Keep SQLite for local dev (`file:./dev.db`) and use PostgreSQL only in production if you prefer.

---

## Cloudinary (images & media)

Use **Cloudinary** for vehicle images, user avatars, and any uploads. URLs are stored in your DB (e.g. `Vehicle.images` as JSON array of URLs).

### 1. Create Cloudinary account
- Sign up at [cloudinary.com](https://cloudinary.com) (free tier is enough to start).
- Dashboard → get **Cloud name**, **API Key**, **API Secret**.

### 2. Environment variables

Add to `.env` (and never commit real values to git):

```env
# Cloudinary (vehicle images, avatars, uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

- `NEXT_PUBLIC_*`: used in browser (e.g. upload widget).
- `CLOUDINARY_API_SECRET`: server-only, for signing uploads.

### 3. Usage in the app

- **Display images:** Use the image URL returned by Cloudinary (e.g. `https://res.cloudinary.com/<cloud_name>/image/upload/...`). Store these in `Vehicle.images` (JSON array) or `User.avatar`.
- **Upload:** Use the upload widget or API route (see `lib/cloudinary.ts` and `/api/upload/sign` if implemented). After upload, save the returned **secure_url** in your database.

### 4. Signed uploads (recommended for production)

`GET /api/upload/sign` returns `{ signature, timestamp }` for the upload widget. Set `CLOUDINARY_API_SECRET` in `.env`. For the widget, use `signatureEndpoint: "/api/upload/sign"` (e.g. with `next-cloudinary`’s CldUploadWidget). Store the returned **secure_url** in `Vehicle.images` or `User.avatar`.

---

## Quick reference

| Purpose        | Service   | What to set in `.env`                          |
|----------------|-----------|------------------------------------------------|
| Dev DB         | SQLite    | `DATABASE_URL="file:./dev.db"`                 |
| Production DB  | Neon/Supabase/Vercel/Railway | `DATABASE_URL="postgresql://..."` |
| Images/Upload  | Cloudinary| `NEXT_PUBLIC_CLOUDINARY_*` + `CLOUDINARY_API_SECRET` |

After changing database or adding Cloudinary, run:
- `npx prisma generate`
- For DB URL change: `npx prisma db push` or `npx prisma migrate dev`
