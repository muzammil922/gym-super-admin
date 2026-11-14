# IronForge Super Admin (Web)

Platform console — **not** part of the Expo mobile app.

## Features

- Login (platform admin only)
- Dashboard across all gyms
- Create gym + **owner admin** (mobile app login: phone + password)
- List gym owners
- Cross-gym invoice list

## Setup

```bash
cd super-admin
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5174](http://localhost:5174)

Set `VITE_API_URL` to your API, e.g. `https://app-gym-api.flowlab.fun/api`

## Backend

Requires migration `20260319000000_platform_admin` and seed:

```bash
cd backend
npx prisma migrate deploy
npm run prisma:seed
```

Default super admin (change in production):

- Email: `superadmin@ironforge.local` or env `PLATFORM_ADMIN_*`
- API: `POST /api/platform/auth/login`

Gym owners use **`POST /api/auth/login`** in the mobile app — not this console.