namespace NotesApi.Behaviors;

/// <summary>
/// MediatR pipeline behavior that intercepts requests and manages caching.
/// Only caches query operations (IQuery). Commands are never cached.
/// </summary>
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

    /// <summary>
    /// Handles the request with caching logic.
    /// For queries: checks cache first, stores result if not found.
    /// For commands: skips caching entirely.
    /// </summary>
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        // Only cache query operations
        if (request is not IQuery)
        {
            _logger.LogDebug("Skipping cache for command: {RequestType}", typeof(TRequest).Name);
            return await next();
        }

        var cacheKey = GenerateCacheKey(request);
        
        // Try to get from cache
        var cachedResult = await _cache.GetAsync<TResponse>(cacheKey);
        if (cachedResult != null)
            return cachedResult;

        // Cache miss - execute handler
        _logger.LogDebug("Cache MISS for query: {RequestType}, key: {Key}", 
            typeof(TRequest).Name, cacheKey);
        var result = await next();

        // Store in cache
        await _cache.SetAsync(cacheKey, result);

        return result;
    }

    /// <summary>
    /// Generates a cache key based on the request type and parameters.
    /// </summary>
    private string GenerateCacheKey(TRequest request)
    {
        // For GetAllNotesQuery, use simple key
        if (request.GetType().Name == "GetAllNotesQuery")
            return "notes:all";

        // For GetNoteByIdQuery, extract Id property
        if (request.GetType().Name == "GetNoteByIdQuery")
        {
            var idProperty = request.GetType().GetProperty("Id");
            if (idProperty != null)
            {
                var id = idProperty.GetValue(request);
                return $"notes:{id}";
            }
        }

        // Fallback to generic key
        return $"{typeof(TRequest).Name}:{request.GetHashCode()}";
    }
}
