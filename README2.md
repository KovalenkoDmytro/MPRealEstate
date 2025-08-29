# Notification Queue — Run Workers in Production

Notifications and emails should be processed **asynchronously** in production to avoid blocking user requests.  
We will use **Redis + Horizon** for scaling and monitoring.

---

## Environment Setup

```env
QUEUE_CONNECTION=redis
REDIS_CLIENT=phpredis   # or predis
```

---

## Install & Configure

```bash
composer require predis/predis laravel/horizon
php artisan horizon:install
php artisan migrate
```

---

## Running Workers

### With Horizon (recommended)
Start Horizon inside your container or server:

```bash
php artisan horizon
```

**Daemonize with Supervisor (non-Docker)**:
```
[program:horizon]
command=php /var/www/html/artisan horizon
numprocs=1
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/www/html/storage/logs/horizon.log
```

Apply config:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start horizon
```

### Docker Compose (alternative)
Add a Horizon service or run as background process:
```yaml
services:
  horizon:
    build: .
    command: php artisan horizon
    depends_on:
      - redis
```

---

## Queue Mapping (optional)

If you want to split jobs by channel:

```php
public function viaQueues(): array
{
    return [
        'mail'     => 'emails',
        'database' => 'default',
    ];
}
```

---

## Deploy Hooks

After each deploy or env/config change:

```bash
php artisan migrate --force
php artisan horizon:publish    # if config changed
php artisan horizon:terminate  # restart gracefully
php artisan config:cache
```

---

## Monitoring & Recovery

- Horizon dashboard: `/horizon` (protect with admin auth)
- List failed jobs:
  ```bash
  php artisan queue:failed
  ```
- Retry failed:
  ```bash
  php artisan queue:retry all
  ```
- Clear failed:
  ```bash
  php artisan queue:flush
  ```

---

## Test Plan

1. Trigger a notification/email (implements `ShouldQueue`).
2. Confirm request returns immediately (not blocked by email send).
3. In Horizon UI, verify job appears then completes.
4. Stop Horizon → trigger another notification → job stays pending.
5. Restart Horizon → pending job is processed.

---

## Acceptance Criteria

- [ ] `QUEUE_CONNECTION=redis` configured in production
- [ ] Horizon running under Supervisor or Docker container
- [ ] Notifications/emails are queued (non-blocking)
- [ ] `/horizon` dashboard is available to admins
- [ ] Runbook documents restart (`horizon:terminate`) and recovery (`queue:retry`)
