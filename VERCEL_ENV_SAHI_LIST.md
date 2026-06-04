# Vercel par kaunsi env vars add karein (sahi list)

## ✅ Zaroor add karo (ya pehle se add hon)

| Key | Value | Note |
|-----|--------|------|
| `DATABASE_URL` | **Neon wala PostgreSQL URL** | ❌ `.env` wala `file:./dev.db` mat use karo – sirf Neon URL |
| `JWT_SECRET` | `12178529db2e3c6cfd6ab6c95c120b3b` | Same as .env |
| `JWT_EXPIRE` | `7d` | Optional |

---

## ✅ Agar Cloudinary use karte ho (images / upload)

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dxxurk65j` |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | `334649887686268` |
| `CLOUDINARY_API_SECRET` | `6n6MMomJr3vZVSm0HmQuDxWdi_U` |

---

## ✅ Agar MongoDB se login use karte ho (production)

| Key | Value |
|-----|--------|
| `MONGODB_URI` | `mongodb+srv://auctionadmin:StrongPassword123!@cluster0.934a7ee.mongodb.net/carauction?retryWrites=true&w=majority` |

(Next.js app `MONGODB_URI` use karta hai – isi name se add karo.)

---

## ⚠️ Sirf agar Next.js app se email bhejte ho

| Key | Value |
|-----|--------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `hassanuddintw@gmail.com` |
| `SMTP_PASS` | `vvhijyayowvxtizc` |
| `EMAIL_FROM_NAME` | `Car Auction` |
| `EMAIL_FROM_ADDRESS` | `hassanuddintw@gmail.com` |

---

## ❌ Vercel par mat add karo / change karo

| Key | Kyun |
|-----|------|
| `DATABASE_URL="file:./dev.db"` | Vercel pe SQLite nahi chalti – sirf Neon URL use karo |
| `NODE_ENV` | Vercel khud set karta hai (production) |
| `PORT` | Vercel khud set karta hai |
| `FRONTEND_URL` | Local: localhost. Production: apna domain (e.g. `https://tumharadomain.com`) |
| `CORS_ORIGIN` | Same – production URL use karo, localhost nahi |
| `NEXT_PUBLIC_API_URL` | Agar alag backend nahi hai to chhod do ya Vercel URL |
| `BACKEND_URL` | Same – sirf agar Express alag host par ho |

---

## Short

- **Minimum:** `DATABASE_URL` (Neon) + `JWT_SECRET` – bas ye bhi kaafi hain deploy ke liye.
- **Better:** Upar wale + Cloudinary + (optional) MongoDB + (optional) SMTP.
- **Kabhi bhi** `.env` ka poora content copy-paste mat karo – `file:./dev.db` aur localhost wale production par galat hain.
