using Microsoft.EntityFrameworkCore;
using Npgsql;
using NotesApi.Database;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<MyDbContext>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// ── Ensure database exists, then migrate ─────────────────────────────────────
// Npgsql cannot create a database via EF Core Migrate() if the DB doesn't
// exist yet. We connect to the "postgres" maintenance database first to
// create the target database, then run EF Core migrations.
using (var scope = app.Services.CreateScope())
{
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    var connStr = config.GetConnectionString("PostgresSqlConnection")!;

    // Parse the connection string to extract the database name and build a
    // maintenance connection string pointing to "postgres" instead.
    var csb = new NpgsqlConnectionStringBuilder(connStr);
    var targetDb = csb.Database;
    csb.Database = "postgres";

    try
    {
        await using var conn = new NpgsqlConnection(csb.ConnectionString);
        await conn.OpenAsync();

        var exists = (bool)(await new NpgsqlCommand(
            $"SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = '{targetDb}')",
            conn).ExecuteScalarAsync())!;

        if (!exists)
        {
            await new NpgsqlCommand($"CREATE DATABASE \"{targetDb}\"", conn)
                .ExecuteNonQueryAsync();
            app.Logger.LogInformation("Created database '{Db}'.", targetDb);
        }
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Failed to ensure database '{Db}' exists.", targetDb);
        throw;
    }

    // Now apply EF Core migrations (idempotent — safe on every startup).
    var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
    try
    {
        await db.Database.MigrateAsync();
        app.Logger.LogInformation("EF Core migrations applied successfully.");
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "EF Core migration failed.");
        throw;
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthorization();
app.MapControllers();
app.Run();
