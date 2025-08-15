# Beat the Bet

Beat the Bet is an experimental Next.js application for exploring sports betting
utilities such as schedule management, user profiles and simple admin tooling.
The project uses Prisma with a Postgres database and Supabase for
authentication.

## Environment variables

Create a `.env` file and provide the following keys:

```
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DBNAME"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="public-anon-key"
SUPABASE_SERVICE_ROLE_KEY="service-role-key"
```

## Setup

```bash
npm install
npx prisma migrate dev
npm run dev
```

### Seeding

The project ships with a seed script that inserts a demo NRL season, teams and
rounds. Run it after the initial migration:

```bash
npx prisma db seed
```

## Roles and admin access

Profiles include a `role` field (`USER` or `ADMIN`).
Users with the `ADMIN` role gain access to `/dashboard/admin` where management
interfaces live. The admin user menu link and sidebar entries appear only for
admins.

## MVP roadmap

- Record and display NRL fixtures and results.
- Basic betting predictions for users.
- Admin tools for managing games and users.
- Newsletter sign‑up for product updates.

This repository is a work in progress; contributions and feedback are welcome.
