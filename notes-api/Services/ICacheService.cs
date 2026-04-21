namespace NotesApi.Services;

/// <summary>
/// Abstraction for distributed cache operations.
/// Provides methods for getting, setting, and removing cached values.
/// </summary>
public interface ICacheService
{
    /// <summary>
    /// Retrieves a value from cache by key.
    /// </summary>
    /// <typeparam name="T">Type of the cached value</typeparam>
    /// <param name="key">Cache key</param>
    /// <returns>Cached value or null if not found</returns>
    Task<T?> GetAsync<T>(string key);

    /// <summary>
    /// Stores a value in cache with optional expiration.
    /// </summary>
    /// <typeparam name="T">Type of the value to cache</typeparam>
    /// <param name="key">Cache key</param>
    /// <param name="value">Value to cache</param>
    /// <param name="expiration">Optional TTL (defaults to 5 minutes)</param>
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);

    /// <summary>
    /// Removes a value from cache by key.
    /// </summary>
    /// <param name="key">Cache key to remove</param>
    Task RemoveAsync(string key);

    /// <summary>
    /// Removes multiple cache entries by pattern.
    /// Note: Requires custom implementation as Redis doesn't support pattern deletion directly.
    /// </summary>
    /// <param name="pattern">Pattern to match (e.g., "notes:*")</param>
    Task RemoveByPatternAsync(string pattern);
}
