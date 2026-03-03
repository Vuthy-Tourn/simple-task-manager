# TaskManager — Fullstack App

**Next.js (TypeScript) + Spring Boot (Gradle) + PostgreSQL**

---

## Quick Start (Docker — all-in-one)

```bash
# Build and run everything
docker-compose up --build

# Frontend → http://localhost:3000
# Backend  → http://localhost:8080
```

---

## Local Development (without Docker)

### Backend (Spring Boot + Gradle)

```bash
cd backend

# Start PostgreSQL first (or use Docker Compose)
docker-compose up postgres -d

# Build and run the Spring Boot backend
./gradlew bootRun
```

> Make sure `gradlew` is executable:

```bash
chmod +x gradlew
```

---

### Frontend (Next.js + TypeScript)

```bash
cd frontend

# Install dependencies
npm install

# Copy example env file
cp ../.env.example .env.local

# Start dev server
npm run dev
```

> Frontend reads `NEXT_PUBLIC_API_URL` for API requests.

---

## API Endpoints

| Method | Path           | Description    |
| ------ | -------------- | -------------- |
| GET    | /api/tasks     | Get all tasks  |
| GET    | /api/tasks/:id | Get task by ID |
| POST   | /api/tasks     | Create task    |
| PATCH  | /api/tasks/:id | Update task    |
| DELETE | /api/tasks/:id | Delete task    |

---

## Environment Variables

### Backend (`application.properties`)

```properties
spring.application.name=taskmanager-backend

spring.datasource.url=jdbc:postgresql://postgres:5432/taskdb
spring.datasource.username=postgres
spring.datasource.password=devpassword
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

server.port=8080

management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=always
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> Update the backend URL for production.

---

## Docker Compose — All-in-One (Safe Ports)

```yaml
version: "3.9"
services:
  postgres:
    image: postgres:16-alpine
    container_name: taskmanager-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: taskdb
    ports:
      - "5433:5432" # Map to avoid local conflicts
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  backend:
    build: ./backend
    image: taskmanager-backend
    container_name: taskmanager-backend
    ports:
      - "8080:8080"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: taskdb
      DB_USER: postgres
      DB_PASSWORD: devpassword
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build: ./frontend
    image: taskmanager-frontend
    container_name: taskmanager-frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  pg_data:
```

---

## Notes

* Postgres maps to **host port 5433** to avoid conflicts with any local Postgres installation.
* Docker Compose handles container dependencies (`depends_on`) and waits for Postgres to be healthy.
* Gradle backend can be run locally with `./gradlew bootRun`.
* Frontend uses `NEXT_PUBLIC_API_URL` to call the backend.
* Use `docker-compose down` to stop and clean containers.

---

## Stack

* **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Axios
* **Backend:** Spring Boot 3.3 (Gradle), JPA/Hibernate, Lombok, Validation
* **Database:** PostgreSQL 16
* **Deployment:** Docker / Kubernetes + Helm + ArgoCD
