# 💊 Pharmacist Rota & Pharmacy Visit Planner

> **AI-Driven Demo Application** for managing pharmacist schedules and pharmacy visits with random assignment algorithm.

## 🎯 What This Demo Does

This application demonstrates a pharmacist rota (rotation) management system:

- **HR** can manage pharmacists, pharmacies, daily availability, and generate random visit plans
- **Managers** can view and export daily plans
- **Pharmacists** can see their assigned pharmacies for the day and mark visits as Done/Skipped

### ⚠️ What's Mocked/Simulated

- **AI Optimization**: Uses simple random round-robin assignment (`random-v1` algorithm) instead of real AI/optimization
- **Loop Allocate Integration**: Simulated by the HR availability screen (this would normally integrate with an external system)
- **Pharmacist-User Link**: Basic name matching to associate pharmacist records with user accounts

---

## 🚀 Quick Start

### Prerequisites

- **PHP 8.1+** with extensions: pdo_sqlite, mbstring, openssl
- **Composer** (PHP package manager)
- **Node.js 18+** and npm

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Create SQLite database
touch database/database.sqlite

# Run migrations and seed demo data
php artisan migrate --seed

# Start server
php artisan serve
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| HR | hr@demo.com | Password123! |
| Manager | manager@demo.com | Password123! |
| Pharmacist | pharm@demo.com | Password123! |

---

## 📁 Project Structure

```
├── backend/                # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/    # API controllers
│   │   ├── Models/              # Eloquent models
│   │   └── Http/Middleware/     # Role middleware
│   ├── database/
│   │   ├── migrations/          # DB schema
│   │   └── seeders/             # Demo data
│   └── routes/api.php           # API routes
│
└── frontend/               # React + Vite
    └── src/
        ├── components/          # Reusable UI
        ├── context/             # Auth context
        ├── pages/               # Route pages
        └── services/            # API client
```

---

## 🔌 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/login | Public | Login |
| POST | /api/logout | Auth | Logout |
| GET | /api/user | Auth | Current user |
| * | /api/pharmacists | HR | CRUD pharmacists |
| * | /api/pharmacies | HR | CRUD pharmacies |
| GET/POST | /api/availability | HR | Daily availability |
| POST | /api/plans/generate | HR | Generate plan |
| GET | /api/plans | HR/Manager | View plans |
| GET | /api/plans/my-today | Pharmacist | My today's plan |
| PATCH | /api/plan-items/{id} | HR/Pharmacist | Update status |
| GET | /api/plans/export | HR/Manager | Export CSV/JSON |

---

## 🎲 Random Assignment Algorithm (v1)

The current plan generation uses a simple approach:

1. Get all pharmacists with "Available" status for the date
2. Get all active pharmacies
3. Shuffle pharmacies randomly
4. Round-robin assign pharmacies to pharmacists evenly

**Future**: Replace with real optimization considering:
- Geographic routing
- Pharmacist specializations
- Visit time windows
- Travel time minimization

---

## 📄 License

MIT - Demo purposes only
