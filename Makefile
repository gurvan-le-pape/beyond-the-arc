include .env

DOCKER_COMPOSE=docker/docker-compose.yml
DOCKER_COMPOSE_DEV=docker/docker-compose.dev.yml
DOCKER_COMPOSE_PROD=docker/docker-compose.prod.yml
DOCKER_COMPOSE_SONAR=docker/docker-compose.sonar.yml
ENV_FILE=--env-file .env

# Build Docker images from scratch
build:
	docker-compose -f $(DOCKER_COMPOSE) $(ENV_FILE) build --no-cache

# Start Docker containers in dev mode (with rebuild)
up-dev:
	docker-compose -f $(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_DEV) $(ENV_FILE) up -d --build

# Start Docker containers in prod mode (with rebuild)
up-prod:
	docker-compose -f $(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_PROD) $(ENV_FILE) up -d --build

# Stop Docker containers
down:
	docker-compose -f $(DOCKER_COMPOSE) $(ENV_FILE) down

# Stop and remove volumes (wipes data)
clean:
	docker-compose -f $(DOCKER_COMPOSE) $(ENV_FILE) down -v

# View logs in dev mode
logs-dev:
	docker-compose -f $(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_DEV) $(ENV_FILE) logs

# View logs in prod mode
logs-prod:
	docker-compose -f $(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_PROD) $(ENV_FILE) logs

ps:
	docker-compose -f $(DOCKER_COMPOSE) $(ENV_FILE) ps

# Access PostgreSQL shell
psql:
	docker exec -it database psql -U $(DATABASE_USER) -d $(DATABASE_NAME)

# Run frontend in dev mode
dev-frontend:
	docker-compose exec frontend npm run dev

# Build frontend (production)
build-frontend:
	docker-compose exec frontend npm run build

# Start frontend (production)
start-frontend:
	docker-compose exec frontend npm run start

# Run backend in dev mode
dev-backend:
	docker-compose exec backend npm run start:dev

# Build backend (production)
build-backend:
	docker-compose exec backend npm run build

# Start backend (production)
start-backend:
	docker-compose exec backend npm run start

# Start SonarQube
sonar-up:
	docker-compose -f $(DOCKER_COMPOSE_SONAR) up -d

# Stop SonarQube
sonar-down:
	docker-compose -f $(DOCKER_COMPOSE_SONAR) down

# Clean SonarQube volumes
sonar-clean:
	docker-compose -f $(DOCKER_COMPOSE_SONAR) down -v

# View SonarQube logs
sonar-logs:
	docker-compose -f $(DOCKER_COMPOSE_SONAR) logs -f

# Generate barrel files (index.ts) for frontend and backend
barrels:
	npm run barrels:watch

# View scheduler logs
logs-scheduler:
	docker-compose -f $(DOCKER_COMPOSE) $(ENV_FILE) logs -f scheduler

# Reset failed matches back to scheduled
reset-failed-matches:
	docker exec -it docker-database psql -U $(DATABASE_USER) -d $(DATABASE_NAME) \
		-c "UPDATE matches SET status = 'scheduled' WHERE status = 'failed';"

# Show seeding progress
season-progress:
	docker-compose -f $(DOCKER_COMPOSE) $(ENV_FILE) exec database psql -U $(DATABASE_USER) -d $(DATABASE_NAME) -c \
		"SELECT entity_type, COUNT(*) as completed FROM seeding_checkpoints GROUP BY entity_type;"

# Show match generation progress
match-progress:
	docker-compose -f $(DOCKER_COMPOSE) $(ENV_FILE) exec database psql -U $(DATABASE_USER) -d $(DATABASE_NAME) -c \
		"SELECT status, COUNT(*) as count FROM matches GROUP BY status ORDER BY status;"