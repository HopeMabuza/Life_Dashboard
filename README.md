# Life Dashboard

A personal life tracking dashboard built with React, Node.js, and PostgreSQL. Sign in with your crypto wallet — no email or password needed.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Auth | WalletConnect (wagmi + Web3Modal) |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma |

## Features

- **Today** — manage tasks by life area and priority, log daily habits
- **Weekly** — answer 5 reflection prompts to review your week
- **Monthly** — set goals per life area and track progress with sliders
- **Progress** — charts and stats across all areas

## Life Areas

Health · Work · Growth · Finance · Relationships

---

## Prerequisites

- Node.js 18+
- PostgreSQL (see setup below)
- A WalletConnect Project ID → [cloud.walletconnect.com](https://cloud.walletconnect.com)

---

## PostgreSQL Setup (WSL/Ubuntu)

```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo service postgresql start
sudo -u postgres psql -c "CREATE DATABASE life_dashboard;"
sudo -u postgres psql -c "CREATE USER dashboard_user WITH PASSWORD 'dashboard123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE life_dashboard TO dashboard_user;"
```

> You'll need to run `sudo service postgresql start` each time you restart WSL.

---

## Getting Started

### 1. Backend

```bash
cd backend
cp .env.example .env
```

Fill in `.env`:
```env
DATABASE_URL="postgresql://dashboard_user:dashboard123@localhost:5432/life_dashboard"
JWT_SECRET="run: openssl rand -hex 32"
PORT=3001
```

```bash
npm install
npm run db:push   # creates all tables in PostgreSQL
npm run dev       # starts on http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
```

Fill in `.env`:
```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

```bash
npm install
npm run dev       # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and connect your wallet.

---

## Project Structure

```
Life_Dashboard/
├── frontend/                 # React app
│   └── src/
│       ├── components/       # layout + reusable UI
│       ├── views/            # Today, Weekly, Monthly, Progress
│       ├── hooks/            # useAuth
│       └── lib/              # wagmi config, axios API calls
├── backend/                  # Express API
│   ├── routes/               # auth, tasks, habits, goals, reflections
│   ├── middleware/           # JWT auth guard
│   └── prisma/               # database schema
└── Docs/                     # personal reference docs (gitignored)
```

## Useful Commands

```bash
# Browse your database in a visual UI
cd backend && npm run db:studio   # opens at http://localhost:5555

# Generate a secure JWT secret
openssl rand -hex 32
```
