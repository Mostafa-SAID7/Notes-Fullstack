namespace NotesApi.Services;

/// <summary>
/// In-memory implementation of the cache service.
/// Used as fallback when Redis is not available (e.g., during testing).
/// </summary>
public class InMemoryCacheService : ICacheService
{
    private readonly IMemoryCache _cache;
    private readonly ILogger<InMemoryCacheService> _logger;
    private const int DefaultTtlSeconds = 300; // 5 minutes

    public InMemoryCacheService(
        IMemoryCache cache,
        ILogger<InMemoryCacheService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves a value from in-memory cache.
    /// Returns null if key doesn't exist.
    /// </summary>
    public async Task<T?> GetAsync<T>(string key)
    {
        try
        {
            var result = _cache.TryGetValue(key, out T? value);
            if (!result)
            {
                _logger.LogDebug("Cache MISS for key: {Key}", key);
                return default;
            }

            _logger.LogDebug("Cache HIT for key: {Key}", key);
            return value;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving cache for key: {Key}", key);
            return default;
        }
    }

    /// <summary>
    /// Stores a value in in-memory cache with TTL.
    /// Defaults to 5 minutes if no expiration is specified.
    /// </summary>
    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
    {
        try
        {
            var ttl = expiration ?? TimeSpan.FromSeconds(DefaultTtlSeconds);
            _cache.Set(key, value, ttl);

            _logger.LogDebug("Cache SET for key: {Key} with TTL: {TTL}s", 
                key, ttl.TotalSeconds);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cache for key: {Key}", key);
        }

        await Task.CompletedTask;
    }

    /// <summary>
    /// Removes a value from in-memory cache by key.
    /// </summary>
    public async Task RemoveAsync(string key)
    {
        try
        {
            _cache.Remove(key);
            _logger.LogDebug("Cache REMOVED for key: {Key}", key);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cache for key: {Key}", key);
        }

        await Task.CompletedTask;
    }

    /// <summary>
    /// Removes cache entries matching a pattern.
    /// Note: In-memory cache doesn't support pattern deletion.
    /// </summary>
    public async Task RemoveByPatternAsync(string pattern)
    {
        _logger.LogWarning(
            "Pattern-based cache removal not supported in in-memory cache. " +
            "Pattern: {Pattern}. Consider using specific keys instead.", pattern);
        await Task.CompletedTask;
    }
}
