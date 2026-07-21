# Tracker

A personal weekly productivity dashboard. Sign in with your crypto wallet — no email or password needed.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Auth | WalletConnect (wagmi + Web3Modal) |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma |

## Features

- **Tasks** — add tasks with day-of-week filter, priority, and description
- **Reflect** — 5-prompt weekly journal
- **Overview** — progress bars showing weekly completion by day
- **Wallet auth** — connect any wallet, sign a message, you're in
- **Mobile friendly** — bottom tab nav, responsive layout

---

## Quick Start

### 1. PostgreSQL (first time only)

```bash
sudo apt update && sudo apt install -y postgresql postgresql-contrib
sudo service postgresql start
sudo -u postgres psql -c "CREATE DATABASE life_dashboard;"
sudo -u postgres psql -c "CREATE USER dashboard_user WITH PASSWORD 'dashboard123';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE life_dashboard TO dashboard_user;"
sudo -u postgres psql -d life_dashboard -c "GRANT ALL ON SCHEMA public TO dashboard_user;"
sudo -u postgres psql -d life_dashboard -c "ALTER DATABASE life_dashboard OWNER TO dashboard_user;"
```

> Run `sudo service postgresql start` each time you restart WSL.

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in JWT_SECRET and DATABASE_URL
npm install
npm run db:push        # creates all tables
npm run dev            # starts on http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # add your WalletConnect Project ID
npm install
npm run dev            # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and connect your wallet.

---

## Environment Variables

**`backend/.env`**
```env
DATABASE_URL="postgresql://dashboard_user:dashboard123@localhost:5432/life_dashboard"
JWT_SECRET="run: openssl rand -hex 32"
PORT=3001
```

**`frontend/.env`**
```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

---

## Project Structure

```
Life_Dashboard/
├── frontend/               React app (Vite + Tailwind)
│   └── src/
│       ├── components/     Button, Card, Badge, Sidebar, BottomNav, TopBar
│       ├── views/          ConnectView, TasksHomeView, ReflectView, OverviewView
│       ├── hooks/          useAuth (wallet → JWT)
│       └── lib/            wagmi config, axios API client
├── backend/                Express API
│   ├── routes/             auth, tasks, habits, goals, reflections
│   ├── middleware/         JWT guard
│   └── prisma/             schema + DB migrations
└── Docs/                   personal reference (gitignored)
```

## Useful Commands

```bash
# Visual database browser
cd backend && npm run db:studio   # http://localhost:5555

# Generate a secure JWT secret
openssl rand -hex 32
```
