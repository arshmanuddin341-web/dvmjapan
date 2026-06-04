# Deploy DVM JAPAN UI on Vercel

Website ko **Vercel** par deploy karne ke steps. Production ke liye **PostgreSQL** use karna hoga (SQLite Vercel serverless par support nahi hai).

---

## 1. Database – PostgreSQL setup (zaroori)

Vercel par SQLite nahi chalti. Free PostgreSQL ke liye:

- **Neon** (recommended): https://neon.tech → Sign up → New Project → copy **Connection string**.
- Ya **Supabase**: https://supabase.com → Project → Settings → Database → **Connection string** (URI).
- Ya **Vercel Postgres**: Vercel dashboard → Storage → Create Database → Postgres.

Example URL:
```text
postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### Prisma schema production ke liye

**Option A – Sirf production ke liye Postgres:**  
Apne `prisma/schema.prisma` mein datasource abhi `sqlite` hai. Production deploy se pehle ise **postgresql** par change karo:

1. `prisma/schema.prisma` open karo.
2. Ye lines:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Isse replace karo:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Save karo.

**Option B – Local dev SQLite, production Postgres:**  
Agar abhi bhi local par SQLite use karna hai to alag branch ya alag `schema.prisma` copy use karke production ke liye postgres wala use karo; ya doc follow karke env se provider switch nahi hota, isliye Option A sabse simple hai.

Pehli baar Postgres use kar rahe ho to migrations run karo (Neon/Supabase DB empty honi chahiye):

```bash
npx prisma migrate deploy
```

Agar migrations nahi bana rakkhe to:

```bash
npx prisma db push
```

---

## 2. Vercel par project deploy karna

### A. Vercel account

1. https://vercel.com par jao.
2. **Sign up** / **Log in** (GitHub se link karna best hai).

### B. New Project from Git

1. **Add New** → **Project**.
2. GitHub repo connect karo (agar code GitHub par hai) ya **Import Git Repository** se "DVM JAPAN UI" repo select karo.
3. **Root Directory** same rakho (empty ya `./`).
4. **Framework Preset**: Next.js auto detect ho jana chahiye.
5. **Build Command**: `prisma generate && next build` (ya Vercel default `next build` – `vercel.json` mein bhi set hai).
6. **Output Directory**: khali (Next.js default).

### C. Environment variables (zaroori)

Vercel project → **Settings** → **Environment Variables** mein ye add karo. **Production** (aur agar chaho to Preview) select karke save karo.

| Name | Value | Notes |
|------|--------|--------|
| `DATABASE_URL` | `postgresql://...` | Neon/Supabase/Vercel Postgres connection string (jisme `?sslmode=require` ho). |
| `JWT_SECRET` | koi strong random string | Production ke liye zaroor; e.g. `openssl rand -base64 32` se banao. |

Optional (jaise need ho):

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (agar alag backend use ho). |
| `BACKEND_URL` | Same backend URL. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (upload sign ke liye). |
| `MONGODB_URI` | Agar MongoDB auth use karte ho. |

**.env** ya koi secret file Vercel par upload **mat** karo; sirf **Environment Variables** use karo.

---

## 3. Deploy

### Option 1: Vercel Dashboard (recommended)

1. **Deploy** button dabao.
2. Pehli build mein `prisma generate` + `next build` chalega.
3. Agar build fail ho to **Deployments** → us deployment par click → **Building** logs dekho. Common issues:
   - `DATABASE_URL` missing → env var add karo.
   - Prisma error → `prisma/schema.prisma` mein `provider = "postgresql"` aur sahi URL check karo.
   - `JWT_SECRET` missing → add karo (app chal jati hai but production ke liye recommended).

### Option 2: CLI se deploy

```bash
npm i -g vercel
vercel login
cd "c:\Users\Administrator\Desktop\DVM JAPAN UI"
vercel
```

Pehli baar poochega: Link to existing project? **N** → Project name → Directory `.` → env vars baad mein Vercel dashboard se add kar lena. Production deploy ke liye: `vercel --prod`.

---

## 4. Deploy ke baad

- URL milega: `https://your-project.vercel.app`.
- Custom domain: **Settings** → **Domains** se add kar sakte ho.
- **File-based auth** (`data/auth-users.json`) Vercel serverless par **persist nahi** hoti (har request alag instance). Isliye production mein:
  - Ya to **MongoDB** use karo (`MONGODB_URI` set karke),  
  - Ya backend (Express) ko alag host par deploy karke `NEXT_PUBLIC_API_URL` / `BACKEND_URL` set karo.

---

## 5. Short checklist

- [ ] PostgreSQL DB bana li (Neon/Supabase/Vercel Postgres).
- [ ] `prisma/schema.prisma` mein `provider = "postgresql"` kar diya.
- [ ] `npx prisma migrate deploy` ya `npx prisma db push` run kiya.
- [ ] Vercel par repo connect kiya.
- [ ] `DATABASE_URL` aur `JWT_SECRET` (aur zaroori env vars) Vercel Environment Variables mein add kiye.
- [ ] Deploy run kiya; build green ho.

Iske baad website **100% deploy** ho chuki hogi; baaki (auth persistence, custom domain) need ke hisaab se kar sakte ho.
