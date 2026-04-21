# Redis Caching Integration Plan

## Overview
This document outlines the strategy for integrating Redis caching into the Notes API backend, along with configuration refactoring to follow SOLID principles and maintain clean architecture.

---

## Phase 1: Configuration Refactoring

### Current State
- **Program.cs** contains mixed concerns: MediatR, AutoMapper, FluentValidation setup
- **Config folder** has: DatabaseConfig, SwaggerConfig, CorsConfig, MappingProfile
- **Missing**: Centralized logging configuration, MediatR configuration, validation configuration

### Refactoring Goals
Extract all configuration concerns into dedicated config files following the extension method pattern:

```
Config/
├── DatabaseConfig.cs       ✓ (exists)
├── SwaggerConfig.cs        ✓ (exists)
├── CorsConfig.cs           ✓ (exists)
├── MappingProfile.cs       ✓ (exists)
├── MediatRConfig.cs        ⚠ (NEW - extract MediatR setup)
├── ValidationConfig.cs     ⚠ (NEW - extract FluentValidation setup)
├── LoggingConfig.cs        ⚠ (NEW - centralized logging)
└── CacheConfig.cs          ⚠ (NEW - Redis caching)
```

### Benefits
- **Single Responsibility**: Each config file handles one concern
- **Testability**: Easier to mock and test configuration
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new configurations without cluttering Program.cs
- **Reusability**: Config methods can be used in test projects

---

## Phase 2: Logging Configuration

### Current State
- Logging is implicit (default ASP.NET Core logging)
- No structured logging configuration
- No log levels management

### Implementation Plan

**File: `Config/LoggingConfig.cs`**

```csharp
namespace NotesApi.Config;

public static class LoggingConfig
{
    /// <summary>
    /// Configures structured logging with appropriate log levels per namespace.
    /// </summary>
    public static ILoggingBuilder AddStructuredLogging(
        this ILoggingBuilder logging,
        IConfiguration configuration)
    {
        logging.ClearProviders();
        logging.AddConsole();
        logging.AddDebug();

        // Set log levels by namespace
        logging.AddFilter("Microsoft.EntityFrameworkCore", LogLevel.Warning);
        logging.AddFilter("Microsoft.AspNetCore", LogLevel.Information);
        logging.AddFilter("NotesApi", LogLevel.Debug);

        return logging;
    }
}
```

**Usage in Program.cs:**
```csharp
builder.Logging.AddStructuredLogging(builder.Configuration);
```

### Logging Strategy
- **Debug**: Internal application flow (handlers, behaviors)
- **Information**: API requests, database operations
- **Warning**: Validation failures, missing resources
- **Error**: Exceptions, failed operations

---

## Phase 3: Redis Caching Integration

### Architecture Overview

```
Request Flow:
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  CacheInterceptorBehavior (MediatR) │
│  - Check cache for GET operations   │
│  - Return cached result if exists   │
└──────┬──────────────────────────────┘
       │
       ├─ Cache HIT ──────────────────────┐
       │                                  │
       └─ Cache MISS ──────────────────┐  │
                                       │  │
                                       ▼  ▼
                                   ┌──────────┐
                                   │ Handler  │
                                   └────┬─────┘
                                        │
                                        ▼
                                   ┌──────────┐
                                   │ Database │
                                   └────┬─────┘
                                        │
                                        ▼
                                   ┌──────────────────┐
                                   │ Store in Cache   │
                                   │ (TTL: 5 minutes) │
                                   └────┬─────────────┘
                                        │
                                        ▼
                                   ┌──────────┐
                                   │ Response │
                                   └──────────┘
```

### Caching Strategy

#### Query Operations (GET)
- **Cache Key Pattern**: `notes:all` or `notes:{id}`
- **TTL**: 5 minutes (300 seconds)
- **Invalidation**: On Create/Update/Delete

#### Command Operations (POST/PUT/DELETE)
- **No caching** (write operations)
- **Cache invalidation** after successful execution
- **Invalidation pattern**: Clear related cache keys

### Implementation Files

#### 1. **Config/CacheConfig.cs** (NEW)
```csharp
namespace NotesApi.Config;

public static class CacheConfig
{
    /// <summary>
    /// Registers Redis distributed cache and cache service.
    /// </summary>
    public static IServiceCollection AddRedisCache(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var redisConnection = configuration.GetConnectionString("Redis")
            ?? throw new InvalidOperationException(
                "Connection string 'Redis' is not configured.");

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = redisConnection;
            options.InstanceName = "NotesApi:";
        });

        services.AddScoped<ICacheService, RedisCacheService>();

        return services;
    }
}
```

#### 2. **Services/ICacheService.cs** (NEW)
```csharp
namespace NotesApi.Services;

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key);
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);
    Task RemoveAsync(string key);
    Task RemoveByPatternAsync(string pattern);
}
```

#### 3. **Services/RedisCacheService.cs** (NEW)
```csharp
namespace NotesApi.Services;

public class RedisCacheService : ICacheService
{
    private readonly IDistributedCache _cache;
    private readonly ILogger<RedisCacheService> _logger;

    public RedisCacheService(
        IDistributedCache cache,
        ILogger<RedisCacheService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task<T?> GetAsync<T>(string key)
    {
        try
        {
            var data = await _cache.GetStringAsync(key);
            if (data == null)
                return default;

            _logger.LogDebug("Cache HIT for key: {Key}", key);
            return JsonSerializer.Deserialize<T>(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving cache for key: {Key}", key);
            return default;
        }
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        try
        {
            var json = JsonSerializer.Serialize(value);
            await _cache.SetStringAsync(key, json, new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(5)
            });

            _logger.LogDebug("Cache SET for key: {Key} with TTL: {TTL}s", 
                key, expiration?.TotalSeconds ?? 300);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cache for key: {Key}", key);
        }
    }

    public async Task RemoveAsync(string key)
    {
        try
        {
            await _cache.RemoveAsync(key);
            _logger.LogDebug("Cache REMOVED for key: {Key}", key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache for key: {Key}", key);
        }
    }

    public async Task RemoveByPatternAsync(string pattern)
    {
        // Note: Redis doesn't support pattern deletion directly
        // This would require custom implementation or using Redis CLI
        _logger.LogWarning("Pattern-based cache removal not yet implemented");
        await Task.CompletedTask;
    }
}
```

#### 4. **Behaviors/CacheInterceptorBehavior.cs** (NEW)
```csharp
namespace NotesApi.Behaviors;

public class CacheInterceptorBehavior<TRequest, TResponse> 
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ICacheService _cache;
    private readonly ILogger<CacheInterceptorBehavior<TRequest, TResponse>> _logger;

    public CacheInterceptorBehavior(
        ICacheService cache,
        ILogger<CacheInterceptorBehavior<TRequest, TResponse>> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        // Only cache GET operations (queries)
        if (request is not IQuery)
            return await next();

        var cacheKey = GenerateCacheKey(request);
        
        // Try to get from cache
        var cachedResult = await _cache.GetAsync<TResponse>(cacheKey);
        if (cachedResult != null)
            return cachedResult;

        // Cache miss - execute handler
        _logger.LogDebug("Cache MISS for key: {Key}", cacheKey);
        var result = await next();

        // Store in cache
        await _cache.SetAsync(cacheKey, result);

        return result;
    }

    private string GenerateCacheKey(TRequest request)
    {
        return request switch
        {
            GetAllNotesQuery => "notes:all",
            GetNoteByIdQuery q => $"notes:{q.Id}",
            _ => $"{typeof(TRequest).Name}:{request.GetHashCode()}"
        };
    }
}
```

#### 5. **Marker Interfaces** (NEW)
```csharp
namespace NotesApi.Features;

/// <summary>Marker interface for query operations (cacheable)</summary>
public interface IQuery { }

/// <summary>Marker interface for command operations (non-cacheable)</summary>
public interface ICommand { }
```

---

## Phase 4: Configuration Extraction

### MediatRConfig.cs (NEW)
```csharp
namespace NotesApi.Config;

public static class MediatRConfig
{
    public static IServiceCollection AddMediatRPipeline(
        this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
            cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
            cfg.AddOpenBehavior(typeof(CacheInterceptorBehavior<,>));
        });

        return services;
    }
}
```

### ValidationConfig.cs (NEW)
```csharp
namespace NotesApi.Config;

public static class ValidationConfig
{
    public static IServiceCollection AddValidation(
        this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining<Program>();
        return services;
    }
}
```

---

## Phase 5: Updated Program.cs

### Before (Current)
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddScoped<IUnitOfWork, UnitOfWorkImpl>();
builder.Services.AddCorsPolicy();
builder.Services.AddSwagger();

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
    cfg.AddOpenBehavior(typeof(LoggingBehavior<,>));
});

builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();
// ... rest of pipeline
```

### After (Refactored)
```csharp
var builder = WebApplication.CreateBuilder(args);

// ── Logging ───────────────────────────────────────────────────────────────────
builder.Logging.AddStructuredLogging(builder.Configuration);

// ── Services ──────────────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddRedisCache(builder.Configuration);
builder.Services.AddScoped<IUnitOfWork, UnitOfWorkImpl>();
builder.Services.AddCorsPolicy();
builder.Services.AddSwagger();
builder.Services.AddMediatRPipeline();
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
builder.Services.AddValidation();

// ── App Pipeline ──────────────────────────────────────────────────────────────
var app = builder.Build();

await app.InitialiseDatabaseAsync();

if (app.Environment.IsDevelopment())
    app.UseSwaggerDocs();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCorsPolicy();
app.UseAuthorization();
app.MapControllers();

app.Run();

public partial class Program { }
```

---

## Phase 6: Global Usings

### GlobalUsings.cs (NEW)
```csharp
global using System.Text.Json;
global using FluentValidation;
global using MediatR;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.Extensions.Caching.Distributed;
global using NotesApi.Behaviors;
global using NotesApi.Common;
global using NotesApi.Config;
global using NotesApi.Database;
global using NotesApi.Features;
global using NotesApi.Middleware;
global using NotesApi.Services;
```

### Benefits
- Reduces repetitive `using` statements across files
- Improves code readability
- Centralizes dependency management
- Easier to track what's globally available

---

## Phase 7: appsettings.json Configuration

### Current
```json
{
  "ConnectionStrings": {
    "PostgresSqlConnection": "Host=localhost;Port=5432;Database=demo;Username=postgres;Password=postgres"
  }
}
```

### Updated
```json
{
  "ConnectionStrings": {
    "PostgresSqlConnection": "Host=localhost;Port=5432;Database=demo;Username=postgres;Password=postgres",
    "Redis": "localhost:6379"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore": "Warning",
      "NotesApi": "Debug"
    }
  },
  "Cache": {
    "DefaultTTL": 300,
    "Enabled": true
  }
}
```

---

## Implementation Checklist

### Phase 1: Configuration Refactoring
- [ ] Create `Config/MediatRConfig.cs`
- [ ] Create `Config/ValidationConfig.cs`
- [ ] Create `Config/LoggingConfig.cs`
- [ ] Update `Program.cs` to use new configs
- [ ] Create `GlobalUsings.cs`
- [ ] Update `appsettings.json`

### Phase 2: Redis Caching
- [ ] Create `Services/ICacheService.cs`
- [ ] Create `Services/RedisCacheService.cs`
- [ ] Create `Config/CacheConfig.cs`
- [ ] Create `Behaviors/CacheInterceptorBehavior.cs`
- [ ] Create marker interfaces `IQuery` and `ICommand`
- [ ] Update MediatR handlers to implement marker interfaces

### Phase 3: Testing
- [ ] Add Redis cache service tests
- [ ] Add cache interceptor behavior tests
- [ ] Update integration tests for cache scenarios
- [ ] Add cache invalidation tests

### Phase 4: Documentation
- [ ] Update API documentation with cache headers
- [ ] Document cache key patterns
- [ ] Document TTL strategy
- [ ] Add troubleshooting guide

---

## Dependencies to Add

```bash
dotnet add package StackExchange.Redis
```

This is already included with `AddStackExchangeRedisCache()` in ASP.NET Core.

---

## Logging Strategy

### Log Levels by Component

| Component | Level | Purpose |
|-----------|-------|---------|
| MediatR Handlers | Debug | Track request flow |
| Database Operations | Information | Log queries and saves |
| Validation | Warning | Log validation failures |
| Cache Operations | Debug | Track cache hits/misses |
| Exceptions | Error | Log all errors |
| API Requests | Information | Log incoming requests |

### Example Log Output
```
[INF] Request starting HTTP/1.1 GET http://localhost:5272/api/notes
[DBG] Cache MISS for key: notes:all
[INF] Executing GetAllNotesQuery
[DBG] Completed GetAllNotesQuery successfully
[DBG] Cache SET for key: notes:all with TTL: 300s
[INF] Request finished HTTP/1.1 GET http://localhost:5272/api/notes - 200 - application/json
```

---

## Next Steps

1. **Review this plan** - Confirm approach and ask questions
2. **Approve phases** - Decide which phases to implement first
3. **Implementation** - Execute phases in order
4. **Testing** - Comprehensive testing for each phase
5. **Documentation** - Update API docs and deployment guides

---

## Questions for Review

1. Should we implement all phases at once or incrementally?
2. Is 5 minutes the right TTL for cached notes?
3. Should we add cache warming on startup?
4. Do we need cache statistics/monitoring?
5. Should we implement cache invalidation patterns (e.g., tag-based)?

