# MPRealEstate — Codex Configuration

## Codex-Specific Behavior

- Use available Skills for Laravel code style, testing, architecture, Inertia, DevOps
- If a Skill applies, prefer it over repeating rules here

## IMPORTANT

1. Before writing any code, describe your approach and wait for approval.
2. If requirements are ambiguous, ask clarifying questions before writing code.
3. After finishing code, list edge cases and suggest test cases.
4. If a task requires changes to more than 3 files, stop and break it into smaller tasks.
5. When there's a bug, start by writing a test that reproduces it, then fix it.
6. Every time I correct you, reflect on what went wrong and plan to prevent it.

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

## Task Management

1. **Plan First**: Write plan to `docs/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `docs/todo.md`
6. **Capture Lessons**: Update `docs/lessons.md` after corrections

## Agent Dispatch (MANDATORY)

- **ALWAYS** follow the agent pipeline defined in `.Codex/rules/workflow.md`
- **ALWAYS** run independent pipeline steps in parallel (e.g., Security Scanner + QA + Tester can run simultaneously after Developer completes)
- **ALWAYS** autonomously determine which agents from `.Codex/agents/` should execute each part of the user's task — do NOT ask the user which agent to use
- Available agents: `ba`, `developer`, `frontend`, `tester`, `qa`, `reviewer`, `debugger`, `security-scanner`, `dba`, `ddd-architect`, `filament`, `devops`, `ci-cd-engineer`, `integration-architect`, `laravel-refactoring-expert`, `queue-specialist`, `docs-writer`
- For every non-trivial task: analyze → select agents → dispatch in parallel where possible → collect results → verify

## Rules (auto-loaded from `.Codex/rules/`)

- `code-style.md` — PHP strict types, Eloquent conventions, code quality tools
- `architecture.md` — Actions pattern, Inertia.js, domain organization, database patterns
- `testing.md` — Pest, model testing policy, test structure
- `git-operations.md` — Commit/push rules, PR description format
- `workflow.md` — Agent pipeline: BA → Developer → Tester → Security → QA → DocsWriter

## Build/Configuration Instructions

### System Requirements

- **PHP 8.3+**
- **Node.js 20+**, npm
- **MySQL 8.2**
- **Redis 7**
- **Docker & Docker Compose** (required for development)

### Project Structure

```
MPRealEstate/
├── laravel/          ← Laravel 12 app (PHP backend + React/TS frontend)
│   ├── app/
│   ├── resources/js/ ← React 19 + TypeScript + Inertia.js
│   └── ...
├── docker/           ← Docker Compose configuration
│   └── docker-compose.yaml
└── AGENTS.md
```

### Docker Services

| Service | Container name | Purpose |
|---|---|---|
| `php` | mprealestate-php | Laravel app + PHP-FPM |
| `nginx` | mprealestate-nginx | Web server (port 8000) |
| `mysql` | mprealestate-mysql | MySQL 8.2 (port 3316) |
| `redis` | mprealestate-redis | Cache + queues |

### Common Commands

```bash
# Start all services
cd docker && docker compose up -d

# Run artisan commands
cd docker && docker compose exec php php artisan <command>

# Run composer
cd docker && docker compose exec php composer <command>

# Run migrations
cd docker && docker compose exec php php artisan migrate

# Run tests (Pest)
cd docker && docker compose exec php php artisan test

# Fix code style (Pint)
cd docker && docker compose exec php ./vendor/bin/pint

# Frontend development (run from laravel/)
cd laravel && npm run dev

# Build frontend
cd laravel && npm run build
```

### Frontend Stack

- **React 19** + **TypeScript** + **Inertia.js** (server-driven SPA)
- **Vite 6** build tool
- **Tailwind CSS 3** + **MUI (Material UI) 7**
- **Mapbox GL** for maps (not Google Maps — removed)
- Pages: `resources/js/pages/`
- Components: `resources/js/components/`
- Types: `resources/js/types/`

### Environment Setup

```bash
# Copy environment file
cp laravel/.env.example laravel/.env

# Start Docker
cd docker && docker compose up -d

# Install PHP dependencies
docker compose exec php composer install

# Generate app key
docker compose exec php php artisan key:generate

# Run migrations with seeders
docker compose exec php php artisan migrate --seed

# Install Node dependencies and start dev server
cd laravel && npm install && npm run dev
```

## Key Architecture Decisions

- **Inertia.js**: No separate API — Laravel controllers return Inertia responses, React renders them
- **Role-based access**: Buyer / Seller / Lawyer / Admin (via `spatie/laravel-permission`)
- **Deal workflow**: Offer → Deposit → Condition Day → Possession Day
- **Queue system**: Redis + Laravel Horizon for async jobs (emails, notifications)
- **No Google Maps**: Project uses Mapbox GL + `@mapbox/search-js-react` for all maps
