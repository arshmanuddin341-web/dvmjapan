# DVM JAPAN Backend

Backend APIs built with Next.js API Routes, Prisma, and SQLite.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Database**
   - `.env` should have `DATABASE_URL="file:./dev.db"`
   - Create tables: `npm run db:push`
   - Seed data: `npm run db:seed`

3. **Run**
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- `POST /api/auth/login` — Login (email, password) → { user, token }
- `POST /api/auth/register` — Register (name, email, password) → { user, token }
- `GET /api/auth/me` — Current user (requires `Authorization: Bearer <token>`)

### Vehicles
- `GET /api/vehicles` — List (query: page, limit, make, fuelType, transmission)
- `GET /api/vehicles/[id]` — Get by id or stockId
- `PUT /api/vehicles/[id]` — Update (admin)
- `DELETE /api/vehicles/[id]` — Delete (admin)

### Inquiries
- `POST /api/inquiries` — Submit contact form
- `GET /api/inquiries` — List (admin only)

### Auctions
- `GET /api/auctions` — List live auction listings

## Demo Credentials

- **Admin:** admin@DVM JAPAN.com / admin123
- **User:** Register via /register

## Database

- **SQLite** for development (`prisma/dev.db`)
- For production: Use PostgreSQL and set `DATABASE_URL` in env
- `npm run db:studio` — Open Prisma Studio to browse data
