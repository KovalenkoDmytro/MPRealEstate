#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="/var/www/MPRealEstate"
LARAVEL_DIR="$PROJECT_ROOT/laravel"

echo "==> Pulling latest changes..."
cd "$PROJECT_ROOT"
git pull origin "$(git rev-parse --abbrev-ref HEAD)"

echo "==> Installing PHP dependencies..."
cd "$LARAVEL_DIR"
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "==> Done. Project updated."
echo ""
echo "    Run migrations manually if needed:"
echo "    php artisan migrate --force"
