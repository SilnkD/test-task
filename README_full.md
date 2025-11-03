# Authentication & Profile App (NestJS + Next.js + PostgreSQL + Docker)

A minimal full-stack application providing registration, login, JWT authentication, and user profile management.

---

## 🚀 Quick Start

### 1 Clone repository

```bash
git clone https://github.com/SilnkD/test-task.git
cd test-task
```

---

## 🧱 Backend (NestJS)


### ⚙️ Dev mode

```bash
cd api
npm install
npm run start:dev
```

The backend will start at: [http://localhost:3000](http://localhost:3000)  
Swagger documentation: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)  

---

### ⚙️ Environment variables (example)

File: `/api/.env`

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

### Features (Backend)
- JWT authentication (access + refresh tokens)  
- Password hashing with bcrypt + salt  
- User profile update (email, displayName, password)  
- Global validation pipe & exception filter  
- Swagger API documentation  
- Dockerized PostgreSQL + NestJS API  

---

## 🎨 Frontend (Next.js + Tailwind + React Hook Form)

### ⚙️ Dev mode

```bash
cd frontend
npm install
npm run dev
```

App available at: [http://localhost:5173](http://localhost:5173)  

---

### 🔧 Environment variables

File: `/frontend/.env`

```
NEXT_PUBLIC_API_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000
AUTH_TOKEN_STORAGE=localStorage
```

---

### 🖥️ Features (Frontend)
- Three main pages:  
  - `/register` — registration  
  - `/login` — login  
  - `/profile` — view and edit user profile  
- Global authentication context (`AuthProvider`)  
- Modern UI with Tailwind CSS  
- Reusable components (`TextField`, `PasswordField`, `Button`, `FormError`)  
- Input validation using React Hook Form + custom schema  
- Adaptive layout for both desktop and mobile  
- Docker-ready production build  

---

## 🐳 Run full stack

To start **frontend + backend + database** in Docker:

```bash
docker compose up --build
```

Frontend → [http://localhost:5173](http://localhost:5173)  
Backend → [http://localhost:3000](http://localhost:3000)  
Swagger → [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 🧾 API Testing (Postman)

Import the collection from:
```
/api/postman/test-task.postman_collection.json
```

Run requests in order:
1. Register  
2. Login  
3. Get Profile  
4. Update Profile  
5. Refresh Token  