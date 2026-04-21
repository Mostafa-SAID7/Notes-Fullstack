# Elasticsearch & Serilog Integration Plan

## Overview
This document outlines the strategy for integrating Elasticsearch with Serilog for centralized structured logging in the Notes API backend. Combined with Redis caching, this creates a complete observability and performance stack.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Notes API Application                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Serilog (Structured Logging)                                     │  │
│  │ - Console Sink (Development)                                     │  │
│  │ - Elasticsearch Sink (Production)                                │  │
│  │ - Structured JSON output                                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │  PostgreSQL  │ │    Redis     │ │ Elasticsearch│
            │   (Data)     │ │   (Cache)    │ │   (Logs)     │
            └──────────────┘ └──────────────┘ └──────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
            ┌──────────────┐              ┌──────────────────┐
            │   Kibana     │              │  Grafana/Alerts  │
            │  (Dashboards)│              │  (Monitoring)    │
            └──────────────┘              └──────────────────┘
```

---

## Phase 1: Serilog Configuration

### Current State
- Using default ASP.NET Core logging
- No structured logging
- No centralized log aggregation

### Implementation Plan

#### 1. **NuGet Packages to Add**
```bash
dotnet add package Serilog
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.Elasticsearch
dotnet add package Serilog.Enrichers.Environment
dotnet add package Serilog.Enrichers.Process
dotnet add package Serilog.Enrichers.Thread
```

#### 2. **Config/LoggingConfig.cs** (UPDATED)
```csharp
namespace NotesApi.Config;

public static class LoggingConfig
{
    /// <summary>
    /// Configures Serilog with structured logging to console and Elasticsearch.
    /// </summary>
    public static WebApplicationBuilder AddSerilogLogging(
        this WebApplicationBuilder builder)
    {
        var elasticsearchUrl = builder.Configuration.GetConnectionString("Elasticsearch")
            ?? "http://localhost:9200";

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .Enrich.FromLogContext()
            .Enrich.WithEnvironmentName()
            .Enrich.WithMachineName()
            .Enrich.WithProcessId()
            .Enrich.WithThreadId()
            .WriteTo.Console(
                outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] {Message:lj}{NewLine}{Exception}")
            .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri(elasticsearchUrl))
            {
                IndexFormat = "notes-api-{0:yyyy.MM.dd}",
                AutoRegisterTemplate = true,
                AutoRegisterTemplateVersion = AutoRegisterTemplateVersion.ESv7,
                NumberOfShards = 2,
                NumberOfReplicas = 1,
                FailureCallback = e => Console.WriteLine("Unable to submit event " + e.MessageTemplate),
                EmitEventFailure = EmitEventFailureHandling.WriteToSelfLog |
                                   EmitEventFailureHandling.RaiseCallback
            })
            .CreateLogger();

        builder.Host.UseSerilog();

        return builder;
    }
}
```

#### 3. **appsettings.json** (UPDATED)
```json
{
  "ConnectionStrings": {
    "PostgresSqlConnection": "Host=localhost;Database=demo;Username=postgres;Password=admin;",
    "Redis": "localhost:6379",
    "Elasticsearch": "http://localhost:9200"
  },
  "Serilog": {
    "MinimumLevel": "Debug",
    "WriteTo": [
      {
        "Name": "Console"
      },
      {
        "Name": "Elasticsearch",
        "Args": {
          "nodeUris": "http://localhost:9200",
          "indexFormat": "notes-api-{0:yyyy.MM.dd}",
          "autoRegisterTemplate": true
        }
      }
    ],
    "Enrich": [
      "FromLogContext",
      "WithEnvironmentName",
      "WithMachineName",
      "WithProcessId",
      "WithThreadId"
    ]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
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

#### 4. **appsettings.Development.json** (UPDATED)
```json
{
  "Serilog": {
    "MinimumLevel": "Debug"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information",
      "Microsoft.EntityFrameworkCore": "Debug",
      "NotesApi": "Debug"
    }
  }
}
```

#### 5. **appsettings.Production.json** (NEW)
```json
{
  "Serilog": {
    "MinimumLevel": "Information"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning",
      "NotesApi": "Information"
    }
  }
}
```

---

## Phase 2: Docker Compose Integration

### Updated docker-compose.yml

```yaml
version: '3.9'

services:
  # ── PostgreSQL ──────────────────────────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    container_name: notes-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: demo
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: admin
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres -d demo']
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - notes-network

  # ── Redis ───────────────────────────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: notes-redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - notes-network

  # ── Elasticsearch ───────────────────────────────────────────────────────────
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: notes-elasticsearch
    restart: unless-stopped
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - xpack.security.enrollment.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - '9200:9200'
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    healthcheck:
      test: ['CMD-SHELL', 'curl -s http://localhost:9200 >/dev/null || exit 1']
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - notes-network

  # ── Kibana ──────────────────────────────────────────────────────────────────
  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    container_name: notes-kibana
    restart: unless-stopped
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - '5601:5601'
    depends_on:
      elasticsearch:
        condition: service_healthy
    healthcheck:
      test: ['CMD-SHELL', 'curl -s http://localhost:5601/api/status >/dev/null || exit 1']
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - notes-network

  # ── .NET API ────────────────────────────────────────────────────────────────
  notes-api:
    build:
      context: ./notes-api
      dockerfile: Dockerfile
    container_name: notes-api
    restart: unless-stopped
    ports:
      - '5272:5272'
    environment:
      ASPNETCORE_ENVIRONMENT: Production
      ConnectionStrings__PostgresSqlConnection: >
        Host=postgres;Database=demo;Username=postgres;Password=admin;
      ConnectionStrings__Redis: redis:6379
      ConnectionStrings__Elasticsearch: http://elasticsearch:9200
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      elasticsearch:
        condition: service_healthy
    networks:
      - notes-network

  # ── React Web App ───────────────────────────────────────────────────────────
  notes-web:
    build:
      context: ./notes-web
      dockerfile: Dockerfile
    container_name: notes-web
    restart: unless-stopped
    ports:
      - '3000:80'
    depends_on:
      - notes-api
    networks:
      - notes-network

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:

networks:
  notes-network:
    driver: bridge
```

---

## Phase 3: GlobalUsings Update

### GlobalUsings.cs (UPDATED)
```csharp
global using System.Text.Json;
global using FluentValidation;
global using MediatR;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.Extensions.Caching.Distributed;
global using Microsoft.Extensions.Caching.Memory;
global using Serilog;
global using Serilog.Events;
global using Serilog.Sinks.Elasticsearch;
global using NotesApi.Behaviors;
global using NotesApi.Common;
global using NotesApi.Config;
global using NotesApi.Database;
global using NotesApi.Features;
global using NotesApi.Middleware;
global using NotesApi.Services;
```

---

## Phase 4: Program.cs Integration

### Updated Program.cs
```csharp
using UnitOfWorkImpl = NotesApi.UnitOfWork.UnitOfWork;

var builder = WebApplication.CreateBuilder(args);

// ── Serilog Logging ───────────────────────────────────────────────────────────
builder.AddSerilogLogging();

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

try
{
    app.Logger.LogInformation("Starting Notes API application");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

/// <summary>
/// Program class for integration testing
/// </summary>
public partial class Program { }
```

---

## Phase 5: Logging Best Practices

### Structured Logging Examples

#### 1. **Request Logging**
```csharp
_logger.LogInformation(
    "Processing request: {Method} {Path} from {RemoteIP}",
    context.Request.Method,
    context.Request.Path,
    context.Connection.RemoteIpAddress);
```

#### 2. **Database Operations**
```csharp
_logger.LogDebug(
    "Executing query: {QueryType} with parameters: {@Parameters}",
    typeof(TRequest).Name,
    request);
```

#### 3. **Cache Operations**
```csharp
_logger.LogDebug(
    "Cache operation: {Operation} for key: {Key} with TTL: {TTL}s",
    "SET",
    cacheKey,
    ttl.TotalSeconds);
```

#### 4. **Error Handling**
```csharp
_logger.LogError(
    ex,
    "Error processing request: {RequestId} - {ErrorMessage}",
    context.TraceIdentifier,
    ex.Message);
```

### Log Levels Strategy

| Level | Usage | Examples |
|-------|-------|----------|
| **Debug** | Development & troubleshooting | Cache hits/misses, query execution, handler flow |
| **Information** | Important business events | API requests, successful operations, state changes |
| **Warning** | Potentially harmful situations | Validation failures, missing resources, retries |
| **Error** | Error events | Exceptions, failed operations, data inconsistencies |
| **Fatal** | Critical failures | Application startup failures, unrecoverable errors |

---

## Phase 6: Kibana Dashboard Setup

### Key Metrics to Track

1. **Request Metrics**
   - Request count by endpoint
   - Response time distribution
   - Error rate by endpoint

2. **Cache Metrics**
   - Cache hit/miss ratio
   - Cache operation latency
   - Cache key distribution

3. **Database Metrics**
   - Query execution time
   - Query count by type
   - Slow query detection

4. **Error Tracking**
   - Error count by type
   - Error rate over time
   - Top error messages

### Sample Kibana Queries

```
# Cache hit rate
GET notes-api-*/_search
{
  "query": {
    "match": {
      "MessageTemplate": "Cache HIT"
    }
  }
}

# Slow requests (>1000ms)
GET notes-api-*/_search
{
  "query": {
    "range": {
      "ElapsedMilliseconds": {
        "gte": 1000
      }
    }
  }
}

# Error count by type
GET notes-api-*/_search
{
  "aggs": {
    "errors_by_type": {
      "terms": {
        "field": "Exception.Type.keyword"
      }
    }
  }
}
```

---

## Phase 7: Testing & Verification

### Unit Tests for Logging

```csharp
[TestFixture]
public class LoggingConfigTests
{
    [Test]
    public void AddSerilogLogging_ConfiguresLogger_Successfully()
    {
        // Arrange
        var builder = WebApplication.CreateBuilder();
        
        // Act
        builder.AddSerilogLogging();
        
        // Assert
        Assert.That(Log.Logger, Is.Not.Null);
    }
}
```

### Integration Tests

```csharp
[TestFixture]
public class ElasticsearchIntegrationTests
{
    [Test]
    public async Task LogsAreIndexedInElasticsearch()
    {
        // Arrange
        var client = new HttpClient();
        
        // Act
        var response = await client.GetAsync("http://localhost:9200/notes-api-*/_search");
        
        // Assert
        Assert.That(response.IsSuccessStatusCode, Is.True);
    }
}
```

---

## Implementation Checklist

### Phase 1: Serilog Configuration
- [ ] Add NuGet packages (Serilog, Serilog.AspNetCore, Serilog.Sinks.Elasticsearch, etc.)
- [ ] Create/Update `Config/LoggingConfig.cs`
- [ ] Update `appsettings.json` with Elasticsearch connection
- [ ] Create `appsettings.Development.json`
- [ ] Create `appsettings.Production.json`

### Phase 2: Docker Compose
- [ ] Add Elasticsearch service
- [ ] Add Kibana service
- [ ] Add Redis service
- [ ] Update notes-api service with new environment variables
- [ ] Create notes-network for service communication
- [ ] Add health checks for all services

### Phase 3: GlobalUsings
- [ ] Update `GlobalUsings.cs` with Serilog namespaces

### Phase 4: Program.cs
- [ ] Update `Program.cs` to use Serilog
- [ ] Add try-catch-finally for graceful shutdown
- [ ] Add startup logging

### Phase 5: Testing
- [ ] Add unit tests for logging configuration
- [ ] Add integration tests for Elasticsearch
- [ ] Verify all 8 backend tests pass
- [ ] Verify all 18 frontend tests pass

### Phase 6: Documentation
- [ ] Document logging best practices
- [ ] Create Kibana dashboard setup guide
- [ ] Document troubleshooting procedures

---

## Deployment Checklist

### Local Development
```bash
# Start all services
docker-compose up -d

# Verify services
docker-compose ps

# View logs
docker-compose logs -f notes-api

# Access Kibana
http://localhost:5601
```

### Production Considerations

1. **Elasticsearch Configuration**
   - Enable security (xpack.security.enabled=true)
   - Configure authentication
   - Set up SSL/TLS
   - Configure backup strategy

2. **Log Retention**
   - Set index lifecycle management (ILM)
   - Configure log rotation
   - Archive old logs

3. **Performance**
   - Monitor Elasticsearch disk usage
   - Configure appropriate heap size
   - Use dedicated nodes for production

4. **Monitoring**
   - Set up Kibana alerts
   - Configure Grafana dashboards
   - Monitor Elasticsearch health

---

## Troubleshooting

### Elasticsearch Connection Issues
```
Error: Unable to connect to Elasticsearch
Solution: Verify Elasticsearch is running and accessible at configured URL
```

### High Memory Usage
```
Error: Elasticsearch consuming too much memory
Solution: Adjust ES_JAVA_OPTS in docker-compose.yml
```

### Missing Logs in Kibana
```
Error: Logs not appearing in Kibana
Solution: 
1. Verify Elasticsearch is healthy
2. Check Serilog configuration
3. Verify index pattern in Kibana
```

---

## Performance Impact

### Expected Metrics
- **Log ingestion**: ~1000 logs/second per instance
- **Elasticsearch disk**: ~1GB per 1M logs
- **Memory overhead**: ~100MB for Serilog + Elasticsearch sink
- **Network latency**: <10ms for local Elasticsearch

### Optimization Tips
1. Use batch processing for log writes
2. Configure appropriate buffer sizes
3. Use index templates for performance
4. Archive old indices regularly

---

## Next Steps

1. **Review this plan** - Confirm approach and ask questions
2. **Approve phases** - Decide implementation order
3. **Implementation** - Execute phases in order
4. **Testing** - Comprehensive testing for each phase
5. **Deployment** - Deploy to production with monitoring

---

## Questions for Review

1. Should we implement all phases at once or incrementally?
2. What log retention policy should we use?
3. Should we set up Grafana for additional monitoring?
4. Do we need custom Kibana dashboards?
5. Should we implement log sampling for high-volume scenarios?
