# TaskManager — Fullstack App

**Next.js 14 (TypeScript) + Spring Boot 3 + PostgreSQL**

## Quick Start

```bash
# Run everything with Docker
docker-compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:8080
# API docs → http://localhost:8080/api/tasks
```

## Local Dev (without Docker)

### Backend
```bash
cd backend
# Start PostgreSQL first (or use docker-compose postgres only)
docker-compose up postgres -d
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
cp ../.env.example .env.local
npm run dev
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET    | /api/tasks | Get all tasks |
| GET    | /api/tasks/:id | Get task by ID |
| POST   | /api/tasks | Create task |
| PATCH  | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

## Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Axios
- **Backend**: Spring Boot 3.3, JPA/Hibernate, Lombok, Validation
- **Database**: PostgreSQL 16
- **Deploy**: Docker / Kubernetes + Helm + ArgoCD (see deploykit.html)
