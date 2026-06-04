# Database Options – Non-Tech Client Ke Liye

Client ko code ya Prisma nahi chahiye – sirf **browser se data dekhna / edit karna**. Ye options use kar sakte ho.

---

## 1. **MongoDB Atlas** (Recommended – aapke paas already hai)

Aapke `.env` mein **MONGODB_URI** already set hai, matlab **MongoDB Atlas** use ho raha hai.

**Client kya karega (koi code nahi):**
1. **https://cloud.mongodb.com** pe jao → apna login use karo (ya aap unko user invite karo).
2. **Database** → apna cluster → **Browse Collections**.
3. Wahan **tables (collections)** dikhengi – vehicles, users, etc.
4. Kisi bhi document (row) pe click karke **view / edit** kar sakte hain. Bilkul form jaisa.

**Faida:** Koi SQL nahi, koi Prisma nahi. Sirf browser + click. Free tier kaafi hai.

**Invite non-tech user:** Atlas → Project → **Access Management** → **Invite User** (unka email) → role "Read and write to any database" ya "Atlas Admin" (jitna dena ho).

---

## 2. **Supabase** (Agar table / Excel jaisa UI chahiye)

- **supabase.com** – free signup.
- **PostgreSQL** behind the scenes, lekin dashboard **Excel jaisa**: Table view, add row, edit cell.
- Client ko **Project URL** + **password** do → **Table Editor** mein sab data dikhega.
- Agar aap app mein Supabase use karna chahte ho to Prisma ko Supabase Postgres URL se connect kar sakte ho (same as Neon); client ko sirf Supabase dashboard use karna hai.

**Faida:** Bahut clean UI, non-tech ko samajhne mein easy.

---

## 3. **Airtable** (Sabse simple – spreadsheet jaisa)

- **airtable.com** – literally **spreadsheet** in cloud.
- Client ko bas Airtable base share karo – columns = fields, rows = records.
- App se connect karne ke liye **Airtable API** use hota hai (code change).

**Faida:** Bilkul Excel jaisa; non-tech sabse jaldi sikh jate hain.  
**Nuqsan:** App side pe Airtable API integrate karni parti hai; abhi project mein nahi hai.

---

## Short Answer

| Client type     | Best option        | Kya karna hai                          |
|-----------------|--------------------|----------------------------------------|
| **Non-tech**    | **MongoDB Atlas**  | Unko Atlas dashboard login karke "Browse Collections" sikhado – **aapke paas already hai** |
| Table/Excel UI | **Supabase**       | Naya project banao, client ko Table Editor do |
| Sirf spreadsheet | **Airtable**     | Base banao, share karo; app ke liye API add karni hogi |

**Recommendation:** Pehle **MongoDB Atlas** hi use karo – already configured hai. Client ko sirf **cloud.mongodb.com** → Database → **Browse Collections** use karna sikhado. Koi naya database ya Prisma change ki zaroorat nahi.
