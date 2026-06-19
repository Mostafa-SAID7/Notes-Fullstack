using Microsoft.EntityFrameworkCore;
using Npgsql;
using NotesApi.Database;

namespace NotesApi.Config;

public static class DatabaseConfig
{
    public static IServiceCollection AddDatabase(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connStr = configuration.GetConnectionString("PostgresSqlConnection")
            ?? throw new InvalidOperationException(
                "Connection string 'PostgresSqlConnection' is not configured.");

        services.AddDbContext<MyDbContext>(options =>
            options.UseNpgsql(connStr)
                   .ConfigureWarnings(w => w.Ignore(
                       Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning)));

        return services;
    }

    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var connStr = config.GetConnectionString("PostgresSqlConnection")!;

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

        try
        {
            await DatabaseSeeder.SeedAsync(db, app.Logger);
        }
        catch (Exception ex)
        {
            app.Logger.LogError(ex, "Database seeding failed.");
        }
    }
}
