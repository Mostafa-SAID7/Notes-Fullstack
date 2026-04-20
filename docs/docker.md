# Docker

## Services

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| `postgres` | `postgres:16-alpine` | 5432 | PostgreSQL database |
| `notes-api` | built from `notes-api/Dockerfile` | 5272 | ASP.NET Core REST API |
| `notes-web` | built from `notes-web/Dockerfile` | 3000 | React app served by nginx |

## Quick start

```bash
# Build images and start all services
docker compose up --build

# Run in background
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down

# Stop and remove volumes (wipes database)
docker compose down -v
```

## Individual service commands

```bash
# Rebuild only the API
docker compose up --build notes-api

# Restart only the web app
docker compose restart notes-web

# Open a shell in the API container
docker compose exec notes-api sh

# Open a psql shell
docker compose exec postgres psql -U postgres -d demo
```

## How nginx proxies the API

In production (Docker), the React app is served by nginx on port 80 (mapped to host 3000). API calls use a relative path `/api/` which nginx proxies to `http://notes-api:5272`:

```nginx
location /api/ {
    proxy_pass http://notes-api:5272;
}
```

This means the browser never needs to know the API's internal port.

## Dockerfiles

### `notes-api/Dockerfile`

Multi-stage build:
1. **build** — `dotnet/sdk:9.0` — restores packages and publishes release build
2. **runtime** — `dotnet/aspnet:9.0` — minimal runtime image, copies published output

### `notes-web/Dockerfile`

Multi-stage build:
1. **build** — `node:20-alpine` — installs deps and runs `npm run build`
2. **runtime** — `nginx:alpine` — serves the `dist/` folder as static files

## Environment variables

### notes-api

| Variable | Default | Description |
|----------|---------|-------------|
| `ASPNETCORE_ENVIRONMENT` | `Production` | ASP.NET environment |
| `ConnectionStrings__PostgresSqlConnection` | see compose | PostgreSQL connection string |

### notes-web (build-time)

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `/api/Notes` | API base URL (relative, proxied by nginx) |
