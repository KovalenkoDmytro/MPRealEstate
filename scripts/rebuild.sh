#!/usr/bin/env bash
set -euo pipefail

LARAVEL_DIR="/var/www/MPRealEstate/laravel"

echo "==> Installing Node dependencies..."
cd "$LARAVEL_DIR"
npm ci

echo "==> Building frontend assets..."
npm run build

echo "==> Clearing application cache..."
php artisan optimize:clear

echo "==> Optimizing application..."
php artisan optimize

echo "==> Done. Frontend rebuilt and backend optimized."
