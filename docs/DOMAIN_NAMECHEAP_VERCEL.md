# Namecheap Domain + Vercel (Bina Hosting) – Website Live Kaise Karein

Aapke paas **Namecheap par domain** hai, **hosting nahi**. Website **Vercel par free** host karke apna domain usse connect kar sakte ho.

---

## Step 1: Vercel Par Website Deploy Karo

1. **https://vercel.com** kholo → Sign up / Login (GitHub se best).
2. **Add New** → **Project**.
3. **Import** your "DVM JAPAN UI" repo (agar GitHub par hai).  
   Ya **Vercel CLI** se:
   ```bash
   npm i -g vercel
   cd "C:\Users\Administrator\Desktop\DVM JAPAN UI"
   vercel
   ```
4. **Environment Variables** zaroor add karo (Settings → Environment Variables):
   - `DATABASE_URL` = Neon wala PostgreSQL URL
   - `JWT_SECRET` = koi strong random string
5. **Deploy** karo. Deploy ke baad URL milega: `https://DVM JAPAN-ui-xxx.vercel.app`

---

## Step 2: Vercel Par Apna Domain Add Karo

1. Vercel dashboard → apna **Project** kholo.
2. **Settings** → **Domains**.
3. **Add** par click karo → apna Namecheap domain likho (e.g. `tumharadomain.com` ya `www.tumharadomain.com`).
4. Vercel tumhe **instructions** dega:  
   - **www** ke liye: CNAME record  
   - **root (tumharadomain.com)** ke liye: A record ya CNAME (Vercel ab `cname.vercel-dns.com` deta hai dono ke liye).

Note jo bhi Vercel "Configure your DNS" mein likhe (hostname, value) woh copy karo — ab Namecheap mein use karenge.

---

## Step 3: Namecheap Par Domain Point Karo (DNS)

1. **https://www.namecheap.com** → Login → **Domain List**.
2. Apne domain ke saamne **Manage** par click karo.
3. **Advanced DNS** tab kholo.
4. **Add New Record** use karke ye add karo (Vercel ke instructions ke mutabiq; normally aise hota hai):

   **Option A – Sirf www use karna (e.g. www.tumharadomain.com):**
   - Type: **CNAME**  
   - Host: **www**  
   - Value: **cname.vercel-dns.com**  
   - TTL: Automatic  
   - Save.

   **Option B – Root domain bhi (tumharadomain.com) Vercel par:**
   - Type: **ALIAS** ya **A Record** (Namecheap pe option naam thode alag ho sakte hain):
     - **ALIAS** ho to: Host **@**, Value **cname.vercel-dns.com**
     - **A Record** ho to: Host **@**, Value **76.76.21.21** (Vercel ka IP; agar Vercel ne koi aur IP di ho to woh use karo)
   - **www** ke liye alag CNAME: Host **www**, Value **cname.vercel-dns.com**

5. Purani **URL Redirect** / **CNAME** records jo conflict karein (e.g. www → kisi aur jagah) unhe **Remove** kar do.
6. **Save** karo. DNS update mein 5 min se 48 hours lag sakte hain (aam tor par 15–30 min).

---

## Step 4: Vercel Par Domain Verify

1. Vercel → Project → **Settings** → **Domains**.
2. Jo domain add kiya hai uske saamne status **"Valid Configuration"** aa jaye to ho gaya.
3. Kabhi kabhi **Refresh** / **Verify** button hota hai — use karo.

---

## Short Checklist

| Step | Kya karna hai |
|------|----------------|
| 1 | Vercel par project deploy karo (Git/CLI), `DATABASE_URL` + `JWT_SECRET` set karo |
| 2 | Vercel → Settings → Domains → apna Namecheap domain add karo |
| 3 | Namecheap → Advanced DNS → CNAME/ALIAS ya A record Vercel wale values se set karo |
| 4 | 15–30 min wait karo, phir browser mein `https://tumharadomain.com` kholo |

Is tarah **bina Namecheap hosting** ke bhi website **live** ho jayegi; hosting ka kaam Vercel free tier kar lega.
