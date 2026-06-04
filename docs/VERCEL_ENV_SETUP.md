# Vercel Environment Variables – Setup

Production (DVM JAPANgroup.com) pe site theek chalne ke liye Vercel pe ye **Environment Variables** add karo.

## Steps

1. **Vercel** pe jao: https://vercel.com  
2. **DVM JAPANs-projects** → **DVM JAPAN-website** open karo  
3. **Settings** → **Environment Variables**  
4. Neeche diye **Name** aur **Value** add karo (Environment: **Production** select karo)

---

## 1. Admin login (Super Admin)

| Name | Value |
|------|--------|
| `SUPER_ADMIN_EMAIL` | `karim@DVM JAPANgroup.com` |
| `SUPER_ADMIN_PASSWORD` | `Admin1234` |

---

## 2. JWT (auth token – 401 Unauthorized fix)

| Name | Value |
|------|--------|
| `JWT_SECRET` | Koi strong random string (e.g. 32+ characters) |

Bina iske admin panel me **401 Unauthorized** aata hai. Set karne ke baad **production pe dobara login** karo (DVM JAPANgroup.com/login).

---

## 3. Cloudinary (vehicle image upload – Admin → Add Vehicle)

Pehle https://cloudinary.com pe free account banao, phir Dashboard se ye values lo.

| Name | Value | Kahan se |
|------|--------|----------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Apna cloud name | Cloudinary Dashboard → Account |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | API Key | Cloudinary Dashboard → API Keys |
| `CLOUDINARY_API_SECRET` | API Secret | Cloudinary Dashboard → API Keys |

---

## 4. Database (admin + vehicles ke liye zaroori)

Agar admin login aur vehicles kaam karein (aur console me **401** / **500** na aaye) to **PostgreSQL** set karo.

| Name | Value |
|------|--------|
| `DATABASE_URL` | `postgresql://user:password@host:5432/dbname?sslmode=require` |

**Important:** DB create karne ke baad **migrations** zaroor chalao, warna tables nahi banege aur 401/500 aayega:

```bash
# Local se (DATABASE_URL production DB ka set karke)
set DATABASE_URL=postgresql://...
npx prisma migrate deploy
```

Neon / Supabase / Vercel Postgres use kar sakte ho.

---

## Save ke baad

- **Save** karo  
- **Redeploy** karo: Deployments → latest → ⋯ → **Redeploy**  
  (Nayi env vars tab hi load hoti hain jab redeploy ho)

---

## Short checklist

- [ ] `SUPER_ADMIN_EMAIL` = karim@DVM JAPANgroup.com  
- [ ] `SUPER_ADMIN_PASSWORD` = Admin1234  
- [ ] `JWT_SECRET` = strong random string (admin login ke liye zaroori – bina iske 401 aata hai)  
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`  
- [ ] `NEXT_PUBLIC_CLOUDINARY_API_KEY`  
- [ ] `CLOUDINARY_API_SECRET` (upload sign ke liye – bina iske image upload fail)  
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` = 447426109211 (green WhatsApp button)  
- [ ] `DATABASE_URL` (admin + vehicles ke liye – bina iske 401/500 a sakte hain) + `prisma migrate deploy`  

Ye karne ke baad admin login aur Add Vehicle → Cloudinary upload dono kaam karenge. Env change ke baad **Redeploy** zaroor karo.
