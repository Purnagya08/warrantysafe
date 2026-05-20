# WarrantySafe

A consumer ownership management platform to track warranties, invoices, and repairs.

## Structure
- `frontend/` — Next.js 14 web application
- `backend/` — NestJS REST API

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev        # runs on http://localhost:3000
```

### Backend
```bash
cd backend
npm install
npm run start:dev  # runs on http://localhost:3001
```

## Environment Variables
- `frontend/.env.local` — API URL config
- `backend/.env` — DB, JWT, OpenAI, AWS config
