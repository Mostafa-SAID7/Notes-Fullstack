namespace NotesApi.Services;

/// <summary>
/// Redis-based implementation of the cache service.
/// Handles serialization/deserialization and error handling.
/// </summary>
public class RedisCacheService : ICacheService
{
    private readonly IDistributedCache _cache;
    private readonly ILogger<RedisCacheService> _logger;
    private const int DefaultTtlSeconds = 300; // 5 minutes

    public RedisCacheService(
        IDistributedCache cache,
        ILogger<RedisCacheService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves a value from Redis cache.
    /// Returns null if key doesn't exist or on error.
    /// </summary>
    public async Task<T?> GetAsync<T>(string key)
    {
        try
        {
            var data = await _cache.GetStringAsync(key);
            if (data == null)
            {
                _logger.LogDebug("Cache MISS for key: {Key}", key);
                return default;
            }

            var result = JsonSerializer.Deserialize<T>(data);
            _logger.LogDebug("Cache HIT for key: {Key}", key);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving cache for key: {Key}", key);
            return default;
        }
    }

    /// <summary>
    /// Stores a value in Redis cache with TTL.
    /// Defaults to 5 minutes if no expiration is specified.
    /// </summary>
    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        try
        {
            var json = JsonSerializer.Serialize(value);
            var ttl = expiration ?? TimeSpan.FromSeconds(DefaultTtlSeconds);

            await _cache.SetStringAsync(key, json, new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = ttl
            });

            _logger.LogDebug("Cache SET for key: {Key} with TTL: {TTL}s", 
                key, ttl.TotalSeconds);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cache for key: {Key}", key);
        }
    }

    /// <summary>
    /// Removes a value from Redis cache by key.
    /// </summary>
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

    /// <summary>
    /// Removes cache entries matching a pattern.
    /// Note: Redis doesn't support pattern deletion directly.
    /// This would require custom implementation using SCAN or maintaining a key registry.
    /// </summary>
    public async Task RemoveByPatternAsync(string pattern)
    {
        _logger.LogWarning(
            "Pattern-based cache removal not yet implemented. " +
            "Pattern: {Pattern}. Consider using specific keys instead.", pattern);
        await Task.CompletedTask;
    }
}
