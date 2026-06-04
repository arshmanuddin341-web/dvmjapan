# Vercel par env vars – Copy-paste checklist

Yeh file khol ke Vercel "Environment Variables" wale section mein ye add karo.  
**Value** wali cheezein apne `.env` se copy karo (yahan paste mat karo – sirf apne Vercel form mein).

---

## 1. DATABASE_URL

- **Name:** `DATABASE_URL`
- **Value:** Apne Neon ka connection string (`.env` mein jo hai wohi)
- Example shape: `postgresql://neondb_owner:xxxx@ep-xxxx.neon.tech/neondb?sslmode=require`

---

## 2. JWT_SECRET

- **Name:** `JWT_SECRET`
- **Value:** Koi strong random string (20–30 characters). Agar `.env` mein hai to wohi use karo.

---

## Steps (Vercel par)

1. **Environment Variables** section expand karo.
2. **Key** = `DATABASE_URL`, **Value** = (Neon URL paste) → Add.
3. **Key** = `JWT_SECRET`, **Value** = (apna secret paste) → Add.
4. **Deploy** click karo.

Bas itna aapko karna hai – baaki Vercel khud build kar lega.
