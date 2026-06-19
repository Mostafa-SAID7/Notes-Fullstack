---
name: Auth + JWT setup
description: How ASP.NET Core Identity + JWT Bearer auth is wired in this project, and the gotchas
---

## Setup
- Identity tables applied via raw SQL (not dotnet ef migrate), then inserted into `__EFMigrationsHistory`
- `MyDbContext` inherits `IdentityDbContext<IdentityUser>`
- `ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning))` in DatabaseConfig.cs to suppress the snapshot mismatch warning
- JWT secret stored in `appsettings.json` under `JwtSettings.Secret` (min 32 chars)
- Token expiry: 168 hours

## Per-user seeding
- The startup `DatabaseSeeder.SeedAsync` is disabled (returns immediately)
- On registration, `AuthController.SeedNotesForUserAsync(userId)` seeds 8 demo notes with the correct UserId

## Cache key isolation (CRITICAL)
- `CacheInterceptorBehavior.GenerateCacheKey` must include `userId` in the key
- `notes:all:{userId}` and `notes:{id}:{userId}` — prevents cross-user cache leakage

**Why:** Without userId in cache key, User A's notes could be served to User B from Redis.
