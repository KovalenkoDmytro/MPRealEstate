# MPRealEstate

A real estate platform built with **Laravel 12**, **React 19**, **TypeScript**, and **Inertia.js v3**. Role-based access for Buyers, Sellers, Lawyers, and Admins with a full deal workflow (Offer → Deposit → Condition Day → Possession Day).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12, PHP 8.3, Inertia.js v3 |
| Frontend | React 19, TypeScript, Inertia.js v3, MUI v7, Vite 6 |
| Database | MySQL 8.2 |
| Cache / Queue | Redis 7 + Laravel Horizon |
| Maps | Mapbox GL + `@mapbox/search-js-react` |
| Auth / Roles | Laravel Breeze + `spatie/laravel-permission` |
| Dev Server | Docker + nginx (port 8000) |

---

## Requirements

- Docker Desktop
- Node.js 20+ & npm
- PHP 8.3+ (inside Docker — no local install needed for running)

---

## Project Structure

```
MPRealEstate/
├── laravel/          ← Laravel 12 app (PHP backend + React/TS frontend)
│   ├── app/
│   ├── resources/js/ ← React 19 + TypeScript + Inertia.js pages & components
│   └── ...
├── docker/           ← Docker Compose configuration
│   └── docker-compose.yaml
└── README.md
```

---

## Docker Services

| Service | Container | Purpose | Port |
|---|---|---|---|
| `php` | mprealestate-php | Laravel app + PHP-FPM | — |
| `nginx` | mprealestate-nginx | Web server | 8000 |
| `mysql` | mprealestate-mysql | MySQL 8.2 | 3316 |
| `redis` | mprealestate-redis | Cache + queues | 6379 |

---

## Setup

```bash
# 1. Copy environment file
cp laravel/.env.example laravel/.env

# 2. Start Docker services
cd docker && docker compose up -d

# 3. Install PHP dependencies
docker compose exec php composer install

# 4. Generate app key
docker compose exec php php artisan key:generate

# 5. Run migrations with seeders
docker compose exec php php artisan migrate --seed

# 6. Install Node dependencies and start dev server
cd ../laravel && npm install && npm run dev
```

Open **http://localhost:8000** in your browser.

---

## Common Commands

```bash
# Start services
cd docker && docker compose up -d

# Stop services
cd docker && docker compose down

# Artisan
cd docker && docker compose exec php php artisan <command>

# Composer
cd docker && docker compose exec php composer <command>

# Run migrations
cd docker && docker compose exec php php artisan migrate

# Fresh migrations with seeders
cd docker && docker compose exec php php artisan migrate:fresh --seed

# Run tests (Pest)
cd docker && docker compose exec php php artisan test

# Fix code style (Pint)
cd docker && docker compose exec php ./vendor/bin/pint

# Frontend dev server (run from laravel/)
cd laravel && npm run dev

# Frontend build
cd laravel && npm run build
```

---

## Queue Workers

Notifications are processed asynchronously via **Redis queues**.

```bash
# Start the queue worker
cd docker && docker compose exec php php artisan queue:work

# List failed jobs
docker compose exec php php artisan queue:failed

# Retry all failed
docker compose exec php php artisan queue:retry all

# Clear failed queue
docker compose exec php php artisan queue:flush
```

---

## Environment — Key Variables

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel_db
DB_USERNAME=laravel
DB_PASSWORD=password

REDIS_HOST=redis
QUEUE_CONNECTION=redis

VITE_APP_NAME=MPRealEstate
VITE_MAPBOX_TOKEN=your_mapbox_token
```

---

## License

MIT
