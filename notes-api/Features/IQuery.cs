namespace NotesApi.Features;

/// <summary>
/// Marker interface for query operations (read-only, cacheable).
/// Used by CacheInterceptorBehavior to identify operations that should be cached.
/// </summary>
public interface IQuery { }
