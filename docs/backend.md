# Backend

## Stack

- **ASP.NET Core 9** — REST API
- **Entity Framework Core 9** with Npgsql — PostgreSQL ORM
- **Swagger / OpenAPI** — auto-generated API docs (dev only)

## Development

```bash
cd notes-api
dotnet run
# → http://localhost:5272
# → http://localhost:5272/swagger
```

## Database migrations

```bash
# Apply existing migrations
dotnet ef database update

# Create a new migration after model changes
dotnet ef migrations add <MigrationName>

# Revert last migration
dotnet ef migrations remove
```

## Configuration

Connection string is read from `appsettings.json` (or overridden by environment variable in Docker):

```json
"ConnectionStrings": {
  "PostgresSqlConnection": "Host=localhost;Database=demo;Username=postgres;Password=admin;"
}
```

In Docker, the compose file sets:

```
ConnectionStrings__PostgresSqlConnection=Host=postgres;Database=demo;Username=postgres;Password=admin;
```

## Project structure

```
notes-api/
├── Program.cs                    # App bootstrap, DI, CORS, Swagger
├── notes-api.csproj              # Project file and NuGet dependencies
├── appsettings.json              # Base configuration
├── appsettings.Development.json  # Dev overrides (gitignored)
├── Controllers/
│   └── NotesController.cs        # GET / POST / PUT / DELETE /api/Notes
├── Database/
│   ├── MyDbContext.cs            # EF Core DbContext
│   └── Models/
│       └── Note.cs              # Note entity model
├── Migrations/                   # EF Core migration files
└── Properties/
    └── launchSettings.json       # Local launch profiles
```

## CORS

CORS is configured to allow any origin, header, and method — suitable for development. Tighten this for production by replacing `AllowAnyOrigin()` with a specific origin list in `Program.cs`.
