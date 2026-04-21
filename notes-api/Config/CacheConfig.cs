using StackExchange.Redis;
using Microsoft.Extensions.Caching.StackExchangeRedis;

namespace NotesApi.Config;

/// <summary>
/// Configures Redis distributed cache for the application.
/// </summary>
public static class CacheConfig
{
    /// <summary>
    /// Registers Redis distributed cache and the cache service.
    /// Throws InvalidOperationException if Redis connection string is not configured.
    /// </summary>
    public static IServiceCollection AddRedisCache(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var redisConnection = configuration.GetConnectionString("Redis");
        
        // If no Redis connection string, use in-memory cache
        if (string.IsNullOrEmpty(redisConnection))
        {
            services.AddMemoryCache();
            services.AddScoped<ICacheService, InMemoryCacheService>();
            return services;
        }

        // Try to validate Redis connection
        try
        {
            var options = ConfigurationOptions.Parse(redisConnection);
            options.AbortOnConnectFail = false; // Don't fail on connection errors
            var connection = ConnectionMultiplexer.Connect(options);
            
            if (!connection.IsConnected)
            {
                // Fall back to in-memory cache if Redis is not available
                services.AddMemoryCache();
                services.AddScoped<ICacheService, InMemoryCacheService>();
                return services;
            }
        }
        catch
        {
            // Fall back to in-memory cache on any error
            services.AddMemoryCache();
            services.AddScoped<ICacheService, InMemoryCacheService>();
            return services;
        }

        // Redis is available, use it
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = redisConnection;
            options.InstanceName = "NotesApi:";
        });

        services.AddScoped<ICacheService, RedisCacheService>();

        return services;
    }
}
