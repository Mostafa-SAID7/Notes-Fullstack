# Notes Fullstack

A full-stack notes application — create, search, edit, and delete notes.

**Stack:** React 18 + TypeScript · ASP.NET Core 9 · PostgreSQL · Docker

---

## Quick start

```bash
docker compose up --build
```

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Web app |
| http://localhost:5272/swagger | API docs (Swagger UI) |
| http://localhost:5272/api/Notes | REST API |

> No Docker? See [Getting Started → Option B](docs/getting-started.md#option-b--local-development).

---

## Documentation

| Doc | Description |
|-----|-------------|
| [Getting Started](docs/getting-started.md) | Prerequisites, Docker setup, local dev setup |
| [Architecture](docs/architecture.md) | System overview, data model, Docker topology |
| [Frontend](docs/frontend.md) | React + Vite + TypeScript + Tailwind + Vitest |
| [Backend](docs/backend.md) | ASP.NET Core + EF Core + PostgreSQL |
| [API Reference](docs/api-reference.md) | All REST endpoints with request/response examples |
| [Docker](docs/docker.md) | Docker Compose, Dockerfiles, nginx proxy, env vars |

---

## Project structure

```
notes-fullstack/
├── docker-compose.yml        # Orchestrates all three services
├── .dockerignore
├── docs/                     # Full documentation
│   ├── getting-started.md
│   ├── architecture.md
│   ├── frontend.md
│   ├── backend.md
│   ├── api-reference.md
│   └── docker.md
├── notes-api/                # ASP.NET Core 9 REST API
│   ├── Dockerfile
│   ├── Controllers/
│   ├── Database/
│   └── Migrations/
└── notes-web/                # React 18 + TypeScript + Vite
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── App.tsx
        ├── components/Note.tsx
        └── types/note.ts
```

---

## Development commands

### Web app

```bash
cd notes-web
npm install
npm run dev          # dev server → http://localhost:3000
npm test             # run tests
npm run typecheck    # TypeScript check
```

### API

```bash
cd notes-api
dotnet run           # → http://localhost:5272
dotnet ef database update   # apply migrations
```
