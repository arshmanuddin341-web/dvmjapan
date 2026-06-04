# Google Sign-In Setup (Login pe click → Google pe redirect)

## Step 1: Google Cloud Console

1. Browser mein jao: **https://console.cloud.google.com/**
2. Apna project select karo ya **New Project** banao (e.g. "DVM JAPAN").
3. Left sidebar → **APIs & Services** → **Credentials**.

## Step 2: OAuth consent screen (pehli baar / "Access blocked: org_internal" fix)

**Important:** Naya OAuth client banane se **org_internal** nahi jata. Ye setting **OAuth consent screen** pe hoti hai (alag page).

1. **https://console.cloud.google.com/** → apna **project** select karo (jahan DVM JAPAN OAuth client hai).
2. Left sidebar → **APIs & Services** → **OAuth consent screen** (Credentials pe mat jao, consent screen pe jao).
3. Agar page pe **"User type: Internal"** dikhe:
   - **"MAKE EXTERNAL"** button dhundho (page ke upar/ side) aur click karo.  
   - Confirm karo. Ab app **External** ho jayegi — personal Gmail (e.g. jenniferjcastro4@gmail.com) use kar sakti hai.
4. Agar pehli baar setup ho raha ho: **User Type** mein **"External"** choose karo → **Create**.
5. App name (e.g. "DVM JAPAN"), support email → **Save and Continue** → Scopes → **Save and Continue**.
6. **Test users:** Status "Testing" hone par **Add users** se woh Gmail add karo jis se login karna hai (e.g. `jenniferjcastro4@gmail.com`) → **Save and Continue**.
7. Browser refresh karo, phir site pe ja kar **Sign in with Google** dubara try karo.

**Agar "MAKE EXTERNAL" option nahi dikhe:** Ho sakta hai project kisi **Google Workspace organization** ke andar ho. Us case mein:
- Naya **Google Cloud project** banao (personal Gmail se login karke, Workspace wale org se alag), usme OAuth consent screen **External** se start karo, aur naya OAuth client + redirect URI add karo; ya
- Apne org admin se poochho ke OAuth consent screen ko External allow kare.

## Step 3: OAuth 2.0 Client ID banao

1. **Credentials** → **+ Create Credentials** → **OAuth client ID**.
2. **Application type:** "Web application".
3. **Name:** e.g. "DVM JAPAN Web".
4. **Authorized redirect URIs** mein ye add karo – **bilkul yahi copy-paste karo** (no https, no trailing slash):
   ```
   http://localhost:5000/api/auth/google/callback
   ```
   - `https` mat use karo – sirf `http`
   - end pe `/` mat lagao
   - `127.0.0.1` mat use karo – sirf `localhost`
   Production ke liye baad mein apna domain add kar sakte ho, e.g. `https://yoursite.com/api/auth/google/callback`.
5. **Create** → popup mein **Client ID** aur **Client secret** dikhenge. Dono copy karo.

## Step 4: Backend `.env` mein daalo

`backend` folder ki `.env` file open karo aur ye add/update karo:

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

- `GOOGLE_CLIENT_ID` = Client ID (long string, `.apps.googleusercontent.com` ke sath).
- `GOOGLE_CLIENT_SECRET` = Client secret (jaise "GOCSPX-...").

## Step 5: Backend restart karo

```bash
cd backend
npm run dev
```

## Flow (kaise kaam karta hai)

1. User login page pe **Google** button pe click karta hai.
2. Backend use ko **Google** pe redirect karta hai.
3. User Google pe sign up / sign in karta hai.
4. Google use wapas backend pe bhejta hai (`/api/auth/google/callback`).
5. Backend user ko create/update karta hai, JWT banata hai, phir use **frontend** pe `/auth/callback?token=...` pe bhejta hai.
6. Frontend token save karta hai aur user ko dashboard pe le jata hai.

## Zaroori baatein

- **Backend chalna chahiye** (port 5000) jab user Google button click kare.
- Redirect URI **exact** hona chahiye: `http://localhost:5000/api/auth/google/callback` (http, no trailing slash).
- Agar MongoDB na ho to backend OAuth callback fail ho sakta hai; MongoDB connect karo ya backend wale fix use karo.
