up:
	docker compose -f docker-compose.dev.yml up --build

down:
	docker compose down

logs:
	docker compose logs -f

rebuild:
	docker compose down && docker compose -f docker-compose.dev.yml up --build
