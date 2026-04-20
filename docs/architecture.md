# Architecture

## Overview

Notes Fullstack is a three-tier web application:

```
┌─────────────────┐     HTTP/JSON      ┌──────────────────┐     EF Core      ┌──────────────┐
│   React + Vite  │ ──────────────────▶│  ASP.NET Core 9  │ ───────────────▶ │  PostgreSQL  │
│   (port 3000)   │◀────────────────── │   (port 5272)    │◀─────────────── │  (port 5432) │
└─────────────────┘                    └──────────────────┘                  └──────────────┘
     notes-web                              notes-api                           postgres
```

## Frontend — `notes-web`

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript 5 (strict) |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Testing | Vitest + Testing Library |

**Key files:**

```
notes-web/src/
├── App.tsx              # Root component — state, fetch logic, modal
├── components/
│   └── Note.tsx         # Note card with edit/delete dropdown
├── types/
│   └── note.ts          # Note and NotePayload interfaces
├── index.css            # Tailwind directives + CSS variables + component classes
└── main.tsx             # React DOM entry point
```

## Backend — `notes-api`

| Layer | Technology |
|-------|-----------|
| Framework | ASP.NET Core 9 |
| Language | C# 13 |
| ORM | Entity Framework Core 9 |
| Database driver | Npgsql 9 |
| API docs | Swagger / OpenAPI |

**Key files:**

```
notes-api/
├── Program.cs                    # DI setup, CORS, Swagger, middleware
├── Controllers/
│   └── NotesController.cs        # REST endpoints
├── Database/
│   ├── MyDbContext.cs            # EF Core DbContext
│   └── Models/Note.cs           # Note entity
└── Migrations/                   # EF Core migration history
```

## Data model

```
Note
├── Id          int (PK, auto-increment)
├── Title       string (required)
├── Desc        string (required)
└── CreatedDate DateTime
```

## Docker topology

```
docker-compose.yml
├── postgres      (postgres:16-alpine)   — persistent volume
├── notes-api     (dotnet:aspnet:9.0)    — depends on postgres healthy
└── notes-web     (nginx:alpine)         — depends on notes-api
                  nginx proxies /api/ → notes-api:5272
```
