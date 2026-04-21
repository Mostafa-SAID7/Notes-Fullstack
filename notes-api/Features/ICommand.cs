namespace NotesApi.Features;

/// <summary>
/// Marker interface for command operations (write operations, non-cacheable).
/// Used by CacheInterceptorBehavior to skip caching for mutations.
/// </summary>
public interface ICommand { }
