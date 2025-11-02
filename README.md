# Authentication & Profile API (NestJS + PostgreSQL + Docker)

A minimal backend service built with **NestJS**, **TypeORM**, and **PostgreSQL**, providing registration, login, JWT authentication, and user profile management. 

---

## Quick Start

### 1 Clone repository
```bash
git clone https://github.com/SilnkD/test-task.git
cd test-task/api
```

### 2 Create environment file
```bash
cp .env
```

### 3 Run with Docker
```bash
docker compose -f docker-compose.dev.yml up --build
```
App will start at: [http://localhost:3000](http://localhost:3000)

Swagger docs: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## Environment variables (example)

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://postgres:postgres@db:5432/app_db
JWT_ACCESS_SECRET=secret-key
JWT_REFRESH_SECRET=secret-refresh
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## Testing with Postman

Import the collection from:
```
/postman/test-task.postman_collection.json
```
Run in order:
1. Register
2. Login
3. Get User Info
4. Update Profile
5. Refresh Token

---

## Running in Linux VM

```bash
sudo apt update && sudo apt install docker.io docker-compose -y
git clone https://github.com/SilnkD/test-task.git
cd test-task/api
cp .env
sudo docker compose -f docker-compose.dev.yml up --build
```

Test connection:
```bash
curl http://localhost:3000/api/docs
```

---

## Features

- JWT auth (access + refresh)
- Password hashing (bcrypt + salt)
- User profile update (login, email, name, password)
- Global validation & error filter
- Dockerized PostgreSQL + API
- Swagger & Postman docs
