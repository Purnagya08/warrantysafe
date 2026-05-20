# WarrantySafe Backend

Express, Prisma, and PostgreSQL API for WarrantySafe.

## Setup

```bash
npm install
cp .env.example .env
```

Update `.env` with your PostgreSQL connection string and JWT secret.

## Database

```bash
npm run db:generate
npm run db:migrate
```

## Development

```bash
npm run dev
```

The API defaults to `http://localhost:5000`.

## Scripts

- `npm run dev` starts the API with nodemon.
- `npm start` starts the API with Node.
- `npm run db:migrate` runs Prisma migrations.
- `npm run db:generate` generates Prisma Client.
- `npm run db:studio` opens Prisma Studio.
