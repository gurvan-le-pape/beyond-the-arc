include .env

DOCKER_COMPOSE=docker/docker-compose.yml
DOCKER_COMPOSE_DEV=docker/docker-compose.dev.yml
DOCKER_COMPOSE_PROD=docker/docker-compose.prod.yml
DOCKER_COMPOSE_SONAR=docker/docker-compose.sonar.yml
ENV_FILE=--env-file .env

# Build Docker images from scratch
build:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) build --no-cache

# Start Docker containers in dev mode (with rebuild)
up-dev:
	docker compose -f $(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_DEV) $(ENV_FILE) up -d --build

# Start Docker containers in prod mode (with rebuild)
up-prod:
	docker compose -f $(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_PROD) $(ENV_FILE) up -d --build

# Stop Docker containers
down:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) down

# Stop and remove volumes (wipes data)
clean:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) down -v

# View logs in dev mode
logs-dev:
	docker compose -f $(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_DEV) $(ENV_FILE) logs

# View logs in prod mode
logs-prod:
	docker compose -f $(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_PROD) $(ENV_FILE) logs

ps:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) ps

# Access PostgreSQL shell
psql:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) exec database psql -U $(DATABASE_USER) -d $(DATABASE_NAME)

# Run frontend in dev mode
dev-frontend:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) exec frontend npm run dev

# Build frontend (production)
build-frontend:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) exec frontend npm run build

# Start frontend (production)
start-frontend:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) exec frontend npm run start

# Run backend in dev mode
dev-backend:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) exec backend npm run start:dev

# Build backend (production)
build-backend:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) exec backend npm run build

# Start backend (production)
start-backend:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) exec backend npm run start

# Start SonarQube
sonar-up:
	docker compose -f $(DOCKER_COMPOSE_SONAR) up -d

# Stop SonarQube
sonar-down:
	docker compose -f $(DOCKER_COMPOSE_SONAR) down

# Clean SonarQube volumes
sonar-clean:
	docker compose -f $(DOCKER_COMPOSE_SONAR) down -v

# View SonarQube logs
sonar-logs:
	docker compose -f $(DOCKER_COMPOSE_SONAR) logs -f

# Generate barrel files (index.ts) for frontend and backend
barrels:
	npm run barrels

# Refresh static reference data (leagues, committees, clubs, coordinates) from FFBB's
# public site and regenerate prisma/migrations/1_seed_static_data/migration.sql.
# Host-side (not Docker) - hits competitions.ffbb.com directly and takes
# ~1h20 (4480 pages at the 1s crawl-delay their robots.txt asks for).
# Review with `git diff` before committing.
#
# This rewrites a migration that production has already applied, and
# `prisma migrate deploy` does not checksum applied migrations — so the
# refreshed data reaches a *fresh* database and nothing else. Landing a refresh
# therefore takes two things: `[refresh-static-data]` in the PR title (the
# contracts CI job blocks the edit otherwise) and the catch-up SQL
# in the PR body, to apply the same change to production by hand.
refresh-static-data: venv/.stamp
	@echo "This will take ~1h20 (scraping ~4480 pages from FFBB at 1 req/s)."
	@echo "Note: the regenerated migration is a no-op on any database that already applied it - production included. See the comment above this target."
	venv/bin/python3 scripts/ffbb-import/scrape.py
	venv/bin/python3 scripts/ffbb-import/build_migration.py

# The virtualenv the two host-side scraper scripts run in. Gitignored, so it is
# built from a pinned manifest rather than assumed to exist - before this
# target, `refresh-static-data` called venv/bin/python3 on a directory that no
# clean clone had, and `requests` was declared in no manifest anywhere.
# Idempotent: re-running only reinstalls when the manifest is newer than the
# stamp. The stamp is the real target, not the directory - `venv/` exists as
# soon as it is created, and make would then call a bare `venv:` target
# up to date whatever the manifest said.
.PHONY: venv
venv: venv/.stamp
venv/.stamp: scripts/ffbb-import/requirements.txt
	python3 -m venv venv
	venv/bin/pip install --disable-pip-version-check -q -r scripts/ffbb-import/requirements.txt
	@touch venv/.stamp
	@venv/bin/python3 --version

# View scheduler logs
logs-scheduler:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) logs -f scheduler

# Reset failed matches back to scheduled
reset-failed-matches:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) exec database psql -U $(DATABASE_USER) -d $(DATABASE_NAME) \
		-c "UPDATE matches SET status = 'scheduled' WHERE status = 'failed';"

# Show season setup progress: leagues with teams in each season's championships
season-progress:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) exec database psql -U $(DATABASE_USER) -d $(DATABASE_NAME) -c \
		"SELECT ch.season_year, COUNT(DISTINCT co.league_id) AS leagues_set_up FROM teams t JOIN pools p ON p.id = t.pool_id JOIN championships ch ON ch.id = p.championship_id JOIN clubs c ON c.id = t.club_id JOIN committees co ON co.id = c.committee_id GROUP BY ch.season_year ORDER BY ch.season_year;"

# Show match generation progress
match-progress:
	docker compose -f $(DOCKER_COMPOSE) $(ENV_FILE) exec database psql -U $(DATABASE_USER) -d $(DATABASE_NAME) -c \
		"SELECT status, COUNT(*) as count FROM matches GROUP BY status ORDER BY status;"
