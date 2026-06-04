# PostgreSQL Setup (Local – Docker)

Project Prisma **PostgreSQL** use karta hai. Local dev ke liye Docker se DB chala sakte ho.

## 1. Docker install karo

- [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) download karo, install karo, aur open karo (Docker running hona chahiye).

## 2. PostgreSQL start karo

Project root pe (jahan `docker-compose.yml` hai):

```bash
docker-compose up -d
```

Ye `DVM JAPAN` database ke saath PostgreSQL port **5432** pe start karega.

## 3. `.env` mein DATABASE_URL set karo

Apni **`.env`** file mein ye line add/update karo (agar pehle `file:./dev.db` ya kuch aur tha to replace karo):

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/DVM JAPAN"
```

## 4. Prisma migrate chalao

```bash
npx prisma migrate dev --name add_content
```

(Pehli bar sab migrations run honge; baad mein sirf naye.)

## 5. (Optional) Prisma Studio – DB dekhne ke liye

```bash
npx prisma studio
```

Browser mein tables dekh sakte ho / edit kar sakte ho.

---

**Stop DB:** `docker-compose down`  
**Logs dekhna:** `docker-compose logs -f db`
