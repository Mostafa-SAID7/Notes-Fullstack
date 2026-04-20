# Getting Started

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [.NET SDK](https://dotnet.microsoft.com/download) | 9.0+ | Run the API |
| [Node.js](https://nodejs.org) | 20+ | Run the web app |
| [PostgreSQL](https://www.postgresql.org) | 14+ | Database |
| [Docker](https://www.docker.com) | 24+ | Containerised run (optional) |

---

## Option A — Docker (recommended, one command)

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Web app | http://localhost:3000 |
| API | http://localhost:5272 |
| Swagger | http://localhost:5272/swagger |
| PostgreSQL | localhost:5432 |

Stop everything:

```bash
docker compose down
```

Remove volumes (wipes database):

```bash
docker compose down -v
```

---

## Option B — Local development

### 1. Database

Make sure PostgreSQL is running locally, then create the database:

```sql
CREATE DATABASE demo;
```

### 2. API

```bash
cd notes-api
dotnet run
# → http://localhost:5272
```

### 3. Web app

```bash
cd notes-web
npm install
npm run dev
# → http://localhost:3000
```

Both must be running at the same time.
